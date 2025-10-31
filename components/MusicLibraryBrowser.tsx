'use client';

import { useState, useRef, useEffect } from 'react';
import { Music, Search, Play, Pause, Check, Filter, Clock, Tag, Sparkles } from 'lucide-react';
import { AudioTrack, SoundEffect, searchMusicTracks, searchSoundEffects, getMusicRecommendations, MUSIC_LIBRARY, SOUND_EFFECTS_LIBRARY } from '@/lib/audio-library';
import { useStore } from '@/lib/store';

interface MusicLibraryBrowserProps {
  onSelect: (track: AudioTrack | SoundEffect) => void;
  selectedTrackId?: string;
  type?: 'music' | 'sfx';
}

export default function MusicLibraryBrowser({ onSelect, selectedTrackId, type = 'music' }: MusicLibraryBrowserProps) {
  const { currentProject } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string[]>([]);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'all' | 'recommended'>(type === 'music' ? 'recommended' : 'all');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Filter tracks
  const musicTracks = type === 'music' 
    ? searchMusicTracks(searchQuery, {
        category: selectedCategory.length > 0 ? selectedCategory as AudioTrack['category'][] : undefined,
        mood: selectedMood.length > 0 ? selectedMood as AudioTrack['mood'][] : undefined,
      })
    : [];

  const soundEffects = type === 'sfx'
    ? searchSoundEffects(searchQuery, {
        category: selectedCategory.length > 0 ? selectedCategory as SoundEffect['category'][] : undefined,
      })
    : [];

  // Get recommendations for current project
  const recommendations = currentProject && type === 'music'
    ? getMusicRecommendations(
        currentProject.scenes.reduce((sum, s) => sum + (s.duration || 5), 0),
        currentProject.scenes.flatMap(s => s.keywords),
        undefined
      )
    : [];

  const displayTracks = type === 'music'
    ? (currentTab === 'recommended' ? recommendations : musicTracks)
    : soundEffects;

  // Handle play/pause
  const togglePlay = (track: AudioTrack | SoundEffect, e: React.MouseEvent) => {
    e.stopPropagation();

    if (playingTrackId === track.id) {
      audioRef.current?.pause();
      setPlayingTrackId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          // In production, this would play actual audio files
          // For now, just show visual feedback
          setPlayingTrackId(track.id);
          setTimeout(() => setPlayingTrackId(null), 3000);
        });
        setPlayingTrackId(track.id);
      }
    }
  };

  // Handle audio end
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setPlayingTrackId(null);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, []);

  const categories = type === 'music'
    ? Array.from(new Set(MUSIC_LIBRARY.map(t => t.category)))
    : Array.from(new Set(SOUND_EFFECTS_LIBRARY.map(s => s.category)));

  const moods = type === 'music'
    ? Array.from(new Set(MUSIC_LIBRARY.map(t => t.mood)))
    : [];

  const toggleCategory = (category: string) => {
    setSelectedCategory(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleMood = (mood: string) => {
    setSelectedMood(prev =>
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      <audio ref={audioRef} />

      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Music className="w-5 h-5 text-purple-600" />
            {type === 'music' ? 'Music Library' : 'Sound Effects'}
          </h3>
        </div>

        {/* Tabs */}
        {type === 'music' && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setCurrentTab('recommended')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'recommended'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-1" />
              Recommended
            </button>
            <button
              onClick={() => setCurrentTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Tracks
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={type === 'music' ? 'Search music tracks...' : 'Search sound effects...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 p-4 space-y-3">
        {/* Category filter */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory.includes(category)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Mood filter (music only) */}
        {type === 'music' && moods.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Mood</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {moods.map(mood => (
                <button
                  key={mood}
                  onClick={() => toggleMood(mood)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedMood.includes(mood)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Track List */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentTab === 'recommended' && type === 'music' && recommendations.length > 0 && (
          <div className="mb-2 px-2 py-1 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-700">
            <Sparkles className="w-3 h-3 inline mr-1" />
            AI-recommended tracks based on your project content
          </div>
        )}

        <div className="space-y-2">
          {displayTracks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Music className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No {type === 'music' ? 'music tracks' : 'sound effects'} found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search query</p>
            </div>
          ) : (
            displayTracks.map(track => {
              const isMusic = 'mood' in track;
              const musicTrack = isMusic ? (track as AudioTrack) : null;
              const isSelected = track.id === selectedTrackId;
              const isPlaying = track.id === playingTrackId;

              return (
                <div
                  key={track.id}
                  onClick={() => onSelect(track)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {track.name}
                        </h4>
                        {isSelected && (
                          <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        )}
                      </div>

                      {track.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {track.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                          {track.category}
                        </span>
                        {musicTrack && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full capitalize">
                            {musicTrack.mood}
                          </span>
                        )}
                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          <Clock className="w-3 h-3" />
                          {formatDuration(track.duration)}
                        </span>
                        {musicTrack?.bpm && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {musicTrack.bpm} BPM
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => togglePlay(track, e)}
                      className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
