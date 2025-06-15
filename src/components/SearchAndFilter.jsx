import React, { useState, useMemo } from 'react'
import { Search, Filter, SortAsc, Grid, List, X } from 'lucide-react'

const SearchAndFilter = ({ 
  songs, 
  onFilteredSongs, 
  viewMode, 
  onViewModeChange 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedThemes, setSelectedThemes] = useState([])
  const [selectedVenues, setSelectedVenues] = useState([])
  const [sortBy, setSortBy] = useState('title')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showFilters, setShowFilters] = useState(false)

  // Get unique themes and venues
  const allThemes = useMemo(() => {
    const themes = new Set()
    songs.forEach(song => {
      if (song.themes) {
        song.themes.forEach(theme => themes.add(theme))
      }
    })
    return Array.from(themes).sort()
  }, [songs])

  const allVenues = useMemo(() => {
    const venues = new Set()
    songs.forEach(song => {
      if (song.suggested_venues) {
        song.suggested_venues.forEach(venue => venues.add(venue))
      }
    })
    return Array.from(venues).sort()
  }, [songs])

  // Filter and sort songs
  const filteredAndSortedSongs = useMemo(() => {
    let filtered = songs.filter(song => {
      // Search filter
      const searchMatch = !searchTerm || 
        song.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.lyrics?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.notes?.toLowerCase().includes(searchTerm.toLowerCase())

      // Theme filter
      const themeMatch = selectedThemes.length === 0 || 
        (song.themes && selectedThemes.some(theme => song.themes.includes(theme)))

      // Venue filter
      const venueMatch = selectedVenues.length === 0 || 
        (song.suggested_venues && selectedVenues.some(venue => song.suggested_venues.includes(venue)))

      return searchMatch && themeMatch && venueMatch
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'title':
          aValue = a.title || ''
          bValue = b.title || ''
          break
        case 'themes':
          aValue = a.themes?.length || 0
          bValue = b.themes?.length || 0
          break
        case 'venues':
          aValue = a.suggested_venues?.length || 0
          bValue = b.suggested_venues?.length || 0
          break
        default:
          aValue = a.title || ''
          bValue = b.title || ''
      }

      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortOrder === 'asc' ? comparison : -comparison
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }
    })

    return filtered
  }, [songs, searchTerm, selectedThemes, selectedVenues, sortBy, sortOrder])

  // Update parent component when filtered songs change
  React.useEffect(() => {
    onFilteredSongs(filteredAndSortedSongs)
  }, [filteredAndSortedSongs, onFilteredSongs])

  const handleThemeToggle = (theme) => {
    setSelectedThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    )
  }

  const handleVenueToggle = (venue) => {
    setSelectedVenues(prev => 
      prev.includes(venue) 
        ? prev.filter(v => v !== venue)
        : [...prev, venue]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedThemes([])
    setSelectedVenues([])
    setSortBy('title')
    setSortOrder('asc')
  }

  const hasActiveFilters = searchTerm || selectedThemes.length > 0 || selectedVenues.length > 0

  return (
    <div className="mb-8">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search songs, lyrics, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2"
          />
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2"
          >
            <option value="title">Sort by Title</option>
            <option value="themes">Sort by Theme Count</option>
            <option value="venues">Sort by Venue Count</option>
          </select>

          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="btn btn-ghost p-2"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <SortAsc className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex border border-gray-600 rounded-lg overflow-hidden">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn ${showFilters ? 'btn-primary' : 'btn-ghost'} px-4`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {(selectedThemes.length + selectedVenues.length + (searchTerm ? 1 : 0))}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn btn-ghost text-sm"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Themes */}
            <div>
              <h4 className="font-medium mb-3 text-blue-400">Themes</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {allThemes.map(theme => (
                  <label key={theme} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedThemes.includes(theme)}
                      onChange={() => handleThemeToggle(theme)}
                      className="rounded"
                    />
                    <span className="text-sm">{theme.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Venues */}
            <div>
              <h4 className="font-medium mb-3 text-green-400">Venues</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {allVenues.map(venue => (
                  <label key={venue} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedVenues.includes(venue)}
                      onChange={() => handleVenueToggle(venue)}
                      className="rounded"
                    />
                    <span className="text-sm">{venue.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-400 mb-4">
        Showing {filteredAndSortedSongs.length} of {songs.length} songs
        {hasActiveFilters && (
          <span className="ml-2 text-red-400">
            (filtered)
          </span>
        )}
      </div>
    </div>
  )
}

export default SearchAndFilter