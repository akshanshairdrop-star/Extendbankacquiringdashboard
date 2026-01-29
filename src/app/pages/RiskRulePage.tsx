import { useState } from 'react';
import { Plus, Search, Edit, Ban, Shield, AlertTriangle, DollarSign, Clock } from 'lucide-react';
import { KPICard } from '@/app/components/KPICard';
import { StatusBadge } from '@/app/components/StatusBadge';
import { Modal } from '@/app/components/Modal';

interface RiskRule {
  id: string;
  ruleName: string;
  mcc: string;
  applicability: 'Merchant' | 'Customer';
  ruleType: string;
  action: 'Alert' | 'Decline';
  status: 'active' | 'deactivated';
  createdDate: string;
}

const mockRules: RiskRule[] = [
  {
    id: '1',
    ruleName: 'High Value Transaction Check',
    mcc: '5411',
    applicability: 'Merchant',
    ruleType: 'Max Amount',
    action: 'Alert',
    status: 'active',
    createdDate: '2026-01-15',
  },
  {
    id: '2',
    ruleName: 'New Payer Restriction',
    mcc: 'ALL',
    applicability: 'Customer',
    ruleType: 'New Payer Limit',
    action: 'Decline',
    status: 'active',
    createdDate: '2026-01-10',
  },
  {
    id: '3',
    ruleName: 'Velocity Check - P2M',
    mcc: '5399',
    applicability: 'Merchant',
    ruleType: 'Velocity',
    action: 'Alert',
    status: 'active',
    createdDate: '2026-01-08',
  },
  {
    id: '4',
    ruleName: 'Daily Limit Exceeded',
    mcc: 'ALL',
    applicability: 'Customer',
    ruleType: 'Daily Amount Limit',
    action: 'Decline',
    status: 'active',
    createdDate: '2026-01-05',
  },
  {
    id: '5',
    ruleName: 'Suspicious Transaction Pattern',
    mcc: '5812',
    applicability: 'Merchant',
    ruleType: 'Velocity',
    action: 'Decline',
    status: 'deactivated',
    createdDate: '2025-12-20',
  },
];

export function RiskRulePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRuleType, setSelectedRuleType] = useState('');
  const [formData, setFormData] = useState({
    ruleName: '',
    mcc: '',
    ruleType: '',
    maxAmount: '',
    newPayerMaxAmount: '',
    newPayerDuration: '24',
    velocityCount: '',
    velocityDuration: '1',
    dailyMaxAmount: '',
    applicability: 'Merchant',
    action: 'Alert',
  });

  const ruleTypes = [
    'Max Amount',
    'New Payer Limit',
    'Velocity',
    'Daily Amount Limit',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Rule created:', formData);
    setIsAddModalOpen(false);
    // Reset form
    setFormData({
      ruleName: '',
      mcc: '',
      ruleType: '',
      maxAmount: '',
      newPayerMaxAmount: '',
      newPayerDuration: '24',
      velocityCount: '',
      velocityDuration: '1',
      dailyMaxAmount: '',
      applicability: 'Merchant',
      action: 'Alert',
    });
    setSelectedRuleType('');
  };

  const filteredRules = mockRules.filter(rule =>
    rule.ruleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.mcc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1339]">Risk Rule Dashboard</h2>
          <p className="text-[#635c8a] text-sm mt-1">Manage transaction risk rules and monitoring</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New Rule
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Rules"
          value="24"
          subtitle="All configured rules"
          icon={Shield}
        />
        <KPICard
          title="Active Rules"
          value="18"
          subtitle="Currently enforced"
          trend={{ value: '2', direction: 'up', label: 'added this week' }}
          icon={Shield}
        />
        <KPICard
          title="Blocked Transactions Today"
          value="156"
          subtitle="Prevented by rules"
          trend={{ value: '12%', direction: 'down', label: 'vs yesterday' }}
          icon={AlertTriangle}
        />
        <KPICard
          title="Amount Saved"
          value="₹12.8 L"
          subtitle="Fraud prevented today"
          trend={{ value: '18%', direction: 'up', label: 'vs yesterday' }}
          icon={DollarSign}
        />
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#635c8a]" />
          <input
            type="text"
            placeholder="Search rules by name or MCC..."
            className="w-full pl-10 pr-4 py-3 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fafafa]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Rule Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">MCC</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Applicability</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Rule Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e2e9]">
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 text-sm text-[#1a1339] font-medium">{rule.ruleName}</td>
                  <td className="px-4 py-3 text-sm text-[#635c8a]">
                    <span className="px-2 py-1 bg-[#f5effb] text-[#4b1b91] rounded font-mono text-xs">
                      {rule.mcc}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1a1339]">{rule.applicability}</td>
                  <td className="px-4 py-3 text-sm text-[#635c8a]">{rule.ruleType}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-md text-xs font-medium ${
                      rule.action === 'Alert'
                        ? 'bg-[#fef3e8] text-[#f59f0a]'
                        : 'bg-[#f9ecec] text-[#d74242]'
                    }`}>
                      {rule.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge 
                      status={rule.status === 'active' ? 'success' : 'failed'} 
                      label={rule.status === 'active' ? 'Active' : 'Deactivated'}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 hover:bg-[#f5effb] rounded transition-colors"
                        title="Update Rule"
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
      </div>

      {/* Add New Rule Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Risk Rule"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rule Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#1a1339] mb-2">
                Rule Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.ruleName}
                onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
                placeholder="Enter rule name"
              />
            </div>

            {/* MCC Code */}
            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">
                MCC Code *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.mcc}
                onChange={(e) => setFormData({ ...formData, mcc: e.target.value })}
                placeholder="Enter MCC or 'ALL'"
              />
            </div>

            {/* Rule Type */}
            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">
                Rule Type *
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.ruleType}
                onChange={(e) => {
                  setFormData({ ...formData, ruleType: e.target.value });
                  setSelectedRuleType(e.target.value);
                }}
              >
                <option value="">Select Rule Type</option>
                {ruleTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditional Fields based on Rule Type */}
          {selectedRuleType === 'Max Amount' && (
            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">
                Maximum Amount (₹) *
              </label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.maxAmount}
                onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                placeholder="Enter maximum amount"
              />
            </div>
          )}

          {selectedRuleType === 'New Payer Limit' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1a1339] mb-2">
                  Maximum Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                  value={formData.newPayerMaxAmount}
                  onChange={(e) => setFormData({ ...formData, newPayerMaxAmount: e.target.value })}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1339] mb-2">
                  Duration (hours) *
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                  value={formData.newPayerDuration}
                  onChange={(e) => setFormData({ ...formData, newPayerDuration: e.target.value })}
                  placeholder="24"
                />
              </div>
            </div>
          )}

          {selectedRuleType === 'Velocity' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1a1339] mb-2">
                  Transaction Count *
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                  value={formData.velocityCount}
                  onChange={(e) => setFormData({ ...formData, velocityCount: e.target.value })}
                  placeholder="Number of transactions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1339] mb-2">
                  Duration (hours) *
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                  value={formData.velocityDuration}
                  onChange={(e) => setFormData({ ...formData, velocityDuration: e.target.value })}
                  placeholder="1"
                />
              </div>
            </div>
          )}

          {selectedRuleType === 'Daily Amount Limit' && (
            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">
                Daily Maximum Amount (₹) *
              </label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.dailyMaxAmount}
                onChange={(e) => setFormData({ ...formData, dailyMaxAmount: e.target.value })}
                placeholder="Enter daily limit"
              />
            </div>
          )}

          {/* Rule Applicability */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">
                Rule Applicability *
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.applicability}
                onChange={(e) => setFormData({ ...formData, applicability: e.target.value as 'Merchant' | 'Customer' })}
              >
                <option value="Merchant">Merchant</option>
                <option value="Customer">Customer</option>
              </select>
            </div>

            {/* Action */}
            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">
                Action *
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value as 'Alert' | 'Decline' })}
              >
                <option value="Alert">Alert</option>
                <option value="Decline">Decline</option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium"
            >
              Create Rule
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 px-6 py-3 bg-[#f5effb] text-[#c07bfc] rounded-lg hover:bg-[#ede5f7] transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
