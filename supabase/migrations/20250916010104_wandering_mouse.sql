/*
  # Create donors table

  1. New Tables
    - `donors`
      - `id` (uuid, primary key)
      - `name` (text, donor full name)
      - `email` (text, optional)
      - `phone` (text, contact number)
      - `birth_date` (date)
      - `age` (integer, calculated)
      - `gender` (enum: M, F)
      - `blood_type` (enum: A+, A-, B+, B-, AB+, AB-, O+, O-)
      - `weight` (numeric, in kg)
      - `height` (numeric, in cm)
      - `address` (text)
      - `municipality` (text)
      - `province_id` (uuid, references provinces)
      - `is_eligible` (boolean, default true)
      - `medical_conditions` (text, optional)
      - `medications` (text, optional)
      - `last_donation_date` (date, optional)
      - `available_days` (text array)
      - `preferred_time` (enum: morning, afternoon, evening)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `donors` table
    - Add policies based on user roles and province access
*/

-- Create enums
DO $$ BEGIN
  CREATE TYPE gender_type AS ENUM ('M', 'F');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE blood_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE preferred_time AS ENUM ('morning', 'afternoon', 'evening');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  birth_date date NOT NULL,
  age integer NOT NULL,
  gender gender_type NOT NULL,
  blood_type blood_type NOT NULL,
  weight numeric NOT NULL CHECK (weight > 0),
  height numeric NOT NULL CHECK (height > 0),
  address text NOT NULL,
  municipality text NOT NULL,
  province_id uuid REFERENCES provinces(id) NOT NULL,
  is_eligible boolean DEFAULT true,
  medical_conditions text,
  medications text,
  last_donation_date date,
  available_days text[] DEFAULT '{}',
  preferred_time preferred_time DEFAULT 'morning',
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE donors ENABLE ROW LEVEL SECURITY;

-- Operators can read donors in their province
CREATE POLICY "Users can read donors in their province"
  ON donors
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles user_profile
      WHERE user_profile.id = auth.uid()
      AND user_profile.province_id = donors.province_id
    )
  );

-- Leaders can update donors they created
CREATE POLICY "Leaders can update donors they created"
  ON donors
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles user_profile
      WHERE user_profile.id = auth.uid()
      AND (
        (user_profile.role = 'leader' AND donors.created_by = auth.uid()) OR
        user_profile.role = 'admin'
      )
      AND user_profile.province_id = donors.province_id
    )
  );

-- Leaders and admins can insert donors
CREATE POLICY "Leaders and admins can insert donors"
  ON donors
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles user_profile
      WHERE user_profile.id = auth.uid()
      AND user_profile.role IN ('leader', 'admin')
      AND user_profile.province_id = donors.province_id
    )
  );

-- Admins can delete donors in their province
CREATE POLICY "Admins can delete donors in their province"
  ON donors
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles user_profile
      WHERE user_profile.id = auth.uid()
      AND user_profile.role = 'admin'
      AND user_profile.province_id = donors.province_id
    )
  );

-- Trigger to automatically update updated_at
CREATE TRIGGER update_donors_updated_at
  BEFORE UPDATE ON donors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();