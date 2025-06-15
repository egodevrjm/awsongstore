import React, { useState } from 'react'
import { useSongs } from '../context/SongContext'
import SongGrid from '../components/SongGrid'
import SearchAndFilter from '../components/SearchAndFilter'
import { Music } from 'lucide-react'

const HomePage = () => {
  const { songs, loading, error } = useSongs()
  const [filteredSongs, setFilteredSongs] = useState([])
  const [viewMode, setViewMode] = useState('grid')

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg mb-4">Error loading songs</div>
        <p className="text-gray-400">{error}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Music className="w-12 h-12 text-red-600" />
          <h1 className="text-4xl font-bold">Alex Wilson Songbook</h1>
        </div>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Explore the complete collection of songs from Kentucky's coal country storyteller
        </p>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        songs={songs}
        onFilteredSongs={setFilteredSongs}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Songs Grid */}
      <SongGrid songs={filteredSongs} loading={loading} />
    </div>
  )
}

export default HomePage