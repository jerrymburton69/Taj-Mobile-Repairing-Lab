<?php
require_once __DIR__ . '/../config/config.php';

$pdo = getDB();
requireAuth(); // Protected endpoint

$method = $_SERVER['REQUEST_METHOD'];

// GET: list or single
if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM repairs WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        $repair = $stmt->fetch();
        if (!$repair) jsonResponse(['error' => 'Repair not found.'], 404);

        // Fetch history
        $histStmt = $pdo->prepare("SELECT status, timestamp, note FROM repair_history WHERE repair_id = :id ORDER BY id ASC");
        $histStmt->execute(['id' => $id]);
        $repair['history'] = $histStmt->fetchAll() ?: [];

        // Fetch notes
        $noteStmt = $pdo->prepare("SELECT * FROM repair_notes WHERE repair_id = :id ORDER BY id DESC");
        $noteStmt->execute(['id' => $id]);
        $repair['notes'] = $noteStmt->fetchAll() ?: [];

        jsonResponse(['repair' => $repair]);
    }

    // List all
    $status = $_GET['status'] ?? null;
    $search = trim($_GET['search'] ?? '');
    
    $sql = "SELECT * FROM repairs WHERE 1=1";
    $params = [];

    if ($status && $status !== 'All') {
        $sql .= " AND status = :status";
        $params['status'] = $status;
    }

    if (!empty($search)) {
        $sql .= " AND (customer_code LIKE :s OR customer_name LIKE :s OR customer_phone LIKE :s OR device_model LIKE :s)";
        $params['s'] = "%{$search}%";
    }

    $sql .= " ORDER BY created_at DESC LIMIT 200";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $repairs = $stmt->fetchAll() ?: [];

    jsonResponse(['repairs' => $repairs]);
}

// POST actions
if ($method === 'POST') {
    verifyCSRF();
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;
    $action = $data['action'] ?? '';

    // ACTION: CREATE REPAIR
    if ($action === 'create') {
        $customerName = trim($data['customer_name'] ?? '');
        $customerPhone = trim($data['customer_phone'] ?? '');
        $customerWhatsapp = trim($data['customer_whatsapp'] ?? $customerPhone);
        $deviceBrand = trim($data['device_brand'] ?? 'Apple');
        $deviceModel = trim($data['device_model'] ?? '');
        $issue = trim($data['issue_description'] ?? '');
        $serviceType = trim($data['service_type'] ?? 'Diagnostics & Repair');
        $estimatedCost = floatval($data['estimated_cost'] ?? 0);
        $technician = trim($data['assigned_technician'] ?? 'Master Tech Usman');
        $isHome = !empty($data['is_home_service']) ? 1 : 0;

        if (empty($customerName) || empty($customerPhone) || empty($deviceModel)) {
            jsonResponse(['error' => 'Please provide Customer Name, Phone, and Device Model.'], 400);
        }

        // Find or create customer
        $custStmt = $pdo->prepare("SELECT id FROM customers WHERE phone = :p LIMIT 1");
        $custStmt->execute(['p' => $customerPhone]);
        $customerId = $custStmt->fetchColumn();

        if (!$customerId) {
            $customerId = 'cust-' . bin2hex(random_bytes(6));
            $insCust = $pdo->prepare("INSERT INTO customers (id, name, phone, whatsapp, address) VALUES (:id, :name, :phone, :wa, :addr)");
            $insCust->execute([
                'id'    => $customerId,
                'name'  => $customerName,
                'phone' => $customerPhone,
                'wa'    => $customerWhatsapp,
                'addr'  => $data['customer_address'] ?? null,
            ]);
        }

        $repairId = 'rep-' . bin2hex(random_bytes(6));
        $customerCode = generateServerRepairCode($pdo);
        $nowStr = date('Y-m-d H:i');

        $ins = $pdo->prepare("
            INSERT INTO repairs (
                id, customer_code, customer_id, customer_name, customer_phone, customer_whatsapp,
                device_brand, device_model, imei_serial, service_type, issue_description,
                status, estimated_cost, currency, assigned_technician, check_in_date,
                estimated_completion, technician_notes, public_notes, is_home_service
            ) VALUES (
                :id, :code, :cid, :cname, :cphone, :cwa,
                :brand, :model, :imei, :stype, :issue,
                'Received', :cost, 'PKR', :tech, :checkin,
                'Within 24 Hours', :tnotes, 'Checked into Taj Mobile Repairing Lab queue.', :ishome
            )
        ");

        $ins->execute([
            'id'      => $repairId,
            'code'    => $customerCode,
            'cid'     => $customerId,
            'cname'   => $customerName,
            'cphone'  => $customerPhone,
            'cwa'     => $customerWhatsapp,
            'brand'   => $deviceBrand,
            'model'   => $deviceModel,
            'imei'    => $data['imei_serial'] ?? null,
            'stype'   => $serviceType,
            'issue'   => $issue,
            'cost'    => $estimatedCost,
            'tech'    => $technician,
            'checkin' => $nowStr,
            'tnotes'  => $data['technician_notes'] ?? 'Intake diagnostics pending.',
            'ishome'  => $isHome,
        ]);

        // History
        $pdo->prepare("INSERT INTO repair_history (repair_id, status, timestamp, note) VALUES (:id, 'Received', :ts, 'Intake received at lab.')")
            ->execute(['id' => $repairId, 'ts' => $nowStr]);

        logActivity($pdo, 'Repair Created', "Created repair {$customerCode} for {$customerName} ({$deviceModel})", $repairId);

        jsonResponse([
            'success'       => true,
            'repair_id'     => $repairId,
            'customer_code' => $customerCode,
        ]);
    }

    // ACTION: UPDATE STATUS
    if ($action === 'update_status') {
        $repairId = $data['repair_id'] ?? '';
        $newStatus = trim($data['status'] ?? '');
        $note = trim($data['note'] ?? '');

        if (!$repairId || !$newStatus) {
            jsonResponse(['error' => 'Missing repair ID or status.'], 400);
        }

        $nowStr = date('Y-m-d H:i');
        $upd = $pdo->prepare("UPDATE repairs SET status = :st, completed_date = CASE WHEN :st IN ('Ready for Pickup', 'Delivered') THEN :dt ELSE completed_date END WHERE id = :id");
        $upd->execute(['st' => $newStatus, 'dt' => $nowStr, 'id' => $repairId]);

        $pdo->prepare("INSERT INTO repair_history (repair_id, status, timestamp, note) VALUES (:id, :st, :ts, :note)")
            ->execute([
                'id'   => $repairId,
                'st'   => $newStatus,
                'ts'   => $nowStr,
                'note' => $note ?: "Status changed to {$newStatus}",
            ]);

        logActivity($pdo, 'Status Changed', "Repair {$repairId} status updated to {$newStatus}", $repairId);

        jsonResponse(['success' => true, 'message' => "Status updated to {$newStatus}."]);
    }

    // ACTION: REGENERATE CODE (Invalidates old code!)
    if ($action === 'regenerate_code') {
        $repairId = $data['repair_id'] ?? '';
        if (!$repairId) jsonResponse(['error' => 'Missing repair ID.'], 400);

        $stmt = $pdo->prepare("SELECT customer_code FROM repairs WHERE id = :id");
        $stmt->execute(['id' => $repairId]);
        $oldCode = $stmt->fetchColumn();

        if (!$oldCode) jsonResponse(['error' => 'Repair not found.'], 404);

        // Generate new code
        $newCode = generateServerRepairCode($pdo);

        // Record old code in invalidation history table
        $pdo->prepare("INSERT INTO repair_code_history (repair_id, old_code) VALUES (:id, :old)")
            ->execute(['id' => $repairId, 'old' => $oldCode]);

        // Update active code
        $pdo->prepare("UPDATE repairs SET customer_code = :newcode WHERE id = :id")
            ->execute(['newcode' => $newCode, 'id' => $repairId]);

        logActivity($pdo, 'Code Regenerated', "Regenerated code for {$repairId} from {$oldCode} to {$newCode}. Old code is now invalid.", $repairId);

        jsonResponse([
            'success'  => true,
            'old_code' => $oldCode,
            'new_code' => $newCode,
            'message'  => "New code {$newCode} generated. Old code {$oldCode} is now permanently invalid."
        ]);
    }

    // ACTION: UPDATE DETAILS (Notes, estimates, public message)
    if ($action === 'update_details') {
        $repairId = $data['repair_id'] ?? '';
        if (!$repairId) jsonResponse(['error' => 'Missing repair ID.'], 400);

        $fields = [
            'public_notes'         => $data['public_notes'] ?? null,
            'technician_notes'     => $data['technician_notes'] ?? null,
            'estimated_completion' => $data['estimated_completion'] ?? null,
            'final_cost'           => isset($data['final_cost']) ? floatval($data['final_cost']) : null,
            'assigned_technician'  => $data['assigned_technician'] ?? null,
        ];

        $setPart = [];
        $params = ['id' => $repairId];
        foreach ($fields as $col => $val) {
            if ($val !== null) {
                $setPart[] = "{$col} = :{$col}";
                $params[$col] = $val;
            }
        }

        if (!empty($setPart)) {
            $sql = "UPDATE repairs SET " . implode(', ', $setPart) . " WHERE id = :id";
            $pdo->prepare($sql)->execute($params);
            logActivity($pdo, 'Repair Details Updated', "Updated details for repair {$repairId}", $repairId);
        }

        jsonResponse(['success' => true, 'message' => 'Repair details updated.']);
    }

    jsonResponse(['error' => 'Invalid action.'], 400);
}
