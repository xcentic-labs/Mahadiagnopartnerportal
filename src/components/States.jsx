import { AlertCircle, Inbox, Loader2 } from 'lucide-react'

export const Loader = ({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center py-16 text-gray-500">
    <Loader2 className="w-7 h-7 animate-spin text-primary" />
    <span className="ml-3">{text}</span>
  </div>
)

export const ErrorState = ({ message, onRetry }) => (
  <div className="card p-10 text-center">
    <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
    <p className="text-red-600 mt-3">{message}</p>
    {onRetry && (
      <button className="btn-primary mt-4" onClick={onRetry}>Retry</button>
    )}
  </div>
)

export const EmptyState = ({ title, message, action }) => (
  <div className="card p-12 text-center">
    <Inbox className="w-12 h-12 text-gray-300 mx-auto" />
    <p className="text-gray-700 font-semibold mt-3">{title}</p>
    {message && <p className="text-gray-500 text-sm mt-1">{message}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
)
