'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import type { Scene } from '@/lib/types';

interface ContentTabProps {
  scene: Scene;
}

export default function ContentTab({ scene }: ContentTabProps) {
  const { updateScene } = useStore();
  const [title, setTitle] = useState(scene.title);
  const [description, setDescription] = useState(scene.description);
  const [voiceover, setVoiceover] = useState(scene.voiceover);
  const [duration, setDuration] = useState(scene.duration);

  const handleUpdate = (field: string, value: any) => {
    updateScene(scene.id, { [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Scene Title
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleUpdate('title', e.target.value);
          }}
          placeholder="Enter scene title..."
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description
        </label>
        <textarea
          className="w-full h-24 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            handleUpdate('description', e.target.value);
          }}
          placeholder="Brief description of what happens in this scene..."
        />
      </div>

      {/* Voiceover */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Voiceover Text
        </label>
        <textarea
          className="w-full h-32 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          value={voiceover}
          onChange={(e) => {
            setVoiceover(e.target.value);
            handleUpdate('voiceover', e.target.value);
          }}
          placeholder="Text to be spoken during this scene..."
        />
        <p className="mt-2 text-sm text-gray-500">
          {voiceover.length} characters (approx. {Math.ceil(voiceover.length / 5)} seconds at normal speech rate)
        </p>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Duration (seconds)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="3"
            max="15"
            step="1"
            className="flex-1"
            value={duration}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setDuration(value);
              handleUpdate('duration', value);
            }}
          />
          <span className="text-lg font-medium text-foreground w-12 text-center">
            {duration}s
          </span>
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Background Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            className="w-16 h-10 rounded-lg border border-border cursor-pointer"
            value={scene.backgroundColor}
            onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
          />
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            value={scene.backgroundColor}
            onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Text Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            className="w-16 h-10 rounded-lg border border-border cursor-pointer"
            value={scene.textColor}
            onChange={(e) => handleUpdate('textColor', e.target.value)}
          />
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            value={scene.textColor}
            onChange={(e) => handleUpdate('textColor', e.target.value)}
            placeholder="#FFFFFF"
          />
        </div>
      </div>
    </div>
  );
}
