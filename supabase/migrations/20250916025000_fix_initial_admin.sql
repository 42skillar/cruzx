/*
  # Fix for creating the first admin profile
  
  This migration adds a secure way to create the first admin profile
  by using a SECURITY DEFINER function that bypasses RLS to check
  if any profiles exist in the database.
*/

-- Create a secure function to check if any profiles exist
-- This function bypasses RLS to get accurate count
CREATE OR REPLACE FUNCTION public.can_create_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT count(*) = 0 FROM public.profiles);
END;
$$;

-- Set the owner to postgres (or database owner) to bypass RLS
ALTER FUNCTION public.can_create_first_admin() OWNER TO postgres;

-- Add secure policy to allow creating first admin only
CREATE POLICY "Allow first admin creation"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.can_create_first_admin() 
    AND id = auth.uid() 
    AND role = 'admin'
  );