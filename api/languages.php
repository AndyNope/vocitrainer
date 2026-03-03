<?php
require_once 'db.php';

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Alle Sprachen abrufen
            $stmt = $db->query("SELECT * FROM languages ORDER BY name");
            $languages = $stmt->fetchAll();
            sendResponse(['languages' => $languages]);
            break;

        case 'POST':
            // Neue Sprache hinzufügen (optional)
            $data = getJsonInput();
            
            if (empty($data['name']) || empty($data['code'])) {
                sendError('Name und Code sind erforderlich');
            }

            $id = $db->insert(
                "INSERT INTO languages (name, code) VALUES (?, ?)",
                [$data['name'], $data['code']]
            );

            sendResponse(['success' => true, 'id' => $id], 201);
            break;

        default:
            sendError('Methode nicht erlaubt', 405);
    }
} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}
