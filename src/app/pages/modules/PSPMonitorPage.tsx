import { useState } from 'react';
import { Eye, AlertCircle, FileText, Building2, Activity, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '@/app/components/KPICard';
import { DataTable, Column, RowAction } from '@/app/components/DataTable';
import { ConfirmationModal } from '@/app/components/ConfirmationModal';

interface PSP {
  id: string;
  pspId: string;
  name: string;
  status: 'active' | 'degraded' | 'down';
  uptime: string;
  tps: number;
  successRate: string;
  lastIncident: string;
}

const mockData: PSP[] = [
  { id: '1', pspId: 'PSP001', name: 'PhonePe', status: 'active', uptime: '99.8%', tps: 245, successRate: '98.2%', lastIncident: '2026-01-15' },
  { id: '2', pspId: 'PSP002', name: 'Google Pay', status: 'active', uptime: '99.9%', tps: 312, successRate: '97.8%', lastIncident: '2026-01-10' },
  { id: '3', pspId: 'PSP003', name: 'Paytm', status: 'degraded', uptime: '95.4%', tps: 89, successRate: '92.1%', lastIncident: '2026-01-23' },
  { id: '4', pspId: 'PSP004', name: 'BHIM', status: 'down', uptime: '78.2%', tps: 0, successRate: '0%', lastIncident: '2026-01-23' },
];

export function PSPMonitorPage() {
  const [psps, setPsps] = useState(mockData);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'escalate' | 'observe'; psp: PSP | null }>({ isOpen: false, type: 'escalate', psp: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = (reason?: string) => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: `Processing ${confirmModal.type}...`,
        success: () => {
          setConfirmModal({ isOpen: false, type: 'escalate', psp: null });
          setIsLoading(false);
          return `${confirmModal.type === 'escalate' ? 'PSP escalated' : 'Observation added'}`;
        },
        error: 'Action failed',
      }
    );
  };

  const columns: Column<PSP>[] = [
    { key: 'pspId', label: 'PSP ID', sortable: true, render: (row) => <span className="font-mono text-[#4b1b91]">{row.pspId}</span> },
    { key: 'name', label: 'PSP Name', sortable: true, render: (row) => <span className="font-medium">{row.name}</span> },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          row.status === 'active' ? 'bg-[#eaf6f0] text-[#34b277]' :
          row.status === 'degraded' ? 'bg-[#fef3e8] text-[#f59f0a]' :
          'bg-[#f9ecec] text-[#d74242]'
        }`}>
          {row.status.toUpperCase()}
        </span>
      )
    },
    { key: 'uptime', label: 'Uptime', sortable: true, render: (row) => <span className={`font-mono ${parseFloat(row.uptime) < 95 ? 'text-[#d74242]' : 'text-[#34b277]'}`}>{row.uptime}</span> },
    { key: 'tps', label: 'TPS', sortable: true, render: (row) => <span className="font-mono">{row.tps}</span> },
    { key: 'successRate', label: 'Success Rate', sortable: true, render: (row) => <span className={`font-mono ${parseFloat(row.successRate) < 95 ? 'text-[#d74242]' : 'text-[#34b277]'}`}>{row.successRate}</span> },
    { key: 'lastIncident', label: 'Last Incident', sortable: true, render: (row) => <span className="text-[#635c8a]">{row.lastIncident}</span> },
  ];

  const rowActions: RowAction<PSP>[] = [
    { label: 'View Details', icon: <Eye className="w-4 h-4" />, onClick: (psp) => toast.info(`Viewing ${psp.name}`) },
    { label: 'Escalate PSP', icon: <AlertCircle className="w-4 h-4" />, onClick: (psp) => setConfirmModal({ isOpen: true, type: 'escalate', psp }), variant: 'danger', show: (psp) => psp.status !== 'active' },
    { label: 'Add Observation', icon: <FileText className="w-4 h-4" />, onClick: (psp) => setConfirmModal({ isOpen: true, type: 'observe', psp }) },
  ];

  const activePSPs = psps.filter(p => p.status === 'active').length;
  const degradedPSPs = psps.filter(p => p.status === 'degraded').length;
  const downPSPs = psps.filter(p => p.status === 'down').length;

  return (
    <div className="p-6 space-y-6">
      <div><h2 className="text-2xl font-bold text-[#1a1339]">PSP / TPAP Monitoring</h2><p className="text-[#635c8a] text-sm mt-1">Monitor payment service providers</p></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total PSPs" value={psps.length.toString()} subtitle="Being monitored" icon={Building2} />
        <KPICard title="Active" value={activePSPs.toString()} subtitle="Operating normally" icon={Activity} />
        <KPICard title="Degraded" value={degradedPSPs.toString()} subtitle="Performance issues" icon={TrendingUp} />
        <KPICard title="Down" value={downPSPs.toString()} subtitle="Not responding" icon={AlertCircle} />
      </div>
      <DataTable columns={columns} data={psps} rowActions={rowActions} searchable searchPlaceholder="Search PSPs..." rowKey={(row) => row.id} />
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'escalate', psp: null })}
        onConfirm={handleAction}
        title={confirmModal.type === 'escalate' ? 'Escalate PSP Issue' : 'Add Observation'}
        message={`${confirmModal.type === 'escalate' ? 'Escalate performance issue for' : 'Add observation for'} ${confirmModal.merchant?.name}?`}
        confirmText={confirmModal.type === 'escalate' ? 'Escalate' : 'Add Note'}
        variant={confirmModal.type === 'escalate' ? 'danger' : 'info'}
        requireReason
        isLoading={isLoading}
      />
    </div>
  );
}
