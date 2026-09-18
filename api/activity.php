<?php
require_once __DIR__ . '/../config/config.php';

$pdo = getDB();
requireAuth(); // Protected

$limit = min(100, intval($_GET['limit'] ?? 50));
$stmt = $pdo->prepare("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT :lim");
$stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
$stmt->execute();
$logs = $stmt->fetchAll() ?: [];

jsonResponse(['logs' => $logs]);
