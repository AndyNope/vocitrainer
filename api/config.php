<?php
// Datenbankkonfiguration
define('DB_HOST', 'localhost');
define('DB_NAME', 'vocitrainer');
define('DB_USER', 'vocitrainer');
define('DB_PASS', 'Pixelgun3d!!');
define('DB_CHARSET', 'utf8mb4');

// App URL (für E-Mail-Links)
$defaultHost = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
$defaultScheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
define('APP_URL', $defaultScheme . '://' . $defaultHost);

// E-Mail Konfiguration
define('MAIL_FROM', 'no-reply@voci-trainer.local');
define('MAIL_FROM_NAME', 'Voci Trainer');

// Timezone
date_default_timezone_set('Europe/Zurich');

// Error Reporting (für Entwicklung)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers für JSON-Antworten
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
