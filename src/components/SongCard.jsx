import React from 'react'
import { Link } from 'react-router-dom'
import { Copy, Edit, Music2, Play, Heart } from 'lucide-react'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'

const SongCard = ({ song, showEditButton = true }) => {
  const { copyToClipboard, copied } = useCopyToClipboard()

  const handleCopy = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const copyText = `Title: ${song.title}

Lyrics:
${song.lyrics}

${song.sounds_like_acoustic ? `Sounds Like (Acoustic): ${song.sounds_like_acoustic}` : ''}
${song.sounds_like_recording ? `Sounds Like (Recording): ${song.sounds_like_recording}` : ''}`

    copyToClipboard(copyText)
  }

  const songId = song.song_id || song.id

  return (
    <div className="song-card group">
      <div className="song-card-header">
        <div className="flex-1">
          <Link 
            to={`/song/${songId}`}
            className="block"
          >
            <h3 className="song-card-title group-hover:text-red-400 transition-colors">
              {song.title}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 mb-3">
            {song.status && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded-lg border border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                {song.status}
              </span>
            )}
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Music2 className="w-3 h-3" />
              <span>Song</span>
            </div>
          </div>
        </div>

        <div className="song-card-actions">
          <button
            onClick={handleCopy}
            className="btn btn-ghost p-2 hover:bg-red-600/20 hover:text-red-400"
            title="Copy song details"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          {showEditButton && (
            <Link
              to={`/song/${songId}/edit`}
              className="btn btn-ghost p-2 hover:bg-blue-600/20 hover:text-blue-400"
              title="Edit song"
            >
              <Edit className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      <div className="song-card-content">
        {/* Lyrics Preview */}
        {song.lyrics && (
          <div className="mb-4">
            <p className="song-card-lyrics">
              {song.lyrics.split('\n').slice(0, 3).join(' ').substring(0, 180)}
              {song.lyrics.length > 180 ? '...' : ''}
            </p>
          </div>
        )}

        {/* Themes */}
        {song.themes && song.themes.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {song.themes.slice(0, 3).map((theme) => (
                <Link
                  key={theme}
                  to={`/theme/${theme}`}
                  className="tag tag-theme hover:scale-105 transition-transform"
                >
                  {theme.replace(/_/g, ' ')}
                </Link>
              ))}
              {song.themes.length > 3 && (
                <span className="tag bg-gray-600/50">
                  +{song.themes.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Venues */}
        {song.suggested_venues && song.suggested_venues.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {song.suggested_venues.slice(0, 2).map((venue) => (
                <Link
                  key={venue}
                  to={`/venue/${venue}`}
                  className="tag tag-venue hover:scale-105 transition-transform"
                >
                  {venue.replace(/_/g, ' ')}
                </Link>
              ))}
              {song.suggested_venues.length > 2 && (
                <span className="tag bg-gray-600/50">
                  +{song.suggested_venues.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Sounds Like Preview */}
        {(song.sounds_like_acoustic || song.sounds_like_recording) && (
          <div className="text-xs text-gray-500 border-t border-white/10 pt-4 mt-auto">
            {song.sounds_like_acoustic && (
              <div className="mb-2">
                <span className="font-medium text-purple-400">Acoustic:</span>
                <p className="mt-1 leading-relaxed">
                  {song.sounds_like_acoustic.substring(0, 100)}
                  {song.sounds_like_acoustic.length > 100 ? '...' : ''}
                </p>
              </div>
            )}
            {song.sounds_like_recording && (
              <div>
                <span className="font-medium text-purple-400">Recording:</span>
                <p className="mt-1 leading-relaxed">
                  {song.sounds_like_recording.substring(0, 100)}
                  {song.sounds_like_recording.length > 100 ? '...' : ''}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <Link
          to={`/song/${songId}`}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>View Details</span>
        </Link>
        
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-400 transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {copied && (
        <div className="toast">
          Song details copied to clipboard!
        </div>
      )}
    </div>
  )
}

export default SongCard