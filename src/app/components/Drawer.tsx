import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Drawer({ isOpen, onClose, title, children, size = 'md' }: DrawerProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'w-96',
    md: 'w-[600px]',
    lg: 'w-[800px]'
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed right-0 top-0 bottom-0 ${sizeClasses[size]} bg-white z-50 shadow-2xl overflow-hidden flex flex-col animate-slide-in-right`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e6e2e9]">
          <h3 className="text-xl font-bold text-[#1a1339]">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </>
  );
}
