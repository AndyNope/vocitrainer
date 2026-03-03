-- Voci Trainer Database Schema
-- MariaDB Database: vocitrainer

-- Tabelle für Benutzer
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP NULL,
    email_verification_token_hash VARCHAR(64) NULL,
    email_verification_expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabelle für Benutzereinstellungen (Hauptsprache)
CREATE TABLE IF NOT EXISTS user_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    main_language VARCHAR(50) NOT NULL DEFAULT 'Deutsch',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_user_settings (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabelle für Sprachen
CREATE TABLE IF NOT EXISTS languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Standardsprachen einfügen
INSERT IGNORE INTO languages (name, code) VALUES 
    ('Deutsch', 'de'),
    ('Englisch', 'en'),
    ('Französisch', 'fr'),
    ('Spanisch', 'es'),
    ('Italienisch', 'it'),
    ('Portugiesisch', 'pt'),
    ('Russisch', 'ru'),
    ('Chinesisch', 'zh'),
    ('Japanisch', 'ja'),
    ('Koreanisch', 'ko');

-- Tabelle für Voci-Sets
CREATE TABLE IF NOT EXISTS voci_sets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    language_id INT NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_shared BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(64) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_language (language_id),
    INDEX idx_favorite (is_favorite),
    UNIQUE KEY uniq_share_token (share_token)
);

-- Tabelle für Vokabeln
CREATE TABLE IF NOT EXISTS vocabularies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    set_id INT NOT NULL,
    word_main VARCHAR(255) NOT NULL,
    word_target VARCHAR(255) NOT NULL,
    position INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (set_id) REFERENCES voci_sets(id) ON DELETE CASCADE,
    INDEX idx_set (set_id)
);

-- Tabelle für Lernfortschritt
CREATE TABLE IF NOT EXISTS learning_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vocabulary_id INT NOT NULL,
    mode ENUM('typing', 'flashcard', 'quiz', 'speed', 'listening') NOT NULL,
    is_correct BOOLEAN NOT NULL,
    learned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vocabulary_id) REFERENCES vocabularies(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_vocabulary (vocabulary_id),
    INDEX idx_mode (mode)
);

-- Tabelle für Session-Statistiken
CREATE TABLE IF NOT EXISTS learning_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    set_id INT NOT NULL,
    mode ENUM('typing', 'flashcard', 'quiz', 'speed', 'listening') NOT NULL,
    correct_count INT DEFAULT 0,
    wrong_count INT DEFAULT 0,
    total_count INT DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (set_id) REFERENCES voci_sets(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_set (set_id)
);
