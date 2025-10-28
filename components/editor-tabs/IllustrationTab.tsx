'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import type { Scene } from '@/lib/types';
import * as LucideIcons from 'lucide-react';
import { Search, Plus, Trash2, RotateCw } from 'lucide-react';
import Fuse from 'fuse.js';

interface IllustrationTabProps {
  scene: Scene;
}

// Get available Lucide icons
const lucideIconNames = Object.keys(LucideIcons).filter(
  (name) => name !== 'createLucideIcon' && name !== 'default'
);

export default function IllustrationTab({ scene }: IllustrationTabProps) {
  const { updateIllustration, addIllustration, deleteIllustration } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIllustrationId, setSelectedIllustrationId] = useState<string | null>(null);

  // Fuzzy search setup
  const fuse = useMemo(
    () =>
      new Fuse(lucideIconNames, {
        threshold: 0.3,
        keys: [''],
      }),
    []
  );

  const filteredIcons = useMemo(() => {
    if (!searchQuery) return lucideIconNames.slice(0, 100);
    return fuse.search(searchQuery).map((result) => result.item).slice(0, 100);
  }, [searchQuery, fuse]);

  const handleAddIllustration = (iconName: string) => {
    addIllustration(scene.id, {
      iconName,
      iconLibrary: 'lucide',
      position: { x: 50, y: 50 },
      size: 80,
      color: '#8B5CF6',
      rotation: 0,
    });
  };

  const selectedIllustration = scene.illustrations.find(
    (ill) => ill.id === selectedIllustrationId
  );

  return (
    <div className="space-y-6">
      {/* Current Illustrations */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Current Illustrations ({scene.illustrations.length})
        </h3>
        {scene.illustrations.length === 0 ? (
          <p className="text-sm text-gray-600 py-4 text-center bg-muted rounded-lg">
            No illustrations yet. Add icons from the library below.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {scene.illustrations.map((illustration) => {
              const Icon = (LucideIcons as any)[illustration.iconName] || LucideIcons.Circle;
              const isSelected = selectedIllustrationId === illustration.id;
              return (
                <div
                  key={illustration.id}
                  className={`relative p-4 border-2 rounded-lg flex flex-col items-center gap-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary bg-opacity-5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedIllustrationId(illustration.id)}
                >
                  <Icon
                    size={40}
                    style={{ color: illustration.color }}
                    strokeWidth={1.5}
                  />
                  <span className="text-xs text-gray-600 truncate w-full text-center">
                    {illustration.iconName}
                  </span>
                  <button
                    className="absolute top-1 right-1 p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteIllustration(scene.id, illustration.id);
                      if (selectedIllustrationId === illustration.id) {
                        setSelectedIllustrationId(null);
                      }
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Illustration Editor */}
      {selectedIllustration && (
        <div className="p-4 bg-muted rounded-lg space-y-4">
          <h4 className="font-medium text-foreground">Edit Illustration</h4>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Size: {selectedIllustration.size}px
            </label>
            <input
              type="range"
              min="40"
              max="200"
              step="10"
              value={selectedIllustration.size}
              onChange={(e) =>
                updateIllustration(scene.id, selectedIllustration.id, {
                  size: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="w-16 h-10 rounded-lg border border-border cursor-pointer"
                value={selectedIllustration.color}
                onChange={(e) =>
                  updateIllustration(scene.id, selectedIllustration.id, {
                    color: e.target.value,
                  })
                }
              />
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                value={selectedIllustration.color}
                onChange={(e) =>
                  updateIllustration(scene.id, selectedIllustration.id, {
                    color: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Rotation */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Rotation: {selectedIllustration.rotation}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="15"
              value={selectedIllustration.rotation}
              onChange={(e) =>
                updateIllustration(scene.id, selectedIllustration.id, {
                  rotation: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          {/* Position */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                X Position: {selectedIllustration.position.x.toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={selectedIllustration.position.x}
                onChange={(e) =>
                  updateIllustration(scene.id, selectedIllustration.id, {
                    position: {
                      ...selectedIllustration.position,
                      x: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Y Position: {selectedIllustration.position.y.toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={selectedIllustration.position.y}
                onChange={(e) =>
                  updateIllustration(scene.id, selectedIllustration.id, {
                    position: {
                      ...selectedIllustration.position,
                      y: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Icon Library */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Icon Library ({filteredIcons.length} available)
        </h3>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search icons... (e.g. heart, user, star)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-8 gap-2 max-h-80 overflow-y-auto">
          {filteredIcons.map((iconName) => {
            const Icon = (LucideIcons as any)[iconName];
            if (!Icon) return null;
            return (
              <button
                key={iconName}
                className="p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-all group"
                onClick={() => handleAddIllustration(iconName)}
                title={iconName}
              >
                <Icon className="w-6 h-6 text-gray-600 group-hover:text-primary" strokeWidth={1.5} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
