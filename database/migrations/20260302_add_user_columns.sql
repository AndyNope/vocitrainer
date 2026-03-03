-- Migration: Add user scoping columns for auth

-- Users table (email verification fields)
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP NULL,
    ADD COLUMN IF NOT EXISTS email_verification_token_hash VARCHAR(64) NULL,
    ADD COLUMN IF NOT EXISTS email_verification_expires_at TIMESTAMP NULL;

-- User settings
ALTER TABLE user_settings
    ADD COLUMN IF NOT EXISTS user_id INT NOT NULL,
    ADD UNIQUE KEY IF NOT EXISTS uniq_user_settings (user_id);

-- Voci sets
ALTER TABLE voci_sets
    ADD COLUMN IF NOT EXISTS user_id INT NOT NULL,
    ADD INDEX IF NOT EXISTS idx_user (user_id);

-- Learning progress
ALTER TABLE learning_progress
    ADD COLUMN IF NOT EXISTS user_id INT NOT NULL,
    ADD INDEX IF NOT EXISTS idx_user (user_id);

-- Learning sessions
ALTER TABLE learning_sessions
    ADD COLUMN IF NOT EXISTS user_id INT NOT NULL,
    ADD INDEX IF NOT EXISTS idx_user (user_id);

-- Foreign keys (add if missing)
ALTER TABLE user_settings
    ADD CONSTRAINT fk_user_settings_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE voci_sets
    ADD CONSTRAINT fk_voci_sets_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE learning_progress
    ADD CONSTRAINT fk_learning_progress_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE learning_sessions
    ADD CONSTRAINT fk_learning_sessions_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- NOTE:
-- If you already have existing data, you must assign user_id values.
-- Example (replace 1 with a real user id):
-- UPDATE user_settings SET user_id = 1 WHERE user_id IS NULL;
-- UPDATE voci_sets SET user_id = 1 WHERE user_id IS NULL;
-- UPDATE learning_progress SET user_id = 1 WHERE user_id IS NULL;
-- UPDATE learning_sessions SET user_id = 1 WHERE user_id IS NULL;
