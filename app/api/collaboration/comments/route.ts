import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const sceneId = searchParams.get('sceneId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // TODO: Supabase query
    // const query = supabase.from('comments').select('*, author:user_profiles(*)').eq('project_id', projectId);
    // if (sceneId) query.eq('scene_id', sceneId);
    // const { data, error } = await query.order('created_at', { ascending: false });

    return NextResponse.json({ comments: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, sceneId, authorId, type, content, position, elementId } = body;

    if (!projectId || !authorId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Supabase insert
    // const { data, error } = await supabase.from('comments').insert({...}).select().single();

    const newComment = {
      id: crypto.randomUUID(),
      projectId,
      sceneId,
      authorId,
      type: type || 'general',
      content,
      position,
      elementId,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, updates } = body;

    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID required' }, { status: 400 });
    }

    // TODO: Supabase update
    return NextResponse.json({ comment: { id: commentId, ...updates } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
