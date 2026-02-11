import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'transactions': 'Transactions',
    'merchants': 'Merchant Management',
    'risk-rules': 'Risk Rules',
    'user-management': 'User Management',
    'tpap-management': 'TPAP Management',
    'tpap': 'TPAP',
    'rules': 'Manage Rules',
    'vpa': 'Manage VPA',
    'reports': 'Reports',
    'reconciliation': 'Reconciliation',
    'udir': 'UDIR',
    'merchant-portfolio': 'Merchant Portfolio',
    'npci-files': 'NPCI File Management',
    'three-way-recon': '3-Way Reconciliation',
    'settlement-ageing': 'Settlement Ageing',
    'daily-settlement': 'Daily Settlement',
    'txn-reconciliation': 'Transaction Reconciliation',
    'unsettled': 'Unsettled Transactions',
    'refund-reversal': 'Refund & Reversal',
    'efrm': 'Fraud Monitoring',
    'txn-monitor': 'Transaction Monitor',
    'merchant-risk': 'Merchant Risk',
    'psp-monitor': 'PSP Monitoring',
    'alerts': 'Alerts & Escalation',
    'settlement-risk': 'Settlement Risk',
    'audit-logs': 'Audit Logs',
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link to="/dashboard" className="flex items-center gap-1 text-[#635c8a] hover:text-[#4b1b91] transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        const label = breadcrumbMap[segment] || segment;

        return (
          <div key={path} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-[#635c8a]" />
            {isLast ? (
              <span className="text-[#1a1339] font-medium">{label}</span>
            ) : (
              <Link to={path} className="text-[#635c8a] hover:text-[#4b1b91] transition-colors">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
