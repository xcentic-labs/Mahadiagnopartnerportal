import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, Stethoscope, CalendarCheck, CreditCard, BadgeCheck, Bike,
  Wallet, Banknote, UserRound, LifeBuoy, X,
} from 'lucide-react'
import logo from '../assets/logo.png'

const sections = [
  {
    title: 'Overview',
    items: [{ title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }],
  },
  {
    title: 'Operations',
    items: [
      { title: 'My Services', icon: Stethoscope, path: '/services' },
      { title: 'Appointments', icon: CalendarCheck, path: '/appointments' },
      { title: 'Service Boys', icon: Bike, path: '/service-boys' },
    ],
  },
  {
    title: 'Subscription',
    items: [
      { title: 'Buy Subscription', icon: CreditCard, path: '/subscription' },
      { title: 'My Subscriptions', icon: BadgeCheck, path: '/my-subscriptions' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { title: 'Wallet', icon: Wallet, path: '/wallet' },
      { title: 'Payment Method', icon: Banknote, path: '/payment-method' },
    ],
  },
  {
    title: 'Account',
    items: [
      { title: 'Profile', icon: UserRound, path: '/profile' },
      { title: 'Help & Support', icon: LifeBuoy, path: '/help' },
    ],
  },
]

const Sidebar = ({ open, onClose }) => (
  <>
    {open && <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" onClick={onClose} />}
    <aside
      className={`fixed z-50 top-0 left-0 h-full w-72 bg-white shadow-lg border-r border-gray-200 flex flex-col
        transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}
        md:static md:translate-x-0`}
    >
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <Link to="/dashboard" onClick={onClose} className="flex-1 flex justify-center">
          <img src={logo} alt="MahaDiagno" className="h-14 object-contain" />
        </Link>
        <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={onClose} aria-label="Close sidebar">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{section.title}</p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blueshade text-primary font-semibold border-l-4 border-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 text-xs text-gray-400">
        © {new Date().getFullYear()} MahaDiagno. All Rights Reserved.
      </div>
    </aside>
  </>
)

export default Sidebar
