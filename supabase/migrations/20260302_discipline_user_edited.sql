-- Allow authors to update their discipline classification once
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS discipline_user_edited BOOLEAN NOT NULL DEFAULT FALSE;
