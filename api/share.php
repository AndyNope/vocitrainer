<?php
require_once 'db.php';

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            if (!empty($_GET['list'])) {
                $stmt = $db->query(
                    "SELECT vs.id, vs.name, vs.language_id, l.name AS language_name, vs.updated_at, vs.share_token,
                            u.name AS owner_name, COUNT(v.id) AS word_count
                     FROM voci_sets vs
                     JOIN users u ON vs.user_id = u.id
                     JOIN languages l ON vs.language_id = l.id
                     LEFT JOIN vocabularies v ON vs.id = v.set_id
                     WHERE vs.is_shared = 1 AND vs.is_community = 1 AND vs.share_token IS NOT NULL
                     GROUP BY vs.id
                     ORDER BY vs.updated_at DESC"
                );
                $sets = $stmt->fetchAll();
                sendResponse(['sets' => $sets]);
            }

            $token = $_GET['token'] ?? '';
            if (!$token) {
                sendError('Token fehlt', 400);
            }

            $stmt = $db->query(
                "SELECT vs.id, vs.name, vs.language_id, l.name AS language_name, COUNT(v.id) AS word_count
                 FROM voci_sets vs
                 JOIN languages l ON vs.language_id = l.id
                 LEFT JOIN vocabularies v ON vs.id = v.set_id
                 WHERE vs.share_token = ? AND vs.is_shared = 1
                 GROUP BY vs.id",
                [$token]
            );
            $set = $stmt->fetch();

            if (!$set) {
                sendError('Freigabe nicht gefunden', 404);
            }

            sendResponse(['set' => $set]);
            break;

        case 'POST':
            $data = getJsonInput();
            $action = $data['action'] ?? '';

            if ($action === 'create') {
                $userId = requireAuth();
                $setId = $data['set_id'] ?? null;
                if (!$setId) {
                    sendError('Set-ID fehlt', 400);
                }

                $stmt = $db->query(
                    "SELECT id, share_token, is_shared, is_community FROM voci_sets WHERE id = ? AND user_id = ?",
                    [$setId, $userId]
                );
                $set = $stmt->fetch();

                if (!$set) {
                    sendError('Set nicht gefunden', 404);
                }

                if (!$set['share_token']) {
                    $token = bin2hex(random_bytes(32));
                    $db->query(
                        "UPDATE voci_sets SET is_shared = 1, share_token = ? WHERE id = ?",
                        [$token, $setId]
                    );
                } else {
                    $token = $set['share_token'];
                    if (!$set['is_shared']) {
                        $db->query("UPDATE voci_sets SET is_shared = 1 WHERE id = ?", [$setId]);
                    }
                }

                $shareUrl = rtrim(APP_URL, '/') . '/index.html?share=' . urlencode($token);
                sendResponse(['share_url' => $shareUrl, 'is_community' => (bool)$set['is_community']]);
            }

            if ($action === 'import') {
                $userId = requireAuth();
                $token = $data['token'] ?? '';
                if (!$token) {
                    sendError('Token fehlt', 400);
                }

                $stmt = $db->query(
                    "SELECT vs.id, vs.name, vs.language_id
                     FROM voci_sets vs
                     WHERE vs.share_token = ? AND vs.is_shared = 1",
                    [$token]
                );
                $sourceSet = $stmt->fetch();

                if (!$sourceSet) {
                    sendError('Freigabe nicht gefunden', 404);
                }

                $newSetId = $db->insert(
                    "INSERT INTO voci_sets (user_id, name, language_id) VALUES (?, ?, ?)",
                    [$userId, $sourceSet['name'] . ' (geteilt)', $sourceSet['language_id']]
                );

                $vocabs = $db->query("SELECT word_main, word_target, position FROM vocabularies WHERE set_id = ? ORDER BY position, id", [$sourceSet['id']])->fetchAll();
                foreach ($vocabs as $vocab) {
                    $db->insert(
                        "INSERT INTO vocabularies (set_id, word_main, word_target, position) VALUES (?, ?, ?, ?)",
                        [$newSetId, $vocab['word_main'], $vocab['word_target'], $vocab['position']]
                    );
                }

                sendResponse(['success' => true, 'set_id' => $newSetId], 201);
            }

            if ($action === 'toggle_community') {
                $userId = requireAuth();
                $setId = $data['set_id'] ?? null;
                $isCommunity = isset($data['is_community']) ? (bool)$data['is_community'] : false;
                
                if (!$setId) {
                    sendError('Set-ID fehlt', 400);
                }

                $stmt = $db->query(
                    "SELECT id FROM voci_sets WHERE id = ? AND user_id = ?",
                    [$setId, $userId]
                );
                
                if (!$stmt->fetch()) {
                    sendError('Set nicht gefunden', 404);
                }

                $db->query(
                    "UPDATE voci_sets SET is_community = ? WHERE id = ?",
                    [$isCommunity ? 1 : 0, $setId]
                );

                sendResponse(['success' => true]);
            }

            sendError('Ungültige Aktion', 400);
            break;

        default:
            sendError('Methode nicht erlaubt', 405);
    }
} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}
