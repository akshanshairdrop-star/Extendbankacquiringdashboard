import { Outlet, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Shield, Users, FileText, Settings, History, ArrowLeft, Bell, Calendar, Search } from 'lucide-react';
import { useState } from 'react';

export function TPAPLayout() {
  const location = useLocation();
  const { tpapId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { path: `/tpap/${tpapId}/dashboard`, icon: LayoutDashboard, label: 'TPAP Dashboard' },
    { path: `/tpap/${tpapId}/transactions`, icon: CreditCard, label: 'Transactions' },
    { path: `/tpap/${tpapId}/rules`, icon: Shield, label: 'Manage Rules' },
    { path: `/tpap/${tpapId}/vpa`, icon: Users, label: 'Manage VPA' },
    { path: `/tpap/${tpapId}/reports`, icon: FileText, label: 'Reports' },
    { path: `/tpap/${tpapId}/reconciliation`, icon: Settings, label: 'Reconciliation' },
    { path: `/tpap/${tpapId}/udir`, icon: History, label: 'UDIR' },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#170d3f] flex flex-col">
        {/* Logo */}
        <div className="h-[74px] flex items-center px-4 border-b border-[rgba(192,123,252,0.2)]">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c07bfc] to-[#4b1b91] flex items-center justify-center">
            <span className="text-white text-lg font-bold">B</span>
          </div>
          <div className="ml-3">
            <div className="text-[#c07bfc] text-sm font-semibold">BankAcquire</div>
            <div className="text-[#d9cde4] text-xs opacity-60">TPAP Portal</div>
          </div>
        </div>

        {/* Back to Main Dashboard */}
        <button
          onClick={() => navigate('/tpap-management')}
          className="mx-3 mt-4 mb-2 flex items-center gap-2 px-4 py-2 text-[#d9cde4] hover:bg-[rgba(192,123,252,0.08)] rounded-lg transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to TPAP List</span>
        </button>

        {/* TPAP Info */}
        <div className="mx-3 mb-4 p-3 bg-[rgba(75,27,145,0.3)] border border-[rgba(192,123,252,0.2)] rounded-lg">
          <p className="text-[#c07bfc] text-xs font-semibold mb-1">Current TPAP</p>
          <p className="text-white text-sm font-medium">TPAP-{tpapId}</p>
          <p className="text-[#d9cde4] text-xs opacity-70 mt-1">PayTech Solutions Ltd.</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-all ${
                  isActive
                    ? 'bg-[rgba(192,123,252,0.15)] border-l-2 border-[#c07bfc] text-[#c07bfc]'
                    : 'text-[#d9cde4] hover:bg-[rgba(192,123,252,0.08)]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-[rgba(192,123,252,0.2)]">
          <p className="text-[#d9cde4] text-xs opacity-50">© 2026 BankAcquire</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#e6e2e9] flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <div>
              <h1 className="text-[#1a1339] text-xl font-semibold">TPAP Management Portal</h1>
              <p className="text-[#635c8a] text-sm">Third Party Application Provider</p>
            </div>
            
            {/* Global Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#635c8a]" />
              <input
                type="text"
                placeholder="Search transactions, VPA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#f8f7fa] border border-[#e6e2e9] rounded-lg text-sm text-[#1a1339] placeholder:text-[#635c8a] focus:outline-none focus:ring-2 focus:ring-[#4b1b91] focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Date Range */}
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
                TP
              </div>
              <div className="text-sm">
                <div className="font-medium text-[#1a1339]">TPAP User</div>
                <div className="text-xs text-[#635c8a]">TPAP Admin</div>
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