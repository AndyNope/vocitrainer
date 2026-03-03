<?php
require_once 'db.php';

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];
$userId = requireAuth();

try {
    switch ($method) {
        case 'GET':
            // Alle Voci-Sets abrufen
            $stmt = $db->query("
                SELECT 
                    vs.id, 
                    vs.name, 
                    vs.is_favorite,
                    vs.is_shared,
                    vs.created_at,
                    vs.updated_at,
                    l.name as language_name,
                    l.id as language_id,
                    1 as is_owner,
                    COUNT(v.id) as word_count
                FROM voci_sets vs
                LEFT JOIN languages l ON vs.language_id = l.id
                LEFT JOIN vocabularies v ON vs.id = v.set_id
                WHERE vs.user_id = ?
                GROUP BY vs.id
                ORDER BY vs.is_favorite DESC, vs.updated_at DESC
            ", [$userId]);
            $sets = $stmt->fetchAll();
            sendResponse(['sets' => $sets]);
            break;

        case 'POST':
            // Neues Voci-Set erstellen
            $data = getJsonInput();
            
            if (empty($data['name']) || empty($data['language_id'])) {
                sendError('Name und Sprache sind erforderlich');
            }

            $id = $db->insert(
                "INSERT INTO voci_sets (user_id, name, language_id) VALUES (?, ?, ?)",
                [$userId, $data['name'], $data['language_id']]
            );

            sendResponse(['success' => true, 'id' => $id], 201);
            break;

        case 'PUT':
            // Voci-Set aktualisieren
            $data = getJsonInput();
            
            if (empty($data['id'])) {
                sendError('ID ist erforderlich');
            }

            $updates = [];
            $params = [];

            if (isset($data['name'])) {
                $updates[] = "name = ?";
                $params[] = $data['name'];
            }

            if (isset($data['language_id'])) {
                $updates[] = "language_id = ?";
                $params[] = $data['language_id'];
            }

            if (isset($data['is_favorite'])) {
                $updates[] = "is_favorite = ?";
                $params[] = $data['is_favorite'] ? 1 : 0;
            }

            if (empty($updates)) {
                sendError('Keine Aktualisierungen angegeben');
            }

            $params[] = $data['id'];
            $params[] = $userId;
            $sql = "UPDATE voci_sets SET " . implode(', ', $updates) . " WHERE id = ? AND user_id = ?";
            $db->query($sql, $params);

            sendResponse(['success' => true]);
            break;

        case 'DELETE':
            // Voci-Set löschen
            $data = getJsonInput();
            
            if (empty($data['id'])) {
                sendError('ID ist erforderlich');
            }

            $db->query("DELETE FROM voci_sets WHERE id = ? AND user_id = ?", [$data['id'], $userId]);
            sendResponse(['success' => true]);
            break;

        default:
            sendError('Methode nicht erlaubt', 405);
    }
} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}
