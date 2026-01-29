import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { TPAPLayout } from '@/app/components/TPAPLayout';
import { OverviewPage } from '@/app/pages/OverviewPage';
import { TransactionsPage } from '@/app/pages/TransactionsPage';
import { MerchantsPage } from '@/app/pages/MerchantsPage';
import { RiskRulePage } from '@/app/pages/RiskRulePage';
import { UserManagementPage } from '@/app/pages/UserManagementPage';
import { TPAPManagementPage } from '@/app/pages/TPAPManagementPage';
import { TPAPDashboardPage } from '@/app/pages/tpap/TPAPDashboardPage';
import { TPAPTransactionsPage } from '@/app/pages/tpap/TPAPTransactionsPage';
import { TPAPRulesPage } from '@/app/pages/tpap/TPAPRulesPage';
import { TPAPVPAPage } from '@/app/pages/tpap/TPAPVPAPage';
import { TPAPReportsPage } from '@/app/pages/tpap/TPAPReportsPage';
import { ReconciliationPage } from '@/app/pages/tpap/ReconciliationPage';
import { UDIRPage } from '@/app/pages/tpap/UDIRPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<OverviewPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="merchants" element={<MerchantsPage />} />
          <Route path="risk-rules" element={<RiskRulePage />} />
          <Route path="user-management" element={<UserManagementPage />} />
          <Route path="tpap-management" element={<TPAPManagementPage />} />
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
