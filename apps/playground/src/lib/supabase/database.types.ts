/**
 * Database types for Supabase
 *
 * This file should be generated using:
 * supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts
 *
 * For now, these are manually defined to match our schema.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type OrgRole = 'admin' | 'editor' | 'viewer'

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: OrgRole
          invited_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role: OrgRole
          invited_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: OrgRole
          invited_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      libraries: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          css_reset: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          description?: string | null
          css_reset?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          description?: string | null
          css_reset?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      components: {
        Row: {
          id: string
          library_id: string
          name: string
          description: string | null
          spec: Json
          accessibility: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          library_id: string
          name: string
          description?: string | null
          spec: Json
          accessibility?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          library_id?: string
          name?: string
          description?: string | null
          spec?: Json
          accessibility?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      design_tokens: {
        Row: {
          id: string
          library_id: string
          name: string
          $type: string | null
          $description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          library_id: string
          name: string
          $type?: string | null
          $description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          library_id?: string
          name?: string
          $type?: string | null
          $description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      themes: {
        Row: {
          id: string
          library_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          library_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          library_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      theme_options: {
        Row: {
          id: string
          theme_id: string
          name: string
          is_default: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          theme_id: string
          name: string
          is_default?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          theme_id?: string
          name?: string
          is_default?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      token_values: {
        Row: {
          id: string
          token_id: string
          theme_option_id: string
          $value: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          token_id: string
          theme_option_id: string
          $value: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          token_id?: string
          theme_option_id?: string
          $value?: Json
          created_at?: string
          updated_at?: string
        }
      }
      organization_invitations: {
        Row: {
          id: string
          organization_id: string
          email: string
          role: OrgRole
          invited_by: string
          token: string
          expires_at: string
          accepted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          email: string
          role: OrgRole
          invited_by: string
          token: string
          expires_at?: string
          accepted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          email?: string
          role?: OrgRole
          invited_by?: string
          token?: string
          expires_at?: string
          accepted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_org_role: {
        Args: {
          org_id: string
        }
        Returns: OrgRole | null
      }
      user_has_org_access: {
        Args: {
          org_id: string
        }
        Returns: boolean
      }
      user_can_create_in_org: {
        Args: {
          org_id: string
        }
        Returns: boolean
      }
      user_can_manage_org: {
        Args: {
          org_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
