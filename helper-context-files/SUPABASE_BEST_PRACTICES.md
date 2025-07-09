# Supabase Auth SSR Best Practices Implementation

This document outlines the modern best practices implemented in this Next.js + Supabase application.

## 🚨 Critical Implementation Notes

### ✅ What We're Using (CORRECT)
- `@supabase/ssr` package for SSR support
- `createBrowserClient` for client-side operations
- `createServerClient` for server-side operations
- `getAll()` and `setAll()` cookie methods only
- Proper middleware implementation

### ❌ What We AVOID (DEPRECATED)
- `@supabase/auth-helpers-nextjs` package
- Individual cookie methods (`get`, `set`, `remove`)
- Old client creation patterns

## File Structure

```
src/
├── lib/
│   ├── supabase.ts          # Browser and server client utilities
│   └── supabase-server.ts   # Server-only client utility
├── contexts/
│   └── SupabaseContext.tsx  # React context for auth state
├── middleware.ts            # Auth middleware for route protection
└── app/
    ├── auth/
    │   └── callback/
    │       └── route.ts     # Auth callback handler
    ├── signin/
    │   └── page.tsx         # Sign in page
    ├── signup/
    │   └── page.tsx         # Sign up page
    └── layout.tsx           # Root layout with providers
```

## Key Implementations

### 1. Client-Side Supabase Client (`src/lib/supabase.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 2. Server-Side Supabase Client (`src/lib/supabase-server.ts`)

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore if called from Server Component
          }
        },
      },
    }
  )
}
```

### 3. Authentication Middleware (`src/middleware.ts`)

The middleware handles:
- Session refresh on every request
- Route protection for authenticated routes
- Proper cookie management
- Automatic redirects to login

### 4. Auth Callback Handler (`src/app/auth/callback/route.ts`)

Handles OAuth callbacks and code exchange for session creation.

### 5. React Context (`src/contexts/SupabaseContext.tsx`)

Provides authentication state and methods to the entire application.

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage Patterns

### Client Components
```typescript
import { useSupabase } from '@/contexts/SupabaseContext'

export default function MyComponent() {
  const { user, signIn, signOut } = useSupabase()
  
  // Use auth methods and user state
}
```

### Server Components
```typescript
import { createClient } from '@/lib/supabase-server'

export default async function ServerComponent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Use user data
}
```

### API Routes
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => 
            request.cookies.set(name, value)
          )
        },
      },
    }
  )
  
  // Use supabase client
}
```

## Security Best Practices

1. **Never expose sensitive keys**: Only use `NEXT_PUBLIC_` prefix for client-safe keys
2. **Use Row Level Security (RLS)**: Enable RLS on all tables
3. **Validate user sessions**: Always check user authentication in protected routes
4. **Handle errors gracefully**: Implement proper error handling for auth operations
5. **Use HTTPS**: Always use HTTPS in production

## Performance Optimizations

1. **Client-side caching**: Supabase client handles caching automatically
2. **Server-side rendering**: Use server components for initial data fetching
3. **Middleware optimization**: Middleware only runs on necessary routes
4. **Context optimization**: Auth context only re-renders when auth state changes

## Troubleshooting

### Common Issues

1. **Session not persisting**: Ensure middleware is properly configured
2. **Auth loops**: Check that middleware returns the correct response object
3. **Cookie issues**: Verify using only `getAll` and `setAll` methods
4. **Import errors**: Make sure you're importing from `@supabase/ssr`

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are set correctly
3. Ensure Supabase project is properly configured
4. Check middleware matcher configuration

## Migration from auth-helpers-nextjs

If migrating from the deprecated package:

1. Remove `@supabase/auth-helpers-nextjs` from dependencies
2. Replace all imports with `@supabase/ssr`
3. Update client creation patterns
4. Implement proper middleware
5. Update cookie handling to use `getAll`/`setAll`

## Additional Resources

- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth) 