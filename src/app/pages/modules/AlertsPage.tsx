import { useState } from 'react';
import { Bell, User, CheckCircle, AlertTriangle, Clock, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '@/app/components/KPICard';
import { DataTable, Column, RowAction } from '@/app/components/DataTable';
import { ConfirmationModal } from '@/app/components/ConfirmationModal';

interface Alert {
  id: string;
  alertId: string;
  type: 'fraud' | 'settlement' | 'system';
  severity: 'critical' | 'high' | 'medium' | 'low';
  merchant: string;
  description: string;
  createdAt: string;
  slaRemaining: string;
  status: 'open' | 'assigned' | 'closed';
  assignedTo?: string;
}

const mockAlerts: Alert[] = [
  { id: '1', alertId: 'ALT001', type: 'fraud', severity: 'critical', merchant: 'Amazon', description: 'High velocity transactions detected', createdAt: '2026-01-23 14:30', slaRemaining: '2h 15m', status: 'open' },
  { id: '2', alertId: 'ALT002', type: 'settlement', severity: 'high', merchant: 'Flipkart', description: 'Settlement mismatch detected', createdAt: '2026-01-23 14:00', slaRemaining: '4h 30m', status: 'assigned', assignedTo: 'John Doe' },
  { id: '3', alertId: 'ALT003', type: 'system', severity: 'medium', merchant: 'Swiggy', description: 'API response time degraded', createdAt: '2026-01-23 13:45', slaRemaining: '6h 45m', status: 'open' },
];

export function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'assign' | 'severity' | 'close' | 'escalate'; alert: Alert | null }>({ isOpen: false, type: 'assign', alert: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = (reason?: string) => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: `Processing ${confirmModal.type}...`,
        success: () => {
          if (confirmModal.type === 'close') {
            setAlerts(prev => prev.map(a => a.id === confirmModal.alert?.id ? { ...a, status: 'closed' as const } : a));
          } else if (confirmModal.type === 'assign') {
            setAlerts(prev => prev.map(a => a.id === confirmModal.alert?.id ? { ...a, status: 'assigned' as const, assignedTo: 'Current User' } : a));
          }
          setConfirmModal({ isOpen: false, type: 'assign', alert: null });
          setIsLoading(false);
          return `Alert ${confirmModal.type}ed successfully`;
        },
        error: 'Action failed',
      }
    );
  };

  const columns: Column<Alert>[] = [
    { key: 'alertId', label: 'Alert ID', sortable: true, render: (row) => <span className="font-mono text-[#4b1b91]">{row.alertId}</span> },
    {
      key: 'severity',
      label: 'Severity',
      sortable: true,
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          row.severity === 'critical' ? 'bg-[#f9ecec] text-[#d74242]' :
          row.severity === 'high' ? 'bg-[#fef3e8] text-[#f59f0a]' :
          row.severity === 'medium' ? 'bg-[#fef3e8] text-[#f59f0a]' :
          'bg-[#eaf6f0] text-[#34b277]'
        }`}>
          {row.severity.toUpperCase()}
        </span>
      )
    },
    { key: 'type', label: 'Type', render: (row) => <span className="capitalize">{row.type}</span> },
    { key: 'merchant', label: 'Merchant', render: (row) => <span className="font-medium">{row.merchant}</span> },
    { key: 'description', label: 'Description', render: (row) => <span className="text-[#635c8a]">{row.description}</span> },
    {
      key: 'slaRemaining',
      label: 'SLA',
      sortable: true,
      render: (row) => {
        const hours = parseInt(row.slaRemaining);
        return (
          <span className={`font-mono ${hours < 2 ? 'text-[#d74242]' : hours < 4 ? 'text-[#f59f0a]' : 'text-[#34b277]'}`}>
            {row.slaRemaining}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          row.status === 'open' ? 'bg-[#fef3e8] text-[#f59f0a]' :
          row.status === 'assigned' ? 'bg-[#eaf6f0] text-[#34b277]' :
          'bg-[#e6e2e9] text-[#635c8a]'
        }`}>
          {row.status.toUpperCase()}
        </span>
      )
    },
  ];

  const rowActions: RowAction<Alert>[] = [
    { label: 'Assign to Me', icon: <User className="w-4 h-4" />, onClick: (alert) => setConfirmModal({ isOpen: true, type: 'assign', alert }), show: (alert) => alert.status === 'open' },
    { label: 'Change Severity', icon: <AlertTriangle className="w-4 h-4" />, onClick: (alert) => setConfirmModal({ isOpen: true, type: 'severity', alert }), variant: 'warning' },
    { label: 'Close Alert', icon: <CheckCircle className="w-4 h-4" />, onClick: (alert) => setConfirmModal({ isOpen: true, type: 'close', alert }), show: (alert) => alert.status !== 'closed' },
    { label: 'Escalate', icon: <ArrowUp className="w-4 h-4" />, onClick: (alert) => setConfirmModal({ isOpen: true, type: 'escalate', alert }), variant: 'danger', show: (alert) => alert.severity === 'critical' },
  ];

  const openAlerts = alerts.filter(a => a.status === 'open').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const breachedSLA = alerts.filter(a => parseInt(a.slaRemaining) < 1).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1339]">Alerts & Escalation</h2>
          <p className="text-[#635c8a] text-sm mt-1">Manage alerts and escalations with SLA tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Open Alerts" value={openAlerts.toString()} subtitle="Requires attention" icon={Bell} />
        <KPICard title="Critical" value={criticalAlerts.toString()} subtitle="High priority" icon={AlertTriangle} />
        <KPICard title="SLA Breached" value={breachedSLA.toString()} subtitle="Overdue" icon={Clock} />
        <KPICard title="Total Today" value={alerts.length.toString()} subtitle="All alerts" icon={Bell} />
      </div>

      <DataTable
        columns={columns}
        data={alerts}
        rowActions={rowActions}
        searchable
        searchPlaceholder="Search alerts..."
        rowKey={(row) => row.id}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'assign', alert: null })}
        onConfirm={handleAction}
        title={`${confirmModal.type.charAt(0).toUpperCase() + confirmModal.type.slice(1)} Alert`}
        message={`Are you sure you want to ${confirmModal.type} this alert?`}
        confirmText={confirmModal.type.charAt(0).toUpperCase() + confirmModal.type.slice(1)}
        variant={confirmModal.type === 'escalate' ? 'danger' : 'info'}
        requireReason={confirmModal.type === 'close' || confirmModal.type === 'escalate'}
        isLoading={isLoading}
      />
    </div>
  );
}
