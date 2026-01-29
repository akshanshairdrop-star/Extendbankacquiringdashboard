import { useState } from 'react';
import { Search, Download, Eye } from 'lucide-react';
import { StatusBadge } from '@/app/components/StatusBadge';

const mockTransactions = [
  { id: '1', txnId: 'TXN001', upiRef: 'UPI001', merchant: 'Amazon', vpa: 'user@paytm', amount: '₹2,450', status: 'success', timestamp: '2026-01-23 14:35:22' },
  { id: '2', txnId: 'TXN002', upiRef: 'UPI002', merchant: 'Flipkart', vpa: 'john@ybl', amount: '₹899', status: 'failed', timestamp: '2026-01-23 14:35:18' },
];

export function TPAPTransactionsPage() {
  const [searchType, setSearchType] = useState('txnId');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#1a1339]">TPAP Transactions</h2>

      {/* Search Options */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="px-3 py-2 border border-[#e6e2e9] rounded-lg" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="txnId">TXN ID</option>
            <option value="upiRef">UPI Ref ID</option>
            <option value="vpa">VPA</option>
            <option value="merchant">Merchant</option>
          </select>
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#635c8a]" />
            <input type="text" placeholder="Global text search..." className="w-full pl-10 pr-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575]">
            <Download className="w-4 h-4" />Export Data
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#fafafa]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">TXN ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">UPI Ref ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Merchant</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">VPA</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6e2e9]">
            {mockTransactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-[#fafafa]">
                <td className="px-4 py-3 text-sm text-[#4b1b91] font-mono">{txn.txnId}</td>
                <td className="px-4 py-3 text-sm text-[#635c8a] font-mono">{txn.upiRef}</td>
                <td className="px-4 py-3 text-sm text-[#1a1339]">{txn.merchant}</td>
                <td className="px-4 py-3 text-sm text-[#1a1339]">{txn.vpa}</td>
                <td className="px-4 py-3 text-sm text-[#1a1339] font-semibold">{txn.amount}</td>
                <td className="px-4 py-3 text-sm"><StatusBadge status={txn.status as any} /></td>
                <td className="px-4 py-3 text-sm text-[#635c8a]">{txn.timestamp}</td>
                <td className="px-4 py-3 text-sm">
                  <button className="p-1.5 hover:bg-[#f5effb] rounded"><Eye className="w-4 h-4 text-[#4b1b91]" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
