import React, { useState, useMemo } from 'react'
import { Search, Filter, SortAsc, Grid, List, X, Sparkles, TrendingUp } from 'lucide-react'

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
    <div className="mb-12">
      {/* Search and Controls */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Search */}
        <div className="search-container flex-1">
          <Search className="search-icon w-5 h-5" />
          <input
            type="text"
            placeholder="Search songs, lyrics, themes, or venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input w-full py-3 text-base"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 min-w-[160px]"
            >
              <option value="title">Sort by Title</option>
              <option value="themes">Sort by Themes</option>
              <option value="venues">Sort by Venues</option>
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="btn btn-ghost p-3"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <SortAsc className={`w-5 h-5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-white/20 rounded-xl overflow-hidden backdrop-blur-10">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-3 transition-all ${
                viewMode === 'grid' 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
              title="Grid View"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-3 transition-all ${
                viewMode === 'list' 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-ghost'} px-6 relative`}
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                {(selectedThemes.length + selectedVenues.length + (searchTerm ? 1 : 0))}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filter-panel mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-semibold">Advanced Filters</h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn btn-ghost text-sm hover:text-red-400"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Themes */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h4 className="font-semibold text-blue-400">Themes</h4>
                <span className="text-sm text-gray-500">({allThemes.length})</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                {allThemes.map(theme => (
                  <label key={theme} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedThemes.includes(theme)}
                      onChange={() => handleThemeToggle(theme)}
                      className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="text-sm group-hover:text-blue-400 transition-colors capitalize">
                      {theme.replace(/_/g, ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Venues */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h4 className="font-semibold text-green-400">Venues</h4>
                <span className="text-sm text-gray-500">({allVenues.length})</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                {allVenues.map(venue => (
                  <label key={venue} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedVenues.includes(venue)}
                      onChange={() => handleVenueToggle(venue)}
                      className="w-4 h-4 rounded border-gray-600 text-green-600 focus:ring-green-500 focus:ring-offset-0"
                    />
                    <span className="text-sm group-hover:text-green-400 transition-colors capitalize">
                      {venue.replace(/_/g, ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm mb-6">
        <div className="flex items-center gap-2 text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>
            Showing <span className="font-semibold text-white">{filteredAndSortedSongs.length}</span> of{' '}
            <span className="font-semibold">{songs.length}</span> songs
          </span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-red-600/20 text-red-400 rounded-lg text-xs font-medium">
              Filtered
            </span>
          )}
        </div>
        
        {searchTerm && (
          <div className="text-gray-500">
            Search: "<span className="text-white font-medium">{searchTerm}</span>"
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchAndFilter