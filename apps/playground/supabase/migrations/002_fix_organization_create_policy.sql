-- Fix organization create policy to ensure created_by matches auth.uid()
-- This prevents users from creating organizations with other users as creators

DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;

CREATE POLICY "Authenticated users can create organizations"
  ON organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());
