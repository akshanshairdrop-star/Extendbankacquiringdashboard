import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { TPAPLayout } from '@/app/components/TPAPLayout';

// Existing Pages
import { OverviewPage } from '@/app/pages/OverviewPage';
import { TransactionsPage } from '@/app/pages/TransactionsPage';
import { MerchantsPage } from '@/app/pages/MerchantsPage';
import { RiskRulePage } from '@/app/pages/RiskRulePage';
import { UserManagementPage } from '@/app/pages/UserManagementPage';
import { TPAPManagementPage } from '@/app/pages/TPAPManagementPage';

// TPAP Pages
import { TPAPDashboardPage } from '@/app/pages/tpap/TPAPDashboardPage';
import { TPAPTransactionsPage } from '@/app/pages/tpap/TPAPTransactionsPage';
import { TPAPRulesPage } from '@/app/pages/tpap/TPAPRulesPage';
import { TPAPVPAPage } from '@/app/pages/tpap/TPAPVPAPage';
import { TPAPReportsPage } from '@/app/pages/tpap/TPAPReportsPage';
import { ReconciliationPage } from '@/app/pages/tpap/ReconciliationPage';
import { UDIRPage } from '@/app/pages/tpap/UDIRPage';

// New Module Pages
import { MerchantPortfolioPage } from '@/app/pages/modules/MerchantPortfolioPage';
import { NPCIFilesPage } from '@/app/pages/modules/NPCIFilesPage';
import { ThreeWayReconPage } from '@/app/pages/modules/ThreeWayReconPage';
import { SettlementAgeingPage } from '@/app/pages/modules/SettlementAgeingPage';
import { DailySettlementPage } from '@/app/pages/modules/DailySettlementPage';
import { TxnReconciliationPage } from '@/app/pages/modules/TxnReconciliationPage';
import { UnsettledTransactionsPage } from '@/app/pages/modules/UnsettledTransactionsPage';
import { RefundReversalPage } from '@/app/pages/modules/RefundReversalPage';
import { EFRMPage } from '@/app/pages/modules/EFRMPage';
import { TransactionMonitorPage } from '@/app/pages/modules/TransactionMonitorPage';
import { MerchantRiskPage } from '@/app/pages/modules/MerchantRiskPage';
import { PSPMonitorPage } from '@/app/pages/modules/PSPMonitorPage';
import { AlertsPage } from '@/app/pages/modules/AlertsPage';
import { SettlementRiskPage } from '@/app/pages/modules/SettlementRiskPage';
import { AuditLogsPage } from '@/app/pages/modules/AuditLogsPage';
import { ReportsPage } from '@/app/pages/modules/ReportsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<OverviewPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="merchants" element={<MerchantsPage />} />
          <Route path="risk-rules" element={<RiskRulePage />} />
          <Route path="user-management" element={<UserManagementPage />} />
          <Route path="tpap-management" element={<TPAPManagementPage />} />
          
          {/* New Module Routes */}
          <Route path="merchant-portfolio" element={<MerchantPortfolioPage />} />
          <Route path="npci-files" element={<NPCIFilesPage />} />
          <Route path="three-way-recon" element={<ThreeWayReconPage />} />
          <Route path="settlement-ageing" element={<SettlementAgeingPage />} />
          <Route path="daily-settlement" element={<DailySettlementPage />} />
          <Route path="txn-reconciliation" element={<TxnReconciliationPage />} />
          <Route path="unsettled" element={<UnsettledTransactionsPage />} />
          <Route path="refund-reversal" element={<RefundReversalPage />} />
          <Route path="efrm" element={<EFRMPage />} />
          <Route path="txn-monitor" element={<TransactionMonitorPage />} />
          <Route path="merchant-risk" element={<MerchantRiskPage />} />
          <Route path="psp-monitor" element={<PSPMonitorPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="settlement-risk" element={<SettlementRiskPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
        
        <Route path="/tpap/:tpapId" element={<TPAPLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TPAPDashboardPage />} />
          <Route path="transactions" element={<TPAPTransactionsPage />} />
          <Route path="rules" element={<TPAPRulesPage />} />
          <Route path="vpa" element={<TPAPVPAPage />} />
          <Route path="reports" element={<TPAPReportsPage />} />
          <Route path="reconciliation" element={<ReconciliationPage />} />
          <Route path="udir" element={<UDIRPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
