import { useState } from 'react';
import { Plus, Download, RefreshCw, Eye, Edit, Ban, CheckCircle, Users, TrendingUp, DollarSign, Package } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '@/app/components/KPICard';
import { StatusBadge } from '@/app/components/StatusBadge';
import { DataTable, Column, RowAction } from '@/app/components/DataTable';
import { Modal } from '@/app/components/Modal';
import { ConfirmationModal } from '@/app/components/ConfirmationModal';
import { Drawer } from '@/app/components/Drawer';
import { EmptyState } from '@/app/components/EmptyState';

interface Merchant {
  id: string;
  merchantId: string;
  name: string;
  category: string;
  mcc: string;
  status: 'active' | 'suspended' | 'pending';
  volume: string;
  transactions: number;
  onboardDate: string;
  riskScore: number;
}

const mockMerchants: Merchant[] = [
  { id: '1', merchantId: 'MER001', name: 'Amazon India', category: 'E-commerce', mcc: '5411', status: 'active', volume: '₹45.2 Cr', transactions: 12450, onboardDate: '2025-01-15', riskScore: 25 },
  { id: '2', merchantId: 'MER002', name: 'Flipkart', category: 'E-commerce', mcc: '5411', status: 'active', volume: '₹38.9 Cr', transactions: 10230, onboardDate: '2025-01-12', riskScore: 18 },
  { id: '3', merchantId: 'MER003', name: 'Swiggy', category: 'Food Delivery', mcc: '5812', status: 'active', volume: '₹27.8 Cr', transactions: 8945, onboardDate: '2025-01-10', riskScore: 32 },
  { id: '4', merchantId: 'MER004', name: 'Zomato', category: 'Food Delivery', mcc: '5812', status: 'suspended', volume: '₹15.2 Cr', transactions: 5200, onboardDate: '2024-12-20', riskScore: 68 },
  { id: '5', merchantId: 'MER005', name: 'BookMyShow', category: 'Entertainment', mcc: '7832', status: 'active', volume: '₹12.4 Cr', transactions: 4150, onboardDate: '2025-01-05', riskScore: 22 },
];

const categories = ['All', 'E-commerce', 'Food Delivery', 'Entertainment', 'Travel', 'Utilities'];
const statuses = ['All', 'Active', 'Suspended', 'Pending'];

export function MerchantPortfolioPage() {
  const [merchants, setMerchants] = useState(mockMerchants);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'suspend' | 'activate'; merchant: Merchant | null }>({ isOpen: false, type: 'suspend', merchant: null });
  const [isLoading, setIsLoading] = useState(false);
  
  // Filters
  const [dateRange, setDateRange] = useState('last-30-days');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [mccSearch, setMccSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'E-commerce',
    mcc: '',
    contactEmail: '',
    contactPhone: '',
  });

  // Apply filters
  const filteredMerchants = merchants.filter(m => {
    if (statusFilter !== 'All' && m.status !== statusFilter.toLowerCase()) return false;
    if (categoryFilter !== 'All' && m.category !== categoryFilter) return false;
    if (mccSearch && !m.mcc.includes(mccSearch)) return false;
    return true;
  });

  // KPI calculations
  const activeMerchants = merchants.filter(m => m.status === 'active').length;
  const totalVolume = '₹139.5 Cr';
  const avgTransactions = Math.floor(merchants.reduce((acc, m) => acc + m.transactions, 0) / merchants.length);

  const handleApplyFilters = () => {
    toast.success('Filters applied successfully');
  };

  const handleResetFilters = () => {
    setDateRange('last-30-days');
    setStatusFilter('All');
    setCategoryFilter('All');
    setMccSearch('');
    toast.info('Filters reset');
  };

  const handleAddMerchant = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      toast.success('Merchant added successfully');
      setIsAddModalOpen(false);
      setFormData({ name: '', category: 'E-commerce', mcc: '', contactEmail: '', contactPhone: '' });
      setIsLoading(false);
    }, 1000);
  };

  const handleViewMerchant = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setIsViewDrawerOpen(true);
  };

  const handleSuspendActivate = (reason?: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const action = confirmModal.type === 'suspend' ? 'suspended' : 'activated';
      toast.success(`Merchant ${action} successfully`);
      
      // Update merchant status
      setMerchants(prev => prev.map(m => 
        m.id === confirmModal.merchant?.id 
          ? { ...m, status: confirmModal.type === 'suspend' ? 'suspended' : 'active' }
          : m
      ));
      
      setConfirmModal({ isOpen: false, type: 'suspend', merchant: null });
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Exporting data...',
        success: 'Data exported successfully',
        error: 'Failed to export data',
      }
    );
  };

  const handleRefresh = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Refreshing dashboard...',
        success: 'Dashboard refreshed',
        error: 'Failed to refresh',
      }
    );
  };

  const columns: Column<Merchant>[] = [
    {
      key: 'merchantId',
      label: 'Merchant ID',
      sortable: true,
      render: (row) => <span className="font-mono text-[#4b1b91]">{row.merchantId}</span>
    },
    {
      key: 'name',
      label: 'Merchant Name',
      sortable: true,
      render: (row) => <span className="font-medium text-[#1a1339]">{row.name}</span>
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (row) => <span className="text-[#635c8a]">{row.category}</span>
    },
    {
      key: 'mcc',
      label: 'MCC',
      render: (row) => <span className="px-2 py-1 bg-[#f5effb] text-[#4b1b91] rounded font-mono text-xs">{row.mcc}</span>
    },
    {
      key: 'volume',
      label: 'Volume',
      sortable: true,
      render: (row) => <span className="font-semibold text-[#1a1339]">{row.volume}</span>
    },
    {
      key: 'transactions',
      label: 'Transactions',
      sortable: true,
      render: (row) => <span className="text-[#635c8a]">{row.transactions.toLocaleString()}</span>
    },
    {
      key: 'riskScore',
      label: 'Risk Score',
      sortable: true,
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          row.riskScore < 30 ? 'bg-[#eaf6f0] text-[#34b277]' :
          row.riskScore < 60 ? 'bg-[#fef3e8] text-[#f59f0a]' :
          'bg-[#f9ecec] text-[#d74242]'
        }`}>
          {row.riskScore}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />
    },
  ];

  const rowActions: RowAction<Merchant>[] = [
    {
      label: 'View Details',
      icon: <Eye className="w-4 h-4" />,
      onClick: handleViewMerchant,
    },
    {
      label: 'Edit Merchant',
      icon: <Edit className="w-4 h-4" />,
      onClick: (merchant) => toast.info(`Edit merchant: ${merchant.name}`),
    },
    {
      label: 'Suspend',
      icon: <Ban className="w-4 h-4" />,
      onClick: (merchant) => setConfirmModal({ isOpen: true, type: 'suspend', merchant }),
      variant: 'danger',
      show: (merchant) => merchant.status === 'active',
    },
    {
      label: 'Activate',
      icon: <CheckCircle className="w-4 h-4" />,
      onClick: (merchant) => setConfirmModal({ isOpen: true, type: 'activate', merchant }),
      show: (merchant) => merchant.status === 'suspended',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1339]">Merchant Portfolio</h2>
          <p className="text-[#635c8a] text-sm mt-1">Manage and monitor merchant accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e6e2e9] text-[#1a1339] rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e6e2e9] text-[#1a1339] rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Merchant
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Merchants"
          value={merchants.length.toString()}
          subtitle="All registered"
          icon={Users}
          onClick={() => {
            setStatusFilter('All');
            toast.info('Showing all merchants');
          }}
        />
        <KPICard
          title="Active Merchants"
          value={activeMerchants.toString()}
          subtitle="Currently active"
          trend={{ value: '12', direction: 'up', label: 'this month' }}
          icon={CheckCircle}
          onClick={() => {
            setStatusFilter('Active');
            toast.info('Filtered by active merchants');
          }}
        />
        <KPICard
          title="Total Volume"
          value={totalVolume}
          subtitle="Last 30 days"
          trend={{ value: '18%', direction: 'up', label: 'vs last month' }}
          icon={DollarSign}
        />
        <KPICard
          title="Avg Transactions"
          value={avgTransactions.toString()}
          subtitle="Per merchant"
          icon={TrendingUp}
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-[#1a1339] font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#635c8a] mb-2">Date Range</label>
            <select
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#635c8a] mb-2">Status</label>
            <select
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#635c8a] mb-2">Category</label>
            <select
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#635c8a] mb-2">MCC Search</label>
            <input
              type="text"
              placeholder="Search MCC..."
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={mccSearch}
              onChange={(e) => setMccSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleApplyFilters}
            className="px-6 py-2 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium"
          >
            Apply
          </button>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2 bg-[#f5effb] text-[#c07bfc] rounded-lg hover:bg-[#ede5f7] transition-colors font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredMerchants}
        rowActions={rowActions}
        searchable
        searchPlaceholder="Search merchants..."
        rowKey={(row) => row.id}
        emptyState={
          <EmptyState
            icon={<Package className="w-8 h-8 text-[#c07bfc]" />}
            title="No merchants found"
            description="Try adjusting your filters or add a new merchant"
            action={{
              label: 'Add Merchant',
              onClick: () => setIsAddModalOpen(true)
            }}
          />
        }
      />

      {/* Add Merchant Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Merchant"
        size="lg"
      >
        <form onSubmit={handleAddMerchant} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a1339] mb-2">Merchant Name *</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">Category *</label>
              <select
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">MCC Code *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.mcc}
                onChange={(e) => setFormData({ ...formData, mcc: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">Contact Email *</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1339] mb-2">Contact Phone *</label>
              <input
                type="tel"
                required
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Merchant'}
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 px-6 py-3 bg-[#f5effb] text-[#c07bfc] rounded-lg hover:bg-[#ede5f7] transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* View Merchant Drawer */}
      <Drawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        title="Merchant Details"
        size="lg"
      >
        {selectedMerchant && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">Merchant ID</label>
                <p className="text-[#1a1339] font-mono">{selectedMerchant.merchantId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">Status</label>
                <StatusBadge status={selectedMerchant.status} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">Merchant Name</label>
                <p className="text-[#1a1339] font-semibold">{selectedMerchant.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">Category</label>
                <p className="text-[#1a1339]">{selectedMerchant.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">MCC Code</label>
                <p className="text-[#1a1339] font-mono">{selectedMerchant.mcc}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">Onboard Date</label>
                <p className="text-[#1a1339]">{selectedMerchant.onboardDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">Total Volume</label>
                <p className="text-[#1a1339] font-bold text-lg">{selectedMerchant.volume}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">Transactions</label>
                <p className="text-[#1a1339] font-bold text-lg">{selectedMerchant.transactions.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">Risk Score</label>
                <p className={`text-lg font-bold ${
                  selectedMerchant.riskScore < 30 ? 'text-[#34b277]' :
                  selectedMerchant.riskScore < 60 ? 'text-[#f59f0a]' :
                  'text-[#d74242]'
                }`}>
                  {selectedMerchant.riskScore}/100
                </p>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'suspend', merchant: null })}
        onConfirm={handleSuspendActivate}
        title={confirmModal.type === 'suspend' ? 'Suspend Merchant' : 'Activate Merchant'}
        message={`Are you sure you want to ${confirmModal.type} ${confirmModal.merchant?.name}?`}
        confirmText={confirmModal.type === 'suspend' ? 'Suspend' : 'Activate'}
        variant={confirmModal.type === 'suspend' ? 'danger' : 'info'}
        requireReason={confirmModal.type === 'suspend'}
        isLoading={isLoading}
      />
    </div>
  );
}
