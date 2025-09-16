/*
  # Create provinces table

  1. New Tables
    - `provinces`
      - `id` (uuid, primary key)
      - `name` (text, province name)
      - `code` (text, province code) 
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `provinces` table
    - Add policy for authenticated users to read provinces
*/

CREATE TABLE IF NOT EXISTS provinces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read provinces"
  ON provinces
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert Angola provinces
INSERT INTO provinces (name, code) VALUES
  ('Bengo', 'BGO'),
  ('Benguela', 'BGU'),
  ('Bié', 'BIE'),
  ('Cabinda', 'CAB'),
  ('Cuando Cubango', 'CCU'),
  ('Cuanza Norte', 'CNO'),
  ('Cuanza Sul', 'CSU'),
  ('Cunene', 'CNN'),
  ('Huambo', 'HUA'),
  ('Huíla', 'HUI'),
  ('Luanda', 'LUA'),
  ('Lunda Norte', 'LNO'),
  ('Lunda Sul', 'LSU'),
  ('Malanje', 'MAL'),
  ('Moxico', 'MOX'),
  ('Namibe', 'NAM'),
  ('Uíge', 'UIG'),
  ('Zaire', 'ZAI')
ON CONFLICT (code) DO NOTHING;