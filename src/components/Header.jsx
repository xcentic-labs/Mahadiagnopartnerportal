import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Menu, UserRound } from 'lucide-react'
import { clearSession } from '../utils/auth'
import { usePartner } from '../hooks/usePartner'
import ConfirmDialog from './ConfirmDialog'

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate()
  const partner = usePartner()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleLogout = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button className="md:hidden" onClick={onMenuClick} aria-label="Open sidebar">
            <Menu className="w-7 h-7 text-gray-700" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Partner Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Manage services, appointments, service boys & payouts</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/profile" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100">
            <div className="w-8 h-8 rounded-full bg-blueshade flex items-center justify-center">
              <UserRound className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-gray-700 max-w-40 truncate">{partner?.hospitalName}</span>
          </Link>
          <button
            onClick={() => setConfirmOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-white font-semibold bg-red-500 hover:bg-red-600 rounded-lg cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Log out"
        message="Are you sure you want to log out?"
        confirmLabel="Log out"
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleLogout}
      />
    </header>
  )
}

export default Header
