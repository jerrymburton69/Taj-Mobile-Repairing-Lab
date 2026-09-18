<?php
/**
 * TAJ MOBILE REPAIRING LAB - Secure Production Configuration
 * Compatible with InfinityFree, cPanel, and standard PHP 7.4+ / 8.x hosting.
 */

// Error reporting: disable displaying raw errors to visitors
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Database Credentials (Set for InfinityFree / cPanel)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'tajlab_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', 'utf8mb4');

// Security & Session Settings
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_samesite', 'Lax');
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        ini_set('session.cookie_secure', '1');
    }
    session_start();
}

// Security Headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

/**
 * Get PDO Database Connection
 */
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log("Database connection failure: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Database connection unavailable. Please ensure database.sql is imported.']);
            exit;
        }
    }
    return $pdo;
}

/**
 * Send JSON Response
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Verify CSRF Token for state-changing requests
 */
function verifyCSRF() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $headers = getallheaders();
        $token = $headers['X-CSRF-Token'] ?? $_POST['csrf_token'] ?? null;
        if (!$token || empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
            jsonResponse(['error' => 'CSRF verification failed or session expired.'], 403);
        }
    }
}

/**
 * Get or Generate CSRF Token
 */
function getCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Require Authenticated Admin Session
 */
function requireAuth() {
    if (empty($_SESSION['admin_logged_in']) || empty($_SESSION['admin_id'])) {
        jsonResponse(['error' => 'Unauthorized. Please login to access admin console.'], 401);
    }
}

/**
 * Client IP helper
 */
function getClientIP() {
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return $_SERVER['HTTP_CF_CONNECTING_IP'];
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    }
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/**
 * Check Login Throttling (Max 5 attempts within 15 mins)
 */
function checkLoginThrottling($pdo, $ip) {
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM login_attempts WHERE ip_address = :ip AND attempted_at > (NOW() - INTERVAL 15 MINUTE)");
        $stmt->execute(['ip' => $ip]);
        $count = (int)$stmt->fetchColumn();
        return $count >= 5;
    } catch (Exception $e) {
        return false;
    }
}

/**
 * Record Login Attempt
 */
function recordLoginAttempt($pdo, $ip) {
    try {
        $stmt = $pdo->prepare("INSERT INTO login_attempts (ip_address) VALUES (:ip)");
        $stmt->execute(['ip' => $ip]);
    } catch (Exception $e) {
        // silent
    }
}

/**
 * Clear Login Attempts on successful login
 */
function clearLoginAttempts($pdo, $ip) {
    try {
        $stmt = $pdo->prepare("DELETE FROM login_attempts WHERE ip_address = :ip");
        $stmt->execute(['ip' => $ip]);
    } catch (Exception $e) {
        // silent
    }
}

/**
 * Log Administrative Activity
 */
function logActivity($pdo, $action, $details, $refId = null) {
    try {
        $user = $_SESSION['admin_username'] ?? 'System';
        $ip = getClientIP();
        $stmt = $pdo->prepare("INSERT INTO activity_logs (action, details, user, ip_address, reference_id) VALUES (:action, :details, :user, :ip, :ref)");
        $stmt->execute([
            'action'  => $action,
            'details' => $details,
            'user'    => $user,
            'ip'      => $ip,
            'ref'     => $refId,
        ]);
    } catch (Exception $e) {
        error_log("Failed to log activity: " . $e->getMessage());
    }
}

/**
 * Unique Alphanumeric Repair Code Generator (Server-Side)
 */
function generateServerRepairCode($pdo) {
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for ($attempt = 0; $attempt < 10; $attempt++) {
        $code = 'TJ-';
        for ($i = 0; $i < 5; $i++) {
            $code .= $chars[random_int(0, strlen($chars) - 1)];
        }
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM repairs WHERE customer_code = :code");
        $stmt->execute(['code' => $code]);
        if ((int)$stmt->fetchColumn() === 0) {
            return $code;
        }
    }
    return 'TJ-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));
}
