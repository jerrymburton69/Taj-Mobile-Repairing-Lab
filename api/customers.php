<?php
require_once __DIR__ . '/../config/config.php';

$pdo = getDB();
requireAuth(); // Protected

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $search = trim($_GET['search'] ?? '');
    $sql = "SELECT c.*, COUNT(r.id) as total_repairs FROM customers c LEFT JOIN repairs r ON c.id = r.customer_id";
    $params = [];

    if (!empty($search)) {
        $sql .= " WHERE c.name LIKE :s OR c.phone LIKE :s OR c.whatsapp LIKE :s";
        $params['s'] = "%{$search}%";
    }

    $sql .= " GROUP BY c.id ORDER BY c.created_at DESC LIMIT 100";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $customers = $stmt->fetchAll() ?: [];

    jsonResponse(['customers' => $customers]);
}

if ($method === 'POST') {
    verifyCSRF();
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;
    $action = $data['action'] ?? '';

    if ($action === 'create') {
        $name = trim($data['name'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $wa = trim($data['whatsapp'] ?? $phone);
        $email = trim($data['email'] ?? '');
        $address = trim($data['address'] ?? '');

        if (empty($name) || empty($phone)) {
            jsonResponse(['error' => 'Customer name and phone number are required.'], 400);
        }

        $id = 'cust-' . bin2hex(random_bytes(6));
        $stmt = $pdo->prepare("INSERT INTO customers (id, name, phone, whatsapp, email, address) VALUES (:id, :n, :p, :w, :e, :a)");
        $stmt->execute([
            'id' => $id,
            'n'  => $name,
            'p'  => $phone,
            'w'  => $wa,
            'e'  => $email ?: null,
            'a'  => $address ?: null,
        ]);

        logActivity($pdo, 'Customer Created', "Created customer profile {$name} ({$phone})", $id);
        jsonResponse(['success' => true, 'customer_id' => $id]);
    }

    if ($action === 'update') {
        $id = $data['id'] ?? '';
        $name = trim($data['name'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $wa = trim($data['whatsapp'] ?? $phone);
        $email = trim($data['email'] ?? '');
        $address = trim($data['address'] ?? '');

        if (!$id || empty($name) || empty($phone)) {
            jsonResponse(['error' => 'Missing required fields.'], 400);
        }

        $stmt = $pdo->prepare("UPDATE customers SET name = :n, phone = :p, whatsapp = :w, email = :e, address = :a WHERE id = :id");
        $stmt->execute([
            'n'  => $name,
            'p'  => $phone,
            'w'  => $wa,
            'e'  => $email ?: null,
            'a'  => $address ?: null,
            'id' => $id,
        ]);

        logActivity($pdo, 'Customer Updated', "Updated customer profile {$name}", $id);
        jsonResponse(['success' => true, 'message' => 'Customer updated successfully.']);
    }

    jsonResponse(['error' => 'Invalid action.'], 400);
}
