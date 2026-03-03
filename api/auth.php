<?php
require_once 'db.php';

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

function sendVerificationEmail($email, $name, $token) {
    $verifyUrl = rtrim(APP_URL, '/') . '/verify.html?token=' . urlencode($token);
    $subject = 'Voci Trainer - E-Mail bestätigen';
    $body = "Hallo {$name},\n\n" .
        "bitte bestätige deine E-Mail-Adresse, indem du auf den folgenden Link klickst:\n" .
        "{$verifyUrl}\n\n" .
        "Der Link ist 24 Stunden gültig.\n\n" .
        "Falls du dich nicht registriert hast, ignoriere diese E-Mail.\n";

    $headers = "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM . ">\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    return mail($email, $subject, $body, $headers);
}

try {
    switch ($method) {
        case 'GET':
            $userId = getCurrentUserId();
            if (!$userId) {
                sendResponse(['user' => null]);
            }

            $stmt = $db->query("SELECT id, name, email FROM users WHERE id = ?", [$userId]);
            $user = $stmt->fetch();

            sendResponse(['user' => $user ?: null]);
            break;

        case 'POST':
            $data = getJsonInput();
            $mode = $data['mode'] ?? '';

            if ($mode === 'register') {
                if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
                    sendError('Name, E-Mail und Passwort sind erforderlich');
                }

                $email = trim(strtolower($data['email']));
                $name = trim($data['name']);
                $password = $data['password'];

                $stmt = $db->query("SELECT id FROM users WHERE email = ?", [$email]);
                if ($stmt->fetch()) {
                    sendError('E-Mail ist bereits registriert', 409);
                }

                $passwordHash = password_hash($password, PASSWORD_DEFAULT);
                $token = bin2hex(random_bytes(32));
                $tokenHash = hash('sha256', $token);
                $expiresAt = (new DateTime('+24 hours'))->format('Y-m-d H:i:s');

                $userId = $db->insert(
                    "INSERT INTO users (name, email, password_hash, email_verification_token_hash, email_verification_expires_at) VALUES (?, ?, ?, ?, ?)",
                    [$name, $email, $passwordHash, $tokenHash, $expiresAt]
                );

                $mailSent = sendVerificationEmail($email, $name, $token);
                if (!$mailSent) {
                    $db->query("DELETE FROM users WHERE id = ?", [$userId]);
                    sendError('Bestätigungs-E-Mail konnte nicht gesendet werden', 500);
                }

                sendResponse(['success' => true, 'requires_verification' => true], 201);
            }

            if ($mode === 'login') {
                if (empty($data['email']) || empty($data['password'])) {
                    sendError('E-Mail und Passwort sind erforderlich');
                }

                $email = trim(strtolower($data['email']));
                $password = $data['password'];

                $stmt = $db->query("SELECT id, name, email, password_hash, email_verified_at FROM users WHERE email = ?", [$email]);
                $user = $stmt->fetch();

                if (!$user || !password_verify($password, $user['password_hash'])) {
                    sendError('Ungültige Anmeldedaten', 401);
                }

                if (!$user['email_verified_at']) {
                    sendError('Bitte bestätige zuerst deine E-Mail-Adresse', 403);
                }

                $_SESSION['user_id'] = $user['id'];
                sendResponse(['user' => ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email']]]);
            }

            sendError('Ungültiger Modus', 400);
            break;

        case 'DELETE':
            session_unset();
            session_destroy();
            sendResponse(['success' => true]);
            break;

        default:
            sendError('Methode nicht erlaubt', 405);
    }
} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}
