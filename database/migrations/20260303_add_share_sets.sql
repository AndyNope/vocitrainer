-- Migration: Add share fields to voci_sets

ALTER TABLE voci_sets
    ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS share_token VARCHAR(64) NULL,
    ADD COLUMN IF NOT EXISTS is_community BOOLEAN DEFAULT FALSE,
    ADD UNIQUE KEY IF NOT EXISTS uniq_share_token (share_token);
