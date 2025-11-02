'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import {
  FolderOpen,
  Plus,
  Search,
  Grid3x3,
  List,
  Filter,
  Clock,
  Calendar,
  Tag,
  MoreVertical,
  Copy,
  Trash2,
  Archive,
  Play,
  FileText,
  BarChart3,
  Star,
} from 'lucide-react';
import type { ProjectListItem, ProjectMetadata } from '@/lib/types';

export default function ProjectsDashboard() {
  const { currentProject, createProject, loadProject } = useStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'modified'>('recent');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Mock projects data (in production, this would come from store/localStorage)
  const [projects] = useState<ProjectListItem[]>([
    {
      id: '1',
      name: 'Product Launch Video',
      metadata: {
        tags: ['marketing', 'product'],
        category: 'marketing',
        status: 'in-progress',
        thumbnail: '',
        lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        viewCount: 15,
        exportCount: 3,
        timeSpent: 3600,
      },
      sceneCount: 8,
      duration: 45,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      name: 'Company Training Module',
      metadata: {
        tags: ['education', 'training'],
        category: 'education',
        status: 'completed',
        thumbnail: '',
        lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000),
        viewCount: 42,
        exportCount: 8,
        timeSpent: 7200,
      },
      sceneCount: 12,
      duration: 120,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      name: 'Q4 Sales Presentation',
      metadata: {
        tags: ['business', 'sales'],
        category: 'business',
        status: 'draft',
        thumbnail: '',
        lastModified: new Date(Date.now() - 5 * 60 * 60 * 1000),
        viewCount: 8,
        exportCount: 1,
        timeSpent: 1800,
      },
      sceneCount: 6,
      duration: 30,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  ]);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName);
      setNewProjectName('');
      setShowNewProjectModal(false);
    }
  };

  const getStatusColor = (status: ProjectMetadata['status']) => {
    switch (status) {
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'review':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'archived':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === '' ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.metadata.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || project.metadata.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || project.metadata.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'modified':
        return b.metadata.lastModified.getTime() - a.metadata.lastModified.getTime();
      case 'recent':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-600">Manage all your storyboard projects</p>
          </div>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
          >
            <Plus className="h-5 w-5" />
            <span>New Project</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mt-6 flex items-center space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="all">All Categories</option>
            <option value="business">Business</option>
            <option value="education">Education</option>
            <option value="marketing">Marketing</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="recent">Most Recent</option>
            <option value="modified">Last Modified</option>
            <option value="name">Name (A-Z)</option>
          </select>

          {/* View Mode */}
          <div className="flex rounded-lg border border-gray-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}`}
            >
              <Grid3x3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`border-l border-gray-300 p-2 ${
                viewMode === 'list' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {sortedProjects.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <FolderOpen className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">No projects found</h3>
              <p className="mb-4 text-gray-600">
                {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first project to get started'}
              </p>
              {!searchQuery && selectedCategory === 'all' && selectedStatus === 'all' && (
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                >
                  Create Project
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => loadProject(project.id)}
                className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-purple-300 hover:shadow-lg"
              >
                {/* Thumbnail */}
                <div className="mb-3 flex h-32 items-center justify-center rounded bg-gradient-to-br from-purple-100 to-pink-100">
                  <FileText className="h-12 w-12 text-purple-600 opacity-50" />
                </div>

                {/* Project Info */}
                <div>
                  <h3 className="mb-1 font-medium text-gray-900 group-hover:text-purple-600">{project.name}</h3>
                  <div className="mb-2 flex items-center space-x-2 text-xs text-gray-500">
                    <span>{project.sceneCount} scenes</span>
                    <span>•</span>
                    <span>{formatDuration(project.duration)}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-3">
                    <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${getStatusColor(project.metadata.status)}`}>
                      {project.metadata.status}
                    </span>
                  </div>

                  {/* Tags */}
                  {project.metadata.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {project.metadata.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="inline-flex items-center space-x-1 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          <Tag className="h-3 w-3" />
                          <span>{tag}</span>
                        </span>
                      ))}
                      {project.metadata.tags.length > 2 && (
                        <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          +{project.metadata.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(project.metadata.lastModified)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <BarChart3 className="h-3 w-3" />
                      <span>{project.metadata.viewCount} views</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => loadProject(project.id)}
                className="group flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-purple-300 hover:shadow-md"
              >
                <div className="flex flex-1 items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-gradient-to-br from-purple-100 to-pink-100">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-purple-600">{project.name}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Play className="h-3 w-3" />
                        <span>{project.sceneCount} scenes</span>
                      </span>
                      <span>•</span>
                      <span>{formatDuration(project.duration)}</span>
                      <span>•</span>
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${getStatusColor(project.metadata.status)}`}>
                        {project.metadata.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>{formatTimeAgo(project.metadata.lastModified)}</span>
                  <span>{project.metadata.viewCount} views</span>
                  <span>{project.metadata.exportCount} exports</span>
                  <button className="text-gray-400 transition-colors hover:text-gray-600">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Create New Project</h2>
            <input
              type="text"
              placeholder="Project name..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
              autoFocus
              className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowNewProjectModal(false);
                  setNewProjectName('');
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
