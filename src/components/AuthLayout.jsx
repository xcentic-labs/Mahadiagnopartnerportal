import logo from '../assets/logo.png'
import hospital from '../assets/hospital.jpg'

// Split screen used by login, register and forgot password
const AuthLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
    <div className="flex flex-col px-6 py-6 sm:px-10 md:px-14 lg:w-1/2 xl:w-2/5 overflow-y-auto">
      <img src={logo} alt="MahaDiagno" className="w-36 sm:w-44" />
      <div className="mt-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy leading-snug">{title}</h1>
        {subtitle && <p className="mt-2 text-sm sm:text-base text-gray-500">{subtitle}</p>}
      </div>
      <div className="w-full max-w-md mt-8 pb-10">{children}</div>
    </div>

    <div className="hidden lg:flex relative lg:w-1/2 xl:w-3/5 text-white">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${hospital})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-blueshade/30 to-primary/80" />
      <div className="relative z-10 flex flex-col justify-end w-full px-12 xl:px-16 py-12">
        <h2 className="text-4xl xl:text-5xl font-bold">MahaDiagno</h2>
        <p className="text-2xl xl:text-3xl mt-2">Simplifying Diagnostics, Empowering Healthcare</p>
      </div>
    </div>
  </div>
)

export default AuthLayout
