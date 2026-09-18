<?php
require_once __DIR__ . '/../config/config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// PUBLIC LEAD SUBMISSION (Tell Us What's Wrong or Home Service)
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;
    $action = $data['action'] ?? 'submit';

    if ($action === 'submit') {
        $name = trim($data['name'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $whatsapp = trim($data['whatsapp'] ?? $phone);
        $email = trim($data['email'] ?? '');
        $brand = trim($data['device_brand'] ?? '');
        $model = trim($data['device_model'] ?? '');
        $problem = trim($data['problem'] ?? '');
        $contactPref = trim($data['preferred_contact'] ?? 'WhatsApp');
        $isHome = !empty($data['is_home_service']) ? 1 : 0;
        $area = trim($data['area'] ?? '');
        $address = trim($data['address'] ?? '');
        $date = trim($data['preferred_date'] ?? '');
        $time = trim($data['preferred_time'] ?? '');

        if (empty($name) || empty($phone) || empty($model) || empty($problem)) {
            jsonResponse(['error' => 'Please provide your Name, Phone Number, Device Model, and Problem description.'], 400);
        }

        $leadId = 'lead-' . bin2hex(random_bytes(6));
        $stmt = $pdo->prepare("
            INSERT INTO leads (
                id, name, phone, whatsapp, email, device_brand, device_model, problem,
                preferred_contact, is_home_service, area, address, preferred_date, preferred_time, status
            ) VALUES (
                :id, :name, :phone, :wa, :email, :brand, :model, :problem,
                :pref, :ishome, :area, :addr, :pdate, :ptime, 'New'
            )
        ");

        $stmt->execute([
            'id'      => $leadId,
            'name'    => $name,
            'phone'   => $phone,
            'wa'      => $whatsapp,
            'email'   => $email ?: null,
            'brand'   => $brand ?: null,
            'model'   => $model,
            'problem' => $problem,
            'pref'    => $contactPref,
            'ishome'  => $isHome,
            'area'    => $area ?: null,
            'addr'    => $address ?: null,
            'pdate'   => $date ?: null,
            'ptime'   => $time ?: null,
        ]);

        logActivity($pdo, 'New Lead Submitted', "Customer {$name} submitted {$model} issue", $leadId);

        jsonResponse([
            'success' => true,
            'lead_id' => $leadId,
            'message' => 'Thank you. Your repair inquiry has been received. A technician will contact you shortly via ' . $contactPref . '.'
        ]);
    }

    // PROTECTED LEAD ACTIONS
    requireAuth();
    verifyCSRF();

    if ($action === 'update_status') {
        $leadId = $data['lead_id'] ?? '';
        $status = $data['status'] ?? 'Contacted';
        $notes = $data['notes'] ?? null;

        $stmt = $pdo->prepare("UPDATE leads SET status = :st, notes = COALESCE(:notes, notes) WHERE id = :id");
        $stmt->execute(['st' => $status, 'notes' => $notes, 'id' => $leadId]);

        logActivity($pdo, 'Lead Status Updated', "Lead {$leadId} updated to {$status}", $leadId);
        jsonResponse(['success' => true, 'message' => "Lead status updated to {$status}."]);
    }

    if ($action === 'convert_to_repair') {
        $leadId = $data['lead_id'] ?? '';
        $stmt = $pdo->prepare("SELECT * FROM leads WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $leadId]);
        $lead = $stmt->fetch();

        if (!$lead) jsonResponse(['error' => 'Lead not found.'], 404);

        // Find or create customer
        $custStmt = $pdo->prepare("SELECT id FROM customers WHERE phone = :p LIMIT 1");
        $custStmt->execute(['p' => $lead['phone']]);
        $customerId = $custStmt->fetchColumn();

        if (!$customerId) {
            $customerId = 'cust-' . bin2hex(random_bytes(6));
            $pdo->prepare("INSERT INTO customers (id, name, phone, whatsapp, email, address) VALUES (:id, :n, :p, :w, :e, :a)")
                ->execute([
                    'id' => $customerId,
                    'n'  => $lead['name'],
                    'p'  => $lead['phone'],
                    'w'  => $lead['whatsapp'],
                    'e'  => $lead['email'],
                    'a'  => $lead['address'],
                ]);
        }

        $repairId = 'rep-' . bin2hex(random_bytes(6));
        $customerCode = generateServerRepairCode($pdo);
        $nowStr = date('Y-m-d H:i');

        $ins = $pdo->prepare("
            INSERT INTO repairs (
                id, customer_code, customer_id, customer_name, customer_phone, customer_whatsapp,
                device_brand, device_model, service_type, issue_description,
                status, check_in_date, is_home_service
            ) VALUES (
                :id, :code, :cid, :cname, :cphone, :cwa,
                :brand, :model, 'General Repair', :issue,
                'Received', :dt, :ishome
            )
        ");

        $ins->execute([
            'id'     => $repairId,
            'code'   => $customerCode,
            'cid'    => $customerId,
            'cname'  => $lead['name'],
            'cphone' => $lead['phone'],
            'cwa'    => $lead['whatsapp'],
            'brand'  => $lead['device_brand'] ?: 'Smartphone',
            'model'  => $lead['device_model'],
            'issue'  => $lead['problem'],
            'dt'     => $nowStr,
            'ishome' => $lead['is_home_service'],
        ]);

        // Update lead status to Converted
        $pdo->prepare("UPDATE leads SET status = 'Converted' WHERE id = :id")->execute(['id' => $leadId]);

        logActivity($pdo, 'Lead Converted', "Lead {$leadId} converted to repair {$customerCode}", $repairId);

        jsonResponse([
            'success'       => true,
            'repair_id'     => $repairId,
            'customer_code' => $customerCode,
        ]);
    }

    jsonResponse(['error' => 'Invalid action.'], 400);
}

// PROTECTED GET: list leads
if ($method === 'GET') {
    requireAuth();
    $status = $_GET['status'] ?? null;
    $sql = "SELECT * FROM leads WHERE 1=1";
    $params = [];

    if ($status && $status !== 'All') {
        $sql .= " AND status = :st";
        $params['st'] = $status;
    }

    $sql .= " ORDER BY created_at DESC LIMIT 100";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $leads = $stmt->fetchAll() ?: [];

    jsonResponse(['leads' => $leads]);
}
