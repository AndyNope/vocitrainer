<?php
require_once 'db.php';

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];
$userId = requireAuth();

try {
    switch ($method) {
        case 'POST':
            // Lernfortschritt speichern
            $data = getJsonInput();
            
            if (empty($data['vocabulary_id']) || empty($data['mode']) || !isset($data['is_correct'])) {
                sendError('Vokabel-ID, Modus und Ergebnis sind erforderlich');
            }

            $stmt = $db->query(
                "SELECT v.id FROM vocabularies v\n                 JOIN voci_sets s ON v.set_id = s.id\n                 WHERE v.id = ? AND s.user_id = ?",
                [$data['vocabulary_id'], $userId]
            );

            if (!$stmt->fetch()) {
                sendError('Vokabel nicht gefunden', 404);
            }

            $id = $db->insert(
                "INSERT INTO learning_progress (user_id, vocabulary_id, mode, is_correct) VALUES (?, ?, ?, ?)",
                [$userId, $data['vocabulary_id'], $data['mode'], $data['is_correct'] ? 1 : 0]
            );

            sendResponse(['success' => true, 'id' => $id], 201);
            break;

        case 'GET':
            // Statistiken für ein Set abrufen
            if (empty($_GET['set_id'])) {
                sendError('Set-ID ist erforderlich');
            }

            $mode = $_GET['mode'] ?? null;
            
            $sql = "
                SELECT 
                    lp.mode,
                    COUNT(*) as total,
                    SUM(CASE WHEN lp.is_correct = 1 THEN 1 ELSE 0 END) as correct,
                    SUM(CASE WHEN lp.is_correct = 0 THEN 1 ELSE 0 END) as wrong
                FROM learning_progress lp
                JOIN vocabularies v ON lp.vocabulary_id = v.id
                JOIN voci_sets s ON v.set_id = s.id
                WHERE v.set_id = ? AND s.user_id = ? AND lp.user_id = ?
            ";
            
            $params = [$_GET['set_id'], $userId, $userId];
            
            if ($mode) {
                $sql .= " AND lp.mode = ?";
                $params[] = $mode;
            }
            
            $sql .= " GROUP BY lp.mode";
            
            $stmt = $db->query($sql, $params);
            $stats = $stmt->fetchAll();
            
            sendResponse(['statistics' => $stats]);
            break;

        default:
            sendError('Methode nicht erlaubt', 405);
    }
} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}
