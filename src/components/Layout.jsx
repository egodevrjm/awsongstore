import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Music, Home, Tag, MapPin, Disc } from 'lucide-react'

const Layout = ({ children }) => {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center gap-3">
              <Music className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold text-white">Alex Wilson</h1>
                <p className="text-sm text-gray-400">Songbook</p>
              </div>
            </Link>

            <nav className="flex items-center gap-6">
              <Link 
                to="/" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/') 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Songs</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 mt-16">
        <div className="container py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Alex Wilson Songbook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout