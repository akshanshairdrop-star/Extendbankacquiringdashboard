import { useState } from 'react';
import { Eye, Clock, DollarSign, AlertTriangle, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '@/app/components/KPICard';
import { DataTable, Column, RowAction } from '@/app/components/DataTable';
import { ConfirmationModal } from '@/app/components/ConfirmationModal';
import { Drawer } from '@/app/components/Drawer';

interface SettlementRisk {
  id: string;
  merchant: string;
  exposure: string;
  holdAmount: string;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'hold' | 'review';
  daysOutstanding: number;
}

const mockData: SettlementRisk[] = [
  { id: '1', merchant: 'Amazon', exposure: '₹15.2 Cr', holdAmount: '₹0', riskLevel: 'low', status: 'active', daysOutstanding: 2 },
  { id: '2', merchant: 'Flipkart', exposure: '₹12.8 Cr', holdAmount: '₹2.4 Cr', riskLevel: 'medium', status: 'hold', daysOutstanding: 5 },
  { id: '3', merchant: 'Zomato', exposure: '₹18.9 Cr', holdAmount: '₹5.2 Cr', riskLevel: 'high', status: 'hold', daysOutstanding: 12 },
];

export function SettlementRiskPage() {
  const [settlements, setSettlements] = useState(mockData);
  const [selectedSettlement, setSelectedSettlement] = useState<SettlementRisk | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'hold' | 'release'; settlement: SettlementRisk | null }>({ isOpen: false, type: 'hold', settlement: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = (reason?: string) => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: `${confirmModal.type === 'hold' ? 'Placing' : 'Releasing'} hold...`,
        success: () => {
          setSettlements(prev => prev.map(s => s.id === confirmModal.settlement?.id ? { ...s, status: confirmModal.type === 'hold' ? 'hold' : 'active' } : s));
          setConfirmModal({ isOpen: false, type: 'hold', settlement: null });
          setIsLoading(false);
          return `Hold ${confirmModal.type === 'hold' ? 'placed' : 'released'} successfully`;
        },
        error: 'Action failed',
      }
    );
  };

  const columns: Column<SettlementRisk>[] = [
    { key: 'merchant', label: 'Merchant', sortable: true, render: (row) => <span className="font-medium">{row.merchant}</span> },
    { key: 'exposure', label: 'Total Exposure', sortable: true, render: (row) => <span className="font-bold text-[#1a1339]">{row.exposure}</span> },
    { key: 'holdAmount', label: 'Hold Amount', sortable: true, render: (row) => <span className={`font-semibold ${row.holdAmount !== '₹0' ? 'text-[#f59f0a]' : 'text-[#635c8a]'}`}>{row.holdAmount}</span> },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      sortable: true,
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          row.riskLevel === 'low' ? 'bg-[#eaf6f0] text-[#34b277]' :
          row.riskLevel === 'medium' ? 'bg-[#fef3e8] text-[#f59f0a]' :
          'bg-[#f9ecec] text-[#d74242]'
        }`}>
          {row.riskLevel.toUpperCase()}
        </span>
      )
    },
    { key: 'daysOutstanding', label: 'Days Outstanding', sortable: true, render: (row) => <span className={`font-bold ${row.daysOutstanding > 7 ? 'text-[#d74242]' : row.daysOutstanding > 3 ? 'text-[#f59f0a]' : 'text-[#34b277]'}`}>{row.daysOutstanding}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          row.status === 'active' ? 'bg-[#eaf6f0] text-[#34b277]' :
          row.status === 'hold' ? 'bg-[#f9ecec] text-[#d74242]' :
          'bg-[#fef3e8] text-[#f59f0a]'
        }`}>
          {row.status.toUpperCase()}
        </span>
      )
    },
  ];

  const rowActions: RowAction<SettlementRisk>[] = [
    { label: 'View Exposure Breakdown', icon: <Eye className="w-4 h-4" />, onClick: (settlement) => { setSelectedSettlement(settlement); setIsDrawerOpen(true); } },
    { label: 'Place Hold', icon: <Clock className="w-4 h-4" />, onClick: (settlement) => setConfirmModal({ isOpen: true, type: 'hold', settlement }), variant: 'danger', show: (settlement) => settlement.status !== 'hold' },
    { label: 'Release Hold', icon: <Shield className="w-4 h-4" />, onClick: (settlement) => setConfirmModal({ isOpen: true, type: 'release', settlement }), show: (settlement) => settlement.status === 'hold' },
  ];

  const totalExposure = '₹46.9 Cr';
  const totalHold = '₹7.6 Cr';
  const highRisk = settlements.filter(s => s.riskLevel === 'high').length;

  return (
    <div className="p-6 space-y-6">
      <div><h2 className="text-2xl font-bold text-[#1a1339]">Settlement Risk</h2><p className="text-[#635c8a] text-sm mt-1">Monitor settlement exposure and risk</p></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Exposure" value={totalExposure} subtitle="Across all merchants" icon={DollarSign} />
        <KPICard title="On Hold" value={totalHold} subtitle="Blocked amount" icon={Clock} />
        <KPICard title="High Risk" value={highRisk.toString()} subtitle="Merchants" icon={AlertTriangle} />
        <KPICard title="Active Settlements" value={settlements.filter(s => s.status === 'active').length.toString()} subtitle="Processing" icon={Shield} />
      </div>
      <DataTable columns={columns} data={settlements} rowActions={rowActions} searchable searchPlaceholder="Search merchants..." rowKey={(row) => row.id} />
      
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Exposure Breakdown" size="lg">
        {selectedSettlement && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Merchant</label><p className="text-[#1a1339] font-semibold">{selectedSettlement.merchant}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Risk Level</label><p className={`font-bold ${selectedSettlement.riskLevel === 'low' ? 'text-[#34b277]' : selectedSettlement.riskLevel === 'medium' ? 'text-[#f59f0a]' : 'text-[#d74242]'}`}>{selectedSettlement.riskLevel.toUpperCase()}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Total Exposure</label><p className="text-[#1a1339] font-bold text-lg">{selectedSettlement.exposure}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Hold Amount</label><p className="text-[#f59f0a] font-bold text-lg">{selectedSettlement.holdAmount}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Days Outstanding</label><p className="text-[#1a1339] font-bold">{selectedSettlement.daysOutstanding}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Status</label><p className={`font-bold ${selectedSettlement.status === 'active' ? 'text-[#34b277]' : 'text-[#d74242]'}`}>{selectedSettlement.status.toUpperCase()}</p></div>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'hold', settlement: null })}
        onConfirm={handleAction}
        title={confirmModal.type === 'hold' ? 'Place Settlement Hold' : 'Release Settlement Hold'}
        message={`Are you sure you want to ${confirmModal.type === 'hold' ? 'place a hold on' : 'release the hold for'} ${confirmModal.settlement?.merchant}?`}
        confirmText={confirmModal.type === 'hold' ? 'Place Hold' : 'Release Hold'}
        variant={confirmModal.type === 'hold' ? 'danger' : 'info'}
        requireReason
        isLoading={isLoading}
      />
    </div>
  );
}
