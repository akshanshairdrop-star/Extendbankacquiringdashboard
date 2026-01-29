import { useState } from 'react';
import { Plus, Search, Edit, Ban, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/app/components/Modal';

interface TPAP {
  id: string;
  name: string;
  tpapId: string;
  onboardingDate: string;
  onboardedBy: string;
  status: 'active' | 'deactivated';
}

const mockTPAPs: TPAP[] = [
  { id: '001', name: 'PhonePe TPAP', tpapId: 'TPAP001', onboardingDate: '2026-01-15', onboardedBy: 'John Doe', status: 'active' },
  { id: '002', name: 'Google Pay TPAP', tpapId: 'TPAP002', onboardingDate: '2026-01-12', onboardedBy: 'Sarah Johnson', status: 'active' },
  { id: '003', name: 'Paytm TPAP', tpapId: 'TPAP003', onboardingDate: '2026-01-10', onboardedBy: 'Mike Williams', status: 'active' },
];

export function TPAPManagementPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [channels, setChannels] = useState<any[]>([{ id: 1 }]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tpapName: '',
    handle: '',
    orgId: '',
    bankParticipationCode: '',
  });

  const addChannel = () => {
    setChannels([...channels, { id: channels.length + 1 }]);
  };

  const filteredTPAPs = mockTPAPs.filter(tpap =>
    tpap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tpap.tpapId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1339]">TPAP Management</h2>
          <p className="text-[#635c8a] text-sm mt-1">Manage Third Party Application Providers</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New TPAP
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#635c8a]" />
          <input
            type="text"
            placeholder="Search TPAPs..."
            className="w-full pl-10 pr-4 py-3 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fafafa]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">TPAP Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">TPAP ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Onboarding Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Onboarded By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e2e9]">
              {filteredTPAPs.map((tpap) => (
                <tr
                  key={tpap.id}
                  onClick={() => navigate(`/tpap/${tpap.id}/dashboard`)}
                  className="hover:bg-[#fafafa] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-[#1a1339] font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#4b1b91]" />
                    {tpap.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#4b1b91] font-mono">{tpap.tpapId}</td>
                  <td className="px-4 py-3 text-sm text-[#635c8a]">{tpap.onboardingDate}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1339]">{tpap.onboardedBy}</td>
                  <td className="px-4 py-3 text-sm" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-[#f5effb] rounded transition-colors"><Edit className="w-4 h-4 text-[#4b1b91]" /></button>
                      <button className="p-1.5 hover:bg-[#f9ecec] rounded transition-colors"><Ban className="w-4 h-4 text-[#d74242]" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="TPAP Onboarding" size="lg">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#1a1339] mb-2">TPAP Name *</label>
              <input type="text" required className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" placeholder="Enter TPAP name" />
            </div>
            <div><label className="block text-sm font-medium text-[#1a1339] mb-2">Handle *</label><input type="text" required className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" placeholder="@handle" /></div>
            <div><label className="block text-sm font-medium text-[#1a1339] mb-2">Org ID *</label><input type="text" required className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium text-[#1a1339] mb-2">Bank Participation Code *</label><input type="text" required className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" /></div>
          </div>

          <div className="border-t border-[#e6e2e9] pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-[#1a1339]">Channels</h4>
              <button type="button" onClick={addChannel} className="px-4 py-2 bg-[#f5effb] text-[#c07bfc] rounded-lg hover:bg-[#ede5f7] transition-colors text-sm font-medium">Add Channel</button>
            </div>
            {channels.map((channel, idx) => (
              <div key={channel.id} className="mb-4 p-4 bg-[#fafafa] rounded-lg space-y-3">
                <h5 className="text-sm font-medium text-[#1a1339]">Channel {idx + 1}</h5>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Channel Name" className="px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" />
                  <input type="text" placeholder="VPA Reserve Pattern" className="px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" />
                  <input type="text" placeholder="Callback URL" className="col-span-2 px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" />
                  <input type="text" placeholder="Account Number" className="px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" />
                  <input type="text" placeholder="Account Holder" className="px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" />
                  <input type="text" placeholder="IFSC Code" className="px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" />
                  <select className="px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"><option>Current</option><option>Saving</option></select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium">Onboard TPAP</button>
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-6 py-3 bg-[#f5effb] text-[#c07bfc] rounded-lg hover:bg-[#ede5f7] transition-colors font-medium">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
