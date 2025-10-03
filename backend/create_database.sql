-- =============================================
-- Create HR Management Database
-- Run this file first to create the database
-- =============================================

-- Create database
CREATE DATABASE hrm_database
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'  -- Neutral collation (recommended for Vietnamese)
    LC_CTYPE = 'C'    -- Neutral character classification
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- Connect to the new database
\c hrm_database;

-- Grant privileges (optional - adjust based on your user setup)
-- GRANT ALL PRIVILEGES ON DATABASE hrm_database TO your_username;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;

-- =============================================
-- Instructions:
-- 1. Run this file first: create_database.sql
-- 2. Then run: database_schema.sql
-- =============================================
