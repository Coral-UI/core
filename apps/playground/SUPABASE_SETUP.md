# Supabase Setup Guide

This guide will help you set up Supabase for the Coral UI Playground application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js ≥20.12.0
- pnpm installed

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: `coral-playground` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the region closest to you
4. Click "Create new project"

## Step 2: Run Database Migrations

1. Install the Supabase CLI (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   cd apps/playground
   supabase link --project-ref your-project-ref
   ```
   (You can find your project ref in the Supabase dashboard URL)

3. Run the migration:
   ```bash
   supabase db push
   ```
   Or manually run the SQL from `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor.

## Step 3: Configure Environment Variables

1. In your Supabase project dashboard, go to Settings > API
2. Copy your Project URL and anon/public key
3. Create a `.env.local` file in `apps/playground/`:
   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Step 3.5: Configure OAuth Providers (Optional)

The app supports Email/Password, Google OAuth, and Figma OAuth authentication. To enable OAuth providers:

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if prompted
6. Choose **Web application** as the application type
7. **Important**: In Google Cloud Console, add authorized redirect URIs:
   - **Get your Supabase callback URL** from the Supabase dashboard:
     - Go to **Authentication** > **Providers** > **Google**
     - Copy the callback URL shown (it will be something like `https://your-project-ref.supabase.co/auth/v1/callback`)
   - Add this Supabase callback URL to Google's **Authorized redirect URIs**
   - For local development with Supabase CLI, use: `http://localhost:54321/auth/v1/callback`
   - **Do NOT** add your app's `/auth/callback` URL here - that goes in Supabase's redirect URLs list instead
8. Under **Authorized JavaScript origins**, add:
   - Your app's origin: `http://localhost:5173` (for local dev) or `https://your-domain.com` (for production)
9. Copy the **Client ID** and **Client Secret**
10. In Supabase dashboard, go to **Authentication** > **Providers**
11. Enable **Google** provider
12. Paste your **Client ID** and **Client Secret**
13. Save the configuration

### Figma OAuth Setup

1. Go to [Figma Developer Settings](https://www.figma.com/developers/apps)
2. Click **Create new app** or select an existing app
3. Navigate to **App settings** > **OAuth**
4. Add redirect URIs:
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://your-domain.com/auth/callback`
5. Copy the **Client ID** and **Client Secret**
6. In Supabase dashboard, go to **Authentication** > **Providers**
7. Enable **Figma** provider
8. Paste your **Client ID** and **Client Secret**
9. Save the configuration

### Configure Redirect URLs in Supabase

1. In Supabase dashboard, go to **Authentication** > **URL Configuration**
2. Add your app's callback URLs to the **Redirect URLs** list:
   - `http://localhost:5173/auth/callback` (for local development - adjust port if different)
   - `https://your-production-domain.com/auth/callback` (for production)
3. Also set the **Site URL** to your app's base URL:
   - Development: `http://localhost:5173`
   - Production: `https://your-production-domain.com`
4. Save the configuration

**Important**: The flow works like this:
1. User clicks "Sign in with Google" → redirected to Google
2. Google authenticates → redirects to Supabase callback (`/auth/v1/callback`)
3. Supabase processes auth → redirects to your app callback (`/auth/callback`)
4. Your app extracts session → redirects to dashboard

**Note**: Email/Password authentication is enabled by default. No additional configuration is required.

## Step 4: Generate TypeScript Types (Optional but Recommended)

To generate TypeScript types from your Supabase schema:

```bash
cd apps/playground
supabase gen types typescript --project-id your-project-ref > src/lib/supabase/database.types.ts
```

This will overwrite the manually created types with generated ones from your actual database schema.

## Step 5: Test the Setup

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. The app should now connect to Supabase. You can test by:
   - Signing up for an account
   - Creating an organization
   - Creating libraries and components

## Database Schema Overview

The migration creates the following tables:

- `organizations` - User organizations
- `organization_members` - User membership and roles (admin, editor, viewer)
- `libraries` - Design system libraries
- `components` - UI components with Coral specs
- `design_tokens` - Design tokens (colors, dimensions, etc.)
- `themes` - Theme definitions
- `theme_options` - Theme variants (e.g., light/dark)
- `token_values` - Token values per theme option

## Row Level Security (RLS)

All tables have RLS enabled with policies that enforce:

- **Viewers**: Can only read data
- **Editors**: Can create/update libraries, components, tokens, and themes
- **Admins**: Can do everything, including managing organization members

## Troubleshooting

### "Missing Supabase environment variables" error

Make sure your `.env.local` file exists and contains the correct values.

### "User not authenticated" errors

Ensure you're signed in. The app requires authentication for all operations.

### RLS Policy Errors

If you see permission errors, check:
1. That the user is a member of the organization
2. That the user has the correct role
3. That the RLS policies were created correctly

## Authentication Methods

The app supports three authentication methods:

1. **Email/Password**: Enabled by default, no additional setup required
2. **Google OAuth**: Requires Google Cloud Console setup (see Step 3.5)
3. **Figma OAuth**: Requires Figma Developer App setup (see Step 3.5)

All authentication flows redirect to `/auth/callback` after successful authentication, which then redirects authenticated users to the dashboard.

## Next Steps

- Configure OAuth providers (Google, Figma) if you want social login options
- Set up email templates for email confirmation (Settings > Authentication > Email Templates)
- Configure email service provider if needed (Settings > Authentication > SMTP Settings)
