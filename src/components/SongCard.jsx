import React from 'react'
import { Link } from 'react-router-dom'
import { Copy, Edit, Music, Calendar, MapPin, Tag } from 'lucide-react'
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
    <div className="card group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link 
            to={`/song/${songId}`}
            className="block hover:text-red-400 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-1 group-hover:text-red-400 transition-colors">
              {song.title}
            </h3>
          </Link>
          
          {song.status && (
            <span className="inline-block px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
              {song.status}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="btn btn-ghost p-2"
            title="Copy song details"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          {showEditButton && (
            <Link
              to={`/song/${songId}/edit`}
              className="btn btn-ghost p-2"
              title="Edit song"
            >
              <Edit className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Lyrics Preview */}
      {song.lyrics && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 line-clamp-3">
            {song.lyrics.split('\n').slice(0, 3).join(' ').substring(0, 150)}
            {song.lyrics.length > 150 ? '...' : ''}
          </p>
        </div>
      )}

      {/* Themes */}
      {song.themes && song.themes.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {song.themes.slice(0, 3).map((theme) => (
              <Link
                key={theme}
                to={`/theme/${theme}`}
                className="tag tag-theme hover:bg-blue-600 transition-colors"
              >
                {theme.replace(/_/g, ' ')}
              </Link>
            ))}
            {song.themes.length > 3 && (
              <span className="tag">+{song.themes.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      {/* Venues */}
      {song.suggested_venues && song.suggested_venues.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {song.suggested_venues.slice(0, 2).map((venue) => (
              <Link
                key={venue}
                to={`/venue/${venue}`}
                className="tag tag-venue hover:bg-green-600 transition-colors"
              >
                {venue.replace(/_/g, ' ')}
              </Link>
            ))}
            {song.suggested_venues.length > 2 && (
              <span className="tag">+{song.suggested_venues.length - 2} more</span>
            )}
          </div>
        </div>
      )}

      {/* Sounds Like Preview */}
      {(song.sounds_like_acoustic || song.sounds_like_recording) && (
        <div className="text-xs text-gray-500 border-t border-gray-700 pt-3">
          {song.sounds_like_acoustic && (
            <p className="mb-1">
              <span className="font-medium">Acoustic:</span> {song.sounds_like_acoustic.substring(0, 80)}
              {song.sounds_like_acoustic.length > 80 ? '...' : ''}
            </p>
          )}
          {song.sounds_like_recording && (
            <p>
              <span className="font-medium">Recording:</span> {song.sounds_like_recording.substring(0, 80)}
              {song.sounds_like_recording.length > 80 ? '...' : ''}
            </p>
          )}
        </div>
      )}

      {copied && (
        <div className="toast">
          Song details copied to clipboard!
        </div>
      )}
    </div>
  )
}

export default SongCard