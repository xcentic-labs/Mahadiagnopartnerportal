const PARTNER_KEY = 'partner'
const LOGGED_IN_KEY = 'isLoggedIn'

export const getPartner = () => {
  try {
    const raw = localStorage.getItem(PARTNER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const isLoggedIn = () => localStorage.getItem(LOGGED_IN_KEY) === 'true' && !!getPartner()

export const saveSession = (partner) => {
  localStorage.setItem(PARTNER_KEY, JSON.stringify(partner))
  localStorage.setItem(LOGGED_IN_KEY, 'true')
}

export const clearSession = () => {
  localStorage.removeItem(PARTNER_KEY)
  localStorage.removeItem(LOGGED_IN_KEY)
}
