import { useState } from 'react';
import { Eye, Shield, Clock, AlertTriangle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '@/app/components/KPICard';
import { DataTable, Column, RowAction } from '@/app/components/DataTable';
import { ConfirmationModal } from '@/app/components/ConfirmationModal';

interface MerchantRisk {
  id: string;
  merchantId: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  settlementStatus: 'active' | 'hold';
  exposure: string;
  lastReview: string;
}

const mockData: MerchantRisk[] = [
  { id: '1', merchantId: 'MER001', name: 'Amazon', riskLevel: 'low', riskScore: 25, settlementStatus: 'active', exposure: '₹15.2 Cr', lastReview: '2026-01-20' },
  { id: '2', merchantId: 'MER002', name: 'Flipkart', riskLevel: 'medium', riskScore: 55, settlementStatus: 'active', exposure: '₹12.8 Cr', lastReview: '2026-01-18' },
  { id: '3', merchantId: 'MER003', name: 'Zomato', riskLevel: 'high', riskScore: 78, settlementStatus: 'hold', exposure: '₹8.5 Cr', lastReview: '2026-01-15' },
  { id: '4', merchantId: 'MER004', name: 'Paytm Mall', riskLevel: 'critical', riskScore: 92, settlementStatus: 'hold', exposure: '₹18.9 Cr', lastReview: '2026-01-10' },
];

export function MerchantRiskPage() {
  const [merchants, setMerchants] = useState(mockData);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'hold' | 'release' | 'note'; merchant: MerchantRisk | null }>({ isOpen: false, type: 'hold', merchant: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = (reason?: string) => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: `Processing ${confirmModal.type}...`,
        success: () => {
          if (confirmModal.type !== 'note') {
            setMerchants(prev => prev.map(m => m.id === confirmModal.merchant?.id ? { ...m, settlementStatus: confirmModal.type === 'hold' ? 'hold' : 'active' } : m));
          }
          setConfirmModal({ isOpen: false, type: 'hold', merchant: null });
          setIsLoading(false);
          return `Action completed successfully`;
        },
        error: 'Action failed',
      }
    );
  };

  const columns: Column<MerchantRisk>[] = [
    { key: 'merchantId', label: 'Merchant ID', sortable: true, render: (row) => <span className="font-mono text-[#4b1b91]">{row.merchantId}</span> },
    { key: 'name', label: 'Merchant Name', sortable: true, render: (row) => <span className="font-medium">{row.name}</span> },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      sortable: true,
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          row.riskLevel === 'low' ? 'bg-[#eaf6f0] text-[#34b277]' :
          row.riskLevel === 'medium' ? 'bg-[#fef3e8] text-[#f59f0a]' :
          row.riskLevel === 'high' ? 'bg-[#f9ecec] text-[#d74242]' :
          'bg-[#d74242] text-white'
        }`}>
          {row.riskLevel.toUpperCase()}
        </span>
      )
    },
    { key: 'riskScore', label: 'Score', sortable: true, render: (row) => <span className="font-mono">{row.riskScore}</span> },
    {
      key: 'settlementStatus',
      label: 'Settlement',
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${row.settlementStatus === 'active' ? 'bg-[#eaf6f0] text-[#34b277]' : 'bg-[#f9ecec] text-[#d74242]'}`}>
          {row.settlementStatus.toUpperCase()}
        </span>
      )
    },
    { key: 'exposure', label: 'Exposure', sortable: true, render: (row) => <span className="font-semibold">{row.exposure}</span> },
    { key: 'lastReview', label: 'Last Review', sortable: true, render: (row) => <span className="text-[#635c8a]">{row.lastReview}</span> },
  ];

  const rowActions: RowAction<MerchantRisk>[] = [
    { label: 'View Profile', icon: <Eye className="w-4 h-4" />, onClick: (merchant) => toast.info(`Viewing ${merchant.name}`) },
    { label: 'Apply Settlement Hold', icon: <Clock className="w-4 h-4" />, onClick: (merchant) => setConfirmModal({ isOpen: true, type: 'hold', merchant }), variant: 'danger', show: (merchant) => merchant.settlementStatus === 'active' },
    { label: 'Release Settlement Hold', icon: <Shield className="w-4 h-4" />, onClick: (merchant) => setConfirmModal({ isOpen: true, type: 'release', merchant }), show: (merchant) => merchant.settlementStatus === 'hold' },
    { label: 'Add Manual Note', icon: <FileText className="w-4 h-4" />, onClick: (merchant) => setConfirmModal({ isOpen: true, type: 'note', merchant }) },
  ];

  const highRisk = merchants.filter(m => m.riskLevel === 'high' || m.riskLevel === 'critical').length;
  const onHold = merchants.filter(m => m.settlementStatus === 'hold').length;

  return (
    <div className="p-6 space-y-6">
      <div><h2 className="text-2xl font-bold text-[#1a1339]">Merchant Risk Monitoring</h2><p className="text-[#635c8a] text-sm mt-1">Monitor merchant risk profiles</p></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Merchants" value={merchants.length.toString()} subtitle="Being monitored" icon={Shield} />
        <KPICard title="High/Critical Risk" value={highRisk.toString()} subtitle="Requires attention" icon={AlertTriangle} />
        <KPICard title="Settlement On Hold" value={onHold.toString()} subtitle="Blocked" icon={Clock} />
        <KPICard title="Avg Risk Score" value="63" subtitle="Portfolio average" icon={AlertTriangle} />
      </div>
      <DataTable columns={columns} data={merchants} rowActions={rowActions} searchable searchPlaceholder="Search merchants..." rowKey={(row) => row.id} />
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'hold', merchant: null })}
        onConfirm={handleAction}
        title={confirmModal.type === 'hold' ? 'Apply Settlement Hold' : confirmModal.type === 'release' ? 'Release Settlement Hold' : 'Add Manual Note'}
        message={`Are you sure you want to ${confirmModal.type === 'hold' ? 'apply settlement hold' : confirmModal.type === 'release' ? 'release settlement hold' : 'add a note'} for ${confirmModal.merchant?.name}?`}
        confirmText={confirmModal.type === 'hold' ? 'Apply Hold' : confirmModal.type === 'release' ? 'Release' : 'Add Note'}
        variant={confirmModal.type === 'hold' ? 'danger' : 'info'}
        requireReason
        isLoading={isLoading}
      />
    </div>
  );
}
