# Quick Backend Integration Guide

This guide provides the fastest path to connect your frontend to the Supabase backend.

## Prerequisites
- Supabase project created
- Database schema executed (`database-schema.sql`)
- Environment variables configured

## Step 1: Install Supabase Client (2 minutes)

```bash
cd /workspace/storyvid-storyboard
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
```

## Step 2: Create Supabase Client (5 minutes)

Create `lib/supabase-client.ts`:

```typescript
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function createServerSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}
```

## Step 3: Update Store Actions (Example)

Replace mock implementations with real API calls. Here are 3 key examples:

### Example 1: Team Members

In `lib/store.ts`, replace:

```typescript
// OLD (Mock)
inviteTeamMember: async (member) => {
  const newMember: TeamMember = {
    ...member,
    id: uuidv4(),
    status: 'invited',
    joinedAt: new Date(),
  };
  const { teamMembers } = get();
  set({ teamMembers: [...teamMembers, newMember] });
},
```

With:

```typescript
// NEW (Real API)
inviteTeamMember: async (member) => {
  const { currentProject, currentUserId } = get();
  if (!currentProject) throw new Error('No project selected');

  const response = await fetch('/api/collaboration/team-members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId: currentProject.id,
      ...member,
      invitedBy: currentUserId,
    }),
  });

  if (!response.ok) throw new Error('Failed to invite member');
  
  const { member: newMember } = await response.json();
  const { teamMembers } = get();
  set({ teamMembers: [...teamMembers, newMember] });
},
```

### Example 2: Hotspots

```typescript
// NEW (Real API)
addHotspot: async (sceneId: string, hotspot) => {
  const response = await fetch('/api/interactive/hotspots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sceneId, ...hotspot }),
  });

  if (!response.ok) throw new Error('Failed to add hotspot');
  
  const { hotspot: newHotspot } = await response.json();
  const { hotspots } = get();
  const sceneHotspots = hotspots.get(sceneId) || [];
  hotspots.set(sceneId, [...sceneHotspots, newHotspot]);
  set({ hotspots: new Map(hotspots) });
},
```

### Example 3: Comments

```typescript
// NEW (Real API)
addComment: async (comment) => {
  const response = await fetch('/api/collaboration/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  });

  if (!response.ok) throw new Error('Failed to add comment');
  
  const { comment: newComment } = await response.json();
  const { comments } = get();
  set({ comments: [...comments, newComment] });
},
```

## Step 4: Complete API Routes

### Create `/api/interactive/hotspots/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const sceneId = searchParams.get('sceneId');

  const { data, error } = await supabase
    .from('hotspots')
    .select('*')
    .eq('scene_id', sceneId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ hotspots: data });
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from('hotspots')
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ hotspot: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { hotspotId, updates } = await request.json();

  const { data, error } = await supabase
    .from('hotspots')
    .update(updates)
    .eq('id', hotspotId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ hotspot: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const hotspotId = searchParams.get('hotspotId');

  const { error } = await supabase.from('hotspots').delete().eq('id', hotspotId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
```

## Step 5: Add Data Loading

Add to your main page or component:

```typescript
useEffect(() => {
  const loadData = async () => {
    if (!currentProject) return;

    try {
      // Load team members
      const teamRes = await fetch(`/api/collaboration/team-members?projectId=${currentProject.id}`);
      const { teamMembers } = await teamRes.json();

      // Load comments
      const commentsRes = await fetch(`/api/collaboration/comments?projectId=${currentProject.id}`);
      const { comments } = await commentsRes.json();

      // Load hotspots for each scene
      const hotspotsMap = new Map();
      for (const scene of currentProject.scenes) {
        const hotspotsRes = await fetch(`/api/interactive/hotspots?sceneId=${scene.id}`);
        const { hotspots } = await hotspotsRes.json();
        hotspotsMap.set(scene.id, hotspots);
      }

      // Update store
      set({ teamMembers, comments, hotspots: hotspotsMap });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  loadData();
}, [currentProject]);
```

## Step 6: Test Your Integration

### Test Checklist:

```bash
# 1. Start dev server
pnpm run dev

# 2. Open browser to http://localhost:3001

# 3. Test each feature:
# - Create hotspot → Check database
# - Invite team member → Check database
# - Add comment → Check database
# - Create A/B test → Check database

# 4. Verify in Supabase Dashboard:
# - Go to Table Editor
# - Check data in each table
# - Verify RLS policies working
```

## Step 7: Deploy

```bash
# Push to GitHub
git add .
git commit -m "Integrate backend"
git push

# Deploy to Vercel
vercel deploy --prod

# Update environment variables in Vercel Dashboard
# Test production deployment
```

## Common API Route Pattern

All API routes follow this pattern:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from('table_name')
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { id, updates } = await request.json();

  const { data, error } = await supabase
    .from('table_name')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { error } = await supabase.from('table_name').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
```

## Remaining API Routes to Create

Copy the pattern above for:

1. `/api/interactive/ctas/route.ts`
2. `/api/interactive/ab-tests/route.ts`
3. `/api/collaboration/approvals/route.ts`
4. `/api/collaboration/versions/route.ts`
5. `/api/distribution/platforms/route.ts`
6. `/api/distribution/publish/route.ts`
7. `/api/distribution/seo/route.ts`
8. `/api/analytics/events/route.ts`
9. `/api/analytics/dashboard/route.ts`

## Error Handling

Add try-catch blocks:

```typescript
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    // Validate input
    if (!body.required_field) {
      return NextResponse.json(
        { error: 'required_field is missing' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('table_name')
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Testing with Supabase

```typescript
// Test RLS policies in Supabase SQL Editor:

-- Test as specific user
SET request.jwt.claims.sub = 'user-id-here';

-- Test queries
SELECT * FROM hotspots WHERE scene_id = 'scene-id-here';
INSERT INTO hotspots (scene_id, type, label, ...) VALUES (...);

-- Reset
RESET request.jwt.claims.sub;
```

## Next Steps

1. ✅ Install Supabase client
2. ✅ Create supabase-client.ts
3. ⏳ Update store actions (start with 3 examples above)
4. ⏳ Create API routes (use pattern provided)
5. ⏳ Add data loading
6. ⏳ Test locally
7. ⏳ Deploy to production

**Estimated Time**: 3-4 hours for complete integration

---

**File**: QUICK-INTEGRATION.md  
**Purpose**: Fast-track backend integration  
**Updated**: 2025-10-31
