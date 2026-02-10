-- Add roleplay column to session_contents table
ALTER TABLE session_contents
ADD COLUMN IF NOT EXISTS roleplay JSONB DEFAULT NULL;

-- Add comment describing the column
COMMENT ON COLUMN session_contents.roleplay IS 'Roleplay scenarios with dialogue-based practice';
