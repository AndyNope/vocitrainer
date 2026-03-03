<?php
require_once 'db.php';

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

// Check if this is a request for a shared set
$isSharedRequest = !empty($_GET['share_token']);

if (!$isSharedRequest) {
    $userId = requireAuth();
}

try {
    switch ($method) {
        case 'GET':
            // Vokabeln eines Sets abrufen
            if (empty($_GET['set_id'])) {
                sendError('Set-ID ist erforderlich');
            }

            if ($isSharedRequest) {
                // Shared set - no auth required
                $stmt = $db->query(
                    "SELECT v.* FROM vocabularies v
                     JOIN voci_sets s ON v.set_id = s.id
                     WHERE v.set_id = ? AND s.share_token = ? AND s.is_shared = 1
                     ORDER BY v.position, v.id",
                    [$_GET['set_id'], $_GET['share_token']]
                );
            } else {
                // User's own set
                $stmt = $db->query(
                    "SELECT v.* FROM vocabularies v
                     JOIN voci_sets s ON v.set_id = s.id
                     WHERE v.set_id = ? AND s.user_id = ?
                     ORDER BY v.position, v.id",
                    [$_GET['set_id'], $userId]
                );
            }
            $vocabularies = $stmt->fetchAll();
            sendResponse(['vocabularies' => $vocabularies]);
            break;

        case 'POST':
            // Neue Vokabel hinzufügen - requires auth
            $userId = requireAuth();
            $data = getJsonInput();
            
            if (empty($data['set_id']) || empty($data['word_main']) || empty($data['word_target'])) {
                sendError('Set-ID und beide Wörter sind erforderlich');
            }

            // Prüfen ob Set dem Benutzer gehört
            $setStmt = $db->query("SELECT id FROM voci_sets WHERE id = ? AND user_id = ?", [$data['set_id'], $userId]);
            if (!$setStmt->fetch()) {
                sendError('Set nicht gefunden', 404);
            }

            // Position ermitteln
            $stmt = $db->query(
                "SELECT COALESCE(MAX(position), 0) + 1 as next_position FROM vocabularies WHERE set_id = ?",
                [$data['set_id']]
            );
            $position = $stmt->fetch()['next_position'];

            $id = $db->insert(
                "INSERT INTO vocabularies (set_id, word_main, word_target, position) VALUES (?, ?, ?, ?)",
                [$data['set_id'], $data['word_main'], $data['word_target'], $position]
            );

            sendResponse(['success' => true, 'id' => $id], 201);
            break;

        case 'PUT':
            // Vokabel aktualisieren
            $data = getJsonInput();
            
            if (empty($data['id'])) {
                sendError('ID ist erforderlich');
            }

            $updates = [];
            $params = [];

            if (isset($data['word_main'])) {
                $updates[] = "word_main = ?";
                $params[] = $data['word_main'];
            }

            if (isset($data['word_target'])) {
                $updates[] = "word_target = ?";
                $params[] = $data['word_target'];
            }

            if (isset($data['position'])) {
                $updates[] = "position = ?";
                $params[] = $data['position'];
            }

            if (empty($updates)) {
                sendError('Keine Aktualisierungen angegeben');
            }

            $params[] = $data['id'];
            $params[] = $userId;
            $sql = "UPDATE vocabularies v\n                    JOIN voci_sets s ON v.set_id = s.id\n                    SET " . implode(', ', $updates) . "\n                    WHERE v.id = ? AND s.user_id = ?";
            $db->query($sql, $params);

            sendResponse(['success' => true]);
            break;

        case 'DELETE':
            // Vokabel löschen
            $data = getJsonInput();
            
            if (empty($data['id'])) {
                sendError('ID ist erforderlich');
            }

            $db->query(
                "DELETE v FROM vocabularies v\n                 JOIN voci_sets s ON v.set_id = s.id\n                 WHERE v.id = ? AND s.user_id = ?",
                [$data['id'], $userId]
            );
            sendResponse(['success' => true]);
            break;

        default:
            sendError('Methode nicht erlaubt', 405);
    }
} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}
