import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSongs } from '../context/SongContext'
import GitHubConfig from '../components/GitHubConfig'
import ImageUpload from '../components/ImageUpload'
import { ArrowLeft, Save, Plus, Music, Tag, MapPin, Upload, X } from 'lucide-react'
import { useGitHubUpload } from '../hooks/useGitHubUpload'
import { GitHubAPI } from '../utils/githubApi'

const AddSongPage = () => {
  const navigate = useNavigate()
  const { songs, updateSong } = useSongs()
  
  const [formData, setFormData] = useState({
    song_id: '',
    title: '',
    lyrics: '',
    notes: '',
    sounds_like_acoustic: '',
    sounds_like_recording: '',
    status: 'private',
    themes: [],
    suggested_venues: []
  })
  
  const [images, setImages] = useState([])
  const [audioFiles, setAudioFiles] = useState([])
  const [githubConfig, setGitHubConfig] = useState(null)
  const [showGitHubConfig, setShowGitHubConfig] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Theme and venue management
  const [newTheme, setNewTheme] = useState('')
  const [newVenue, setNewVenue] = useState('')

  // Get existing themes and venues from all songs
  const existingThemes = [...new Set(songs.flatMap(song => song.themes || []))].sort()
  const existingVenues = [...new Set(songs.flatMap(song => song.suggested_venues || []))].sort()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Generate song ID from title
  const generateSongId = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50)
  }

  // Update song ID when title changes
  const handleTitleChange = (e) => {
    const title = e.target.value
    const songId = generateSongId(title)
    
    setFormData(prev => ({
      ...prev,
      title,
      song_id: songId
    }))
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

  const removeAudio = (audioId) => {
    setAudioFiles(prev => prev.filter(audio => audio.id !== audioId))
  }

  // Theme management
  const addTheme = (theme) => {
    const normalizedTheme = theme.toLowerCase().replace(/\s+/g, '_')
    if (normalizedTheme && !formData.themes.includes(normalizedTheme)) {
      setFormData(prev => ({
        ...prev,
        themes: [...prev.themes, normalizedTheme]
      }))
    }
  }

  const removeTheme = (theme) => {
    setFormData(prev => ({
      ...prev,
      themes: prev.themes.filter(t => t !== theme)
    }))
  }

  const handleAddNewTheme = () => {
    if (newTheme.trim()) {
      addTheme(newTheme.trim())
      setNewTheme('')
    }
  }

  // Venue management
  const addVenue = (venue) => {
    const normalizedVenue = venue.toLowerCase().replace(/\s+/g, '_')
    if (normalizedVenue && !formData.suggested_venues.includes(normalizedVenue)) {
      setFormData(prev => ({
        ...prev,
        suggested_venues: [...prev.suggested_venues, normalizedVenue]
      }))
    }
  }

  const removeVenue = (venue) => {
    setFormData(prev => ({
      ...prev,
      suggested_venues: prev.suggested_venues.filter(v => v !== venue)
    }))
  }

  const handleAddNewVenue = () => {
    if (newVenue.trim()) {
      addVenue(newVenue.trim())
      setNewVenue('')
    }
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a song title')
      return
    }

    if (!formData.song_id.trim()) {
      alert('Song ID is required')
      return
    }

    setSaving(true)
    
    try {
      const newSong = {
        ...formData,
        images,
        audio_files: audioFiles,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // If GitHub is configured, save the song file to the repository
      if (githubConfig) {
        try {
          const github = new GitHubAPI(
            githubConfig.token,
            githubConfig.owner,
            githubConfig.repo
          )

          const songContent = JSON.stringify(newSong, null, 2)
          const base64Content = btoa(unescape(encodeURIComponent(songContent)))
          
          await github.uploadFile(
            `songs/${formData.song_id}.json`,
            base64Content,
            `Add new song: ${formData.title}`,
            githubConfig.branch || 'main'
          )
        } catch (error) {
          console.error('Failed to save to GitHub:', error)
          alert(`Warning: Song created locally but failed to save to GitHub: ${error.message}`)
        }
      }
      
      // Add to local state (this would normally be handled by your backend)
      updateSong(formData.song_id, newSong)
      
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      navigate(`/song/${formData.song_id}`)
    } catch (error) {
      console.error('Error saving song:', error)
      alert('Failed to save song. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link 
          to="/" 
          className="btn btn-ghost"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Songs
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGitHubConfig(!showGitHubConfig)}
            className={`btn ${githubConfig ? 'btn-secondary' : 'btn-ghost'}`}
            title="GitHub Configuration"
          >
            <Settings className="w-4 h-4" />
            GitHub
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !formData.title.trim()}
            className="btn btn-primary"
          >
            {saving ? (
              <div className="spinner" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Creating...' : 'Create Song'}
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Add New Song</h1>
            <p className="text-gray-400">Create a new song for the Alex Wilson songbook</p>
          </div>
        </div>
      </div>

      {/* GitHub Configuration */}
      {showGitHubConfig && (
        <div className="mb-8">
          <GitHubConfig 
            onConfigChange={setGitHubConfig}
            initialConfig={githubConfig}
          />
        </div>
      )}

      {/* Form */}
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Music className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold">Song Details</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full"
                placeholder="Enter song title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Song ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="song_id"
                value={formData.song_id}
                onChange={handleInputChange}
                className="w-full"
                placeholder="song_id_generated_from_title"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-generated from title. Used for file naming and URLs.
              </p>
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

        {/* Themes */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Tag className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Themes</h2>
          </div>
          
          {/* Current Themes */}
          {formData.themes.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {formData.themes.map((theme) => (
                  <span
                    key={theme}
                    className="tag tag-theme flex items-center gap-2"
                  >
                    {theme.replace(/_/g, ' ')}
                    <button
                      onClick={() => removeTheme(theme)}
                      className="hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add Existing Theme */}
          {existingThemes.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Add Existing Theme</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addTheme(e.target.value)
                    e.target.value = ''
                  }
                }}
                className="w-full"
              >
                <option value="">Select a theme...</option>
                {existingThemes
                  .filter(theme => !formData.themes.includes(theme))
                  .map(theme => (
                    <option key={theme} value={theme}>
                      {theme.replace(/_/g, ' ')}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Add New Theme */}
          <div>
            <label className="block text-sm font-medium mb-2">Add New Theme</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTheme}
                onChange={(e) => setNewTheme(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddNewTheme()}
                className="flex-1"
                placeholder="Enter new theme"
              />
              <button
                onClick={handleAddNewTheme}
                className="btn btn-secondary"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Venues */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold">Suggested Venues</h2>
          </div>
          
          {/* Current Venues */}
          {formData.suggested_venues.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {formData.suggested_venues.map((venue) => (
                  <span
                    key={venue}
                    className="tag tag-venue flex items-center gap-2"
                  >
                    {venue.replace(/_/g, ' ')}
                    <button
                      onClick={() => removeVenue(venue)}
                      className="hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add Existing Venue */}
          {existingVenues.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Add Existing Venue</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addVenue(e.target.value)
                    e.target.value = ''
                  }
                }}
                className="w-full"
              >
                <option value="">Select a venue...</option>
                {existingVenues
                  .filter(venue => !formData.suggested_venues.includes(venue))
                  .map(venue => (
                    <option key={venue} value={venue}>
                      {venue.replace(/_/g, ' ')}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Add New Venue */}
          <div>
            <label className="block text-sm font-medium mb-2">Add New Venue</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newVenue}
                onChange={(e) => setNewVenue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddNewVenue()}
                className="flex-1"
                placeholder="Enter new venue"
              />
              <button
                onClick={handleAddNewVenue}
                className="btn btn-secondary"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
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
          <ImageUpload
            songId={formData.song_id || 'new-song'}
            images={images}
            onImagesChange={setImages}
            githubConfig={githubConfig}
            maxImages={10}
          />
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
            <p className="text-sm text-gray-500 mt-2">
              Note: Audio files are stored locally in the browser. For permanent storage, consider using a cloud service.
            </p>
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

export default AddSongPage