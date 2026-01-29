interface StatusBadgeProps {
  status: 'success' | 'failed' | 'pending';
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles = {
    success: 'bg-[#eaf6f0] text-[#34b277] border-[rgba(52,178,119,0.3)]',
    failed: 'bg-[#f9ecec] text-[#d74242] border-[rgba(215,66,66,0.3)]',
    pending: 'bg-[#fef3e8] text-[#f59f0a] border-[rgba(245,159,10,0.3)]'
  };

  const labels = {
    success: 'Success',
    failed: 'Failed',
    pending: 'Pending'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border ${styles[status]}`}>
      {label || labels[status]}
    </span>
  );
}
