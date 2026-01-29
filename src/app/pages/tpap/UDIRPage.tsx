import { KPICard } from '@/app/components/KPICard';
import { AlertCircle, CheckCircle, Clock, DollarSign, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const trendData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  disputes: Math.floor(Math.random() * 50) + 20,
}));

const disputes = [
  { id: 'DISP001', txnId: 'TXN001', type: 'Chargeback', merchant: 'Amazon', amount: '₹2,450', status: 'Pending', raisedDate: '2026-01-22', tat: '2 days', tatStatus: 'On Track' },
  { id: 'DISP002', txnId: 'TXN002', type: 'Unauthorized', merchant: 'Flipkart', amount: '₹899', status: 'Resolved', raisedDate: '2026-01-20', tat: '4 days', tatStatus: 'Resolved' },
  { id: 'DISP003', txnId: 'TXN003', type: 'Chargeback', merchant: 'Paytm', amount: '₹15,250', status: 'Pending', raisedDate: '2026-01-18', tat: '6 days', tatStatus: 'Breached' },
];

export function UDIRPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1a1339]">UDIR - Dispute Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575]">
          <Download className="w-4 h-4" />Export Data
        </button>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-medium text-[#635c8a] mb-2">Date Range</label>
        <select className="w-full md:w-64 px-3 py-2 border border-[#e6e2e9] rounded-lg">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
        </select>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Disputes" value="234" subtitle="All time" icon={AlertCircle} />
        <KPICard title="Pending" value="89" subtitle="Under investigation" icon={Clock} />
        <KPICard title="Resolved" value="145" subtitle="Successfully closed" trend={{ value: '12', direction: 'up', label: 'this week' }} icon={CheckCircle} />
        <KPICard title="Total Refunds" value="₹12.4 L" subtitle="Refunded amount" icon={DollarSign} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dispute Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-[#1a1339] text-lg font-semibold mb-4">Dispute Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e2e9" />
              <XAxis dataKey="day" stroke="#635c8a" style={{ fontSize: '12px' }} />
              <YAxis stroke="#635c8a" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Line type="monotone" dataKey="disputes" stroke="#f59f0a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Resolution Heatmap Placeholder */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-[#1a1339] text-lg font-semibold mb-4">Resolution Heatmap</h3>
          <div className="grid grid-cols-7 gap-2 mt-4">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className={`h-10 rounded ${['bg-[#eaf6f0]', 'bg-[#fef3e8]', 'bg-[#f9ecec]'][Math.floor(Math.random() * 3)]}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Dispute Tracking Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e6e2e9]">
          <h3 className="text-[#1a1339] font-semibold">Dispute Tracking</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fafafa]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Dispute ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Transaction ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Merchant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Raised Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">TAT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">TAT Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e2e9]">
              {disputes.map((dispute) => (
                <tr key={dispute.id} className="hover:bg-[#fafafa]">
                  <td className="px-4 py-3 text-sm text-[#4b1b91] font-mono">{dispute.id}</td>
                  <td className="px-4 py-3 text-sm text-[#635c8a] font-mono">{dispute.txnId}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1339]">{dispute.type}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1339]">{dispute.merchant}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1339] font-semibold">{dispute.amount}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-md text-xs font-medium ${dispute.status === 'Pending' ? 'bg-[#fef3e8] text-[#f59f0a]' : 'bg-[#eaf6f0] text-[#34b277]'}`}>
                      {dispute.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#635c8a]">{dispute.raisedDate}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1339]">{dispute.tat}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-md text-xs font-medium ${
                      dispute.tatStatus === 'On Track' ? 'bg-[#eaf6f0] text-[#34b277]' :
                      dispute.tatStatus === 'Resolved' ? 'bg-[#f5effb] text-[#4b1b91]' :
                      'bg-[#f9ecec] text-[#d74242]'
                    }`}>
                      {dispute.tatStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
