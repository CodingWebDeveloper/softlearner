# Supabase Integration Setup Guide

This guide will help you set up Supabase with your Next.js + MUI application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name and database password
5. Choose a region close to your users
6. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon/Public Key** (under "Project API keys")

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values from Step 2.

## Step 4: Configure Authentication Settings

1. In your Supabase dashboard, go to Authentication → Settings
2. Configure the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000/auth/callback`
3. Save the settings

## Step 5: Enable Email Authentication

1. In your Supabase dashboard, go to Authentication → Providers
2. Make sure "Email" is enabled
3. Configure email templates if desired

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`
3. You should see the authentication form
4. Try creating a new account or signing in

## Features Included

- **Authentication**: Email/password sign up and sign in
- **User Profile**: Display user information and sign out functionality
- **Protected Routes**: Conditional rendering based on authentication state
- **Real-time Updates**: Automatic UI updates when authentication state changes

## Database Setup (Optional)

If you want to store additional user data, you can create tables in your Supabase database:

1. Go to your Supabase dashboard → Table Editor
2. Create a new table (e.g., `profiles`)
3. Add columns like `id`, `user_id`, `full_name`, `avatar_url`, etc.
4. Set up Row Level Security (RLS) policies

## Next Steps

- Add social authentication providers (Google, GitHub, etc.)
- Implement password reset functionality
- Add user profile management
- Set up database tables and relationships
- Configure Row Level Security policies

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**: Double-check your environment variables
2. **Authentication not working**: Verify your site URL and redirect URLs in Supabase settings
3. **CORS errors**: Make sure your site URL is correctly configured in Supabase

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues) 