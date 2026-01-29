import { useState } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { StatusBadge } from '@/app/components/StatusBadge';
import { Modal } from '@/app/components/Modal';

const mockReports = [
  { id: '1', name: 'Daily Transaction Report', type: 'Transaction Report', frequency: 'Daily', schedule: '09:00 AM', recipients: 'ops@bank.com', status: 'active' },
  { id: '2', name: 'Weekly Settlement', type: 'Settlement Report', frequency: 'Weekly', schedule: 'Monday 10:00 AM', recipients: 'finance@bank.com', status: 'active' },
];

const reportHistory = [
  { id: '1', name: 'Daily Transaction Report', type: 'Transaction', frequency: 'Daily', generatedDate: '2026-01-23 09:00', fileSize: '2.4 MB' },
  { id: '2', name: 'Weekly Settlement', type: 'Settlement', frequency: 'Weekly', generatedDate: '2026-01-22 10:00', fileSize: '1.8 MB' },
];

export function TPAPReportsPage() {
  const [activeTab, setActiveTab] = useState<'configure' | 'history'>('configure');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1a1339]">Reports</h2>
        {activeTab === 'configure' && (
          <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575]">
            <Plus className="w-5 h-5" />Create Report
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex border-b border-[#e6e2e9]">
          <button onClick={() => setActiveTab('configure')} className={`px-6 py-4 font-medium ${activeTab === 'configure' ? 'text-[#4b1b91] border-b-2 border-[#4b1b91]' : 'text-[#635c8a]'}`}>Configure Reports</button>
          <button onClick={() => setActiveTab('history')} className={`px-6 py-4 font-medium ${activeTab === 'history' ? 'text-[#4b1b91] border-b-2 border-[#4b1b91]' : 'text-[#635c8a]'}`}>Report History</button>
        </div>

        {activeTab === 'configure' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#fafafa]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Report Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Frequency</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Schedule Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Recipients</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e2e9]">
                {mockReports.map((report) => (
                  <tr key={report.id} className="hover:bg-[#fafafa]">
                    <td className="px-4 py-3 text-sm text-[#1a1339] font-medium">{report.name}</td>
                    <td className="px-4 py-3 text-sm text-[#635c8a]">{report.type}</td>
                    <td className="px-4 py-3 text-sm text-[#1a1339]">{report.frequency}</td>
                    <td className="px-4 py-3 text-sm text-[#635c8a]">{report.schedule}</td>
                    <td className="px-4 py-3 text-sm text-[#4b1b91]">{report.recipients}</td>
                    <td className="px-4 py-3 text-sm"><StatusBadge status="success" label="Active" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#fafafa]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Report Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Frequency</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Generated Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">File Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e2e9]">
                {reportHistory.map((report) => (
                  <tr key={report.id} className="hover:bg-[#fafafa]">
                    <td className="px-4 py-3 text-sm text-[#1a1339] font-medium">{report.name}</td>
                    <td className="px-4 py-3 text-sm text-[#635c8a]">{report.type}</td>
                    <td className="px-4 py-3 text-sm text-[#1a1339]">{report.frequency}</td>
                    <td className="px-4 py-3 text-sm text-[#635c8a]">{report.generatedDate}</td>
                    <td className="px-4 py-3 text-sm text-[#1a1339]">{report.fileSize}</td>
                    <td className="px-4 py-3 text-sm">
                      <button className="p-1.5 hover:bg-[#f5effb] rounded"><Download className="w-4 h-4 text-[#4b1b91]" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create Report" size="md">
        <form className="space-y-4">
          <div><label className="block text-sm font-medium text-[#1a1339] mb-2">Report Name *</label><input type="text" required className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" /></div>
          <div><label className="block text-sm font-medium text-[#1a1339] mb-2">Description</label><textarea className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" rows={3} /></div>
          <div><label className="block text-sm font-medium text-[#1a1339] mb-2">Report Type *</label><select className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg"><option>Transaction Report</option><option>Settlement Report</option><option>UDIR Report</option></select></div>
          <div><label className="block text-sm font-medium text-[#1a1339] mb-2">Date Range *</label><select className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg"><option>Daily</option><option>Weekly</option><option>Monthly</option><option>Custom</option></select></div>
          <div><label className="block text-sm font-medium text-[#1a1339] mb-2">Scheduling *</label><select className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg"><option>Daily</option><option>Weekly</option><option>Monthly</option><option>Custom</option></select></div>
          <div><label className="block text-sm font-medium text-[#1a1339] mb-2">Email Recipients *</label><input type="email" required className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" placeholder="email@example.com" /></div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] font-medium">Create Report</button>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 px-6 py-3 bg-[#f5effb] text-[#c07bfc] rounded-lg hover:bg-[#ede5f7] font-medium">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
