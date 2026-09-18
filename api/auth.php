<?php
require_once __DIR__ . '/../config/config.php';

$pdo = getDB();
$ip = getClientIP();
$action = $_GET['action'] ?? $_POST['action'] ?? '';

// GET status: returns whether user is logged in, admin details, and fresh CSRF token
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $isLoggedIn = !empty($_SESSION['admin_logged_in']);
    
    // Check if system has any registered admin
    $stmt = $pdo->query("SELECT COUNT(*) FROM admins");
    $hasAdmin = ((int)$stmt->fetchColumn()) > 0;

    jsonResponse([
        'authenticated' => $isLoggedIn,
        'has_admin'     => $hasAdmin,
        'csrf_token'    => getCSRFToken(),
        'admin'         => $isLoggedIn ? [
            'id'        => $_SESSION['admin_id'] ?? null,
            'username'  => $_SESSION['admin_username'] ?? '',
            'full_name' => $_SESSION['admin_fullname'] ?? '',
            'role'      => $_SESSION['admin_role'] ?? 'admin',
        ] : null,
    ]);
}

// POST actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;
    $action = $data['action'] ?? $action;

    // ACTION: FIRST-RUN SETUP (Only allowed if zero admins exist in database)
    if ($action === 'setup') {
        $stmt = $pdo->query("SELECT COUNT(*) FROM admins");
        if (((int)$stmt->fetchColumn()) > 0) {
            jsonResponse(['error' => 'First-run setup has already been completed. Please log in.'], 400);
        }

        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';
        $fullName = trim($data['full_name'] ?? 'Taj Lab Manager');

        if (strlen($username) < 3 || strlen($password) < 8) {
            jsonResponse(['error' => 'Username must be at least 3 chars and password at least 8 chars.'], 400);
        }

        $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
        $ins = $pdo->prepare("INSERT INTO admins (username, password_hash, full_name, role) VALUES (:u, :p, :f, 'superadmin')");
        $ins->execute([
            'u' => $username,
            'p' => $hash,
            'f' => $fullName,
        ]);

        $adminId = $pdo->lastInsertId();
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $adminId;
        $_SESSION['admin_username'] = $username;
        $_SESSION['admin_fullname'] = $fullName;
        $_SESSION['admin_role'] = 'superadmin';

        logActivity($pdo, 'First-Run Setup Completed', "Admin account {$username} created via setup", $adminId);

        jsonResponse([
            'success' => true,
            'message' => 'Admin account created successfully.',
            'admin'   => [
                'id'        => $adminId,
                'username'  => $username,
                'full_name' => $fullName,
                'role'      => 'superadmin'
            ],
            'csrf_token' => getCSRFToken()
        ]);
    }

    // ACTION: LOGIN
    if ($action === 'login') {
        if (checkLoginThrottling($pdo, $ip)) {
            jsonResponse(['error' => 'Too many failed login attempts. Please wait 15 minutes before trying again.'], 429);
        }

        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';

        if (empty($username) || empty($password)) {
            jsonResponse(['error' => 'Please provide both username and password.'], 400);
        }

        $stmt = $pdo->prepare("SELECT id, username, password_hash, full_name, role FROM admins WHERE username = :u LIMIT 1");
        $stmt->execute(['u' => $username]);
        $admin = $stmt->fetch();

        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            recordLoginAttempt($pdo, $ip);
            logActivity($pdo, 'Failed Login Attempt', "Failed login for username: {$username}");
            jsonResponse(['error' => 'Invalid username or password.'], 401);
        }

        // Login success: regenerate session ID to prevent session fixation
        session_regenerate_id(true);
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_username'] = $admin['username'];
        $_SESSION['admin_fullname'] = $admin['full_name'];
        $_SESSION['admin_role'] = $admin['role'];

        clearLoginAttempts($pdo, $ip);

        // Update last login
        $pdo->prepare("UPDATE admins SET last_login = NOW() WHERE id = :id")->execute(['id' => $admin['id']]);

        logActivity($pdo, 'Admin Login', "User {$admin['username']} logged in successfully", $admin['id']);

        jsonResponse([
            'success' => true,
            'message' => 'Authentication successful.',
            'admin'   => [
                'id'        => $admin['id'],
                'username'  => $admin['username'],
                'full_name' => $admin['full_name'],
                'role'      => $admin['role']
            ],
            'csrf_token' => getCSRFToken()
        ]);
    }

    // ACTION: LOGOUT
    if ($action === 'logout') {
        $username = $_SESSION['admin_username'] ?? 'User';
        logActivity($pdo, 'Admin Logout', "User {$username} logged out");
        
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();

        jsonResponse(['success' => true, 'message' => 'Logged out successfully.']);
    }

    // ACTION: CHANGE PASSWORD
    if ($action === 'change_password') {
        requireAuth();
        verifyCSRF();

        $currentPass = $data['current_password'] ?? '';
        $newPass = $data['new_password'] ?? '';

        if (strlen($newPass) < 8) {
            jsonResponse(['error' => 'New password must be at least 8 characters.'], 400);
        }

        $stmt = $pdo->prepare("SELECT password_hash FROM admins WHERE id = :id");
        $stmt->execute(['id' => $_SESSION['admin_id']]);
        $hash = $stmt->fetchColumn();

        if (!password_verify($currentPass, $hash)) {
            jsonResponse(['error' => 'Current password is incorrect.'], 400);
        }

        $newHash = password_hash($newPass, PASSWORD_BCRYPT, ['cost' => 12]);
        $pdo->prepare("UPDATE admins SET password_hash = :p WHERE id = :id")->execute([
            'p'  => $newHash,
            'id' => $_SESSION['admin_id']
        ]);

        logActivity($pdo, 'Password Changed', "Admin changed their account password", $_SESSION['admin_id']);
        jsonResponse(['success' => true, 'message' => 'Password changed successfully.']);
    }

    jsonResponse(['error' => 'Invalid action.'], 400);
}
