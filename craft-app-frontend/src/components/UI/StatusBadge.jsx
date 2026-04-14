const STATUS_STYLES = {
  // Order statuses
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800',
  payment_failed: 'bg-red-100 text-red-800',
  // Active/inactive
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  // User roles
  admin: 'bg-red-100 text-red-800',
  creator: 'bg-purple-100 text-purple-800',
  user: 'bg-blue-100 text-blue-800',
  // Payment
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default function StatusBadge({ status, className = '' }) {
  const style = STATUS_STYLES[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${style} ${className}`}>
      {status}
    </span>
  );
}
