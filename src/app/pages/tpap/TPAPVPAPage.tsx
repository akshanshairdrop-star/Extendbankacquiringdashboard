import { useState } from 'react';
import { Search, Ban, CheckCircle } from 'lucide-react';
import { StatusBadge } from '@/app/components/StatusBadge';

const mockVPAs = [
  { id: '1', name: 'John Doe', vpa: 'john@paytm', type: 'Customer', status: 'active', createdDate: '2026-01-20' },
  { id: '2', name: 'Amazon Pay', vpa: 'merchant@axis', type: 'Merchant', status: 'active', createdDate: '2026-01-18' },
  { id: '3', name: 'Sarah Smith', vpa: 'sarah@ybl', type: 'Customer', status: 'blocked', createdDate: '2026-01-15' },
];

export function TPAPVPAPage() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVPAs = mockVPAs.filter(vpa => {
    const matchesSearch = vpa.name.toLowerCase().includes(searchQuery.toLowerCase()) || vpa.vpa.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || vpa.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || vpa.status === statusFilter.toLowerCase();
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#1a1339]">Manage VPA</h2>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#635c8a]" />
            <input type="text" placeholder="Search VPA or name..." className="w-full pl-10 pr-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <select className="px-3 py-2 border border-[#e6e2e9] rounded-lg" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Merchant">Merchant</option>
            <option value="Customer">Customer</option>
          </select>
          <select className="px-3 py-2 border border-[#e6e2e9] rounded-lg" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#fafafa]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">VPA</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Created Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6e2e9]">
            {filteredVPAs.map((vpa) => (
              <tr key={vpa.id} className="hover:bg-[#fafafa]">
                <td className="px-4 py-3 text-sm text-[#1a1339] font-medium">{vpa.name}</td>
                <td className="px-4 py-3 text-sm text-[#4b1b91] font-mono">{vpa.vpa}</td>
                <td className="px-4 py-3 text-sm"><span className={`px-3 py-1 rounded-md text-xs font-medium ${vpa.type === 'Merchant' ? 'bg-[#f5effb] text-[#4b1b91]' : 'bg-[#eaf6f0] text-[#34b277]'}`}>{vpa.type}</span></td>
                <td className="px-4 py-3 text-sm"><StatusBadge status={vpa.status === 'active' ? 'success' : 'failed'} label={vpa.status === 'active' ? 'Active' : 'Blocked'} /></td>
                <td className="px-4 py-3 text-sm text-[#635c8a]">{vpa.createdDate}</td>
                <td className="px-4 py-3 text-sm">
                  <button className={`p-1.5 rounded transition-colors ${vpa.status === 'active' ? 'hover:bg-[#f9ecec]' : 'hover:bg-[#eaf6f0]'}`}>
                    {vpa.status === 'active' ? <Ban className="w-4 h-4 text-[#d74242]" /> : <CheckCircle className="w-4 h-4 text-[#34b277]" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
