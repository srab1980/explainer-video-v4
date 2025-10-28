'use client';

import { useStore } from '@/lib/store';
import { Check, Loader2 } from 'lucide-react';

export default function AutoSaveIndicator() {
  const { isSaving, lastSaved } = useStore();

  if (!lastSaved && !isSaving) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      {isSaving ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Check className="w-4 h-4 text-green-600" />
          <span>Saved</span>
        </>
      )}
    </div>
  );
}
