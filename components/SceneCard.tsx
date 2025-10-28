'use client';

import { useStore } from '@/lib/store';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Copy, Trash2 } from 'lucide-react';
import type { Scene } from '@/lib/types';

interface SceneCardProps {
  scene: Scene;
  index: number;
  isSelected: boolean;
}

export default function SceneCard({ scene, index, isSelected }: SceneCardProps) {
  const { selectScene, duplicateScene, deleteScene } = useStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scene.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white border-2 rounded-lg p-3 cursor-pointer transition-all ${
        isSelected
          ? 'border-primary shadow-md'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => selectScene(scene.id)}
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <button
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary">
              Scene {index + 1}
            </span>
            <span className="text-xs text-gray-500">
              {scene.duration}s
            </span>
          </div>
          <h4 className="font-medium text-sm text-foreground truncate mb-1">
            {scene.title}
          </h4>
          <p className="text-xs text-gray-600 line-clamp-2">
            {scene.description}
          </p>

          {/* Layout & Animation Tags */}
          <div className="flex gap-1 mt-2">
            <span className="text-xs px-2 py-0.5 bg-secondary bg-opacity-10 text-secondary rounded">
              {scene.layout}
            </span>
            <span className="text-xs px-2 py-0.5 bg-accent bg-opacity-10 text-accent rounded">
              {scene.animation}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
        <button
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            selectScene(scene.id);
          }}
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            duplicateScene(scene.id);
          }}
        >
          <Copy className="w-3 h-3" />
          Duplicate
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Delete this scene?')) {
              deleteScene(scene.id);
            }
          }}
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>
    </div>
  );
}
