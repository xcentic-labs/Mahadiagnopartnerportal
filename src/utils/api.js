import axios from 'axios'
import { API_URL } from './config'

const api = axios.create({ baseURL: API_URL })

// Pulls a readable message out of an axios error
export const errorMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.error || error?.response?.data?.message || error?.message || fallback

export default api
