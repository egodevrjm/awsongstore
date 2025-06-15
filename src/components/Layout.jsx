import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Music, Home, Sparkles, Plus } from 'lucide-react'

const Layout = ({ children }) => {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <div className="relative">
                <Music className="logo-icon" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
              <div className="logo-text">
                <h1>Alex Wilson</h1>
                <p>Kentucky Songbook</p>
              </div>
            </Link>

            <nav className="flex items-center gap-4">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Songs</span>
              </Link>
              
              <Link 
                to="/song/new" 
                className={`nav-link ${isActive('/song/new') ? 'active' : ''}`}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Song</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 mt-20 backdrop-blur-20">
        <div className="container py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Music className="w-6 h-6 text-red-600" />
              <span className="font-display text-xl font-semibold">Alex Wilson Songbook</span>
            </div>
            <p className="text-gray-400 mb-4">
              Stories from Kentucky's coal country, told through song
            </p>
            <p className="text-gray-500 text-sm">
              &copy; 2024 Alex Wilson. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout