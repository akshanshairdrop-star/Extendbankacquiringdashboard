import { useState } from 'react';
import { Plus, Download, Send, FileText, Calendar, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '@/app/components/KPICard';
import { DataTable, Column, RowAction } from '@/app/components/DataTable';
import { Modal } from '@/app/components/Modal';

interface Report {
  id: string;
  reportName: string;
  type: 'Transaction' | 'Settlement' | 'Merchant' | 'Risk' | 'Audit';
  format: 'PDF' | 'Excel' | 'CSV';
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'On-Demand';
  schedule?: string;
  recipients: string;
  lastGenerated?: string;
  status: 'active' | 'paused';
}

const mockReports: Report[] = [
  { id: '1', reportName: 'Daily Transaction Summary', type: 'Transaction', format: 'Excel', frequency: 'Daily', schedule: '09:00 AM', recipients: 'ops@bank.com', lastGenerated: '2026-01-23 09:00', status: 'active' },
  { id: '2', reportName: 'Weekly Settlement Report', type: 'Settlement', format: 'PDF', frequency: 'Weekly', schedule: 'Monday 10:00 AM', recipients: 'finance@bank.com', lastGenerated: '2026-01-20 10:00', status: 'active' },
  { id: '3', reportName: 'Merchant Performance', type: 'Merchant', format: 'Excel', frequency: 'Monthly', schedule: '1st of month', recipients: 'management@bank.com', lastGenerated: '2026-01-01 08:00', status: 'active' },
  { id: '4', reportName: 'Risk Analysis', type: 'Risk', format: 'PDF', frequency: 'On-Demand', recipients: 'risk@bank.com', status: 'paused' },
];

export function ReportsPage() {
  const [reports, setReports] = useState(mockReports);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    reportName: '',
    type: 'Transaction',
    format: 'Excel',
    frequency: 'Daily',
    schedule: '',
    recipients: '',
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Creating report...',
        success: () => {
          setIsCreateModalOpen(false);
          setFormData({
            reportName: '',
            type: 'Transaction',
            format: 'Excel',
            frequency: 'Daily',
            schedule: '',
            recipients: '',
          });
          setIsLoading(false);
          return 'Report created and scheduled successfully';
        },
        error: 'Failed to create report',
      }
    );
  };

  const handleGenerateNow = (report: Report) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: `Generating ${report.reportName}...`,
        success: `Report generated and sent to ${report.recipients}`,
        error: 'Generation failed',
      }
    );
  };

  const handleDownload = (report: Report) => {
    toast.success(`Downloading ${report.reportName}`);
  };

  const handleEmailReport = (report: Report) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Sending email...',
        success: `Report emailed to ${report.recipients}`,
        error: 'Email failed',
      }
    );
  };

  const columns: Column<Report>[] = [
    { key: 'reportName', label: 'Report Name', sortable: true, render: (row) => <span className="font-medium text-[#1a1339]">{row.reportName}</span> },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (row) => (
        <span className="px-3 py-1 bg-[#f5effb] text-[#4b1b91] rounded-md text-xs font-medium">
          {row.type}
        </span>
      )
    },
    { key: 'format', label: 'Format', render: (row) => <span className="text-[#635c8a]">{row.format}</span> },
    {
      key: 'frequency',
      label: 'Frequency',
      sortable: true,
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          row.frequency === 'Daily' ? 'bg-[#eaf6f0] text-[#34b277]' :
          row.frequency === 'Weekly' ? 'bg-[#f5effb] text-[#4b1b91]' :
          row.frequency === 'Monthly' ? 'bg-[#fef3e8] text-[#f59f0a]' :
          'bg-[#e6e2e9] text-[#635c8a]'
        }`}>
          {row.frequency}
        </span>
      )
    },
    { key: 'schedule', label: 'Schedule', render: (row) => <span className="text-[#635c8a]">{row.schedule || '-'}</span> },
    { key: 'recipients', label: 'Recipients', render: (row) => <span className="text-[#4b1b91]">{row.recipients}</span> },
    { key: 'lastGenerated', label: 'Last Generated', sortable: true, render: (row) => <span className="text-[#635c8a] font-mono text-xs">{row.lastGenerated || 'Never'}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          row.status === 'active' ? 'bg-[#eaf6f0] text-[#34b277]' : 'bg-[#e6e2e9] text-[#635c8a]'
        }`}>
          {row.status.toUpperCase()}
        </span>
      )
    },
  ];

  const rowActions: RowAction<Report>[] = [
    {
      label: 'Generate Now',
      icon: <FileText className="w-4 h-4" />,
      onClick: handleGenerateNow,
    },
    {
      label: 'Download Latest',
      icon: <Download className="w-4 h-4" />,
      onClick: handleDownload,
      show: (report) => !!report.lastGenerated,
    },
    {
      label: 'Email Report',
      icon: <Mail className="w-4 h-4" />,
      onClick: handleEmailReport,
    },
  ];

  const activeReports = reports.filter(r => r.status === 'active').length;
  const dailyReports = reports.filter(r => r.frequency === 'Daily').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1339]">Reports</h2>
          <p className="text-[#635c8a] text-sm mt-1">Automated report generation and scheduling</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Reports" value={reports.length.toString()} subtitle="Configured" icon={FileText} />
        <KPICard title="Active" value={activeReports.toString()} subtitle="Scheduled reports" icon={Calendar} />
        <KPICard title="Daily Reports" value={dailyReports.toString()} subtitle="Generated daily" icon={Clock} />
        <KPICard title="Recipients" value="12" subtitle="Email addresses" icon={Mail} />
      </div>

      <DataTable
        columns={columns}
        data={reports}
        rowActions={rowActions}
        searchable
        searchPlaceholder="Search reports..."
        rowKey={(row) => row.id}
      />

      {/* Create Report Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Report"
        size="lg"
      >
        <form onSubmit={handleCreateReport} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a1339] mb-2">Report Name *</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={formData.reportName}
              onChange={(e) => setFormData({ ...formData, reportName: e.target.value })}
              placeholder="Enter report name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">Report Type *</label>
              <select
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="Transaction">Transaction Report</option>
                <option value="Settlement">Settlement Report</option>
                <option value="Merchant">Merchant Report</option>
                <option value="Risk">Risk Report</option>
                <option value="Audit">Audit Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">Format *</label>
              <select
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
              >
                <option value="Excel">Excel</option>
                <option value="PDF">PDF</option>
                <option value="CSV">CSV</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">Frequency *</label>
              <select
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="On-Demand">On-Demand</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">Schedule Time</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="e.g., 09:00 AM"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1a1339] mb-2">Email Recipients *</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={formData.recipients}
              onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
              placeholder="email1@example.com, email2@example.com"
            />
            <p className="text-xs text-[#635c8a] mt-1">Separate multiple emails with commas</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create & Schedule'}
            </button>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1 px-6 py-3 bg-[#f5effb] text-[#c07bfc] rounded-lg hover:bg-[#ede5f7] transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
