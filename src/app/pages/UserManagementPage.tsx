import { useState } from 'react';
import { Plus, Search, Edit, Ban, Users as UsersIcon, UserCog, Shield, CheckCircle } from 'lucide-react';
import { KPICard } from '@/app/components/KPICard';
import { StatusBadge } from '@/app/components/StatusBadge';
import { Modal } from '@/app/components/Modal';

interface User {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Bank Admin' | 'Bank Ops';
  status: 'active' | 'deactivated';
  createdDate: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    userId: 'USR001',
    email: 'john.admin@bankacquire.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'Bank Admin',
    status: 'active',
    createdDate: '2026-01-15',
  },
  {
    id: '2',
    userId: 'USR002',
    email: 'sarah.ops@bankacquire.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'Bank Ops',
    status: 'active',
    createdDate: '2026-01-12',
  },
  {
    id: '3',
    userId: 'USR003',
    email: 'mike.ops@bankacquire.com',
    firstName: 'Mike',
    lastName: 'Williams',
    role: 'Bank Ops',
    status: 'active',
    createdDate: '2026-01-10',
  },
  {
    id: '4',
    userId: 'USR004',
    email: 'emily.admin@bankacquire.com',
    firstName: 'Emily',
    lastName: 'Brown',
    role: 'Bank Admin',
    status: 'active',
    createdDate: '2026-01-08',
  },
  {
    id: '5',
    userId: 'USR005',
    email: 'david.ops@bankacquire.com',
    firstName: 'David',
    lastName: 'Garcia',
    role: 'Bank Ops',
    status: 'deactivated',
    createdDate: '2025-12-20',
  },
];

export function UserManagementPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Bank Ops',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('User created:', formData);
    setIsAddModalOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'Bank Ops',
    });
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'Active' && user.status === 'active') ||
      (statusFilter === 'Deactivated' && user.status === 'deactivated');
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const bankAdmins = mockUsers.filter(u => u.role === 'Bank Admin').length;
  const bankOps = mockUsers.filter(u => u.role === 'Bank Ops').length;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1339]">User Management</h2>
          <p className="text-[#635c8a] text-sm mt-1">Manage bank users and access control</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New User
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Users"
          value={mockUsers.length.toString()}
          subtitle="All registered users"
          icon={UsersIcon}
        />
        <KPICard
          title="Bank Admin"
          value={bankAdmins.toString()}
          subtitle="Administrator accounts"
          icon={Shield}
        />
        <KPICard
          title="Bank Ops"
          value={bankOps.toString()}
          subtitle="Operations team"
          icon={UserCog}
        />
        <KPICard
          title="Active Users"
          value={activeUsers.toString()}
          subtitle="Currently active"
          trend={{ value: '2', direction: 'up', label: 'this month' }}
          icon={CheckCircle}
        />
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-[#635c8a] mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#635c8a]" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-[#635c8a] mb-2">By Role</label>
            <select
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Bank Admin">Bank Admin</option>
              <option value="Bank Ops">Bank Ops</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-[#635c8a] mb-2">By Status</label>
            <select
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Deactivated">Deactivated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fafafa]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">User ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e2e9]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 text-sm text-[#4b1b91] font-mono">{user.userId}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1339]">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1339] font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-md text-xs font-medium ${
                      user.role === 'Bank Admin'
                        ? 'bg-[#f5effb] text-[#4b1b91]'
                        : 'bg-[#eaf6f0] text-[#34b277]'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge 
                      status={user.status === 'active' ? 'success' : 'failed'} 
                      label={user.status === 'active' ? 'Active' : 'Deactivated'}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 hover:bg-[#f5effb] rounded transition-colors"
                        title="Update User"
                      >
                        <Edit className="w-4 h-4 text-[#4b1b91]" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-[#f9ecec] rounded transition-colors"
                        title="Deactivate"
                      >
                        <Ban className="w-4 h-4 text-[#d74242]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#e6e2e9]">
          <div className="text-sm text-[#635c8a]">
            Showing {filteredUsers.length} of {mockUsers.length} users
          </div>
        </div>
      </div>

      {/* Add New User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">
                First Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">
                Last Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#1a1339] mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@bankacquire.com"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-[#1a1339] mb-2">
              Role *
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Bank Admin' | 'Bank Ops' })}
            >
              <option value="Bank Ops">Bank Ops</option>
              <option value="Bank Admin">Bank Admin</option>
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium"
            >
              Create User
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 px-6 py-3 bg-[#f5effb] text-[#c07bfc] rounded-lg hover:bg-[#ede5f7] transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
