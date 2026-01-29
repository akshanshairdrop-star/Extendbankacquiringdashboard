import { useState } from 'react';
import { StatusBadge } from '@/app/components/StatusBadge';
import { RefreshCw, Download, Copy, X, Search } from 'lucide-react';

interface Transaction {
  id: string;
  timestamp: string;
  transactionId: string;
  npciRef: string;
  payerVPA: string;
  payeeVPA: string;
  amount: string;
  status: 'success' | 'failed' | 'pending';
  merchantName: string;
  mcc: string;
  tat: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    timestamp: '2026-01-23 14:35:22',
    transactionId: 'TXN20260123143522001',
    npciRef: 'NPCI2026012314352201',
    payerVPA: 'user@paytm',
    payeeVPA: 'merchant@axis',
    amount: '₹2,450.00',
    status: 'success',
    merchantName: 'Amazon Pay India',
    mcc: '5411',
    tat: '245ms',
  },
  {
    id: '2',
    timestamp: '2026-01-23 14:35:18',
    transactionId: 'TXN20260123143518002',
    npciRef: 'NPCI2026012314351802',
    payerVPA: 'john@ybl',
    payeeVPA: 'store@icici',
    amount: '₹899.00',
    status: 'failed',
    merchantName: 'Flipkart Payments',
    mcc: '5399',
    tat: '1200ms',
  },
  {
    id: '3',
    timestamp: '2026-01-23 14:35:15',
    transactionId: 'TXN20260123143515003',
    npciRef: 'NPCI2026012314351503',
    payerVPA: 'sara@oksbi',
    payeeVPA: 'vendor@hdfc',
    amount: '₹15,250.00',
    status: 'success',
    merchantName: 'Google Pay Business',
    mcc: '5812',
    tat: '198ms',
  },
  {
    id: '4',
    timestamp: '2026-01-23 14:35:12',
    transactionId: 'TXN20260123143512004',
    npciRef: 'NPCI2026012314351204',
    payerVPA: 'mike@paytm',
    payeeVPA: 'shop@axis',
    amount: '₹3,499.00',
    status: 'pending',
    merchantName: 'Paytm Mall',
    mcc: '5311',
    tat: '3500ms',
  },
  {
    id: '5',
    timestamp: '2026-01-23 14:35:09',
    transactionId: 'TXN20260123143509005',
    npciRef: 'NPCI2026012314350905',
    payerVPA: 'emma@ybl',
    payeeVPA: 'merchant@icici',
    amount: '₹675.00',
    status: 'success',
    merchantName: 'PhonePe Merchants',
    mcc: '5814',
    tat: '267ms',
  },
  {
    id: '6',
    timestamp: '2026-01-23 14:35:05',
    transactionId: 'TXN20260123143505006',
    npciRef: 'NPCI2026012314350506',
    payerVPA: 'raj@oksbi',
    payeeVPA: 'business@hdfc',
    amount: '₹12,000.00',
    status: 'success',
    merchantName: 'Amazon Pay India',
    mcc: '5411',
    tat: '312ms',
  },
];

export function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const filteredTransactions = mockTransactions.filter(txn => {
    const matchesSearch = 
      txn.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.npciRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.payerVPA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.payeeVPA.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(txn.status);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1339]">Real-Time Transaction Drill Down</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-[#34b277] rounded-full animate-pulse" />
            <span className="text-[#34b277] text-sm font-medium">Live Updates Enabled</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e6e2e9] rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-[#1a1339] text-sm font-semibold mb-3">Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Time Range */}
          <div>
            <label className="block text-sm font-medium text-[#635c8a] mb-2">Time Range</label>
            <select 
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="1hour">Last 1 Hour</option>
              <option value="24hours">Last 24 Hours</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-[#635c8a] mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#635c8a]" />
              <input
                type="text"
                placeholder="Transaction ID, NPCI Ref, VPA..."
                className="w-full pl-10 pr-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Channel Filter - Placeholder */}
          <div>
            <label className="block text-sm font-medium text-[#635c8a] mb-2">Channel</label>
            <select className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]">
              <option value="all">All Channels</option>
              <option value="p2p">P2P</option>
              <option value="p2m">P2M</option>
              <option value="recurring">Recurring</option>
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div>
          <label className="block text-sm font-medium text-[#635c8a] mb-2">Status</label>
          <div className="flex flex-wrap gap-2">
            {['success', 'failed', 'pending'].map((status) => (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                  selectedStatuses.includes(status)
                    ? status === 'success'
                      ? 'bg-[#eaf6f0] border-[#34b277] text-[#34b277]'
                      : status === 'failed'
                      ? 'bg-[#f9ecec] border-[#d74242] text-[#d74242]'
                      : 'bg-[#fef3e8] border-[#f59f0a] text-[#f59f0a]'
                    : 'bg-white border-[#e6e2e9] text-[#635c8a] hover:border-[#c77efc]'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button className="px-6 py-2 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors text-sm font-medium">
            Apply Filter
          </button>
          <button 
            onClick={() => {
              setSelectedStatuses([]);
              setSearchQuery('');
              setTimeRange('today');
            }}
            className="px-6 py-2 bg-[#f5effb] text-[#c07bfc] rounded-lg hover:bg-[#ede5f7] transition-colors text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#e6e2e9]">
          <h3 className="text-[#1a1339] font-semibold">
            Transactions ({filteredTransactions.length})
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#4b1b91] hover:bg-[#f5effb] rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fafafa] sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Transaction ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">NPCI REF ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Payer VPA</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Payee VPA</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">Merchant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">MCC</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">TAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e2e9]">
              {filteredTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  onClick={() => setSelectedTransaction(txn)}
                  className="hover:bg-[#fafafa] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-[#1a1339] whitespace-nowrap">{txn.timestamp}</td>
                  <td className="px-4 py-3 text-sm text-[#4b1b91] font-mono">{txn.transactionId}</td>
                  <td className="px-4 py-3 text-sm text-[#635c8a] font-mono">{txn.npciRef}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1339]">{txn.payerVPA}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1339]">{txn.payeeVPA}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1339] font-semibold">{txn.amount}</td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={txn.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1a1339]">{txn.merchantName}</td>
                  <td className="px-4 py-3 text-sm text-[#635c8a]">{txn.mcc}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1339]">{txn.tat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#e6e2e9]">
          <div className="text-sm text-[#635c8a]">
            Showing 1-{Math.min(itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-[#e6e2e9] rounded text-sm hover:bg-[#fafafa] disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1 border border-[#e6e2e9] rounded text-sm hover:bg-[#fafafa] disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Detail Drawer */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-2xl shadow-xl overflow-y-auto animate-slide-in-right">
            <div className="sticky top-0 bg-white border-b border-[#e6e2e9] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#1a1339]">Transaction Details</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#635c8a]">Status</span>
                <StatusBadge status={selectedTransaction.status} />
              </div>

              {/* Transaction Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1a1339] pb-2 border-b border-[#e6e2e9]">Transaction Information</h4>
                
                {[
                  { label: 'Transaction ID', value: selectedTransaction.transactionId },
                  { label: 'NPCI Reference ID', value: selectedTransaction.npciRef },
                  { label: 'Timestamp', value: selectedTransaction.timestamp },
                  { label: 'Amount', value: selectedTransaction.amount },
                  { label: 'TAT', value: selectedTransaction.tat },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between group">
                    <span className="text-sm text-[#635c8a]">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#1a1339] font-medium">{item.value}</span>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all">
                        <Copy className="w-4 h-4 text-[#635c8a]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payer/Payee Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1a1339] pb-2 border-b border-[#e6e2e9]">Party Information</h4>
                
                {[
                  { label: 'Payer VPA', value: selectedTransaction.payerVPA },
                  { label: 'Payee VPA', value: selectedTransaction.payeeVPA },
                  { label: 'Merchant Name', value: selectedTransaction.merchantName },
                  { label: 'MCC', value: selectedTransaction.mcc },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-[#635c8a]">{item.label}</span>
                    <span className="text-sm text-[#1a1339] font-medium">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1a1339] pb-2 border-b border-[#e6e2e9]">Transaction Timeline</h4>
                <div className="space-y-3">
                  {[
                    { time: '14:35:22.001', event: 'Request Received', status: 'completed' },
                    { time: '14:35:22.045', event: 'Bank Validation', status: 'completed' },
                    { time: '14:35:22.123', event: 'NPCI Processing', status: 'completed' },
                    { time: '14:35:22.245', event: 'Settlement Initiated', status: 'completed' },
                    { time: '14:35:22.267', event: 'Transaction Complete', status: 'completed' },
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#34b277] mt-1.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#1a1339]">{step.event}</p>
                        <p className="text-xs text-[#635c8a]">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
