import { useState } from 'react';
import { Plus, Shield, Lock } from 'lucide-react';
import { StatusBadge } from '@/app/components/StatusBadge';

const globalRules = [
  { id: '1', name: 'Global High Value Check', mcc: 'ALL', type: 'Max Amount', applicability: 'Merchant', action: 'Alert', status: 'active' },
];

const tpapRules = [
  { id: '2', name: 'TPAP Velocity Check', mcc: '5411', type: 'Velocity', applicability: 'Customer', action: 'Decline', status: 'active' },
];

export function TPAPRulesPage() {
  const [selectedTab, setSelectedTab] = useState<'global' | 'tpap'>('global');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1a1339]">Manage Rules</h2>
        {selectedTab === 'tpap' && (
          <button className="flex items-center gap-2 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575]">
            <Plus className="w-5 h-5" />Add TPAP Rule
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex border-b border-[#e6e2e9]">
          <button onClick={() => setSelectedTab('global')} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${selectedTab === 'global' ? 'text-[#4b1b91] border-b-2 border-[#4b1b91]' : 'text-[#635c8a]'}`}>
            <Lock className="w-4 h-4" />Global Rules (View Only)
          </button>
          <button onClick={() => setSelectedTab('tpap')} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${selectedTab === 'tpap' ? 'text-[#4b1b91] border-b-2 border-[#4b1b91]' : 'text-[#635c8a]'}`}>
            <Shield className="w-4 h-4" />TPAP Rules (Editable)
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fafafa]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Rule Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">MCC</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Rule Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Applicability</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e2e9]">
              {(selectedTab === 'global' ? globalRules : tpapRules).map((rule) => (
                <tr key={rule.id} className="hover:bg-[#fafafa]">
                  <td className="px-4 py-3 text-sm text-[#1a1339] font-medium">{rule.name}</td>
                  <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-[#f5effb] text-[#4b1b91] rounded font-mono text-xs">{rule.mcc}</span></td>
                  <td className="px-4 py-3 text-sm text-[#635c8a]">{rule.type}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1339]">{rule.applicability}</td>
                  <td className="px-4 py-3 text-sm"><span className={`px-3 py-1 rounded-md text-xs font-medium ${rule.action === 'Alert' ? 'bg-[#fef3e8] text-[#f59f0a]' : 'bg-[#f9ecec] text-[#d74242]'}`}>{rule.action}</span></td>
                  <td className="px-4 py-3 text-sm"><StatusBadge status="success" label="Active" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
