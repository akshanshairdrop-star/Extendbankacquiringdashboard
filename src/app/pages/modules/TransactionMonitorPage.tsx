import { useState } from 'react';
import { Eye, CheckCircle, Flag, Ban, AlertTriangle, CreditCard, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '@/app/components/KPICard';
import { StatusBadge } from '@/app/components/StatusBadge';
import { DataTable, Column, RowAction } from '@/app/components/DataTable';
import { ConfirmationModal } from '@/app/components/ConfirmationModal';
import { Drawer } from '@/app/components/Drawer';

interface Transaction {
  id: string;
  txnId: string;
  merchant: string;
  amount: string;
  status: 'pending' | 'success' | 'flagged' | 'blocked';
  riskScore: number;
  timestamp: string;
  payer: string;
  payee: string;
}

const mockTxns: Transaction[] = [
  { id: '1', txnId: 'TXN001', merchant: 'Amazon', amount: '₹2,450', status: 'pending', riskScore: 75, timestamp: '2026-01-23 14:30', payer: 'john@upi', payee: 'amazon@paytm' },
  { id: '2', txnId: 'TXN002', merchant: 'Flipkart', amount: '₹899', status: 'flagged', riskScore: 85, timestamp: '2026-01-23 14:25', payer: 'sarah@ybl', payee: 'flipkart@axis' },
  { id: '3', txnId: 'TXN003', merchant: 'Swiggy', amount: '₹450', status: 'success', riskScore: 20, timestamp: '2026-01-23 14:20', payer: 'mike@paytm', payee: 'swiggy@icici' },
  { id: '4', txnId: 'TXN004', merchant: 'Zomato', amount: '₹15,250', status: 'blocked', riskScore: 95, timestamp: '2026-01-23 14:15', payer: 'suspicious@upi', payee: 'zomato@hdfc' },
];

export function TransactionMonitorPage() {
  const [transactions, setTransactions] = useState(mockTxns);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'approve' | 'flag' | 'block'; txn: Transaction | null }>({ isOpen: false, type: 'approve', txn: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = (reason?: string) => {
    setIsLoading(true);
    const actionMap = {
      approve: 'approved',
      flag: 'flagged',
      block: 'blocked'
    };
    
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `${confirmModal.type}ing transaction...`,
        success: () => {
          setTransactions(prev => prev.map(t => 
            t.id === confirmModal.txn?.id 
              ? { ...t, status: actionMap[confirmModal.type] === 'approved' ? 'success' : actionMap[confirmModal.type] as any }
              : t
          ));
          setConfirmModal({ isOpen: false, type: 'approve', txn: null });
          setIsLoading(false);
          return `Transaction ${actionMap[confirmModal.type]} successfully`;
        },
        error: 'Action failed',
      }
    );
  };

  const columns: Column<Transaction>[] = [
    {
      key: 'txnId',
      label: 'Transaction ID',
      sortable: true,
      render: (row) => <span className="font-mono text-[#4b1b91]">{row.txnId}</span>
    },
    {
      key: 'merchant',
      label: 'Merchant',
      sortable: true,
      render: (row) => <span className="font-medium text-[#1a1339]">{row.merchant}</span>
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => <span className="font-semibold text-[#1a1339]">{row.amount}</span>
    },
    {
      key: 'riskScore',
      label: 'Risk Score',
      sortable: true,
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          row.riskScore < 40 ? 'bg-[#eaf6f0] text-[#34b277]' :
          row.riskScore < 70 ? 'bg-[#fef3e8] text-[#f59f0a]' :
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
    {
      key: 'timestamp',
      label: 'Timestamp',
      sortable: true,
      render: (row) => <span className="text-[#635c8a]">{row.timestamp}</span>
    },
  ];

  const rowActions: RowAction<Transaction>[] = [
    {
      label: 'View Details',
      icon: <Eye className="w-4 h-4" />,
      onClick: (txn) => {
        setSelectedTxn(txn);
        setIsViewDrawerOpen(true);
      },
    },
    {
      label: 'Approve Transaction',
      icon: <CheckCircle className="w-4 h-4" />,
      onClick: (txn) => setConfirmModal({ isOpen: true, type: 'approve', txn }),
      show: (txn) => txn.status === 'pending' || txn.status === 'flagged',
    },
    {
      label: 'Flag Transaction',
      icon: <Flag className="w-4 h-4" />,
      onClick: (txn) => setConfirmModal({ isOpen: true, type: 'flag', txn }),
      variant: 'warning',
      show: (txn) => txn.status === 'pending',
    },
    {
      label: 'Block Transaction',
      icon: <Ban className="w-4 h-4" />,
      onClick: (txn) => setConfirmModal({ isOpen: true, type: 'block', txn }),
      variant: 'danger',
      show: (txn) => txn.status !== 'blocked',
    },
  ];

  const pendingTxns = transactions.filter(t => t.status === 'pending').length;
  const flaggedTxns = transactions.filter(t => t.status === 'flagged').length;
  const blockedTxns = transactions.filter(t => t.status === 'blocked').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1339]">Transaction Monitor</h2>
          <p className="text-[#635c8a] text-sm mt-1">Real-time transaction monitoring and fraud detection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Monitored" value={transactions.length.toString()} subtitle="Last 1 hour" icon={CreditCard} />
        <KPICard title="Pending Review" value={pendingTxns.toString()} subtitle="Requires action" icon={AlertTriangle} />
        <KPICard title="Flagged" value={flaggedTxns.toString()} subtitle="Suspicious activity" icon={Flag} />
        <KPICard title="Blocked" value={blockedTxns.toString()} subtitle="Auto-blocked" icon={Ban} />
      </div>

      <DataTable
        columns={columns}
        data={transactions}
        rowActions={rowActions}
        searchable
        searchPlaceholder="Search transactions..."
        rowKey={(row) => row.id}
      />

      <Drawer isOpen={isViewDrawerOpen} onClose={() => setIsViewDrawerOpen(false)} title="Transaction Details" size="lg">
        {selectedTxn && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Transaction ID</label><p className="text-[#1a1339] font-mono">{selectedTxn.txnId}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Status</label><StatusBadge status={selectedTxn.status} /></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Merchant</label><p className="text-[#1a1339] font-semibold">{selectedTxn.merchant}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Amount</label><p className="text-[#1a1339] font-bold text-lg">{selectedTxn.amount}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Payer</label><p className="text-[#1a1339]">{selectedTxn.payer}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Payee</label><p className="text-[#1a1339]">{selectedTxn.payee}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Timestamp</label><p className="text-[#1a1339]">{selectedTxn.timestamp}</p></div>
              <div>
                <label className="block text-sm font-medium text-[#635c8a] mb-1">Risk Score</label>
                <p className={`text-lg font-bold ${selectedTxn.riskScore < 40 ? 'text-[#34b277]' : selectedTxn.riskScore < 70 ? 'text-[#f59f0a]' : 'text-[#d74242]'}`}>
                  {selectedTxn.riskScore}/100
                </p>
              </div>
            </div>
            <div className="border-t border-[#e6e2e9] pt-4">
              <h4 className="font-semibold text-[#1a1339] mb-3">Audit Trail</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#635c8a]">Created:</span><span className="text-[#1a1339]">{selectedTxn.timestamp}</span></div>
                <div className="flex justify-between"><span className="text-[#635c8a]">Last Updated:</span><span className="text-[#1a1339]">{selectedTxn.timestamp}</span></div>
                <div className="flex justify-between"><span className="text-[#635c8a]">Updated By:</span><span className="text-[#1a1339]">System</span></div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'approve', txn: null })}
        onConfirm={handleAction}
        title={`${confirmModal.type.charAt(0).toUpperCase() + confirmModal.type.slice(1)} Transaction`}
        message={`Are you sure you want to ${confirmModal.type} this transaction?`}
        confirmText={confirmModal.type.charAt(0).toUpperCase() + confirmModal.type.slice(1)}
        variant={confirmModal.type === 'block' ? 'danger' : confirmModal.type === 'flag' ? 'warning' : 'info'}
        requireReason
        isLoading={isLoading}
      />
    </div>
  );
}
