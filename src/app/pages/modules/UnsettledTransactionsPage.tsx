import { useState } from 'react';
import { Eye, Send, User, Download, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '@/app/components/KPICard';
import { DataTable, Column, RowAction } from '@/app/components/DataTable';
import { ConfirmationModal } from '@/app/components/ConfirmationModal';

interface UnsettledTxn {
  id: string;
  txnId: string;
  merchant: string;
  amount: string;
  stuckDays: number;
  reason: string;
  status: 'pending' | 'escalated';
}

const mockData: UnsettledTxn[] = [
  { id: '1', txnId: 'TXN001', merchant: 'Amazon', amount: '₹2,450', stuckDays: 3, reason: 'Bank timeout', status: 'pending' },
  { id: '2', txnId: 'TXN002', merchant: 'Flipkart', amount: '₹15,899', stuckDays: 7, reason: 'NPCI mismatch', status: 'escalated' },
  { id: '3', txnId: 'TXN003', merchant: 'Swiggy', amount: '₹4,250', stuckDays: 5, reason: 'Merchant error', status: 'pending' },
];

export function UnsettledTransactionsPage() {
  const [transactions, setTransactions] = useState(mockData);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'settle' | 'escalate' | 'assign'; txn: UnsettledTxn | null }>({ isOpen: false, type: 'settle', txn: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = (reason?: string) => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Processing ${confirmModal.type}...`,
        success: () => {
          setConfirmModal({ isOpen: false, type: 'settle', txn: null });
          setIsLoading(false);
          return `Transaction ${confirmModal.type}d successfully`;
        },
        error: 'Action failed',
      }
    );
  };

  const columns: Column<UnsettledTxn>[] = [
    { key: 'txnId', label: 'Transaction ID', sortable: true, render: (row) => <span className="font-mono text-[#4b1b91]">{row.txnId}</span> },
    { key: 'merchant', label: 'Merchant', sortable: true, render: (row) => <span className="font-medium">{row.merchant}</span> },
    { key: 'amount', label: 'Amount', sortable: true, render: (row) => <span className="font-semibold">{row.amount}</span> },
    { key: 'stuckDays', label: 'Stuck (Days)', sortable: true, render: (row) => <span className={`font-bold ${row.stuckDays > 5 ? 'text-[#d74242]' : row.stuckDays > 3 ? 'text-[#f59f0a]' : 'text-[#34b277]'}`}>{row.stuckDays}</span> },
    { key: 'reason', label: 'Reason', render: (row) => <span className="text-[#635c8a]">{row.reason}</span> },
    { key: 'status', label: 'Status', render: (row) => <span className={`px-3 py-1 rounded-md text-xs font-medium ${row.status === 'escalated' ? 'bg-[#f9ecec] text-[#d74242]' : 'bg-[#fef3e8] text-[#f59f0a]'}`}>{row.status}</span> },
  ];

  const rowActions: RowAction<UnsettledTxn>[] = [
    { label: 'View Details', icon: <Eye className="w-4 h-4" />, onClick: (txn) => toast.info(`Viewing ${txn.txnId}`) },
    { label: 'Trigger Manual Settlement', icon: <Send className="w-4 h-4" />, onClick: (txn) => setConfirmModal({ isOpen: true, type: 'settle', txn }) },
    { label: 'Assign to Ops', icon: <User className="w-4 h-4" />, onClick: (txn) => setConfirmModal({ isOpen: true, type: 'assign', txn }), show: (txn) => txn.status === 'pending' },
    { label: 'Escalate', icon: <AlertCircle className="w-4 h-4" />, onClick: (txn) => setConfirmModal({ isOpen: true, type: 'escalate', txn }), variant: 'danger', show: (txn) => txn.stuckDays > 5 },
  ];

  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const escalatedCount = transactions.filter(t => t.status === 'escalated').length;
  const totalAmount = '₹22,599';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-[#1a1339]">Unsettled / Stuck Transactions</h2><p className="text-[#635c8a] text-sm mt-1">Monitor and resolve stuck transactions</p></div>
        <button onClick={() => toast.success('List exported')} className="flex items-center gap-2 px-4 py-2 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575]"><Download className="w-4 h-4" />Export List</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Unsettled" value={transactions.length.toString()} subtitle="Stuck transactions" icon={AlertCircle} />
        <KPICard title="Pending" value={pendingCount.toString()} subtitle="Awaiting action" icon={Clock} />
        <KPICard title="Escalated" value={escalatedCount.toString()} subtitle="High priority" icon={AlertCircle} />
        <KPICard title="Total Amount" value={totalAmount} subtitle="Locked value" icon={Send} />
      </div>

      <DataTable columns={columns} data={transactions} rowActions={rowActions} searchable searchPlaceholder="Search transactions..." rowKey={(row) => row.id} />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'settle', txn: null })}
        onConfirm={handleAction}
        title={`${confirmModal.type === 'settle' ? 'Trigger Manual Settlement' : confirmModal.type === 'escalate' ? 'Escalate Transaction' : 'Assign to Ops'}`}
        message={`Are you sure you want to ${confirmModal.type} this transaction?`}
        confirmText={confirmModal.type === 'settle' ? 'Settle' : confirmModal.type === 'escalate' ? 'Escalate' : 'Assign'}
        variant={confirmModal.type === 'escalate' ? 'danger' : 'info'}
        requireReason
        isLoading={isLoading}
      />
    </div>
  );
}
