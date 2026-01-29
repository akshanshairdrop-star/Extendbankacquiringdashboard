import { KPICard } from '@/app/components/KPICard';
import { CheckCircle, Clock, AlertCircle, DollarSign } from 'lucide-react';

const tpapSettlements = [
  { tpap: 'TPAP-001', settlementAmount: '₹45.80 Cr', merchants: 125, pendingAmount: '₹2.4 L', chargebackStatus: 'On Track' },
  { tpap: 'TPAP-002', settlementAmount: '₹38.90 Cr', merchants: 98, pendingAmount: '₹1.8 L', chargebackStatus: 'On Track' },
  { tpap: 'TPAP-003', settlementAmount: '₹27.80 Cr', merchants: 76, pendingAmount: '₹3.2 L', chargebackStatus: 'Delayed' },
];

export function ReconciliationPage() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#1a1339]">Reconciliation</h2>

      {/* Date Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-medium text-[#635c8a] mb-2">Date Range</label>
        <select className="w-full md:w-64 px-3 py-2 border border-[#e6e2e9] rounded-lg">
          <option>Today</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Transactions" value="154,820" subtitle="Processed today" icon={CheckCircle} />
        <KPICard title="Settled" value="149,230" subtitle="96.4% settled" trend={{ value: '3.2%', direction: 'up', label: 'vs yesterday' }} icon={DollarSign} />
        <KPICard title="Pending" value="5,120" subtitle="Awaiting settlement" icon={Clock} />
        <KPICard title="Mismatches" value="470" subtitle="Requires attention" icon={AlertCircle} />
      </div>

      {/* TPAP Settlement Summary */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e6e2e9]">
          <h3 className="text-[#1a1339] font-semibold">TPAP Settlement Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fafafa]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">TPAP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Settlement Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Merchants</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Pending Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Chargeback Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e2e9]">
              {tpapSettlements.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#fafafa]">
                  <td className="px-4 py-3 text-sm text-[#4b1b91] font-mono">{item.tpap}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1339] font-semibold">{item.settlementAmount}</td>
                  <td className="px-4 py-3 text-sm text-[#635c8a]">{item.merchants}</td>
                  <td className="px-4 py-3 text-sm text-[#f59f0a] font-semibold">{item.pendingAmount}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-md text-xs font-medium ${item.chargebackStatus === 'On Track' ? 'bg-[#eaf6f0] text-[#34b277]' : 'bg-[#fef3e8] text-[#f59f0a]'}`}>
                      {item.chargebackStatus}
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
