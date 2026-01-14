/**
 * User Management settings panel
 */

import React, { useState } from 'react';
import type { User, UserRole, UserPermissions } from '../../../types/settings';
import { Card, CardHeader, Button, Badge } from '../../../components';

interface UserManagementPanelProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
}

const ROLE_CONFIG: Record<UserRole, { label: string; color: string; description: string }> = {
  admin: {
    label: 'Administrator',
    color: 'bg-purple-500/20 text-purple-400',
    description: 'Full access to all features and settings',
  },
  operator: {
    label: 'Operator',
    color: 'bg-blue-500/20 text-blue-400',
    description: 'Can manage rules and view all dashboards',
  },
  viewer: {
    label: 'Viewer',
    color: 'bg-slate-500/20 text-slate-400',
    description: 'Read-only access to dashboards',
  },
  auditor: {
    label: 'Auditor',
    color: 'bg-amber-500/20 text-amber-400',
    description: 'Can view audit logs and export reports',
  },
};

const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: {
    canViewDashboard: true,
    canManageRules: true,
    canApproveTickets: true,
    canModifySettings: true,
    canViewAuditLogs: true,
    canManageUsers: true,
    canExportData: true,
  },
  operator: {
    canViewDashboard: true,
    canManageRules: true,
    canApproveTickets: false,
    canModifySettings: false,
    canViewAuditLogs: false,
    canManageUsers: false,
    canExportData: true,
  },
  viewer: {
    canViewDashboard: true,
    canManageRules: false,
    canApproveTickets: false,
    canModifySettings: false,
    canViewAuditLogs: false,
    canManageUsers: false,
    canExportData: false,
  },
  auditor: {
    canViewDashboard: true,
    canManageRules: false,
    canApproveTickets: false,
    canModifySettings: false,
    canViewAuditLogs: true,
    canManageUsers: false,
    canExportData: true,
  },
};

interface AddUserModalProps {
  onClose: () => void;
  onAdd: (user: Omit<User, 'id' | 'createdAt'>) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'viewer' as UserRole,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      status: 'pending',
      permissions: DEFAULT_PERMISSIONS[formData.role],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-md">
        <h3 className="text-lg font-bold text-white mb-4">Add New User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              placeholder="user@company.com"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              {Object.entries(ROLE_CONFIG).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              {ROLE_CONFIG[formData.role].description}
            </p>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="primary">
              Add User
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const UserManagementPanel: React.FC<UserManagementPanelProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString();
  };

  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">User Management</h2>
          <p className="text-slate-400 text-sm">Manage user accounts and permissions</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader title="Role Permissions Matrix" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400 font-medium">Permission</th>
                {Object.entries(ROLE_CONFIG).map(([role, { label }]) => (
                  <th key={role} className="text-center py-2 px-3 text-slate-400 font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'canViewDashboard', label: 'View Dashboards' },
                { key: 'canManageRules', label: 'Manage Rules' },
                { key: 'canApproveTickets', label: 'Approve Tickets' },
                { key: 'canModifySettings', label: 'Modify Settings' },
                { key: 'canViewAuditLogs', label: 'View Audit Logs' },
                { key: 'canManageUsers', label: 'Manage Users' },
                { key: 'canExportData', label: 'Export Data' },
              ].map((perm) => (
                <tr key={perm.key} className="border-b border-slate-700/50">
                  <td className="py-2 px-3 text-slate-300">{perm.label}</td>
                  {Object.keys(ROLE_CONFIG).map((role) => (
                    <td key={role} className="text-center py-2 px-3">
                      {DEFAULT_PERMISSIONS[role as UserRole][perm.key as keyof UserPermissions] ? (
                        <svg className="w-5 h-5 text-emerald-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-slate-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader title={`Users (${users.length})`} />
        <div className="divide-y divide-slate-700">
          {users.map((user) => (
            <div
              key={user.id}
              className="py-3 flex items-center justify-between hover:bg-slate-700/30 -mx-6 px-6 cursor-pointer"
              onClick={() => setSelectedUserId(user.id === selectedUserId ? null : user.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{user.name}</p>
                    <Badge
                      variant={user.status === 'active' ? 'success' : user.status === 'pending' ? 'warning' : 'default'}
                      size="sm"
                    >
                      {user.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${ROLE_CONFIG[user.role].color}`}>
                  {ROLE_CONFIG[user.role].label}
                </span>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform ${selectedUserId === user.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {selectedUser && (
        <Card>
          <CardHeader
            title={`User Details: ${selectedUser.name}`}
            action={
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newStatus = selectedUser.status === 'active' ? 'inactive' : 'active';
                    onUpdateUser(selectedUser.id, { status: newStatus });
                  }}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {selectedUser.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    onDeleteUser(selectedUser.id);
                    setSelectedUserId(null);
                  }}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </Button>
              </div>
            }
          />
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Email</label>
                <p className="text-slate-300">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Role</label>
                <p className="text-slate-300">{ROLE_CONFIG[selectedUser.role].label}</p>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Created</label>
                <p className="text-slate-300">{formatDate(selectedUser.createdAt)}</p>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Last Login</label>
                <p className="text-slate-300">{formatDate(selectedUser.lastLogin)}</p>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2">Permissions</label>
              <div className="space-y-2">
                {Object.entries(selectedUser.permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      {key.replace(/^can/, '').replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    {value ? (
                      <span className="text-emerald-400">Allowed</span>
                    ) : (
                      <span className="text-slate-600">Denied</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {showAddModal && (
        <AddUserModal onClose={() => setShowAddModal(false)} onAdd={onAddUser} />
      )}
    </div>
  );
};
