import { useState } from 'react';
import { KPICard } from '@/app/components/KPICard';
import { StatusBadge } from '@/app/components/StatusBadge';
import { Store, TrendingUp, DollarSign, AlertCircle, Eye, Ban, CheckCircle, Download, X } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Merchant {
  id: string;
  name: string;
  merchantId: string;
  mcc: string;
  status: 'active' | 'suspended';
  transactionCount: number;
  volume: string;
  settlementRate: number;
  chargebackRate: number;
}

const mockMerchants: Merchant[] = [
  {
    id: '1',
    name: 'Amazon Pay India',
    merchantId: 'MERCH001',
    mcc: '5411',
    status: 'active',
    transactionCount: 45820,
    volume: '₹45.80 Cr',
    settlementRate: 98.5,
    chargebackRate: 0.3,
  },
  {
    id: '2',
    name: 'Flipkart Payments',
    merchantId: 'MERCH002',
    mcc: '5399',
    status: 'active',
    transactionCount: 38900,
    volume: '₹38.90 Cr',
    settlementRate: 97.2,
    chargebackRate: 0.5,
  },
  {
    id: '3',
    name: 'Paytm Mall',
    merchantId: 'MERCH003',
    mcc: '5311',
    status: 'active',
    transactionCount: 27800,
    volume: '₹27.80 Cr',
    settlementRate: 96.8,
    chargebackRate: 0.8,
  },
  {
    id: '4',
    name: 'PhonePe Merchants',
    merchantId: 'MERCH004',
    mcc: '5814',
    status: 'active',
    transactionCount: 23400,
    volume: '₹23.40 Cr',
    settlementRate: 98.1,
    chargebackRate: 0.4,
  },
  {
    id: '5',
    name: 'Google Pay Business',
    merchantId: 'MERCH005',
    mcc: '5812',
    status: 'suspended',
    transactionCount: 18900,
    volume: '₹18.90 Cr',
    settlementRate: 92.5,
    chargebackRate: 2.1,
  },
];

const merchantVolumeData = [
  { name: 'Amazon Pay', volume: 458 },
  { name: 'Flipkart', volume: 389 },
  { name: 'Paytm', volume: 278 },
  { name: 'PhonePe', volume: 234 },
  { name: 'Google Pay', volume: 189 },
];

const settlementRateData = [
  { day: 'Mon', rate: 97.5 },
  { day: 'Tue', rate: 98.2 },
  { day: 'Wed', rate: 96.8 },
  { day: 'Thu', rate: 98.5 },
  { day: 'Fri', rate: 97.9 },
  { day: 'Sat', rate: 98.1 },
  { day: 'Sun', rate: 97.3 },
];

export function MerchantsPage() {
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [dateRange, setDateRange] = useState('7days');
  const [mccFilter, setMccFilter] = useState('all');

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#1a1339]">Merchant Management Dashboard</h2>
        <p className="text-[#635c8a] text-sm mt-1">Monitor merchant performance, settlements, and chargebacks</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-[#1a1339] text-sm font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#635c8a] mb-2">Date Range</label>
            <select 
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#635c8a] mb-2">Merchant</label>
            <select className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]">
              <option value="all">All Merchants</option>
              {mockMerchants.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#635c8a] mb-2">MCC Filter</label>
            <select 
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={mccFilter}
              onChange={(e) => setMccFilter(e.target.value)}
            >
              <option value="all">All MCC</option>
              <option value="5411">5411 - Grocery Stores</option>
              <option value="5399">5399 - General Merchandise</option>
              <option value="5812">5812 - Eating Places</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => {
            setDateRange('7days');
            setMccFilter('all');
          }}
          className="mt-4 px-6 py-2 bg-[#f5effb] text-[#c07bfc] rounded-lg hover:bg-[#ede5f7] transition-colors text-sm font-medium"
        >
          Reset Filter
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Merchants"
          value="1,245"
          subtitle="Active merchants"
          trend={{ value: '12', direction: 'up', label: 'vs last month' }}
          icon={Store}
        />
        <KPICard
          title="Total Transactions"
          value="154,820"
          subtitle="Last 7 days"
          trend={{ value: '8.5%', direction: 'up', label: 'vs previous week' }}
          icon={TrendingUp}
        />
        <KPICard
          title="Transaction Volume"
          value="₹154.90 Cr"
          subtitle="Last 7 days"
          trend={{ value: '15.2%', direction: 'up', label: 'vs previous week' }}
          icon={DollarSign}
        />
        <KPICard
          title="Chargeback Rate"
          value="0.42%"
          subtitle="Industry avg: 0.65%"
          trend={{ value: '0.1%', direction: 'down', label: 'vs last month' }}
          icon={AlertCircle}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Merchant Volume Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-[#1a1339] text-lg font-semibold mb-4">Total Merchants by Volume</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={merchantVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e2e9" />
              <XAxis dataKey="name" stroke="#635c8a" style={{ fontSize: '12px' }} />
              <YAxis stroke="#635c8a" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Bar dataKey="volume" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Settlement Rate Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-[#1a1339] text-lg font-semibold mb-4">Settlement Rate</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={settlementRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e2e9" />
              <XAxis dataKey="day" stroke="#635c8a" style={{ fontSize: '12px' }} />
              <YAxis domain={[95, 100]} stroke="#635c8a" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#34b277" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-[#fef3e8] rounded" />
            <span className="text-[#635c8a]">Highlight drops using amber/red threshold</span>
          </div>
        </div>
      </div>

      {/* Merchant Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#e6e2e9]">
          <h3 className="text-[#1a1339] font-semibold">Merchant List ({mockMerchants.length})</h3>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#4b1b91] hover:bg-[#f5effb] rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fafafa]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Merchant Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Merchant ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">MCC</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Transaction Count</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Volume</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Settlement Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Chargeback %</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e2e9]">
              {mockMerchants.map((merchant) => (
                <tr key={merchant.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 text-sm text-[#1a1339] font-medium">{merchant.name}</td>
                  <td className="px-4 py-3 text-sm text-[#4b1b91] font-mono">{merchant.merchantId}</td>
                  <td className="px-4 py-3 text-sm text-[#635c8a]">{merchant.mcc}</td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge 
                      status={merchant.status === 'active' ? 'success' : 'failed'} 
                      label={merchant.status === 'active' ? 'Active' : 'Suspended'}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1a1339]">{merchant.transactionCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1339] font-semibold">{merchant.volume}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={merchant.settlementRate >= 97 ? 'text-[#34b277]' : 'text-[#f59f0a]'}>
                      {merchant.settlementRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={merchant.chargebackRate <= 0.5 ? 'text-[#34b277]' : 'text-[#d74242]'}>
                      {merchant.chargebackRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedMerchant(merchant)}
                        className="p-1.5 hover:bg-[#f5effb] rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-[#4b1b91]" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-[#f9ecec] rounded transition-colors"
                        title={merchant.status === 'active' ? 'Suspend' : 'Activate'}
                      >
                        {merchant.status === 'active' ? (
                          <Ban className="w-4 h-4 text-[#d74242]" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-[#34b277]" />
                        )}
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
            Showing 1-{mockMerchants.length} of {mockMerchants.length}
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-[#e6e2e9] rounded text-sm hover:bg-[#fafafa] disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-[#e6e2e9] rounded text-sm hover:bg-[#fafafa] disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Merchant Detail Drawer */}
      {selectedMerchant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-2xl shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#e6e2e9] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#1a1339]">Merchant Details</h3>
              <button
                onClick={() => setSelectedMerchant(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Summary */}
              <div className="bg-gradient-to-br from-[#4b1b91] to-[#8b5cf6] rounded-xl p-6 text-white">
                <h4 className="text-2xl font-bold mb-2">{selectedMerchant.name}</h4>
                <div className="flex items-center gap-4 text-sm opacity-90">
                  <span>ID: {selectedMerchant.merchantId}</span>
                  <span>•</span>
                  <span>MCC: {selectedMerchant.mcc}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <StatusBadge 
                    status={selectedMerchant.status === 'active' ? 'success' : 'failed'} 
                    label={selectedMerchant.status === 'active' ? 'Active' : 'Suspended'}
                  />
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1a1339] pb-2 border-b border-[#e6e2e9]">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f5effb] rounded-lg p-4">
                    <p className="text-[#635c8a] text-sm mb-1">Transaction Count</p>
                    <p className="text-2xl font-bold text-[#4b1b91]">{selectedMerchant.transactionCount.toLocaleString()}</p>
                  </div>
                  <div className="bg-[#f5effb] rounded-lg p-4">
                    <p className="text-[#635c8a] text-sm mb-1">Volume</p>
                    <p className="text-2xl font-bold text-[#4b1b91]">{selectedMerchant.volume}</p>
                  </div>
                  <div className="bg-[#eaf6f0] rounded-lg p-4">
                    <p className="text-[#635c8a] text-sm mb-1">Settlement Rate</p>
                    <p className="text-2xl font-bold text-[#34b277]">{selectedMerchant.settlementRate}%</p>
                  </div>
                  <div className={`${selectedMerchant.chargebackRate <= 0.5 ? 'bg-[#eaf6f0]' : 'bg-[#f9ecec]'} rounded-lg p-4`}>
                    <p className="text-[#635c8a] text-sm mb-1">Chargeback Rate</p>
                    <p className={`text-2xl font-bold ${selectedMerchant.chargebackRate <= 0.5 ? 'text-[#34b277]' : 'text-[#d74242]'}`}>
                      {selectedMerchant.chargebackRate}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Settlement History */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1a1339] pb-2 border-b border-[#e6e2e9]">Recent Settlement History</h4>
                <div className="space-y-3">
                  {[
                    { date: '2026-01-23', amount: '₹12.5 Cr', status: 'Completed', time: '14:30' },
                    { date: '2026-01-22', amount: '₹11.8 Cr', status: 'Completed', time: '14:30' },
                    { date: '2026-01-21', amount: '₹13.2 Cr', status: 'Completed', time: '14:30' },
                    { date: '2026-01-20', amount: '₹10.9 Cr', status: 'Pending', time: '14:30' },
                  ].map((settlement, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-[#1a1339]">{settlement.date}</p>
                        <p className="text-xs text-[#635c8a]">{settlement.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#1a1339]">{settlement.amount}</p>
                        <StatusBadge 
                          status={settlement.status === 'Completed' ? 'success' : 'pending'} 
                          label={settlement.status}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disputes & Chargebacks */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1a1339] pb-2 border-b border-[#e6e2e9]">Dispute & Chargeback Overview</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-[#fafafa] rounded-lg">
                    <p className="text-2xl font-bold text-[#1a1339]">12</p>
                    <p className="text-xs text-[#635c8a] mt-1">Total Disputes</p>
                  </div>
                  <div className="p-4 bg-[#fafafa] rounded-lg">
                    <p className="text-2xl font-bold text-[#34b277]">8</p>
                    <p className="text-xs text-[#635c8a] mt-1">Resolved</p>
                  </div>
                  <div className="p-4 bg-[#fafafa] rounded-lg">
                    <p className="text-2xl font-bold text-[#f59f0a]">4</p>
                    <p className="text-xs text-[#635c8a] mt-1">Pending</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium">
                  View Full Report
                </button>
                <button className="flex-1 px-4 py-2 bg-[#f5effb] text-[#c07bfc] rounded-lg hover:bg-[#ede5f7] transition-colors font-medium">
                  {selectedMerchant.status === 'active' ? 'Suspend Merchant' : 'Activate Merchant'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
