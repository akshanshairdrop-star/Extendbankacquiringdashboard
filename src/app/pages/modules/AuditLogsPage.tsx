import { useState } from 'react';
import { Eye, Download, Filter, FileText, User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '@/app/components/KPICard';
import { DataTable, Column, RowAction } from '@/app/components/DataTable';
import { Drawer } from '@/app/components/Drawer';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  module: string;
  action: string;
  entity: string;
  changeBefore?: string;
  changeAfter?: string;
  ipAddress: string;
  status: 'success' | 'failed';
}

const mockLogs: AuditLog[] = [
  { id: '1', timestamp: '2026-01-23 14:35:22', user: 'John Doe', module: 'Merchant Management', action: 'SUSPEND', entity: 'MER001', changeBefore: 'active', changeAfter: 'suspended', ipAddress: '192.168.1.100', status: 'success' },
  { id: '2', timestamp: '2026-01-23 14:30:15', user: 'Sarah Johnson', module: 'Risk Rules', action: 'UPDATE', entity: 'RULE002', changeBefore: 'threshold: 5000', changeAfter: 'threshold: 10000', ipAddress: '192.168.1.101', status: 'success' },
  { id: '3', timestamp: '2026-01-23 14:25:08', user: 'Mike Williams', module: 'Settlements', action: 'APPROVE', entity: 'CYC001', changeBefore: 'pending', changeAfter: 'approved', ipAddress: '192.168.1.102', status: 'success' },
  { id: '4', timestamp: '2026-01-23 14:20:45', user: 'Emily Brown', module: 'User Management', action: 'CREATE', entity: 'USR005', changeBefore: null, changeAfter: 'created', ipAddress: '192.168.1.103', status: 'failed' },
];

export function AuditLogsPage() {
  const [logs, setLogs] = useState(mockLogs);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userFilter, setUserFilter] = useState('All');
  const [moduleFilter, setModuleFilter] = useState('All');

  const modules = ['All', 'Merchant Management', 'Risk Rules', 'Settlements', 'User Management'];
  const users = ['All', ...Array.from(new Set(mockLogs.map(l => l.user)))];

  const filteredLogs = logs.filter(log => {
    if (userFilter !== 'All' && log.user !== userFilter) return false;
    if (moduleFilter !== 'All' && log.module !== moduleFilter) return false;
    return true;
  });

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Exporting audit logs...',
        success: 'Audit logs exported successfully',
        error: 'Export failed',
      }
    );
  };

  const columns: Column<AuditLog>[] = [
    { key: 'timestamp', label: 'Timestamp', sortable: true, render: (row) => <span className="font-mono text-[#635c8a]">{row.timestamp}</span> },
    { key: 'user', label: 'User', sortable: true, render: (row) => <span className="font-medium">{row.user}</span> },
    { key: 'module', label: 'Module', sortable: true, render: (row) => <span className="text-[#4b1b91]">{row.module}</span> },
    { key: 'action', label: 'Action', sortable: true, render: (row) => <span className="px-2 py-1 bg-[#f5effb] text-[#4b1b91] rounded text-xs font-medium">{row.action}</span> },
    { key: 'entity', label: 'Entity', render: (row) => <span className="font-mono text-[#1a1339]">{row.entity}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${row.status === 'success' ? 'bg-[#eaf6f0] text-[#34b277]' : 'bg-[#f9ecec] text-[#d74242]'}`}>
          {row.status.toUpperCase()}
        </span>
      )
    },
  ];

  const rowActions: RowAction<AuditLog>[] = [
    {
      label: 'View Change Diff',
      icon: <Eye className="w-4 h-4" />,
      onClick: (log) => {
        setSelectedLog(log);
        setIsDrawerOpen(true);
      },
      show: (log) => !!log.changeBefore && !!log.changeAfter,
    },
  ];

  const totalLogs = logs.length;
  const successLogs = logs.filter(l => l.status === 'success').length;
  const failedLogs = logs.filter(l => l.status === 'failed').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1339]">Audit Logs</h2>
          <p className="text-[#635c8a] text-sm mt-1">Complete system activity audit trail</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium"
        >
          <Download className="w-5 h-5" />
          Export Logs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Logs" value={totalLogs.toString()} subtitle="Last 24 hours" icon={FileText} />
        <KPICard title="Successful" value={successLogs.toString()} subtitle="Completed actions" icon={Shield} />
        <KPICard title="Failed" value={failedLogs.toString()} subtitle="Failed attempts" icon={FileText} />
        <KPICard title="Unique Users" value={users.length.toString()} subtitle="Active users" icon={User} />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-[#635c8a]" />
          <h3 className="text-[#1a1339] font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#635c8a] mb-2">Filter by User</label>
            <select
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              {users.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#635c8a] mb-2">Filter by Module</label>
            <select
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
            >
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#635c8a] mb-2">Date Range</label>
            <select className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]">
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredLogs}
        rowActions={rowActions}
        searchable
        searchPlaceholder="Search logs..."
        rowKey={(row) => row.id}
      />

      {/* Change Diff Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Change Details"
        size="lg"
      >
        {selectedLog && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">User</label>
                <p className="text-[#1a1339] font-medium">{selectedLog.user}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">Action</label>
                <p className="text-[#1a1339] font-semibold">{selectedLog.action}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">Module</label>
                <p className="text-[#1a1339]">{selectedLog.module}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">Entity</label>
                <p className="text-[#1a1339] font-mono">{selectedLog.entity}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">IP Address</label>
                <p className="text-[#1a1339] font-mono">{selectedLog.ipAddress}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">Timestamp</label>
                <p className="text-[#1a1339] font-mono">{selectedLog.timestamp}</p>
              </div>
            </div>

            {selectedLog.changeBefore && selectedLog.changeAfter && (
              <div className="border-t border-[#e6e2e9] pt-4">
                <h4 className="font-semibold text-[#1a1339] mb-3">Change Comparison</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f9ecec] p-4 rounded-lg">
                    <label className="block text-sm font-medium text-[#d74242] mb-2">Before</label>
                    <p className="text-[#1a1339] font-mono text-sm">{selectedLog.changeBefore}</p>
                  </div>
                  <div className="bg-[#eaf6f0] p-4 rounded-lg">
                    <label className="block text-sm font-medium text-[#34b277] mb-2">After</label>
                    <p className="text-[#1a1339] font-mono text-sm">{selectedLog.changeAfter}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
