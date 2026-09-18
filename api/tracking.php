<?php
require_once __DIR__ . '/../config/config.php';

$pdo = getDB();

$code = trim($_GET['code'] ?? $_POST['code'] ?? '');
if (empty($code)) {
    jsonResponse(['error' => 'Please provide a valid repair tracking code (e.g. TJ-48291).'], 400);
}

// Clean and normalize code
$cleanCode = strtoupper(preg_replace('/[^A-Za-z0-9\-]/', '', $code));

try {
    // 1. Check if this code was previously invalidated due to code regeneration
    $checkOld = $pdo->prepare("SELECT repair_id, invalidated_at FROM repair_code_history WHERE UPPER(old_code) = :code LIMIT 1");
    $checkOld->execute(['code' => $cleanCode]);
    $oldEntry = $checkOld->fetch();

    if ($oldEntry) {
        jsonResponse([
            'error'       => 'This repair voucher code has been regenerated and is no longer active. Please check with our front desk or use your newest tracking code.',
            'invalidated' => true
        ], 410);
    }

    // 2. Fetch repair with STRICTLY safe public fields only
    $stmt = $pdo->prepare("
        SELECT 
            customer_code,
            device_brand,
            device_model,
            service_type,
            status,
            check_in_date,
            estimated_completion,
            completed_date,
            public_notes
        FROM repairs 
        WHERE UPPER(customer_code) = :code 
        LIMIT 1
    ");
    $stmt->execute(['code' => $cleanCode]);
    $repair = $stmt->fetch();

    if (!$repair) {
        jsonResponse(['error' => "We could not locate active repair records for code '{$cleanCode}'. Please verify the voucher or contact our lab."], 404);
    }

    // 3. Fetch history timeline for this repair
    $histStmt = $pdo->prepare("
        SELECT status, timestamp, note 
        FROM repair_history 
        WHERE repair_id = (SELECT id FROM repairs WHERE UPPER(customer_code) = :code LIMIT 1) 
        ORDER BY id ASC
    ");
    $histStmt->execute(['code' => $cleanCode]);
    $repair['history'] = $histStmt->fetchAll() ?: [];

    // Return safe data
    jsonResponse([
        'success' => true,
        'repair'  => $repair
    ]);

} catch (Exception $e) {
    error_log("Tracking endpoint error: " . $e->getMessage());
    jsonResponse(['error' => 'An error occurred while querying repair records. Please try again later.'], 500);
}
