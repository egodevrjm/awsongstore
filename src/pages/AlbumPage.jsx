import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSongs } from '../context/SongContext'
import SongGrid from '../components/SongGrid'
import { ArrowLeft, Disc } from 'lucide-react'

const AlbumPage = () => {
  const { albumId } = useParams()
  const { albums, songs, loading } = useSongs()
  
  const album = albums.find(a => a.id === albumId)
  const albumSongs = album ? songs.filter(song => 
    album.songIds.includes(song.song_id || song.id)
  ) : []

  if (!album) {
    return (
      <div className="text-center py-12">
        <Disc className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Album Not Found</h1>
        <p className="text-gray-400 mb-6">The album you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Back to Songs
        </Link>
      </div>
    )
  }

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
      </div>

      {/* Album Info */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {album.coverImageUrl && (
          <div className="flex-shrink-0">
            <img
              src={album.coverImageUrl}
              alt={album.title}
              className="w-64 h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <Disc className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold">{album.title}</h1>
          </div>
          
          <div className="space-y-2 mb-6">
            <p className="text-xl text-gray-300">by {album.artist}</p>
            <p className="text-gray-400">{album.year}</p>
            <p className="text-gray-400">
              {albumSongs.length} track{albumSongs.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {album.description && (
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-300 leading-relaxed">{album.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Songs */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Tracks</h2>
        <SongGrid songs={albumSongs} loading={loading} />
      </div>
    </div>
  )
}

export default AlbumPage