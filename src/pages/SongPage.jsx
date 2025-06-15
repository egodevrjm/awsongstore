import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSongs } from '../context/SongContext'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'
import { 
  ArrowLeft, 
  Copy, 
  Edit, 
  Music, 
  Tag, 
  MapPin, 
  FileText,
  Volume2,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react'

const SongPage = () => {
  const { songId } = useParams()
  const { getSongById, loading } = useSongs()
  const { copyToClipboard, copied } = useCopyToClipboard()

  const song = getSongById(songId)

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="h-6 bg-gray-700 rounded mb-8 w-1/4"></div>
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!song) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Song Not Found</h1>
        <p className="text-gray-400 mb-6">The song you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Back to Songs
        </Link>
      </div>
    )
  }

  const handleCopy = () => {
    const copyText = `Title: ${song.title}

Lyrics:
${song.lyrics}

${song.sounds_like_acoustic ? `Sounds Like (Acoustic): ${song.sounds_like_acoustic}` : ''}
${song.sounds_like_recording ? `Sounds Like (Recording): ${song.sounds_like_recording}` : ''}`

    copyToClipboard(copyText)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <Link 
          to="/" 
          className="btn btn-ghost"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="ml-1">Back</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="btn btn-secondary btn-text-hidden-mobile"
            aria-label="Copy song details"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Details</span>
          </button>
          
          <Link
            to={`/song/${songId}/edit`}
            className="btn btn-primary btn-text-hidden-mobile"
            aria-label="Edit song"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Song</span>
          </Link>
        </div>
      </div>

      {/* Song Title and Status */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">{song.title}</h1>
        
        {song.status && (
          <span className="inline-block px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm">
            {song.status}
          </span>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Lyrics - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-semibold">Lyrics</h2>
            </div>
            
            {song.lyrics ? (
              <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                {song.lyrics}
              </div>
            ) : (
              <p className="text-gray-500 italic">No lyrics available</p>
            )}
          </div>

          {/* Images */}
          {song.images && song.images.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold">Images</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {song.images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-48 object-cover rounded-lg"
                      loading="lazy"
                    />
                    
                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <div className="flex gap-2">
                        {image.githubUrl && (
                          <a
                            href={image.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost p-2 text-white hover:text-blue-400"
                            title="View on GitHub"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-2 truncate" title={image.name}>
                      {image.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audio Files */}
          {song.audio_files && song.audio_files.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Volume2 className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold">Audio Files</h2>
              </div>
              
              <div className="space-y-3">
                {song.audio_files.map((audio) => (
                  <div key={audio.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-800 p-3 rounded-lg gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                        <span className="text-xs font-bold">♪</span>
                      </div>
                      <div>
                        <p className="font-medium">{audio.name}</p>
                        <p className="text-xs text-gray-400">{audio.type}</p>
                      </div>
                    </div>
                    
                    <audio controls className="w-full sm:w-auto h-8">
                      <source src={audio.url} type={audio.type} />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {song.notes && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Notes</h2>
              <div className="text-gray-300 whitespace-pre-wrap">
                {song.notes}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Themes */}
          {song.themes && song.themes.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Themes</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {song.themes.map((theme) => (
                  <Link
                    key={theme}
                    to={`/theme/${theme}`}
                    className="tag tag-theme hover:bg-blue-600 transition-colors"
                  >
                    {theme.replace(/_/g, ' ')}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Venues */}
          {song.suggested_venues && song.suggested_venues.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">Suggested Venues</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {song.suggested_venues.map((venue) => (
                  <Link
                    key={venue}
                    to={`/venue/${venue}`}
                    className="tag tag-venue hover:bg-green-600 transition-colors"
                  >
                    {venue.replace(/_/g, ' ')}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Sounds Like */}
          {(song.sounds_like_acoustic || song.sounds_like_recording) && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Volume2 className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Sounds Like</h3>
              </div>
              
              {song.sounds_like_acoustic && (
                <div className="mb-4">
                  <h4 className="font-medium text-purple-400 mb-2">Acoustic</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {song.sounds_like_acoustic}
                  </p>
                </div>
              )}
              
              {song.sounds_like_recording && (
                <div>
                  <h4 className="font-medium text-purple-400 mb-2">Recording</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {song.sounds_like_recording}
                  </p>
                </div>
              )}
            </div>
          )}
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

export default SongPage