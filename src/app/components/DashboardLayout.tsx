import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  LayoutDashboard, CreditCard, Users, Bell, Shield, UserCog, Building2,
  ChevronDown, ChevronRight, Package, FileText, AlertTriangle, Activity,
  DollarSign, RefreshCw, Eye, AlertCircle, FileCheck, Calendar, Search
} from 'lucide-react';
import { Breadcrumb } from '@/app/components/Breadcrumb';

interface MenuItem {
  path?: string;
  icon: any;
  label: string;
  children?: MenuItem[];
}

export function DashboardLayout() {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['merchant', 'reconciliation', 'risk']);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSection = (label: string) => {
    setExpandedSections(prev =>
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    );
  };

  const menuItems: MenuItem[] = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    
    // Merchant Management
    {
      icon: Users,
      label: 'Merchant Management',
      children: [
        { path: '/merchant-portfolio', icon: Package, label: 'Merchant Portfolio' },
        { path: '/merchants', icon: Users, label: 'All Merchants' },
        { path: '/merchant-risk', icon: Shield, label: 'Merchant Risk' },
      ]
    },
    
    // Reconciliation
    {
      icon: FileCheck,
      label: 'Reconciliation',
      children: [
        { path: '/npci-files', icon: FileText, label: 'NPCI File Management' },
        { path: '/three-way-recon', icon: RefreshCw, label: '3-Way Reconciliation' },
        { path: '/settlement-ageing', icon: Calendar, label: 'Settlement Ageing' },
        { path: '/daily-settlement', icon: DollarSign, label: 'Daily Settlement' },
        { path: '/txn-reconciliation', icon: CreditCard, label: 'Transaction Recon' },
        { path: '/unsettled', icon: AlertCircle, label: 'Unsettled Txns' },
        { path: '/refund-reversal', icon: RefreshCw, label: 'Refund & Reversal' },
      ]
    },
    
    // Risk & Fraud
    {
      icon: Shield,
      label: 'Risk & Fraud',
      children: [
        { path: '/efrm', icon: AlertTriangle, label: 'Fraud Monitoring' },
        { path: '/txn-monitor', icon: Eye, label: 'Transaction Monitor' },
        { path: '/risk-rules', icon: Shield, label: 'Risk Rules' },
        { path: '/settlement-risk', icon: DollarSign, label: 'Settlement Risk' },
      ]
    },
    
    // Monitoring
    {
      icon: Activity,
      label: 'Monitoring',
      children: [
        { path: '/psp-monitor', icon: Building2, label: 'PSP / TPAP Monitor' },
        { path: '/alerts', icon: Bell, label: 'Alerts & Escalation' },
        { path: '/transactions', icon: CreditCard, label: 'All Transactions' },
      ]
    },
    
    // System
    {
      icon: FileText,
      label: 'System',
      children: [
        { path: '/reports', icon: FileText, label: 'Reports' },
        { path: '/audit-logs', icon: FileCheck, label: 'Audit Logs' },
        { path: '/user-management', icon: UserCog, label: 'User Management' },
        { path: '/tpap-management', icon: Building2, label: 'TPAP Management' },
      ]
    },
  ];

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.includes(item.label);
    const active = isActive(item.path);

    if (hasChildren) {
      return (
        <div key={item.label} className="mb-1">
          <button
            onClick={() => toggleSection(item.label)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-[#d9cde4] hover:bg-[rgba(192,123,252,0.08)] transition-all"
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {isExpanded && (
            <div className="mt-1 ml-4 space-y-1">
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path!}
        className={`flex items-center px-4 py-2.5 rounded-lg mb-1 transition-all ${
          active
            ? 'bg-[rgba(192,123,252,0.15)] border-l-2 border-[#c07bfc] text-[#c07bfc]'
            : 'text-[#d9cde4] hover:bg-[rgba(192,123,252,0.08)]'
        } ${level > 0 ? 'pl-8' : ''}`}
      >
        <Icon className="w-4 h-4" />
        <span className="ml-3 text-sm font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-72 bg-[#170d3f] flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="h-[74px] flex items-center px-4 border-b border-[rgba(192,123,252,0.2)] flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c07bfc] to-[#4b1b91] flex items-center justify-center">
            <span className="text-white text-lg font-bold">B</span>
          </div>
          <div className="ml-3">
            <div className="text-[#c07bfc] text-sm font-semibold">BankAcquire</div>
            <div className="text-[#d9cde4] text-xs opacity-60">PayTech Dashboard</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-[rgba(192,123,252,0.2)] flex-shrink-0">
          <p className="text-[#d9cde4] text-xs opacity-50">© 2026 BankAcquire</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#e6e2e9] flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <Breadcrumb />
            
            {/* Global Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#635c8a]" />
              <input
                type="text"
                placeholder="Search TXN ID / UPI Ref / VPA / Merchant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#f8f7fa] border border-[#e6e2e9] rounded-lg text-sm text-[#1a1339] placeholder:text-[#635c8a] focus:outline-none focus:ring-2 focus:ring-[#4b1b91] focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Date Range Picker */}
            <button className="flex items-center gap-2 px-4 py-2 bg-[#fcfcfd] border border-[#e6e2e9] rounded-lg text-[#1a1339] text-sm font-medium hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4" />
              Today
            </button>
            
            {/* Alerts */}
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors relative">
              <Bell className="w-5 h-5 text-[#1a1339]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#d74242] rounded-full animate-pulse"></span>
            </button>
            
            {/* User Profile */}
            <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#4b1b91] text-white flex items-center justify-center text-sm font-semibold">
                JD
              </div>
              <div className="text-sm">
                <div className="font-medium text-[#1a1339]">John Doe</div>
                <div className="text-xs text-[#635c8a]">Bank Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#fafafa]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}