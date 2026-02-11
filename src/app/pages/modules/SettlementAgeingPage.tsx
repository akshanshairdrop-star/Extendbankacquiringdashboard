import { KPICard } from '@/app/components/KPICard';
import { DataTable, Column } from '@/app/components/DataTable';
import { DollarSign, Clock, AlertTriangle, Download } from 'lucide-react';
import { toast } from 'sonner';

interface AgeingRecord {
  id: string;
  merchant: string;
  amount: string;
  ageingDays: number;
  category: '0-7' | '8-15' | '16-30' | '30+';
  exposure: string;
}

const mockData: AgeingRecord[] = [
  { id: '1', merchant: 'Amazon', amount: '₹2.4 Cr', ageingDays: 5, category: '0-7', exposure: '₹15.2 Cr' },
  { id: '2', merchant: 'Flipkart', amount: '₹1.8 Cr', ageingDays: 12, category: '8-15', exposure: '₹12.8 Cr' },
  { id: '3', merchant: 'Swiggy', amount: '₹850 L', ageingDays: 25, category: '16-30', exposure: '₹8.5 Cr' },
  { id: '4', merchant: 'Zomato', amount: '₹4.2 Cr', ageingDays: 35, category: '30+', exposure: '₹18.9 Cr' },
];

export function SettlementAgeingPage() {
  const columns: Column<AgeingRecord>[] = [
    { key: 'merchant', label: 'Merchant', sortable: true, render: (row) => <span className="font-medium">{row.merchant}</span> },
    { key: 'amount', label: 'Unsettled Amount', sortable: true, render: (row) => <span className="font-bold text-[#1a1339]">{row.amount}</span> },
    { key: 'ageingDays', label: 'Ageing Days', sortable: true, render: (row) => <span className={`font-bold ${row.ageingDays > 30 ? 'text-[#d74242]' : row.ageingDays > 15 ? 'text-[#f59f0a]' : 'text-[#34b277]'}`}>{row.ageingDays}</span> },
    { key: 'category', label: 'Category', render: (row) => <span className={`px-3 py-1 rounded-md text-xs font-medium ${row.category === '30+' ? 'bg-[#f9ecec] text-[#d74242]' : row.category === '16-30' ? 'bg-[#fef3e8] text-[#f59f0a]' : 'bg-[#eaf6f0] text-[#34b277]'}`}>{row.category} days</span> },
    { key: 'exposure', label: 'Total Exposure', sortable: true, render: (row) => <span className="font-semibold">{row.exposure}</span> },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-[#1a1339]">Settlement Ageing</h2><p className="text-[#635c8a] text-sm mt-1">Track unsettled amounts by age</p></div>
        <button onClick={() => toast.success('Report downloaded')} className="flex items-center gap-2 px-4 py-2 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575]"><Download className="w-4 h-4" />Download Report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Unsettled" value="₹9.25 Cr" subtitle="Pending settlement" icon={DollarSign} />
        <KPICard title="0-7 Days" value="₹2.4 Cr" subtitle="Within SLA" icon={Clock} />
        <KPICard title="8-15 Days" value="₹1.8 Cr" subtitle="Near breach" icon={AlertTriangle} />
        <KPICard title="30+ Days" value="₹4.2 Cr" subtitle="Critical" icon={AlertTriangle} />
      </div>

      <DataTable columns={columns} data={mockData} searchable searchPlaceholder="Search merchants..." rowKey={(row) => row.id} />
    </div>
  );
}
