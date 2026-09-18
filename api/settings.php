<?php
require_once __DIR__ . '/../config/config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// PUBLIC GET: fetch settings
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM website_settings");
    $raw = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    
    // Automatically decode JSON objects if present
    $formatted = [];
    foreach ($raw as $k => $v) {
        $trimmed = trim($v);
        if (($trimmed !== '' && ($trimmed[0] === '{' || $trimmed[0] === '['))) {
            $decoded = json_decode($trimmed, true);
            $formatted[$k] = ($decoded !== null) ? $decoded : $v;
        } else {
            $formatted[$k] = $v;
        }
    }

    jsonResponse(['settings' => $formatted]);
}

// PROTECTED POST: update settings
if ($method === 'POST') {
    requireAuth();
    verifyCSRF();
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;
    $action = $data['action'] ?? 'update';

    // ACTION: UPDATE SINGLE OR MULTIPLE SETTINGS
    if ($action === 'update') {
        $settings = $data['settings'] ?? [];
        if (!is_array($settings)) jsonResponse(['error' => 'Invalid settings format.'], 400);

        $stmt = $pdo->prepare("INSERT INTO website_settings (setting_key, setting_value) VALUES (:k, :v) ON DUPLICATE KEY UPDATE setting_value = :v");
        
        foreach ($settings as $k => $v) {
            $valToStore = is_array($v) || is_object($v) 
                ? json_encode($v, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) 
                : (string)$v;

            $stmt->execute(['k' => $k, 'v' => $valToStore]);
        }

        logActivity($pdo, 'Settings Updated', "Updated website settings and theme tokens");
        jsonResponse(['success' => true, 'message' => 'Settings updated successfully.']);
    }

    // ACTION: GLOBAL CONTENT SEARCH & REPLACE (Section 28 of Master Prompt)
    if ($action === 'search_replace') {
        $searchTerm = trim($data['search'] ?? '');
        $replaceTerm = (string)($data['replace'] ?? '');
        $dryRun = !empty($data['dry_run']);

        if (empty($searchTerm)) {
            jsonResponse(['error' => 'Search term cannot be empty.'], 400);
        }

        $stmt = $pdo->query("SELECT setting_key, setting_value FROM website_settings");
        $all = $stmt->fetchAll();
        $matches = [];
        $affectedKeys = [];

        foreach ($all as $row) {
            if (mb_stripos($row['setting_value'], $searchTerm) !== false) {
                $newVal = str_ireplace($searchTerm, $replaceTerm, $row['setting_value']);
                $matches[] = [
                    'key'      => $row['setting_key'],
                    'original' => $row['setting_value'],
                    'preview'  => $newVal,
                ];
                $affectedKeys[] = [
                    'key'    => $row['setting_key'],
                    'newVal' => $newVal
                ];
            }
        }

        if (!$dryRun && !empty($affectedKeys)) {
            $upd = $pdo->prepare("UPDATE website_settings SET setting_value = :v WHERE setting_key = :k");
            foreach ($affectedKeys as $item) {
                $upd->execute(['v' => $item['newVal'], 'k' => $item['key']]);
            }
            logActivity($pdo, 'Global Content Replace', "Replaced '{$searchTerm}' with '{$replaceTerm}' across " . count($affectedKeys) . " fields");
        }

        jsonResponse([
            'success' => true,
            'dry_run' => $dryRun,
            'count'   => count($matches),
            'matches' => $matches,
            'message' => $dryRun ? "Found " . count($matches) . " matching fields." : "Successfully replaced content in " . count($affectedKeys) . " fields."
        ]);
    }

    jsonResponse(['error' => 'Invalid action.'], 400);
}
