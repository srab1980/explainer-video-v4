import { NextRequest, NextResponse } from 'next/server';
import type { Project, JSONExportConfig } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { project, config }: { project: Project; config: JSONExportConfig } = await request.json();

    if (!project) {
      return NextResponse.json(
        { error: 'Invalid project data' },
        { status: 400 }
      );
    }

    // Prepare JSON export data
    const exportData = {
      version: config.version || '1.0.0',
      exportedAt: new Date().toISOString(),
      metadata: config.includeMetadata ? {
        projectId: project.id,
        projectName: project.name || 'Untitled Project',
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        sceneCount: project.scenes?.length || 0,
        totalDuration: project.scenes?.reduce((sum, scene) => sum + (scene.duration || 5), 0) || 0,
      } : undefined,
      project: {
        id: project.id,
        name: project.name,
        script: project.script,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        scenes: project.scenes?.map(scene => ({
          id: scene.id,
          order: scene.order,
          title: scene.title,
          description: scene.description,
          voiceover: scene.voiceover,
          duration: scene.duration,
          keywords: scene.keywords,
          backgroundColor: scene.backgroundColor,
          textColor: scene.textColor,
          layoutType: scene.layoutType,
          animationType: scene.animationType,
          illustrations: scene.illustrations?.map(ill => ({
            id: ill.id,
            type: ill.type,
            name: ill.name,
            x: ill.x,
            y: ill.y,
            size: ill.size,
            rotation: ill.rotation,
            color: ill.color,
            opacity: ill.opacity,
            zIndex: ill.zIndex,
            // Optionally include image data if config.includeAssets is true
            ...(config.includeAssets && ill.imageUrl ? { imageUrl: ill.imageUrl } : {}),
          })),
        })),
      },
    };

    // Convert to JSON string
    const jsonString = config.pretty 
      ? JSON.stringify(exportData, null, 2)
      : JSON.stringify(exportData);

    // Calculate file size
    const fileSize = new TextEncoder().encode(jsonString).length;
    const fileName = `${project.name || 'storyboard'}_${Date.now()}.json`;

    // Create blob URL (will be generated client-side)
    return NextResponse.json({
      success: true,
      fileName,
      fileSize,
      data: exportData,
      jsonString,
      message: 'JSON export generated successfully',
    });
  } catch (error) {
    console.error('JSON export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate JSON export', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
