-- Create organization_invitations table
-- This table stores pending invitations to join organizations

CREATE TABLE organization_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_organization_invitations_token ON organization_invitations(token);
CREATE INDEX idx_organization_invitations_org_id ON organization_invitations(organization_id);
CREATE INDEX idx_organization_invitations_email ON organization_invitations(email);
CREATE INDEX idx_organization_invitations_expires_at ON organization_invitations(expires_at) WHERE accepted_at IS NULL;

-- Ensure only one pending invitation per email per organization
-- Using a partial unique index instead of a constraint with WHERE clause
CREATE UNIQUE INDEX unique_pending_invitation ON organization_invitations(organization_id, email) WHERE accepted_at IS NULL;

-- Enable Row Level Security
ALTER TABLE organization_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view invitations for organizations they have access to
CREATE POLICY "Users can view invitations for organizations they have access to"
  ON organization_invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = organization_invitations.organization_id
      AND (
        organizations.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM organization_members
          WHERE organization_members.organization_id = organization_invitations.organization_id
          AND organization_members.user_id = auth.uid()
        )
      )
    )
  );

-- RLS Policy: Only admins can create invitations
CREATE POLICY "Admins can create invitations"
  ON organization_invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = organization_invitations.organization_id
      AND (
        organizations.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM organization_members
          WHERE organization_members.organization_id = organization_invitations.organization_id
          AND organization_members.user_id = auth.uid()
          AND organization_members.role = 'admin'
        )
      )
    )
    AND invited_by = auth.uid()
  );

-- RLS Policy: Only admins can update invitations
CREATE POLICY "Admins can update invitations"
  ON organization_invitations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = organization_invitations.organization_id
      AND (
        organizations.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM organization_members
          WHERE organization_members.organization_id = organization_invitations.organization_id
          AND organization_members.user_id = auth.uid()
          AND organization_members.role = 'admin'
        )
      )
    )
  );

-- RLS Policy: Only admins can delete invitations
CREATE POLICY "Admins can delete invitations"
  ON organization_invitations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = organization_invitations.organization_id
      AND (
        organizations.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM organization_members
          WHERE organization_members.organization_id = organization_invitations.organization_id
          AND organization_members.user_id = auth.uid()
          AND organization_members.role = 'admin'
        )
      )
    )
  );

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_organization_invitations_updated_at
  BEFORE UPDATE ON organization_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
