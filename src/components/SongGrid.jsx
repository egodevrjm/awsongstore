import React from 'react'
import SongCard from './SongCard'
import SongListItem from './SongListItem'

const SongGrid = ({ songs, loading = false, viewMode = 'grid' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-700 rounded mb-4 w-3/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-700 rounded w-5/6"></div>
              <div className="h-3 bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!songs || songs.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <p className="text-gray-400 text-lg">No songs found</p>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3 md:space-y-4">
        {songs.map((song) => (
          <SongListItem 
            key={song.song_id || song.id} 
            song={song} 
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {songs.map((song) => (
        <SongCard 
          key={song.song_id || song.id} 
          song={song} 
        />
      ))}
    </div>
  )
}

export default SongGrid