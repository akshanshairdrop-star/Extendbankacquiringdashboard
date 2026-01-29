import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Users, Bell, Shield, UserCog, Building2 } from 'lucide-react';

export function DashboardLayout() {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/transactions', icon: CreditCard, label: 'Transactions' },
    { path: '/merchants', icon: Users, label: 'Merchant Management' },
    { path: '/risk-rules', icon: Shield, label: 'Risk Rules' },
    { path: '/user-management', icon: UserCog, label: 'User Management' },
    { path: '/tpap-management', icon: Building2, label: 'TPAP Management' },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#190d3f] flex flex-col">
        {/* Logo */}
        <div className="h-[74px] flex items-center px-4 border-b border-[#2c224f]">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c77efc] to-[#571c92] flex items-center justify-center">
            <span className="text-white text-lg font-bold">B</span>
          </div>
          <div className="ml-3">
            <div className="text-[#c77efc] text-sm font-semibold">BankAcquire</div>
            <div className="text-[#d9cde4] text-xs opacity-60">UPI Dashboard</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-all ${
                  isActive
                    ? 'bg-[rgba(199,126,252,0.15)] border-l-2 border-[#c77efc] text-[#c77efc]'
                    : 'text-[#d9cde4] hover:bg-[rgba(199,126,252,0.08)]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-[#2c224f]">
          <p className="text-[#d9cde4] text-xs opacity-50">© 2026 BankAcquire</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#e6e2e9] flex items-center justify-between px-6">
          <div>
            <h1 className="text-[#1a1339] text-xl font-semibold">Bank Acquiring Dashboard</h1>
            <p className="text-[#635c8a] text-sm">UPI Transaction Analytics</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-[#fcfcfd] border border-[#e6e2e9] rounded-lg text-[#1a1339] text-sm font-medium hover:bg-gray-50 transition-colors">
              Today
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors relative">
              <Bell className="w-5 h-5 text-[#1a1339]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#d74242] rounded-full"></span>
            </button>
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