import { useState } from 'react';
import { Eye, Download, Settings, AlertTriangle, Shield, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '@/app/components/KPICard';
import { DataTable, Column, RowAction } from '@/app/components/DataTable';

interface FraudTxn {
  id: string;
  txnId: string;
  merchant: string;
  amount: string;
  riskScore: number;
  flaggedBy: string;
  status: 'flagged' | 'investigating' | 'cleared' | 'blocked';
  timestamp: string;
}

const mockData: FraudTxn[] = [
  { id: '1', txnId: 'TXN001', merchant: 'Amazon', amount: '₹25,450', riskScore: 92, flaggedBy: 'Velocity Rule', status: 'flagged', timestamp: '2026-01-23 14:30' },
  { id: '2', txnId: 'TXN002', merchant: 'Flipkart', amount: '₹48,899', riskScore: 85, flaggedBy: 'Amount Threshold', status: 'investigating', timestamp: '2026-01-23 14:25' },
  { id: '3', txnId: 'TXN003', merchant: 'Swiggy', amount: '₹450', riskScore: 15, flaggedBy: 'Manual Review', status: 'cleared', timestamp: '2026-01-23 14:20' },
];

export function EFRMPage() {
  const [transactions, setTransactions] = useState(mockData);

  const columns: Column<FraudTxn>[] = [
    { key: 'txnId', label: 'Transaction ID', sortable: true, render: (row) => <span className="font-mono text-[#4b1b91]">{row.txnId}</span> },
    { key: 'merchant', label: 'Merchant', sortable: true, render: (row) => <span className="font-medium">{row.merchant}</span> },
    { key: 'amount', label: 'Amount', sortable: true, render: (row) => <span className="font-semibold">{row.amount}</span> },
    {
      key: 'riskScore',
      label: 'Risk Score',
      sortable: true,
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          row.riskScore >= 80 ? 'bg-[#f9ecec] text-[#d74242]' :
          row.riskScore >= 60 ? 'bg-[#fef3e8] text-[#f59f0a]' :
          'bg-[#eaf6f0] text-[#34b277]'
        }`}>
          {row.riskScore}
        </span>
      )
    },
    { key: 'flaggedBy', label: 'Flagged By', render: (row) => <span className="text-[#635c8a]">{row.flaggedBy}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          row.status === 'flagged' ? 'bg-[#fef3e8] text-[#f59f0a]' :
          row.status === 'investigating' ? 'bg-[#f5effb] text-[#4b1b91]' :
          row.status === 'cleared' ? 'bg-[#eaf6f0] text-[#34b277]' :
          'bg-[#f9ecec] text-[#d74242]'
        }`}>
          {row.status.toUpperCase()}
        </span>
      )
    },
    { key: 'timestamp', label: 'Timestamp', sortable: true, render: (row) => <span className="text-[#635c8a]">{row.timestamp}</span> },
  ];

  const rowActions: RowAction<FraudTxn>[] = [
    { label: 'View Details', icon: <Eye className="w-4 h-4" />, onClick: (txn) => toast.info(`Viewing ${txn.txnId}`) },
    { label: 'Export Report', icon: <Download className="w-4 h-4" />, onClick: (txn) => toast.success(`Exporting ${txn.txnId}`) },
  ];

  const flaggedCount = transactions.filter(t => t.status === 'flagged').length;
  const blockedCount = transactions.filter(t => t.status === 'blocked').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-[#1a1339]">EFRM - Fraud Monitoring</h2><p className="text-[#635c8a] text-sm mt-1">Enterprise Fraud Risk Management</p></div>
        <div className="flex gap-3">
          <button onClick={() => toast.success('Report exported')} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e6e2e9] rounded-lg hover:bg-gray-50"><Download className="w-4 h-4" />Export Report</button>
          <button onClick={() => toast.info('Opening settings')} className="flex items-center gap-2 px-4 py-2 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575]"><Settings className="w-4 h-4" />Configure Thresholds</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Flagged Today" value={flaggedCount.toString()} subtitle="Suspicious activity" icon={Flag} />
        <KPICard title="Investigating" value={transactions.filter(t => t.status === 'investigating').length.toString()} subtitle="Under review" icon={Eye} />
        <KPICard title="Blocked" value={blockedCount.toString()} subtitle="Fraud confirmed" icon={Shield} />
        <KPICard title="Avg Risk Score" value="58" subtitle="Today's average" icon={AlertTriangle} />
      </div>

      <DataTable columns={columns} data={transactions} rowActions={rowActions} searchable searchPlaceholder="Search transactions..." rowKey={(row) => row.id} />
    </div>
  );
}
