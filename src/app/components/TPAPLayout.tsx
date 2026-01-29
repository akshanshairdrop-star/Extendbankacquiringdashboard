import { Outlet, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Shield, Users, FileText, Settings, History, ArrowLeft, Bell } from 'lucide-react';

export function TPAPLayout() {
  const location = useLocation();
  const { tpapId } = useParams();
  const navigate = useNavigate();

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
      <aside className="w-64 bg-[#190d3f] flex flex-col">
        {/* Logo */}
        <div className="h-[74px] flex items-center px-4 border-b border-[#2c224f]">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c77efc] to-[#571c92] flex items-center justify-center">
            <span className="text-white text-lg font-bold">B</span>
          </div>
          <div className="ml-3">
            <div className="text-[#c77efc] text-sm font-semibold">BankAcquire</div>
            <div className="text-[#d9cde4] text-xs opacity-60">TPAP Portal</div>
          </div>
        </div>

        {/* Back to Main Dashboard */}
        <button
          onClick={() => navigate('/tpap-management')}
          className="mx-3 mt-4 mb-2 flex items-center gap-2 px-4 py-2 text-[#d9cde4] hover:bg-[rgba(199,126,252,0.08)] rounded-lg transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to TPAP List</span>
        </button>

        {/* TPAP Info */}
        <div className="mx-3 mb-4 p-3 bg-[#2c224f] rounded-lg">
          <p className="text-[#c77efc] text-xs font-semibold mb-1">Current TPAP</p>
          <p className="text-white text-sm font-medium">TPAP-{tpapId}</p>
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
            <h1 className="text-[#1a1339] text-xl font-semibold">TPAP Management Portal</h1>
            <p className="text-[#635c8a] text-sm">Third Party Application Provider</p>
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
