/*
  # Create donations table

  1. New Tables
    - `donations`
      - `id` (uuid, primary key)
      - `donor_id` (uuid, references donors)
      - `donation_date` (date)
      - `location` (text, donation location)
      - `volume_ml` (integer, volume in milliliters)
      - `donation_type` (enum: whole_blood, plasma, platelets, red_cells)
      - `notes` (text, optional)
      - `province_id` (uuid, references provinces)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `donations` table
    - Add policies for users to manage donations in their province
*/

-- Create donation type enum
DO $$ BEGIN
  CREATE TYPE donation_type AS ENUM ('whole_blood', 'plasma', 'platelets', 'red_cells');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES donors(id) NOT NULL,
  donation_date date NOT NULL,
  location text NOT NULL,
  volume_ml integer NOT NULL CHECK (volume_ml > 0),
  donation_type donation_type NOT NULL DEFAULT 'whole_blood',
  notes text,
  province_id uuid REFERENCES provinces(id) NOT NULL,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Users can read donations in their province
CREATE POLICY "Users can read donations in their province"
  ON donations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles user_profile
      WHERE user_profile.id = auth.uid()
      AND user_profile.province_id = donations.province_id
    )
  );

-- All authenticated users can insert donations
CREATE POLICY "Authenticated users can insert donations"
  ON donations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles user_profile
      WHERE user_profile.id = auth.uid()
      AND user_profile.province_id = donations.province_id
    )
  );

-- Leaders can update donations they created, admins can update all
CREATE POLICY "Users can update donations based on role"
  ON donations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles user_profile
      WHERE user_profile.id = auth.uid()
      AND (
        (user_profile.role IN ('leader', 'operator') AND donations.created_by = auth.uid()) OR
        user_profile.role = 'admin'
      )
      AND user_profile.province_id = donations.province_id
    )
  );

-- Admins can delete donations in their province
CREATE POLICY "Admins can delete donations in their province"
  ON donations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles user_profile
      WHERE user_profile.id = auth.uid()
      AND user_profile.role = 'admin'
      AND user_profile.province_id = donations.province_id
    )
  );