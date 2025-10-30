import { NextRequest, NextResponse } from 'next/server';
import { VideoRenderJob } from '@/lib/types';

// In-memory storage for render jobs (in production, use a database)
const renderJobs = new Map<string, VideoRenderJob>();

export async function POST(request: NextRequest) {
  try {
    const { projectId, config } = await request.json();

    if (!projectId || !config) {
      return NextResponse.json(
        { error: 'Project ID and config are required' },
        { status: 400 }
      );
    }

    // Generate unique job ID
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Estimate duration based on scene count and quality
    // In production, this would be calculated based on actual rendering metrics
    const estimatedDuration = 120; // 2 minutes placeholder

    // Create render job
    const job: VideoRenderJob = {
      id: jobId,
      projectId,
      config,
      status: 'pending',
      progress: 0,
      currentStep: 'Initializing render...',
      startTime: Date.now(),
      estimatedTimeRemaining: estimatedDuration,
    };

    // Store job
    renderJobs.set(jobId, job);

    // Start rendering process (in background)
    startRenderProcess(jobId);

    return NextResponse.json({
      jobId,
      estimatedDuration,
    });
  } catch (error: any) {
    console.error('Video render error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to start video render' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const job = renderJobs.get(jobId);

    if (!job) {
      return NextResponse.json(
        { error: 'Render job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ job });
  } catch (error: any) {
    console.error('Job status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get job status' },
      { status: 500 }
    );
  }
}

// Simulated rendering process
// In production, this would use FFmpeg or a rendering service
async function startRenderProcess(jobId: string) {
  const job = renderJobs.get(jobId);
  if (!job) return;

  try {
    // Update to processing
    job.status = 'processing';
    job.currentStep = 'Generating voiceovers...';
    job.progress = 10;
    renderJobs.set(jobId, job);

    await sleep(2000);

    // Generate frames
    job.status = 'rendering';
    job.currentStep = 'Rendering video frames...';
    job.progress = 30;
    job.estimatedTimeRemaining = 90;
    renderJobs.set(jobId, job);

    await sleep(3000);

    // Apply animations
    job.currentStep = 'Applying animations...';
    job.progress = 50;
    job.estimatedTimeRemaining = 60;
    renderJobs.set(jobId, job);

    await sleep(3000);

    // Encode video
    job.status = 'encoding';
    job.currentStep = 'Encoding video...';
    job.progress = 70;
    job.estimatedTimeRemaining = 30;
    renderJobs.set(jobId, job);

    await sleep(3000);

    // Mix audio
    job.currentStep = 'Mixing audio tracks...';
    job.progress = 85;
    job.estimatedTimeRemaining = 15;
    renderJobs.set(jobId, job);

    await sleep(2000);

    // Finalize
    job.currentStep = 'Finalizing video...';
    job.progress = 95;
    job.estimatedTimeRemaining = 5;
    renderJobs.set(jobId, job);

    await sleep(2000);

    // Complete
    job.status = 'completed';
    job.progress = 100;
    job.currentStep = 'Render complete!';
    job.endTime = Date.now();
    job.estimatedTimeRemaining = 0;
    
    // In production, this would be the actual video URL from storage
    job.outputUrl = `/videos/${jobId}.mp4`;
    
    renderJobs.set(jobId, job);

  } catch (error: any) {
    job.status = 'failed';
    job.error = error.message || 'Rendering failed';
    renderJobs.set(jobId, job);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
