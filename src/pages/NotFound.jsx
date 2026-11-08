import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
    <p className="text-6xl font-bold text-primary">404</p>
    <p className="text-gray-600 mt-3">The page you are looking for does not exist.</p>
    <Link to="/" className="btn-primary mt-6">Go home</Link>
  </div>
)

export default NotFound
