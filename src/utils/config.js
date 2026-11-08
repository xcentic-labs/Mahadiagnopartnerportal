// Server root, e.g. https://api.mahadiagno.com
// Static files (reports, banners) and the socket server live here.
export const SERVER_URL = (import.meta.env.VITE_SERVER_URL || 'https://api.mahadiagno.com').replace(/\/$/, '')

// REST API root
export const API_URL = `${SERVER_URL}/api/v1`

export const reportUrl = (name) => `${SERVER_URL}/reports/${name}`
export const partnerBannerUrl = (name) => `${SERVER_URL}/partnerbanner/${name}`
