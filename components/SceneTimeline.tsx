'use client';

import { useStore } from '@/lib/store';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SceneCard from './SceneCard';
import { Plus } from 'lucide-react';

export default function SceneTimeline() {
  const { currentProject, reorderScenes, selectedSceneId } = useStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && currentProject) {
      const oldIndex = currentProject.scenes.findIndex((s) => s.id === active.id);
      const newIndex = currentProject.scenes.findIndex((s) => s.id === over.id);

      const newOrder = [...currentProject.scenes];
      const [moved] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, moved);

      reorderScenes(newOrder.map((s) => s.id));
    }
  };

  if (!currentProject || !currentProject.scenes.length) {
    return null;
  }

  const scenes = currentProject.scenes.sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">
          Scenes ({scenes.length})
        </h3>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={scenes.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {scenes.map((scene, index) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                index={index}
                isSelected={selectedSceneId === scene.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
