import { useState } from 'react';
import { Eye, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '@/app/components/KPICard';
import { DataTable, Column, RowAction } from '@/app/components/DataTable';
import { ConfirmationModal } from '@/app/components/ConfirmationModal';
import { Drawer } from '@/app/components/Drawer';

interface ReconRecord {
  id: string;
  txnId: string;
  bankRecord: string;
  npciRecord: string;
  merchantRecord: string;
  amount: string;
  status: 'matched' | 'mismatch' | 'pending';
  date: string;
}

const mockRecords: ReconRecord[] = [
  { id: '1', txnId: 'TXN001', bankRecord: '✓', npciRecord: '✓', merchantRecord: '✓', amount: '₹2,450', status: 'matched', date: '2026-01-23' },
  { id: '2', txnId: 'TXN002', bankRecord: '✓', npciRecord: '✓', merchantRecord: '✗', amount: '₹899', status: 'mismatch', date: '2026-01-23' },
  { id: '3', txnId: 'TXN003', bankRecord: '✓', npciRecord: '✗', merchantRecord: '✓', amount: '₹15,250', status: 'mismatch', date: '2026-01-23' },
];

export function ThreeWayReconPage() {
  const [records, setRecords] = useState(mockRecords);
  const [selectedRecord, setSelectedRecord] = useState<ReconRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'approve' | 'exception'; record: ReconRecord | null }>({ isOpen: false, type: 'approve', record: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = (reason?: string) => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Processing ${confirmModal.type}...`,
        success: () => {
          if (confirmModal.type === 'approve') {
            setRecords(prev => prev.map(r => r.id === confirmModal.record?.id ? { ...r, status: 'matched' as const } : r));
          }
          setConfirmModal({ isOpen: false, type: 'approve', record: null });
          setIsLoading(false);
          return `Match ${confirmModal.type}d successfully`;
        },
        error: 'Action failed',
      }
    );
  };

  const columns: Column<ReconRecord>[] = [
    { key: 'txnId', label: 'Transaction ID', sortable: true, render: (row) => <span className="font-mono text-[#4b1b91]">{row.txnId}</span> },
    { key: 'bankRecord', label: 'Bank', render: (row) => <span className={row.bankRecord === '✓' ? 'text-[#34b277]' : 'text-[#d74242]'}>{row.bankRecord}</span> },
    { key: 'npciRecord', label: 'NPCI', render: (row) => <span className={row.npciRecord === '✓' ? 'text-[#34b277]' : 'text-[#d74242]'}>{row.npciRecord}</span> },
    { key: 'merchantRecord', label: 'Merchant', render: (row) => <span className={row.merchantRecord === '✓' ? 'text-[#34b277]' : 'text-[#d74242]'}>{row.merchantRecord}</span> },
    { key: 'amount', label: 'Amount', sortable: true, render: (row) => <span className="font-semibold">{row.amount}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          row.status === 'matched' ? 'bg-[#eaf6f0] text-[#34b277]' :
          row.status === 'mismatch' ? 'bg-[#f9ecec] text-[#d74242]' :
          'bg-[#fef3e8] text-[#f59f0a]'
        }`}>
          {row.status.toUpperCase()}
        </span>
      )
    },
    { key: 'date', label: 'Date', sortable: true },
  ];

  const rowActions: RowAction<ReconRecord>[] = [
    { label: 'View Details', icon: <Eye className="w-4 h-4" />, onClick: (record) => { setSelectedRecord(record); setIsDrawerOpen(true); } },
    { label: 'Approve Match', icon: <CheckCircle className="w-4 h-4" />, onClick: (record) => setConfirmModal({ isOpen: true, type: 'approve', record }), show: (record) => record.status === 'pending' },
    { label: 'Raise Exception', icon: <AlertCircle className="w-4 h-4" />, onClick: (record) => setConfirmModal({ isOpen: true, type: 'exception', record }), variant: 'danger', show: (record) => record.status === 'mismatch' },
  ];

  const matched = records.filter(r => r.status === 'matched').length;
  const mismatched = records.filter(r => r.status === 'mismatch').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-[#1a1339]">3-Way Reconciliation</h2><p className="text-[#635c8a] text-sm mt-1">Bank, NPCI & Merchant reconciliation</p></div>
        <button onClick={() => toast.info('Refreshing...')} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e6e2e9] rounded-lg hover:bg-gray-50"><RefreshCw className="w-4 h-4" />Refresh</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Records" value={records.length.toString()} subtitle="Today" icon={RefreshCw} />
        <KPICard title="Matched" value={matched.toString()} subtitle="All sources match" icon={CheckCircle} />
        <KPICard title="Mismatched" value={mismatched.toString()} subtitle="Requires attention" icon={AlertCircle} />
        <KPICard title="Success Rate" value={`${Math.round((matched / records.length) * 100)}%`} subtitle="Match percentage" icon={CheckCircle} />
      </div>

      <DataTable columns={columns} data={records} rowActions={rowActions} searchable searchPlaceholder="Search transactions..." rowKey={(row) => row.id} />

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Reconciliation Details" size="lg">
        {selectedRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Transaction ID</label><p className="text-[#1a1339] font-mono">{selectedRecord.txnId}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Amount</label><p className="text-[#1a1339] font-bold">{selectedRecord.amount}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Bank Record</label><p className={selectedRecord.bankRecord === '✓' ? 'text-[#34b277] font-bold' : 'text-[#d74242] font-bold'}>{selectedRecord.bankRecord} {selectedRecord.bankRecord === '✓' ? 'Present' : 'Missing'}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">NPCI Record</label><p className={selectedRecord.npciRecord === '✓' ? 'text-[#34b277] font-bold' : 'text-[#d74242] font-bold'}>{selectedRecord.npciRecord} {selectedRecord.npciRecord === '✓' ? 'Present' : 'Missing'}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Merchant Record</label><p className={selectedRecord.merchantRecord === '✓' ? 'text-[#34b277] font-bold' : 'text-[#d74242] font-bold'}>{selectedRecord.merchantRecord} {selectedRecord.merchantRecord === '✓' ? 'Present' : 'Missing'}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Status</label><p className={`font-bold ${selectedRecord.status === 'matched' ? 'text-[#34b277]' : 'text-[#d74242]'}`}>{selectedRecord.status.toUpperCase()}</p></div>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'approve', record: null })}
        onConfirm={handleAction}
        title={confirmModal.type === 'approve' ? 'Approve Match' : 'Raise Exception'}
        message={`Are you sure you want to ${confirmModal.type} this reconciliation?`}
        confirmText={confirmModal.type === 'approve' ? 'Approve' : 'Raise Exception'}
        variant={confirmModal.type === 'exception' ? 'danger' : 'info'}
        requireReason={confirmModal.type === 'exception'}
        isLoading={isLoading}
      />
    </div>
  );
}
