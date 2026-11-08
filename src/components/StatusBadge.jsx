const styles = {
  ACCEPTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  SCHEDULED: 'bg-amber-50 text-amber-700 border-amber-200',
  COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  SUCCESS: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
}

const StatusBadge = ({ status }) => {
  const key = status?.toUpperCase()
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${styles[key] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
      {status || 'PENDING'}
    </span>
  )
}

export default StatusBadge
