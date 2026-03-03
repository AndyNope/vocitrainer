<?php
require_once 'db.php';

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method !== 'GET') {
        sendError('Methode nicht erlaubt', 405);
    }

    $token = $_GET['token'] ?? '';
    if (!$token) {
        sendError('Token fehlt', 400);
    }

    $tokenHash = hash('sha256', $token);

    $stmt = $db->query(
        "SELECT id, email_verification_expires_at, email_verified_at FROM users WHERE email_verification_token_hash = ? LIMIT 1",
        [$tokenHash]
    );
    $user = $stmt->fetch();

    if (!$user) {
        sendError('Token ungültig', 400);
    }

    if ($user['email_verified_at']) {
        sendResponse(['success' => true, 'already_verified' => true]);
    }

    $now = new DateTime();
    $expiresAt = new DateTime($user['email_verification_expires_at']);

    if ($expiresAt < $now) {
        sendError('Token abgelaufen', 410);
    }

    $db->query(
        "UPDATE users SET email_verified_at = NOW(), email_verification_token_hash = NULL, email_verification_expires_at = NULL WHERE id = ?",
        [$user['id']]
    );

    $_SESSION['user_id'] = $user['id'];

    sendResponse(['success' => true]);
} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}
