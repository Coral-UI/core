-- Fix organization_members insert policy to allow creators to add themselves
-- This fixes the chicken-and-egg problem where creators need to be admins to add members,
-- but they can't be admins until they're members

DROP POLICY IF EXISTS "Admins can add members" ON organization_members;

CREATE POLICY "Admins can add members"
  ON organization_members FOR INSERT
  WITH CHECK (
    -- Allow if user can manage org (is admin)
    user_can_manage_org(organization_id)
    OR
    -- Allow if user is the creator of the organization (for initial self-add)
    EXISTS (
      SELECT 1 FROM organizations
      WHERE id = organization_id
      AND created_by = auth.uid()
    )
  );
