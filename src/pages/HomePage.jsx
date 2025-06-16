import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSongs } from '../context/SongContext'
import SongGrid from '../components/SongGrid'
import SearchAndFilter from '../components/SearchAndFilter'
import { Music, Plus, RefreshCw, Tag, MapPin } from 'lucide-react'

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
      <div className="text-center space-y-4 md:space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Alex Wilson Songbook
        </h1>
        <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Stories from Kentucky's coal country, told through song. 
          Explore the complete collection of heartfelt ballads, working-class anthems, 
          and tales of resilience from Appalachia's mountains.
        </p>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/song/new"
            className="btn btn-primary text-base px-6 py-3 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            Add New Song
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto px-4 sm:px-0 mt-6">
          <div className="bg-white/5 backdrop-blur-10 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Music className="w-5 h-5 text-red-400" />
              <span className="text-xl font-bold">{totalSongs}</span>
            </div>
            <p className="text-gray-400 text-xs">Songs</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-10 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Tag className="w-5 h-5 text-blue-400" />
              <span className="text-xl font-bold">{totalThemes}</span>
            </div>
            <p className="text-gray-400 text-xs">Themes</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-10 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-green-400" />
              <span className="text-xl font-bold">{totalVenues}</span>
            </div>
            <p className="text-gray-400 text-xs">Venues</p>
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