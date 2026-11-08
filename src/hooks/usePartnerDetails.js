import { useCallback, useEffect, useState } from 'react'
import api, { errorMessage } from '../utils/api'
import { usePartner } from './usePartner'

// Fresh partner record from the server: includes address, services, serviceBoy,
// appointment, subscription_purchase, paymentMethod, amount and isSubscribed.
export const usePartnerDetails = () => {
  const partner = usePartner()
  const partnerId = partner?.id
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!partnerId) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/partners/getpartners/${partnerId}`)
      setDetails(res.data.partner)
    } catch (err) {
      setError(errorMessage(err, 'Unable to load partner details'))
    } finally {
      setLoading(false)
    }
  }, [partnerId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { partner, details, loading, error, refresh }
}
