import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSongs } from '../context/SongContext'
import SongGrid from '../components/SongGrid'
import { ArrowLeft, Tag } from 'lucide-react'

const ThemePage = () => {
  const { theme } = useParams()
  const { getSongsByTheme, loading } = useSongs()
  
  const songs = getSongsByTheme(theme)
  const themeName = theme.replace(/_/g, ' ')

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/" 
          className="btn btn-ghost"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Songs
        </Link>
        
        <div className="flex items-center gap-3">
          <Tag className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold capitalize">{themeName}</h1>
            <p className="text-gray-400">
              {songs.length} song{songs.length !== 1 ? 's' : ''} with this theme
            </p>
          </div>
        </div>
      </div>

      {/* Songs */}
      <SongGrid songs={songs} loading={loading} />
    </div>
  )
}

export default ThemePage