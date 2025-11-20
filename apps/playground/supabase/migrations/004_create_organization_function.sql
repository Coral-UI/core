-- Create a function to handle organization creation atomically
-- This ensures the creator is automatically added as an admin member
-- and bypasses RLS issues by using SECURITY DEFINER

CREATE OR REPLACE FUNCTION create_organization_with_creator(
  org_name TEXT,
  creator_user_id UUID
)
RETURNS UUID AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Verify the creator_user_id matches the authenticated user
  IF creator_user_id != auth.uid() THEN
    RAISE EXCEPTION 'User can only create organizations for themselves';
  END IF;

  -- Create the organization
  INSERT INTO organizations (name, created_by, created_at, updated_at)
  VALUES (org_name, creator_user_id, NOW(), NOW())
  RETURNING id INTO new_org_id;

  -- Automatically add creator as admin member
  INSERT INTO organization_members (
    organization_id,
    user_id,
    role,
    invited_by,
    created_at,
    updated_at
  )
  VALUES (
    new_org_id,
    creator_user_id,
    'admin',
    creator_user_id,
    NOW(),
    NOW()
  );

  RETURN new_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_organization_with_creator(TEXT, UUID) TO authenticated;
