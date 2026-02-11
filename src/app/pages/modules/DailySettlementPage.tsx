import { useState } from 'react';
import { Download, Eye, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '@/app/components/KPICard';
import { DataTable, Column, RowAction } from '@/app/components/DataTable';
import { ConfirmationModal } from '@/app/components/ConfirmationModal';
import { Drawer } from '@/app/components/Drawer';

interface Settlement {
  id: string;
  cycleId: string;
  date: string;
  totalAmount: string;
  merchants: number;
  status: 'approved' | 'pending' | 'hold';
  transactions: number;
}

const mockSettlements: Settlement[] = [
  { id: '1', cycleId: 'CYC001', date: '2026-01-23', totalAmount: '₹45.8 Cr', merchants: 125, status: 'approved', transactions: 15420 },
  { id: '2', cycleId: 'CYC002', date: '2026-01-22', totalAmount: '₹38.9 Cr', merchants: 115, status: 'pending', transactions: 14230 },
  { id: '3', cycleId: 'CYC003', date: '2026-01-21', totalAmount: '₹42.2 Cr', merchants: 118, status: 'hold', transactions: 13890 },
];

export function DailySettlementPage() {
  const [settlements, setSettlements] = useState(mockSettlements);
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'approve' | 'hold'; settlement: Settlement | null }>({ isOpen: false, type: 'approve', settlement: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = (reason?: string) => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `${confirmModal.type}ing settlement...`,
        success: () => {
          setSettlements(prev => prev.map(s => s.id === confirmModal.settlement?.id ? { ...s, status: confirmModal.type === 'approve' ? 'approved' : 'hold' } : s));
          setConfirmModal({ isOpen: false, type: 'approve', settlement: null });
          setIsLoading(false);
          return `Settlement ${confirmModal.type}d successfully`;
        },
        error: 'Action failed',
      }
    );
  };

  const columns: Column<Settlement>[] = [
    { key: 'cycleId', label: 'Cycle ID', sortable: true, render: (row) => <span className="font-mono text-[#4b1b91]">{row.cycleId}</span> },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'totalAmount', label: 'Total Amount', sortable: true, render: (row) => <span className="font-bold text-[#1a1339]">{row.totalAmount}</span> },
    { key: 'merchants', label: 'Merchants', sortable: true },
    { key: 'transactions', label: 'Transactions', sortable: true, render: (row) => <span className="font-mono">{row.transactions.toLocaleString()}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          row.status === 'approved' ? 'bg-[#eaf6f0] text-[#34b277]' :
          row.status === 'pending' ? 'bg-[#fef3e8] text-[#f59f0a]' :
          'bg-[#f9ecec] text-[#d74242]'
        }`}>
          {row.status.toUpperCase()}
        </span>
      )
    },
  ];

  const rowActions: RowAction<Settlement>[] = [
    { label: 'View Details', icon: <Eye className="w-4 h-4" />, onClick: (settlement) => { setSelectedSettlement(settlement); setIsDrawerOpen(true); } },
    { label: 'Approve Settlement', icon: <CheckCircle className="w-4 h-4" />, onClick: (settlement) => setConfirmModal({ isOpen: true, type: 'approve', settlement }), show: (settlement) => settlement.status === 'pending' },
    { label: 'Hold Settlement', icon: <Clock className="w-4 h-4" />, onClick: (settlement) => setConfirmModal({ isOpen: true, type: 'hold', settlement }), variant: 'warning', show: (settlement) => settlement.status !== 'hold' },
    { label: 'Export', icon: <Download className="w-4 h-4" />, onClick: (settlement) => toast.success(`Exporting ${settlement.cycleId}`) },
  ];

  const approved = settlements.filter(s => s.status === 'approved').length;
  const pending = settlements.filter(s => s.status === 'pending').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-[#1a1339]">Daily Settlement</h2><p className="text-[#635c8a] text-sm mt-1">Manage daily settlement cycles</p></div>
        <button onClick={() => toast.success('Report exported')} className="flex items-center gap-2 px-4 py-2 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575]"><Download className="w-4 h-4" />Export All</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Cycles" value={settlements.length.toString()} subtitle="Last 7 days" icon={Clock} />
        <KPICard title="Approved" value={approved.toString()} subtitle="Completed" icon={CheckCircle} />
        <KPICard title="Pending" value={pending.toString()} subtitle="Awaiting approval" icon={Clock} />
        <KPICard title="Total Amount" value="₹126.9 Cr" subtitle="This week" icon={Download} />
      </div>

      <DataTable columns={columns} data={settlements} rowActions={rowActions} searchable searchPlaceholder="Search settlements..." rowKey={(row) => row.id} />

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Settlement Details" size="lg">
        {selectedSettlement && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Cycle ID</label><p className="text-[#1a1339] font-mono">{selectedSettlement.cycleId}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Date</label><p className="text-[#1a1339]">{selectedSettlement.date}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Total Amount</label><p className="text-[#1a1339] font-bold text-lg">{selectedSettlement.totalAmount}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Merchants</label><p className="text-[#1a1339] font-bold">{selectedSettlement.merchants}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Transactions</label><p className="text-[#1a1339] font-bold">{selectedSettlement.transactions.toLocaleString()}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Status</label><p className={`font-bold ${selectedSettlement.status === 'approved' ? 'text-[#34b277]' : selectedSettlement.status === 'pending' ? 'text-[#f59f0a]' : 'text-[#d74242]'}`}>{selectedSettlement.status.toUpperCase()}</p></div>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'approve', settlement: null })}
        onConfirm={handleAction}
        title={`${confirmModal.type === 'approve' ? 'Approve' : 'Hold'} Settlement`}
        message={`Are you sure you want to ${confirmModal.type} this settlement cycle?`}
        confirmText={confirmModal.type === 'approve' ? 'Approve' : 'Hold'}
        variant={confirmModal.type === 'hold' ? 'warning' : 'info'}
        requireReason={confirmModal.type === 'hold'}
        isLoading={isLoading}
      />
    </div>
  );
}
