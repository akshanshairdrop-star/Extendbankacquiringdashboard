import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-[#f5effb] flex items-center justify-center mb-4">
        {icon || <Inbox className="w-8 h-8 text-[#c07bfc]" />}
      </div>
      <h3 className="text-lg font-semibold text-[#1a1339] mb-2">{title}</h3>
      {description && (
        <p className="text-[#635c8a] text-sm text-center max-w-md mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
