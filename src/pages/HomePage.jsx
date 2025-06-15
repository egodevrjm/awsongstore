import React, { useState } from 'react'
import { useSongs } from '../context/SongContext'
import SongGrid from '../components/SongGrid'
import SearchAndFilter from '../components/SearchAndFilter'
import { Music, Sparkles, MapPin, Tag, TrendingUp } from 'lucide-react'

const HomePage = () => {
  const { songs, loading, error } = useSongs()
  const [filteredSongs, setFilteredSongs] = useState([])
  const [viewMode, setViewMode] = useState('grid')

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Music className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-red-400 mb-4">Unable to Load Songs</h1>
          <p className="text-gray-400 leading-relaxed">{error}</p>
        </div>
      </div>
    )
  }

  const totalSongs = songs.length
  const totalThemes = new Set(songs.flatMap(song => song.themes || [])).size
  const totalVenues = new Set(songs.flatMap(song => song.suggested_venues || [])).size

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full"></div>
          <div className="relative flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <Music className="w-16 h-16 text-red-600" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Alex Wilson
          </h1>
          <h2 className="text-2xl md:text-3xl font-display text-red-400 font-medium">
            Kentucky Songbook
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Stories from Kentucky's coal country, told through song. 
            Explore the complete collection of heartfelt ballads, working-class anthems, 
            and tales of resilience from Appalachia's mountains.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-10 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Music className="w-6 h-6 text-red-400" />
              <span className="text-2xl font-bold">{totalSongs}</span>
            </div>
            <p className="text-gray-400 text-sm">Songs</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-10 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Tag className="w-6 h-6 text-blue-400" />
              <span className="text-2xl font-bold">{totalThemes}</span>
            </div>
            <p className="text-gray-400 text-sm">Themes</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-10 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <MapPin className="w-6 h-6 text-green-400" />
              <span className="text-2xl font-bold">{totalVenues}</span>
            </div>
            <p className="text-gray-400 text-sm">Venues</p>
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
        <SongGrid songs={filteredSongs} loading={loading} />
      </div>
    </div>
  )
}

export default HomePage