export const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`

export const formatDate = (value) => {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const formatDateTime = (value) => {
  if (!value) return 'N/A'
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
  })
}
