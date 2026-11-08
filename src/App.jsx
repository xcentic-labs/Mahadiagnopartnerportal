import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from './routes/ProtectedRoute'
import { isLoggedIn } from './utils/auth'

import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Services from './pages/Services'
import Appointments from './pages/Appointments'
import Subscription from './pages/Subscription'
import MySubscriptions from './pages/MySubscriptions'
import ServiceBoys from './pages/ServiceBoys'
import TrackLocation from './pages/TrackLocation'
import Wallet from './pages/Wallet'
import PaymentMethod from './pages/PaymentMethod'
import Profile from './pages/Profile'
import Help from './pages/Help'
import { Terms, Privacy } from './pages/Policies'
import NotFound from './pages/NotFound'

const App = () => (
  <>
    <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick pauseOnHover theme="light" />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn() ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/my-subscriptions" element={<MySubscriptions />} />
          <Route path="/service-boys" element={<ServiceBoys />} />
          <Route path="/service-boys/:id/track" element={<TrackLocation />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/payment-method" element={<PaymentMethod />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>
)

export default App
