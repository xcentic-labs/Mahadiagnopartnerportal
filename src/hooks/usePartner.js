import { useMemo } from 'react'
import { getPartner } from '../utils/auth'

// Partner saved at login (id, hospitalName, phoneNumber, email, ...)
export const usePartner = () => useMemo(() => getPartner(), [])
