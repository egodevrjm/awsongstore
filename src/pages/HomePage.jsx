import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSongs } from '../context/SongContext'
import SongGrid from '../components/SongGrid'
import SearchAndFilter from '../components/SearchAndFilter'
import { Music, Sparkles, MapPin, Tag, Plus, RefreshCw } from 'lucide-react'

const HomePage = () => {
  const { songs, loading, error, reload } = useSongs()
  const [filteredSongs, setFilteredSongs] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [isReloading, setIsReloading] = useState(false)

  useEffect(() => {
    setFilteredSongs(songs)
  }, [songs])

  const handleReload = async () => {
    setIsReloading(true)
    await reload()
    setIsReloading(false)
  }

  if (error) {
    return (
      <div className="text-center py-12 md:py-20">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Music className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-red-400 mb-4">Unable to Load Songs</h1>
          <p className="text-gray-400 leading-relaxed mb-6">{error}</p>
          <button 
            onClick={handleReload}
            className="btn btn-primary"
            disabled={isReloading}
          >
            <RefreshCw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
            {isReloading ? 'Reloading...' : 'Try Again'}
          </button>
        </div>
      </div>
    )
  }

  const totalSongs = songs.length
  const totalThemes = new Set(songs.flatMap(song => song.themes || [])).size
  const totalVenues = new Set(songs.flatMap(song => song.suggested_venues || [])).size

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 md:space-y-8">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full"></div>
          <div className="relative flex items-center justify-center gap-4 mb-4 md:mb-6">
            <div className="relative">
              <Music className="w-12 h-12 md:w-16 md:h-16 text-red-600" />
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="space-y-3 md:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Alex Wilson
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-display text-red-400 font-medium">
            Kentucky Songbook
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Stories from Kentucky's coal country, told through song. 
            Explore the complete collection of heartfelt ballads, working-class anthems, 
            and tales of resilience from Appalachia's mountains.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/song/new"
            className="btn btn-primary text-base md:text-lg px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            Add New Song
          </Link>
          
          <button
            onClick={handleReload}
            className="btn btn-secondary text-base md:text-lg px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto"
            disabled={isReloading}
          >
            <RefreshCw className={`w-5 h-5 ${isReloading ? 'animate-spin' : ''}`} />
            {isReloading ? 'Reloading...' : 'Refresh Data'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto px-4 sm:px-0">
          <div className="bg-white/5 backdrop-blur-10 rounded-2xl p-4 md:p-6 border border-white/10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Music className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
              <span className="text-xl md:text-2xl font-bold">{totalSongs}</span>
            </div>
            <p className="text-gray-400 text-xs md:text-sm">Songs</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-10 rounded-2xl p-4 md:p-6 border border-white/10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Tag className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              <span className="text-xl md:text-2xl font-bold">{totalThemes}</span>
            </div>
            <p className="text-gray-400 text-xs md:text-sm">Themes</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-10 rounded-2xl p-4 md:p-6 border border-white/10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
              <span className="text-xl md:text-2xl font-bold">{totalVenues}</span>
            </div>
            <p className="text-gray-400 text-xs md:text-sm">Venues</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        songs={songs}
        onFilteredSongs={setFilteredSongs}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Songs Grid */}
      <div className="slide-up">
        <SongGrid songs={filteredSongs} loading={loading} viewMode={viewMode} />
      </div>
    </div>
  )
}

export default HomePage