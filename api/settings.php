<?php
require_once 'db.php';

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];
$userId = requireAuth();

try {
    switch ($method) {
        case 'GET':
            // Einstellungen abrufen
            $stmt = $db->query("SELECT * FROM user_settings WHERE user_id = ? LIMIT 1", [$userId]);
            $settings = $stmt->fetch();
            
            if (!$settings) {
                // Standardeinstellungen erstellen
                $id = $db->insert(
                    "INSERT INTO user_settings (user_id, main_language) VALUES (?, 'Deutsch')",
                    [$userId]
                );
                $settings = ['id' => $id, 'main_language' => 'Deutsch', 'user_id' => $userId];
            }
            
            sendResponse(['settings' => $settings]);
            break;

        case 'PUT':
            // Einstellungen aktualisieren
            $data = getJsonInput();
            
            if (empty($data['main_language'])) {
                sendError('Hauptsprache ist erforderlich');
            }

            // Prüfen ob Einstellungen existieren
            $stmt = $db->query("SELECT id FROM user_settings WHERE user_id = ? LIMIT 1", [$userId]);
            $existing = $stmt->fetch();

            if ($existing) {
                $db->query(
                    "UPDATE user_settings SET main_language = ? WHERE id = ? AND user_id = ?",
                    [$data['main_language'], $existing['id'], $userId]
                );
            } else {
                $db->insert(
                    "INSERT INTO user_settings (user_id, main_language) VALUES (?, ?)",
                    [$userId, $data['main_language']]
                );
            }

            sendResponse(['success' => true]);
            break;

        default:
            sendError('Methode nicht erlaubt', 405);
    }
} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}
