import { NextRequest, NextResponse } from 'next/server';
import type { Project, PDFExportConfig } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { project, config }: { project: Project; config: PDFExportConfig } = await request.json();

    if (!project || !project.scenes || project.scenes.length === 0) {
      return NextResponse.json(
        { error: 'Invalid project data' },
        { status: 400 }
      );
    }

    // PDF generation will be handled client-side using jsPDF
    // This endpoint serves as a coordination point and metadata generator
    
    const fileName = `${project.name || 'storyboard'}_${Date.now()}.pdf`;
    const metadata = {
      projectId: project.id,
      projectName: project.name,
      sceneCount: project.scenes.length,
      format: config.format,
      pageSize: config.pageSize,
      orientation: config.orientation,
      generatedAt: new Date().toISOString(),
    };

    // Return metadata for client-side PDF generation
    return NextResponse.json({
      success: true,
      fileName,
      metadata,
      projectData: project,
      config,
      message: 'PDF generation configuration prepared',
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { error: 'Failed to prepare PDF export', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
