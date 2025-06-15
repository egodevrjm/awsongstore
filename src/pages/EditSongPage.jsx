import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSongs } from '../context/SongContext'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'

const EditSongPage = () => {
  const { songId } = useParams()
  const navigate = useNavigate()
  const { getSongById, updateSong } = useSongs()
  
  const song = getSongById(songId)
  
  const [formData, setFormData] = useState({
    title: '',
    lyrics: '',
    notes: '',
    sounds_like_acoustic: '',
    sounds_like_recording: '',
    status: 'private'
  })
  
  const [images, setImages] = useState([])
  const [audioFiles, setAudioFiles] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title || '',
        lyrics: song.lyrics || '',
        notes: song.notes || '',
        sounds_like_acoustic: song.sounds_like_acoustic || '',
        sounds_like_recording: song.sounds_like_recording || '',
        status: song.status || 'private'
      })
      
      // Load existing images and audio files if any
      setImages(song.images || [])
      setAudioFiles(song.audio_files || [])
    }
  }, [song])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const newImage = {
            id: Date.now() + Math.random(),
            name: file.name,
            url: event.target.result,
            type: file.type
          }
          setImages(prev => [...prev, newImage])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleAudioUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      if (file.type.startsWith('audio/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const newAudio = {
            id: Date.now() + Math.random(),
            name: file.name,
            url: event.target.result,
            type: file.type
          }
          setAudioFiles(prev => [...prev, newAudio])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
  }

  const removeAudio = (audioId) => {
    setAudioFiles(prev => prev.filter(audio => audio.id !== audioId))
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      const updatedSong = {
        ...formData,
        images,
        audio_files: audioFiles,
        updated_at: new Date().toISOString()
      }
      
      updateSong(songId, updatedSong)
      
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      navigate(`/song/${songId}`)
    } catch (error) {
      console.error('Error saving song:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!song) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Song Not Found</h1>
        <p className="text-gray-400 mb-6">The song you're trying to edit doesn't exist.</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Back to Songs
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link 
          to={`/song/${songId}`} 
          className="btn btn-ghost"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Song
        </Link>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? (
            <div className="spinner" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Song Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Song title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lyrics */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Lyrics</h2>
          <textarea
            name="lyrics"
            value={formData.lyrics}
            onChange={handleInputChange}
            className="w-full h-96"
            placeholder="Enter song lyrics..."
          />
        </div>

        {/* Sounds Like */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Sounds Like</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Acoustic Version</label>
              <textarea
                name="sounds_like_acoustic"
                value={formData.sounds_like_acoustic}
                onChange={handleInputChange}
                className="w-full h-24"
                placeholder="Describe how the acoustic version sounds..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Recording Version</label>
              <textarea
                name="sounds_like_recording"
                value={formData.sounds_like_recording}
                onChange={handleInputChange}
                className="w-full h-24"
                placeholder="Describe how the recorded version sounds..."
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Images</h2>
          
          <div className="mb-4">
            <label className="btn btn-secondary cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-400 mt-1 truncate">{image.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audio Files */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Audio Files</h2>
          
          <div className="mb-4">
            <label className="btn btn-secondary cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload Audio
              <input
                type="file"
                multiple
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
              />
            </label>
          </div>

          {audioFiles.length > 0 && (
            <div className="space-y-3">
              {audioFiles.map((audio) => (
                <div key={audio.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                      <span className="text-xs font-bold">♪</span>
                    </div>
                    <div>
                      <p className="font-medium">{audio.name}</p>
                      <p className="text-xs text-gray-400">{audio.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <audio controls className="h-8">
                      <source src={audio.url} type={audio.type} />
                    </audio>
                    <button
                      onClick={() => removeAudio(audio.id)}
                      className="btn btn-ghost p-2 text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Notes</h2>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full h-32"
            placeholder="Additional notes about the song..."
          />
        </div>
      </div>
    </div>
  )
}

export default EditSongPage