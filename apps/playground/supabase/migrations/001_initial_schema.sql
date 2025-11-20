-- Initial schema migration for Coral UI Playground
-- Creates all tables, RLS policies, and helper functions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create organization_members table
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Create libraries table
CREATE TABLE libraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  css_reset TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create components table
CREATE TABLE components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  library_id UUID NOT NULL REFERENCES libraries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  spec JSONB NOT NULL,
  accessibility JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create design_tokens table
CREATE TABLE design_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  library_id UUID NOT NULL REFERENCES libraries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  "$type" TEXT,
  "$description" TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create themes table
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  library_id UUID NOT NULL REFERENCES libraries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create theme_options table
CREATE TABLE theme_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create token_values table
CREATE TABLE token_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_id UUID NOT NULL REFERENCES design_tokens(id) ON DELETE CASCADE,
  theme_option_id UUID NOT NULL REFERENCES theme_options(id) ON DELETE CASCADE,
  "$value" JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX idx_libraries_org_id ON libraries(organization_id);
CREATE INDEX idx_components_library_id ON components(library_id);
CREATE INDEX idx_design_tokens_library_id ON design_tokens(library_id);
CREATE INDEX idx_themes_library_id ON themes(library_id);
CREATE INDEX idx_theme_options_theme_id ON theme_options(theme_id);
CREATE INDEX idx_token_values_token_id ON token_values(token_id);
CREATE INDEX idx_token_values_theme_option_id ON token_values(theme_option_id);

-- Helper function: Get user's role in an organization
CREATE OR REPLACE FUNCTION get_user_org_role(org_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Check if user is the creator
  SELECT 'admin'::TEXT INTO user_role
  FROM organizations
  WHERE id = org_id AND created_by = auth.uid();

  IF user_role IS NOT NULL THEN
    RETURN user_role;
  END IF;

  -- Check if user is a member
  SELECT role INTO user_role
  FROM organization_members
  WHERE organization_id = org_id AND user_id = auth.uid();

  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if user has access to organization
CREATE OR REPLACE FUNCTION user_has_org_access(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- User created the org OR is a member
  RETURN EXISTS (
    SELECT 1 FROM organizations WHERE id = org_id AND created_by = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM organization_members WHERE organization_id = org_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if user can create in organization
CREATE OR REPLACE FUNCTION user_can_create_in_org(org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := get_user_org_role(org_id);
  RETURN user_role IN ('admin', 'editor');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if user can manage organization
CREATE OR REPLACE FUNCTION user_can_manage_org(org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := get_user_org_role(org_id);
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE libraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_values ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view organizations they created or are members of"
  ON organizations FOR SELECT
  USING (user_has_org_access(id));

CREATE POLICY "Authenticated users can create organizations"
  ON organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Admins can update organizations"
  ON organizations FOR UPDATE
  USING (user_can_manage_org(id));

CREATE POLICY "Admins can delete organizations"
  ON organizations FOR DELETE
  USING (user_can_manage_org(id));

-- RLS Policies for organization_members
CREATE POLICY "Users can view members of organizations they have access to"
  ON organization_members FOR SELECT
  USING (user_has_org_access(organization_id));

CREATE POLICY "Admins can add members"
  ON organization_members FOR INSERT
  WITH CHECK (user_can_manage_org(organization_id));

CREATE POLICY "Admins can update member roles"
  ON organization_members FOR UPDATE
  USING (user_can_manage_org(organization_id));

CREATE POLICY "Admins can remove members"
  ON organization_members FOR DELETE
  USING (user_can_manage_org(organization_id));

-- RLS Policies for libraries
CREATE POLICY "Users can view libraries in organizations they have access to"
  ON libraries FOR SELECT
  USING (user_has_org_access(organization_id));

CREATE POLICY "Admins and editors can create libraries"
  ON libraries FOR INSERT
  WITH CHECK (user_can_create_in_org(organization_id));

CREATE POLICY "Admins and editors can update libraries"
  ON libraries FOR UPDATE
  USING (user_can_create_in_org(organization_id));

CREATE POLICY "Admins and editors can delete libraries"
  ON libraries FOR DELETE
  USING (user_can_create_in_org(organization_id));

-- RLS Policies for components
CREATE POLICY "Users can view components in libraries they have access to"
  ON components FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM libraries
      WHERE libraries.id = components.library_id
      AND user_has_org_access(libraries.organization_id)
    )
  );

CREATE POLICY "Admins and editors can create components"
  ON components FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM libraries
      WHERE libraries.id = components.library_id
      AND user_can_create_in_org(libraries.organization_id)
    )
  );

CREATE POLICY "Admins and editors can update components"
  ON components FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM libraries
      WHERE libraries.id = components.library_id
      AND user_can_create_in_org(libraries.organization_id)
    )
  );

CREATE POLICY "Admins and editors can delete components"
  ON components FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM libraries
      WHERE libraries.id = components.library_id
      AND user_can_create_in_org(libraries.organization_id)
    )
  );

-- RLS Policies for design_tokens
CREATE POLICY "Users can view tokens in libraries they have access to"
  ON design_tokens FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM libraries
      WHERE libraries.id = design_tokens.library_id
      AND user_has_org_access(libraries.organization_id)
    )
  );

CREATE POLICY "Admins and editors can create tokens"
  ON design_tokens FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM libraries
      WHERE libraries.id = design_tokens.library_id
      AND user_can_create_in_org(libraries.organization_id)
    )
  );

CREATE POLICY "Admins and editors can update tokens"
  ON design_tokens FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM libraries
      WHERE libraries.id = design_tokens.library_id
      AND user_can_create_in_org(libraries.organization_id)
    )
  );

CREATE POLICY "Admins and editors can delete tokens"
  ON design_tokens FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM libraries
      WHERE libraries.id = design_tokens.library_id
      AND user_can_create_in_org(libraries.organization_id)
    )
  );

-- RLS Policies for themes
CREATE POLICY "Users can view themes in libraries they have access to"
  ON themes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM libraries
      WHERE libraries.id = themes.library_id
      AND user_has_org_access(libraries.organization_id)
    )
  );

CREATE POLICY "Admins and editors can create themes"
  ON themes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM libraries
      WHERE libraries.id = themes.library_id
      AND user_can_create_in_org(libraries.organization_id)
    )
  );

CREATE POLICY "Admins and editors can update themes"
  ON themes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM libraries
      WHERE libraries.id = themes.library_id
      AND user_can_create_in_org(libraries.organization_id)
    )
  );

CREATE POLICY "Admins and editors can delete themes"
  ON themes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM libraries
      WHERE libraries.id = themes.library_id
      AND user_can_create_in_org(libraries.organization_id)
    )
  );

-- RLS Policies for theme_options
CREATE POLICY "Users can view theme options in themes they have access to"
  ON theme_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM themes
      JOIN libraries ON libraries.id = themes.library_id
      WHERE themes.id = theme_options.theme_id
      AND user_has_org_access(libraries.organization_id)
    )
  );

CREATE POLICY "Admins and editors can create theme options"
  ON theme_options FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM themes
      JOIN libraries ON libraries.id = themes.library_id
      WHERE themes.id = theme_options.theme_id
      AND user_can_create_in_org(libraries.organization_id)
    )
  );

CREATE POLICY "Admins and editors can update theme options"
  ON theme_options FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM themes
      JOIN libraries ON libraries.id = themes.library_id
      WHERE themes.id = theme_options.theme_id
      AND user_can_create_in_org(libraries.organization_id)
    )
  );

CREATE POLICY "Admins and editors can delete theme options"
  ON theme_options FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM themes
      JOIN libraries ON libraries.id = themes.library_id
      WHERE themes.id = theme_options.theme_id
      AND user_can_create_in_org(libraries.organization_id)
    )
  );

-- RLS Policies for token_values
CREATE POLICY "Users can view token values in tokens they have access to"
  ON token_values FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM design_tokens
      JOIN libraries ON libraries.id = design_tokens.library_id
      WHERE design_tokens.id = token_values.token_id
      AND user_has_org_access(libraries.organization_id)
    )
  );

CREATE POLICY "Admins and editors can create token values"
  ON token_values FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM design_tokens
      JOIN libraries ON libraries.id = design_tokens.library_id
      WHERE design_tokens.id = token_values.token_id
      AND user_can_create_in_org(libraries.organization_id)
    )
  );

CREATE POLICY "Admins and editors can update token values"
  ON token_values FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM design_tokens
      JOIN libraries ON libraries.id = design_tokens.library_id
      WHERE design_tokens.id = token_values.token_id
      AND user_can_create_in_org(libraries.organization_id)
    )
  );

CREATE POLICY "Admins and editors can delete token values"
  ON token_values FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM design_tokens
      JOIN libraries ON libraries.id = design_tokens.library_id
      WHERE design_tokens.id = token_values.token_id
      AND user_can_create_in_org(libraries.organization_id)
    )
  );

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at
  BEFORE UPDATE ON organization_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_libraries_updated_at
  BEFORE UPDATE ON libraries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_components_updated_at
  BEFORE UPDATE ON components
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_design_tokens_updated_at
  BEFORE UPDATE ON design_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_themes_updated_at
  BEFORE UPDATE ON themes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theme_options_updated_at
  BEFORE UPDATE ON theme_options
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_token_values_updated_at
  BEFORE UPDATE ON token_values
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
