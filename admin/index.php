<?php
/**
 * Admin direct directory entry point
 * Serves index.html or redirects cleanly into the SPA admin interface.
 */
if (file_exists(__DIR__ . '/../index.html')) {
    include __DIR__ . '/../index.html';
    exit;
}
if (file_exists(__DIR__ . '/../dist/index.html')) {
    include __DIR__ . '/../dist/index.html';
    exit;
}
header('Location: /?admin=true');
exit;
