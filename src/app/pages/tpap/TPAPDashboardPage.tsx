import { KPICard } from '@/app/components/KPICard';
import { TrendingUp, DollarSign, CheckCircle, Building2, Zap, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const volumeData = [
  { tpap: 'TPAP-001', volume: 458 },
  { tpap: 'TPAP-002', volume: 389 },
  { tpap: 'TPAP-003', volume: 278 },
];

const hourlyData = Array.from({ length: 12 }, (_, i) => ({
  time: `${i * 2}:00`,
  success: Math.floor(Math.random() * 1000) + 500,
  failed: Math.floor(Math.random() * 100),
}));

const failureReasons = [
  { reason: 'BD (Bank Decline)', count: 145, percentage: 45 },
  { reason: 'TD (Technical Decline)', count: 98, percentage: 30 },
  { reason: 'Timeout', count: 52, percentage: 16 },
  { reason: 'Others', count: 29, percentage: 9 },
];

export function TPAPDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Date Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-medium text-[#635c8a] mb-2">Date Range</label>
        <select className="w-full md:w-64 px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]">
          <option>Today</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Custom Range</option>
        </select>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard title="Total Transactions" value="154,820" subtitle="Last 24 hours" trend={{ value: '12.5%', direction: 'up', label: 'vs yesterday' }} icon={TrendingUp} />
        <KPICard title="Total Volume" value="₹154.90 Cr" subtitle="Last 24 hours" trend={{ value: '8.2%', direction: 'up', label: 'vs yesterday' }} icon={DollarSign} />
        <KPICard title="Success Rate" value="96.8%" subtitle="Last 24 hours" trend={{ value: '0.3%', direction: 'up', label: 'vs yesterday' }} icon={CheckCircle} />
        <KPICard title="Total TPAP" value="3" subtitle="Active TPAPs" icon={Building2} />
        <KPICard title="TPS" value="245" subtitle="Transactions per second" icon={Zap} />
        <KPICard title="Successful Txn (1 Hour)" value="12,456" subtitle="Last 1 hour" trend={{ value: '5.2%', direction: 'up', label: 'vs prev hour' }} icon={Clock} />
      </div>

      {/* Failed/Declined Transactions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-[#1a1339] text-lg font-semibold mb-4">Failed / Declined Transactions</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6e2e9" />
            <XAxis dataKey="time" stroke="#635c8a" style={{ fontSize: '12px' }} />
            <YAxis stroke="#635c8a" style={{ fontSize: '12px' }} />
            <Tooltip />
            <Line type="monotone" dataKey="success" stroke="#34b277" strokeWidth={2} name="Success" />
            <Line type="monotone" dataKey="failed" stroke="#d74242" strokeWidth={2} name="Failed" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TPAP Volume */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-[#1a1339] text-lg font-semibold mb-4">TPAP Volume</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e2e9" />
              <XAxis dataKey="tpap" stroke="#635c8a" style={{ fontSize: '12px' }} />
              <YAxis stroke="#635c8a" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Bar dataKey="volume" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Failure Reasons */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-[#1a1339] text-lg font-semibold mb-4">Top Failure Reasons</h3>
          <div className="space-y-4">
            {failureReasons.map((item) => (
              <div key={item.reason}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#1a1339] font-medium">{item.reason}</span>
                  <span className="text-sm font-semibold text-[#1a1339]">{item.count}</span>
                </div>
                <div className="w-full bg-[#f2f0f4] rounded-full h-2">
                  <div className="bg-[#d74242] h-2 rounded-full transition-all" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
