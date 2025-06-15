import React from 'react'
import { Link } from 'react-router-dom'
import { Copy, Edit, Music2, Play, Tag, MapPin } from 'lucide-react'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'

const SongListItem = ({ song }) => {
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
    <div className="bg-gray-800/50 border border-white/10 rounded-xl p-4 hover:bg-gray-800/80 hover:border-red-500/30 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <Link 
            to={`/song/${songId}`}
            className="block group"
          >
            <h3 className="text-lg font-bold mb-1 group-hover:text-red-400 transition-colors">
              {song.title}
            </h3>
          </Link>
          
          <div className="flex flex-wrap items-center gap-2 mb-2">
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
          
          {/* Lyrics Preview */}
          {song.lyrics && (
            <p className="text-sm text-gray-400 line-clamp-2 mb-3">
              {song.lyrics.split('\n').slice(0, 2).join(' ').substring(0, 120)}
              {song.lyrics.length > 120 ? '...' : ''}
            </p>
          )}
          
          <div className="flex flex-wrap gap-4">
            {/* Themes */}
            {song.themes && song.themes.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-3 h-3 text-blue-400" />
                <div className="flex flex-wrap gap-1">
                  {song.themes.slice(0, 2).map((theme, index) => (
                    <React.Fragment key={theme}>
                      <Link
                        to={`/theme/${theme}`}
                        className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        {theme.replace(/_/g, ' ')}
                      </Link>
                      {index < Math.min(song.themes.length, 2) - 1 && <span className="text-gray-500">, </span>}
                    </React.Fragment>
                  ))}
                  {song.themes.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{song.themes.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Venues */}
            {song.suggested_venues && song.suggested_venues.length > 0 && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-green-400" />
                <div className="flex flex-wrap gap-1">
                  {song.suggested_venues.slice(0, 2).map((venue, index) => (
                    <React.Fragment key={venue}>
                      <Link
                        to={`/venue/${venue}`}
                        className="text-xs text-green-400 hover:text-green-300 hover:underline"
                      >
                        {venue.replace(/_/g, ' ')}
                      </Link>
                      {index < Math.min(song.suggested_venues.length, 2) - 1 && <span className="text-gray-500">, </span>}
                    </React.Fragment>
                  ))}
                  {song.suggested_venues.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{song.suggested_venues.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Link
            to={`/song/${songId}`}
            className="btn btn-ghost p-2 text-gray-400 hover:text-red-400"
            title="View song details"
            aria-label="View song details"
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">View</span>
          </Link>
          
          <button
            onClick={handleCopy}
            className="btn btn-ghost p-2 text-gray-400 hover:text-blue-400"
            title="Copy song details"
            aria-label="Copy song details"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Copy</span>
          </button>
          
          <Link
            to={`/song/${songId}/edit`}
            className="btn btn-ghost p-2 text-gray-400 hover:text-green-400"
            title="Edit song"
            aria-label="Edit song"
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Edit</span>
          </Link>
        </div>
      </div>

      {copied && (
        <div className="toast">
          Song details copied to clipboard!
        </div>
      )}
    </div>
  )
}

export default SongListItem