# StoryVid Backend Setup & Deployment Guide

## Overview

This guide walks you through setting up the complete backend infrastructure for StoryVid's Interactive & Collaboration features.

## Prerequisites

- Supabase account (free tier is sufficient for development)
- Vercel account (for deployment)
- OpenAI API key (already configured)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Note down:
   - Project URL
   - Anon/Public API Key
   - Service Role Key (keep secret!)

### 1.2 Run Database Schema

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy entire contents of `database-schema.sql`
4. Run the schema (this creates all tables, indexes, RLS policies)

The schema includes:
- 20+ tables for all features
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for automatic timestamps

### 1.3 Enable Email Auth (Optional)

For team collaboration:
1. Go to Authentication > Settings
2. Enable Email provider
3. Configure email templates for invitations

## Step 2: Environment Configuration

### 2.1 Create/Update .env.local

```bash
# OpenAI (Already configured)
OPENAI_API_KEY=your_openai_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App URL (for OAuth callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Optional: Platform API Keys (for distribution features)
YOUTUBE_API_KEY=your_youtube_key
VIMEO_ACCESS_TOKEN=your_vimeo_token
```

### 2.2 Install Supabase Client

```bash
cd /workspace/storyvid-storyboard
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
```

## Step 3: Create Supabase Client

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Client-side Supabase client
export function createBrowserClient() {
  return createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });
}

// Server-side Supabase client (for API routes)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
```

## Step 4: Implement Authentication

### 4.1 Create Auth Context

Create `contexts/AuthContext.tsx`:

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createBrowserClient } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    if (error) throw error;

    // Create user profile
    if (data.user) {
      await supabase.from('user_profiles').insert({
        id: data.user.id,
        display_name: displayName,
      });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### 4.2 Wrap App with Auth Provider

Update `app/layout.tsx`:

```typescript
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

## Step 5: Update API Routes

### Example: Team Members API

Update `app/api/collaboration/team-members/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('team_members')
    .select(`
      *,
      user_profiles (
        id,
        display_name,
        avatar_url
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ teamMembers: data });
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const body = await request.json();
  const { projectId, email, role, permissions, invitedBy } = body;

  // Find user by email
  const { data: users } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (!users) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('team_members')
    .insert({
      project_id: projectId,
      user_id: users.id,
      role,
      permissions,
      invited_by: invitedBy,
      status: 'invited',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ member: data }, { status: 201 });
}
```

## Step 6: Update Frontend Store

### 6.1 Replace Mock Data with API Calls

Update `lib/store.ts` - Example for team members:

```typescript
inviteTeamMember: async (member) => {
  try {
    const { currentProject } = get();
    if (!currentProject) throw new Error('No project selected');

    const response = await fetch('/api/collaboration/team-members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: currentProject.id,
        email: member.email,
        role: member.role,
        permissions: member.permissions,
        invitedBy: get().currentUserId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to invite member');
    }

    const { member: newMember } = await response.json();
    
    const { teamMembers } = get();
    set({ teamMembers: [...teamMembers, newMember] });
  } catch (error) {
    console.error('Error inviting team member:', error);
    throw error;
  }
},
```

### 6.2 Add Data Fetching on Load

```typescript
// Add to store initialization
loadProjectData: async (projectId: string) => {
  try {
    // Load team members
    const teamResponse = await fetch(`/api/collaboration/team-members?projectId=${projectId}`);
    const { teamMembers } = await teamResponse.json();
    
    // Load comments
    const commentsResponse = await fetch(`/api/collaboration/comments?projectId=${projectId}`);
    const { comments } = await commentsResponse.json();
    
    // Load hotspots
    const hotspotsResponse = await fetch(`/api/interactive/hotspots?projectId=${projectId}`);
    const { hotspots } = await hotspotsResponse.json();
    
    set({ teamMembers, comments, /* ... */ });
  } catch (error) {
    console.error('Error loading project data:', error);
  }
},
```

## Step 7: Create Remaining API Routes

Create these API routes following the same pattern:

### Collaboration
- `/api/collaboration/team-members` ✅ (Created)
- `/api/collaboration/comments` ✅ (Created)
- `/api/collaboration/approvals` - Approval requests
- `/api/collaboration/versions` - Version control

### Interactive Elements
- `/api/interactive/hotspots` - Hotspot CRUD
- `/api/interactive/ctas` - CTA CRUD
- `/api/interactive/ab-tests` - A/B testing
- `/api/interactive/track-click` - Click tracking

### Distribution
- `/api/distribution/platforms` - Platform connections
- `/api/distribution/publish` - Publish videos
- `/api/distribution/seo` - SEO metadata
- `/api/distribution/jobs` - Distribution jobs status

### Analytics
- `/api/analytics/events` - Track analytics events
- `/api/analytics/dashboard` - Fetch dashboard data

## Step 8: Deploy to Vercel

### 8.1 Connect to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Add interactive & collaboration features"

# Create GitHub repo and push
gh repo create storyvid --public
git remote add origin https://github.com/YOUR_USERNAME/storyvid.git
git push -u origin main
```

### 8.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables:
   - Add all variables from `.env.local`
   - Ensure `NEXT_PUBLIC_APP_URL` matches your Vercel domain
4. Deploy

### 8.3 Update Supabase Settings

1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add your Vercel URL to:
   - Site URL
   - Redirect URLs

## Step 9: Testing Checklist

### Backend Testing
- [ ] Database tables created successfully
- [ ] RLS policies working correctly
- [ ] API routes return correct data
- [ ] Authentication flow works
- [ ] Team invitations work

### Frontend Integration
- [ ] Store actions call APIs correctly
- [ ] Data persists to database
- [ ] Real-time updates work (if implemented)
- [ ] Error handling displays properly
- [ ] Loading states work

### Feature Testing
- [ ] Create hotspot → saves to database
- [ ] Invite team member → sends invitation
- [ ] Add comment → appears for all team members
- [ ] Create A/B test → variants tracked
- [ ] Publish to platform → job tracked
- [ ] View analytics → real data displayed

## Step 10: Optional Enhancements

### Real-Time Collaboration

Add real-time subscriptions using Supabase Realtime:

```typescript
// In a component
useEffect(() => {
  const supabase = createBrowserClient();
  
  const channel = supabase
    .channel('project-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `project_id=eq.${projectId}`,
      },
      (payload) => {
        // Update local state with new comment
        console.log('New comment:', payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [projectId]);
```

### Platform OAuth Integration

For YouTube, Vimeo, etc.:

1. Register apps with each platform
2. Implement OAuth flow
3. Store tokens in `platform_connections` table
4. Use tokens to publish videos

### Email Notifications

Use Supabase Edge Functions or Resend:

```typescript
// Send email when team member invited
await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'StoryVid <noreply@storyvid.com>',
    to: [email],
    subject: 'You've been invited to collaborate',
    html: `<p>You've been invited to join a project...</p>`,
  }),
});
```

## Troubleshooting

### Common Issues

**RLS Policies Blocking Queries**:
- Check if user is authenticated
- Verify team membership in `team_members` table
- Test policies in Supabase SQL Editor

**API Routes Returning 500**:
- Check Supabase credentials in environment variables
- Verify database connection
- Check server logs for detailed errors

**Data Not Persisting**:
- Verify RLS policies allow INSERT
- Check API route implementation
- Ensure proper error handling

### Debug Mode

Enable detailed logging:

```typescript
// In API routes
console.log('Request body:', body);
console.log('Supabase response:', data, error);

// In frontend
console.log('API call:', endpoint, payload);
console.log('Response:', response);
```

## Security Best Practices

1. **Never expose Service Role Key** in client-side code
2. **Use RLS policies** for all tables
3. **Validate input** in API routes
4. **Sanitize user content** to prevent XSS
5. **Rate limit** API endpoints
6. **Use HTTPS** in production
7. **Rotate keys** regularly

## Performance Optimization

1. **Index database queries** (already in schema)
2. **Enable caching** for static data
3. **Use pagination** for large datasets
4. **Lazy load** components
5. **Optimize images** before upload
6. **Use CDN** for static assets

## Cost Estimation

### Supabase (Free Tier)
- Database: 500MB
- Storage: 1GB
- Bandwidth: 2GB
- API requests: Unlimited

### Vercel (Hobby Tier)
- Bandwidth: 100GB
- Serverless functions: Unlimited
- Build minutes: 100/month

For production, upgrade to paid tiers as needed.

## Next Steps

1. Set up Supabase project
2. Run database schema
3. Configure environment variables
4. Install Supabase client
5. Implement authentication
6. Create API routes
7. Update frontend store
8. Test locally
9. Deploy to Vercel
10. Test in production

## Support

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs

---

**Status**: Ready for backend implementation  
**Est. Setup Time**: 2-4 hours  
**Difficulty**: Intermediate  
