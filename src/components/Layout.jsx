import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Music, Home, Plus, Menu, X, RefreshCw } from 'lucide-react'
import { useSongs } from '../context/SongContext'

const Layout = ({ children }) => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { reload } = useSongs()
  const [isReloading, setIsReloading] = useState(false)

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const handleReload = async () => {
    setIsReloading(true)
    await reload()
    setIsReloading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <div className="logo-icon-container">
                <Music className="logo-icon" />
              </div>
              <div className="logo-text">
                <h1>Alex Wilson</h1>
                <p>Kentucky Songbook</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                <Home className="w-4 h-4" />
                <span>Songs</span>
              </Link>
              
              <Link 
                to="/song/new" 
                className={`nav-link ${isActive('/song/new') ? 'active' : ''}`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Song</span>
              </Link>

              <button
                onClick={handleReload}
                className="nav-link"
                disabled={isReloading}
              >
                <RefreshCw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
                <span>{isReloading ? 'Reloading...' : 'Refresh Data'}</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-800"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-black/95 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="container h-full flex flex-col">
          <div className="flex items-center justify-between py-6">
            <Link to="/" className="logo" onClick={closeMobileMenu}>
              <div className="logo-icon-container">
                <Music className="logo-icon" />
              </div>
              <div className="logo-text">
                <h1>Alex Wilson</h1>
                <p>Kentucky Songbook</p>
              </div>
            </Link>
            
            <button 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-4 py-8">
            <Link 
              to="/" 
              className={`nav-link text-lg ${isActive('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <Home className="w-5 h-5" />
              <span>Songs</span>
            </Link>
            
            <Link 
              to="/song/new" 
              className={`nav-link text-lg ${isActive('/song/new') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <Plus className="w-5 h-5" />
              <span>Add Song</span>
            </Link>

            <button
              onClick={() => {
                handleReload();
                closeMobileMenu();
              }}
              className="nav-link text-lg"
              disabled={isReloading}
            >
              <RefreshCw className={`w-5 h-5 ${isReloading ? 'animate-spin' : ''}`} />
              <span>{isReloading ? 'Reloading...' : 'Refresh Data'}</span>
            </button>
          </nav>
          
          <div className="mt-auto pb-8 text-center text-gray-500 text-sm">
            <p>&copy; 2024 Alex Wilson Songbook</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-6 md:py-8 lg:py-12 flex-grow">
        <div className="fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 mt-8 md:mt-12 lg:mt-20 backdrop-blur-20">
        <div className="container py-4 md:py-6">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2024 Alex Wilson Songbook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout