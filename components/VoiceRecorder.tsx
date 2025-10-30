'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { Mic, Square, Upload, Loader2 } from 'lucide-react';
import type { SupportedLanguage } from '@/lib/types';

const LANGUAGES: { code: SupportedLanguage; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
];

export default function VoiceRecorder({ onTranscription }: { onTranscription: (text: string) => void }) {
  const { isTranscribing, transcribeVoice } = useStore();
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;

    try {
      const text = await transcribeVoice(audioBlob, selectedLanguage);
      setTranscription(text);
      onTranscription(text);
      
      // Check for voice commands
      const commandResponse = await fetch('/api/voice-commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription: text }),
      });
      
      if (commandResponse.ok) {
        const commandData = await commandResponse.json();
        if (commandData.command) {
          executeVoiceCommand(commandData.command);
        }
      }
    } catch (error) {
      console.error('Transcription failed:', error);
      alert('Transcription failed. Please try again.');
    }
  };

  const executeVoiceCommand = (command: string) => {
    const { currentProject, selectedSceneId, selectScene } = useStore.getState();
    
    if (!currentProject) return;

    switch (command) {
      case 'next_scene':
        if (currentProject.scenes.length > 0) {
          const currentIndex = currentProject.scenes.findIndex(s => s.id === selectedSceneId);
          if (currentIndex < currentProject.scenes.length - 1) {
            selectScene(currentProject.scenes[currentIndex + 1].id);
          }
        }
        break;
      
      case 'previous_scene':
        if (currentProject.scenes.length > 0) {
          const currentIndex = currentProject.scenes.findIndex(s => s.id === selectedSceneId);
          if (currentIndex > 0) {
            selectScene(currentProject.scenes[currentIndex - 1].id);
          }
        }
        break;
      
      case 'add_scene':
        // This would require more context, just notify user
        alert('Voice command detected: Add scene. Please use the UI to add a new scene.');
        break;
      
      case 'delete_scene':
        if (selectedSceneId) {
          if (confirm('Delete the currently selected scene?')) {
            useStore.getState().deleteScene(selectedSceneId);
          }
        }
        break;
      
      case 'play':
        // Could trigger preview play if implemented
        alert('Voice command detected: Play');
        break;
      
      case 'pause':
        // Could trigger preview pause if implemented
        alert('Voice command detected: Pause');
        break;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioBlob(file);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Select Language</label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors animate-pulse"
          >
            <Square className="w-5 h-5" />
            Stop Recording
          </button>
        )}

        <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 cursor-pointer transition-colors">
          <Upload className="w-5 h-5" />
          Upload Audio
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {audioBlob && (
        <div className="space-y-3">
          <audio
            src={URL.createObjectURL(audioBlob)}
            controls
            className="w-full"
          />
          <button
            onClick={handleTranscribe}
            disabled={isTranscribing}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTranscribing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Transcribing...
              </>
            ) : (
              'Transcribe Audio'
            )}
          </button>
        </div>
      )}

      {transcription && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold mb-2">Transcription:</h4>
          <p className="text-gray-700">{transcription}</p>
        </div>
      )}

      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <strong>Voice Commands:</strong> Try saying "next scene", "add scene", "delete scene", "play", or "pause"
      </div>
    </div>
  );
}
