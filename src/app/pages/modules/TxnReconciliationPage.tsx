import { useState } from 'react';
import { Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '@/app/components/KPICard';
import { DataTable, Column, RowAction } from '@/app/components/DataTable';
import { ConfirmationModal } from '@/app/components/ConfirmationModal';

interface TxnRecon {
  id: string;
  txnId: string;
  amount: string;
  bankStatus: 'matched' | 'mismatch';
  merchantStatus: 'matched' | 'mismatch';
  status: 'reconciled' | 'unreconciled';
  date: string;
}

const mockData: TxnRecon[] = [
  { id: '1', txnId: 'TXN001', amount: '₹2,450', bankStatus: 'matched', merchantStatus: 'matched', status: 'reconciled', date: '2026-01-23' },
  { id: '2', txnId: 'TXN002', amount: '₹899', bankStatus: 'matched', merchantStatus: 'mismatch', status: 'unreconciled', date: '2026-01-23' },
  { id: '3', txnId: 'TXN003', amount: '₹15,250', bankStatus: 'mismatch', merchantStatus: 'matched', status: 'unreconciled', date: '2026-01-23' },
];

export function TxnReconciliationPage() {
  const [records, setRecords] = useState(mockData);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'resolve'; record: TxnRecon | null }>({ isOpen: false, type: 'resolve', record: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleResolve = (reason?: string) => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Resolving...',
        success: () => {
          setRecords(prev => prev.map(r => r.id === confirmModal.record?.id ? { ...r, status: 'reconciled' as const } : r));
          setConfirmModal({ isOpen: false, type: 'resolve', record: null });
          setIsLoading(false);
          return 'Transaction reconciled';
        },
        error: 'Failed',
      }
    );
  };

  const columns: Column<TxnRecon>[] = [
    { key: 'txnId', label: 'Transaction ID', sortable: true, render: (row) => <span className="font-mono text-[#4b1b91]">{row.txnId}</span> },
    { key: 'amount', label: 'Amount', sortable: true, render: (row) => <span className="font-semibold">{row.amount}</span> },
    { key: 'bankStatus', label: 'Bank', render: (row) => <span className={`px-2 py-1 rounded text-xs ${row.bankStatus === 'matched' ? 'bg-[#eaf6f0] text-[#34b277]' : 'bg-[#f9ecec] text-[#d74242]'}`}>{row.bankStatus}</span> },
    { key: 'merchantStatus', label: 'Merchant', render: (row) => <span className={`px-2 py-1 rounded text-xs ${row.merchantStatus === 'matched' ? 'bg-[#eaf6f0] text-[#34b277]' : 'bg-[#f9ecec] text-[#d74242]'}`}>{row.merchantStatus}</span> },
    { key: 'status', label: 'Status', render: (row) => <span className={`px-3 py-1 rounded-md text-xs font-medium ${row.status === 'reconciled' ? 'bg-[#eaf6f0] text-[#34b277]' : 'bg-[#fef3e8] text-[#f59f0a]'}`}>{row.status}</span> },
    { key: 'date', label: 'Date', sortable: true },
  ];

  const rowActions: RowAction<TxnRecon>[] = [
    { label: 'View Details', icon: <Eye className="w-4 h-4" />, onClick: (record) => toast.info(`Viewing ${record.txnId}`) },
    { label: 'Mark Resolved', icon: <CheckCircle className="w-4 h-4" />, onClick: (record) => setConfirmModal({ isOpen: true, type: 'resolve', record }), show: (record) => record.status === 'unreconciled' },
  ];

  const reconciled = records.filter(r => r.status === 'reconciled').length;
  const unreconciled = records.filter(r => r.status === 'unreconciled').length;

  return (
    <div className="p-6 space-y-6">
      <div><h2 className="text-2xl font-bold text-[#1a1339]">Transaction Level Reconciliation</h2><p className="text-[#635c8a] text-sm mt-1">Reconcile individual transactions</p></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Transactions" value={records.length.toString()} subtitle="Today" icon={AlertCircle} />
        <KPICard title="Reconciled" value={reconciled.toString()} subtitle="Matched" icon={CheckCircle} />
        <KPICard title="Unreconciled" value={unreconciled.toString()} subtitle="Requires attention" icon={AlertCircle} />
        <KPICard title="Success Rate" value={`${Math.round((reconciled / records.length) * 100)}%`} subtitle="Reconciliation rate" icon={CheckCircle} />
      </div>
      <DataTable columns={columns} data={records} rowActions={rowActions} searchable searchPlaceholder="Search transactions..." rowKey={(row) => row.id} />
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'resolve', record: null })}
        onConfirm={handleResolve}
        title="Mark as Resolved"
        message="Are you sure you want to mark this transaction as reconciled?"
        confirmText="Resolve"
        variant="info"
        requireReason
        isLoading={isLoading}
      />
    </div>
  );
}
