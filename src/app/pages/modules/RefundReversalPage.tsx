import { useState } from 'react';
import { RefreshCw, Eye, Send, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '@/app/components/KPICard';
import { DataTable, Column, RowAction } from '@/app/components/DataTable';
import { ConfirmationModal } from '@/app/components/ConfirmationModal';

interface Refund {
  id: string;
  refundId: string;
  txnId: string;
  merchant: string;
  amount: string;
  type: 'refund' | 'reversal';
  status: 'success' | 'failed' | 'pending';
  date: string;
}

const mockData: Refund[] = [
  { id: '1', refundId: 'REF001', txnId: 'TXN001', merchant: 'Amazon', amount: '₹2,450', type: 'refund', status: 'success', date: '2026-01-23' },
  { id: '2', refundId: 'REF002', txnId: 'TXN002', merchant: 'Flipkart', amount: '₹899', type: 'refund', status: 'failed', date: '2026-01-23' },
  { id: '3', refundId: 'REV001', txnId: 'TXN003', merchant: 'Swiggy', amount: '₹450', type: 'reversal', status: 'pending', date: '2026-01-23' },
];

export function RefundReversalPage() {
  const [refunds, setRefunds] = useState(mockData);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'initiate' | 'retry'; refund: Refund | null }>({ isOpen: false, type: 'initiate', refund: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = (reason?: string) => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `${confirmModal.type === 'initiate' ? 'Initiating' : 'Retrying'} refund...`,
        success: () => {
          setConfirmModal({ isOpen: false, type: 'initiate', refund: null });
          setIsLoading(false);
          return `Refund ${confirmModal.type}d successfully`;
        },
        error: 'Action failed',
      }
    );
  };

  const columns: Column<Refund>[] = [
    { key: 'refundId', label: 'Refund ID', sortable: true, render: (row) => <span className="font-mono text-[#4b1b91]">{row.refundId}</span> },
    { key: 'txnId', label: 'Transaction ID', sortable: true, render: (row) => <span className="font-mono text-[#635c8a]">{row.txnId}</span> },
    { key: 'merchant', label: 'Merchant', sortable: true, render: (row) => <span className="font-medium">{row.merchant}</span> },
    { key: 'amount', label: 'Amount', sortable: true, render: (row) => <span className="font-semibold">{row.amount}</span> },
    { key: 'type', label: 'Type', render: (row) => <span className={`px-3 py-1 rounded-md text-xs font-medium ${row.type === 'refund' ? 'bg-[#eaf6f0] text-[#34b277]' : 'bg-[#f5effb] text-[#4b1b91]'}`}>{row.type}</span> },
    { key: 'status', label: 'Status', render: (row) => <span className={`px-3 py-1 rounded-md text-xs font-medium ${row.status === 'success' ? 'bg-[#eaf6f0] text-[#34b277]' : row.status === 'failed' ? 'bg-[#f9ecec] text-[#d74242]' : 'bg-[#fef3e8] text-[#f59f0a]'}`}>{row.status}</span> },
    { key: 'date', label: 'Date', sortable: true },
  ];

  const rowActions: RowAction<Refund>[] = [
    { label: 'View Details', icon: <Eye className="w-4 h-4" />, onClick: (refund) => toast.info(`Viewing ${refund.refundId}`) },
    { label: 'Retry Failed Refund', icon: <RefreshCw className="w-4 h-4" />, onClick: (refund) => setConfirmModal({ isOpen: true, type: 'retry', refund }), variant: 'warning', show: (refund) => refund.status === 'failed' },
    { label: 'Initiate Refund', icon: <Send className="w-4 h-4" />, onClick: (refund) => setConfirmModal({ isOpen: true, type: 'initiate', refund }), show: (refund) => refund.status === 'pending' },
  ];

  const successCount = refunds.filter(r => r.status === 'success').length;
  const failedCount = refunds.filter(r => r.status === 'failed').length;

  return (
    <div className="p-6 space-y-6">
      <div><h2 className="text-2xl font-bold text-[#1a1339]">Refund & Reversal Reconciliation</h2><p className="text-[#635c8a] text-sm mt-1">Manage refunds and reversals</p></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Refunds" value={refunds.length.toString()} subtitle="Today" icon={RefreshCw} />
        <KPICard title="Successful" value={successCount.toString()} subtitle="Completed" icon={CheckCircle} />
        <KPICard title="Failed" value={failedCount.toString()} subtitle="Requires retry" icon={AlertCircle} />
        <KPICard title="Pending" value={refunds.filter(r => r.status === 'pending').length.toString()} subtitle="In progress" icon={Clock} />
      </div>
      <DataTable columns={columns} data={refunds} rowActions={rowActions} searchable searchPlaceholder="Search refunds..." rowKey={(row) => row.id} />
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'initiate', refund: null })}
        onConfirm={handleAction}
        title={confirmModal.type === 'initiate' ? 'Initiate Refund' : 'Retry Failed Refund'}
        message={`Are you sure you want to ${confirmModal.type} this refund?`}
        confirmText={confirmModal.type === 'initiate' ? 'Initiate' : 'Retry'}
        variant="info"
        requireReason
        isLoading={isLoading}
      />
    </div>
  );
}
