// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from '../services/authService'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const userName = user?.user_metadata?.full_name || user?.email || ''

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">✓</span>
        </div>
        <span className="text-xl font-bold text-gray-800">TaskFlow</span>
      </Link>

      {/* Right side */}
      {user && (
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-sm">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-600 font-medium">
              {userName.split(' ')[0]}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}