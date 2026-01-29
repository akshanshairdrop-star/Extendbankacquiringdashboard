import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
    label: string;
  };
  icon?: LucideIcon;
}

export function KPICard({ title, value, subtitle, trend, icon: Icon }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl border-l-4 border-[#c77efc] p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[#635c8a] text-sm font-medium mb-2">{title}</p>
          <h3 className="text-[#1a1339] text-2xl font-bold mb-1">{value}</h3>
          {subtitle && (
            <p className="text-[#635c8a] text-xs">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-2 mt-3">
              <span className={`text-sm font-medium ${
                trend.direction === 'up' ? 'text-[#34b277]' : 'text-[#d74242]'
              }`}>
                {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-[#635c8a] text-sm">{trend.label}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 bg-[#f5effb] rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#571c92]" />
          </div>
        )}
      </div>
    </div>
  );
}
