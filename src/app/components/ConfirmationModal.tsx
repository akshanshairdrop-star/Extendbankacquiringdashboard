import { ReactNode, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  requireReason?: boolean;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  requireReason = false,
  isLoading = false,
}: ConfirmationModalProps) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) return;
    onConfirm(reason);
    setReason('');
  };

  const variantStyles = {
    danger: 'bg-[#d74242] hover:bg-[#c23838]',
    warning: 'bg-[#f59f0a] hover:bg-[#e08f09]',
    info: 'bg-[#4b1b91] hover:bg-[#3d1575]'
  };

  const iconColors = {
    danger: 'text-[#d74242]',
    warning: 'text-[#f59f0a]',
    info: 'text-[#4b1b91]'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-full bg-opacity-10 flex items-center justify-center mb-4 ${variant === 'danger' ? 'bg-red-100' : variant === 'warning' ? 'bg-orange-100' : 'bg-purple-100'}`}>
            <AlertTriangle className={`w-6 h-6 ${iconColors[variant]}`} />
          </div>

          {/* Title & Message */}
          <h3 className="text-lg font-bold text-[#1a1339] mb-2">{title}</h3>
          <p className="text-[#635c8a] text-sm mb-4">{message}</p>

          {/* Reason Input */}
          {requireReason && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1a1339] mb-2">
                Reason {requireReason && <span className="text-[#d74242]">*</span>}
              </label>
              <textarea
                className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc] resize-none"
                rows={3}
                placeholder="Enter reason for this action..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[#f5effb] text-[#c07bfc] rounded-lg hover:bg-[#ede5f7] transition-colors font-medium disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || (requireReason && !reason.trim())}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium disabled:opacity-50 ${variantStyles[variant]}`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
