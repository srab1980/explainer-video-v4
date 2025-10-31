'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Users, UserPlus, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { TeamMember, UserRole, Comment } from '@/lib/types';

export default function CollaborationPanel() {
  const {
    currentProject,
    currentUser,
    teamMembers,
    comments,
    approvalRequests,
    inviteTeamMember,
    updateTeamMember,
    removeTeamMember,
    addComment,
    resolveComment,
    createApprovalRequest,
    respondToApproval,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'team' | 'comments' | 'approvals'>('team');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'editor' as UserRole,
  });

  const handleInviteMember = async () => {
    const permissions = {
      canEdit: ['owner', 'admin', 'editor'].includes(inviteForm.role),
      canComment: true,
      canApprove: ['owner', 'admin', 'reviewer'].includes(inviteForm.role),
      canPublish: ['owner', 'admin'].includes(inviteForm.role),
      canInvite: ['owner', 'admin'].includes(inviteForm.role),
      canManageTeam: ['owner', 'admin'].includes(inviteForm.role),
    };

    await inviteTeamMember({
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      permissions,
    });

    setInviteForm({ name: '', email: '', role: 'editor' });
    setShowInviteForm(false);
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      owner: 'bg-purple-100 text-purple-700',
      admin: 'bg-blue-100 text-blue-700',
      editor: 'bg-green-100 text-green-700',
      reviewer: 'bg-yellow-100 text-yellow-700',
      viewer: 'bg-gray-100 text-gray-700',
    };
    return colors[role];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      invited: 'bg-yellow-100 text-yellow-700',
      inactive: 'bg-gray-100 text-gray-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (!currentProject) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p>No project selected</p>
      </div>
    );
  }

  const pendingApprovals = approvalRequests.filter(r => r.status === 'pending');
  const openComments = comments.filter(c => c.status === 'open');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Collaboration</h2>
        <p className="text-sm text-gray-600">Work together with your team</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'team'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="w-4 h-4" />
          Team ({teamMembers.length})
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'comments'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Comments ({openComments.length})
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'approvals'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Approvals ({pendingApprovals.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            {!showInviteForm && (
              <button
                onClick={() => setShowInviteForm(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <UserPlus className="w-5 h-5" />
                Invite Team Member
              </button>
            )}

            {showInviteForm && (
              <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                <h3 className="font-semibold mb-4 text-gray-900">Invite New Member</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={inviteForm.name}
                      onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as UserRole })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="editor">Editor - Can edit scenes</option>
                      <option value="reviewer">Reviewer - Can comment and approve</option>
                      <option value="viewer">Viewer - View only</option>
                      <option value="admin">Admin - Full access</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleInviteMember}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Send Invite
                    </button>
                    <button
                      onClick={() => setShowInviteForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Team Members List */}
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{member.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(member.role)}`}>
                          {member.role}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      {member.lastActive && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last active: {new Date(member.lastActive).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  {currentUser?.role === 'owner' || currentUser?.role === 'admin' ? (
                    <button
                      onClick={() => removeTeamMember(member.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                {/* Permissions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {member.permissions.canEdit && (
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">Can Edit</span>
                  )}
                  {member.permissions.canComment && (
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">Can Comment</span>
                  )}
                  {member.permissions.canApprove && (
                    <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded">Can Approve</span>
                  )}
                  {member.permissions.canPublish && (
                    <span className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded">Can Publish</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            {openComments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No open comments</p>
              </div>
            ) : (
              openComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{comment.authorName}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            comment.type === 'issue'
                              ? 'bg-red-100 text-red-700'
                              : comment.type === 'suggestion'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {comment.type}
                        </span>
                      </div>
                    </div>
                    {currentUser && (
                      <button
                        onClick={() => resolveComment(comment.id, currentUser.id)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 ml-11">{comment.content}</p>
                  {comment.position && (
                    <p className="text-xs text-gray-500 ml-11 mt-1">
                      Position: {comment.position.x}%, {comment.position.y}%
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="space-y-4">
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No pending approvals</p>
              </div>
            ) : (
              pendingApprovals.map((request) => {
                const requester = teamMembers.find(m => m.id === request.requestedBy);
                return (
                  <div
                    key={request.id}
                    className="p-4 border-2 border-yellow-300 bg-yellow-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <h4 className="font-semibold text-gray-900">Approval Required</h4>
                        </div>
                        <p className="text-sm text-gray-700">
                          Requested by <span className="font-medium">{requester?.name}</span>
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{request.message}</p>
                    {currentUser && request.requestedFrom.includes(currentUser.id) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => respondToApproval(request.id, currentUser.id, 'approved')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => respondToApproval(request.id, currentUser.id, 'rejected')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => respondToApproval(request.id, currentUser.id, 'changes-requested')}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          Request Changes
                        </button>
                      </div>
                    )}
                    {request.approvals.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-yellow-200">
                        <p className="text-xs text-gray-600 mb-2">Responses:</p>
                        {request.approvals.map((approval, idx) => (
                          <div key={idx} className="text-xs text-gray-700">
                            <span className="font-medium">{approval.userName}</span>: {approval.status}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
