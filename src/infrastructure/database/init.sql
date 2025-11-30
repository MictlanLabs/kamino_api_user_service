-- Database initialization script for Kamino User Service
-- This script creates the necessary tables for user management and authentication

-- Ensure pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create migrations log table (must exist before any insert)
CREATE TABLE IF NOT EXISTS migrations_log (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_migrations_log_name ON migrations_log(name);

-- Create users table (UUID primary key) for fresh setups
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Alter users table to add profile photo and gender
ALTER TABLE IF EXISTS users
    ADD COLUMN IF NOT EXISTS profile_photo_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS gender VARCHAR(20) CHECK (gender IN ('MALE','FEMALE','NON_BINARY','OTHER'));

-- Add new columns: age and favorite_places
ALTER TABLE IF EXISTS users
    ADD COLUMN IF NOT EXISTS age INTEGER CHECK (age >= 0 AND age <= 130),
    ADD COLUMN IF NOT EXISTS favorite_places JSONB DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_gender ON users(gender);
-- Optional indexes (skip heavy indexing unless needed)
-- CREATE INDEX IF NOT EXISTS idx_users_age ON users(age);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create places_likes table to track likes of places by users
CREATE TABLE IF NOT EXISTS places_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    place_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, place_id)
);

-- Indexes for places_likes
CREATE INDEX IF NOT EXISTS idx_places_likes_user_id ON places_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_places_likes_place_id ON places_likes(place_id);

-- Conditional migration: convert integer user IDs to UUIDs and update references
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'id' AND data_type = 'integer'
    ) THEN
        -- Add new UUID column to users
        ALTER TABLE users ADD COLUMN IF NOT EXISTS new_id UUID DEFAULT gen_random_uuid();
        UPDATE users SET new_id = COALESCE(new_id, gen_random_uuid());

        -- Prepare refresh_tokens for UUID user_id
        ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS new_user_id UUID;
        UPDATE refresh_tokens rt
        SET new_user_id = u.new_id
        FROM users u
        WHERE rt.user_id::text = u.id::text;

        -- Drop existing FK if present
        ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey;

        -- Swap columns in users
        ALTER TABLE users RENAME COLUMN id TO old_id;
        ALTER TABLE users RENAME COLUMN new_id TO id;
        ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;
        ALTER TABLE users ADD PRIMARY KEY (id);

        -- Swap columns in refresh_tokens
        ALTER TABLE refresh_tokens RENAME COLUMN user_id TO old_user_id;
        ALTER TABLE refresh_tokens RENAME COLUMN new_user_id TO user_id;
        ALTER TABLE refresh_tokens ALTER COLUMN user_id SET NOT NULL;
        ALTER TABLE refresh_tokens ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

        -- Clean up old columns
        ALTER TABLE refresh_tokens DROP COLUMN IF EXISTS old_user_id;
        ALTER TABLE users DROP COLUMN IF EXISTS old_id;

        -- Log migration
        INSERT INTO migrations_log(name, description)
        VALUES ('2025-11-uuid-users-id', 'Convert users.id and refresh_tokens.user_id from integer to UUID')
        ON CONFLICT (name) DO NOTHING;
    END IF;
END
$$;
