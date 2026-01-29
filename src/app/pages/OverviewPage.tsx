import { KPICard } from '@/app/components/KPICard';
import { StatusBadge } from '@/app/components/StatusBadge';
import { TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const hourlyData = [
  { time: '00:00', volume: 8000 },
  { time: '02:00', volume: 5000 },
  { time: '04:00', volume: 4000 },
  { time: '06:00', volume: 7000 },
  { time: '08:00', volume: 12000 },
  { time: '10:00', volume: 18000 },
  { time: '12:00', volume: 23000 },
  { time: '14:00', volume: 21000 },
  { time: '16:00', volume: 26000 },
  { time: '18:00', volume: 24000 },
  { time: '20:00', volume: 18000 },
  { time: '22:00', volume: 12000 },
];

const statusData = [
  { name: 'Success', value: 85.2, count: 209347, color: '#34b277' },
  { name: 'Failed', value: 3.2, count: 7851, color: '#d74242' },
  { name: 'Pending', value: 11.6, count: 28460, color: '#f59f0a' },
];

const merchantData = [
  { name: 'Amazon Pay India', status: 'Active', volume: '₹45.80 Cr' },
  { name: 'Flipkart Payments', status: 'Active', volume: '₹38.90 Cr' },
  { name: 'Paytm Mall', status: 'Active', volume: '₹27.80 Cr' },
  { name: 'PhonePe Merchants', status: 'Active', volume: '₹23.40 Cr' },
  { name: 'Google Pay Business', status: 'Inactive', volume: '₹18.90 Cr' },
];

const failureReasons = [
  { reason: 'Insufficient Funds', percentage: 32 },
  { reason: 'Invalid VPA', percentage: 28 },
  { reason: 'Bank Decline', percentage: 24 },
  { reason: 'Timeout', percentage: 10 },
  { reason: 'Technical Error', percentage: 6 },
];

export function OverviewPage() {
  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Transactions"
          value="2,45,678"
          subtitle="Today's volume"
          trend={{ value: '12.5%', direction: 'up', label: 'vs yesterday' }}
          icon={TrendingUp}
        />
        <KPICard
          title="Success Rate"
          value="96.8%"
          subtitle="vs 96.5% yesterday"
          trend={{ value: '0.3%', direction: 'up', label: 'vs yesterday' }}
          icon={CheckCircle}
        />
        <KPICard
          title="Failures"
          value="7,851"
          subtitle="Declined transactions"
          trend={{ value: '8.2%', direction: 'up', label: 'vs yesterday' }}
          icon={XCircle}
        />
        <KPICard
          title="Avg TAT"
          value="267 ms"
          subtitle="P95 = 524 ms"
          trend={{ value: '15%', direction: 'down', label: 'faster' }}
          icon={Clock}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#1a1339] text-lg font-semibold">Transaction Trend - Hourly</h3>
            <span className="text-[#635c8a] text-sm">Volume</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e2e9" />
              <XAxis dataKey="time" stroke="#635c8a" style={{ fontSize: '12px' }} />
              <YAxis stroke="#635c8a" style={{ fontSize: '12px' }} />
              <Tooltip />
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Line type="monotone" dataKey="volume" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorVolume)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-[#1a1339] text-lg font-semibold mb-4">Transaction Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-[#1a1339]">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-[#1a1339]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Merchants */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-[#1a1339] text-lg font-semibold mb-4">Top Merchant Volume</h3>
          <div className="space-y-3">
            {merchantData.map((merchant) => (
              <div key={merchant.name} className="flex items-center justify-between py-2 border-b border-[#e6e2e9] last:border-0">
                <div>
                  <p className="text-[#1a1339] text-sm font-medium">{merchant.name}</p>
                  <StatusBadge 
                    status={merchant.status === 'Active' ? 'success' : 'failed'} 
                    label={merchant.status}
                  />
                </div>
                <span className="text-[#1a1339] font-semibold">{merchant.volume}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Failure Reasons */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-[#1a1339] text-lg font-semibold mb-4">Top Failure Reasons</h3>
          <div className="space-y-3">
            {failureReasons.map((item) => (
              <div key={item.reason}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#1a1339]">{item.reason}</span>
                  <span className="text-sm font-medium text-[#1a1339]">{item.percentage}%</span>
                </div>
                <div className="w-full bg-[#f2f0f4] rounded-full h-2">
                  <div
                    className="bg-[#d74242] h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Transaction Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-[#1a1339] text-lg font-semibold mb-4">Current Transaction State</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statusData.map((item) => (
            <div
              key={item.name}
              className="border border-[#e6e2e9] rounded-lg p-4"
              style={{ backgroundColor: `${item.color}05` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-[#1a1339]">{item.name}</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}%</div>
              <div className="text-[#635c8a] text-sm mt-1">{item.count.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
