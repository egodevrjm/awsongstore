// Utility functions for updating catalog and related files
import { GitHubAPI } from './githubApi'

export class CatalogUpdater {
  constructor(githubConfig) {
    this.github = new GitHubAPI(
      githubConfig.token,
      githubConfig.owner,
      githubConfig.repo
    )
    this.branch = githubConfig.branch || 'main'
  }

  async updateAllCatalogs(newSong) {
    const updates = []
    
    try {
      // Update main catalog
      updates.push(this.updateCatalog(newSong))
      
      // Update search index
      updates.push(this.updateSearchIndex(newSong))
      
      // Update theme files
      if (newSong.themes && newSong.themes.length > 0) {
        for (const theme of newSong.themes) {
          updates.push(this.updateThemeFile(theme, newSong))
        }
      }
      
      // Update venue files
      if (newSong.suggested_venues && newSong.suggested_venues.length > 0) {
        for (const venue of newSong.suggested_venues) {
          updates.push(this.updateVenueFile(venue, newSong))
        }
      }
      
      // Update status file (for private songs)
      if (newSong.status) {
        updates.push(this.updateStatusFile(newSong.status, newSong))
      }
      
      // Wait for all updates to complete
      await Promise.all(updates)
      
      return { success: true, updatedFiles: updates.length }
    } catch (error) {
      console.error('Error updating catalogs:', error)
      throw new Error(`Failed to update catalog files: ${error.message}`)
    }
  }

  async updateCatalog(newSong) {
    try {
      // Get existing catalog
      let catalogData = []
      try {
        const catalogFile = await this.github.getFile('catalog.json', this.branch)
        catalogData = JSON.parse(atob(catalogFile.content))
      } catch (error) {
        // Catalog doesn't exist, start with empty array
        console.log('Creating new catalog.json')
      }

      // Create catalog entry for the new song
      const catalogEntry = {
        song_id: newSong.song_id,
        title: newSong.title,
        status: newSong.status || 'private',
        themes: newSong.themes || [],
        suggested_venues: newSong.suggested_venues || [],
        created_at: newSong.created_at,
        updated_at: newSong.updated_at
      }

      // Add to catalog (avoid duplicates)
      const existingIndex = catalogData.findIndex(song => song.song_id === newSong.song_id)
      if (existingIndex >= 0) {
        catalogData[existingIndex] = catalogEntry
      } else {
        catalogData.push(catalogEntry)
      }

      // Sort by title
      catalogData.sort((a, b) => a.title.localeCompare(b.title))

      // Upload updated catalog
      const catalogContent = JSON.stringify(catalogData, null, 2)
      const base64Content = btoa(unescape(encodeURIComponent(catalogContent)))
      
      await this.github.uploadFile(
        'catalog.json',
        base64Content,
        `Update catalog: add ${newSong.title}`,
        this.branch
      )

      return 'catalog.json'
    } catch (error) {
      console.error('Error updating catalog:', error)
      throw error
    }
  }

  async updateSearchIndex(newSong) {
    try {
      // Get existing search index
      let searchData = []
      try {
        const searchFile = await this.github.getFile('search.json', this.branch)
        searchData = JSON.parse(atob(searchFile.content))
      } catch (error) {
        console.log('Creating new search.json')
      }

      // Create search entry
      const searchEntry = {
        song_id: newSong.song_id,
        title: newSong.title,
        status: newSong.status || 'private',
        themes: newSong.themes || [],
        suggested_venues: newSong.suggested_venues || [],
        lyrics_excerpt: newSong.lyrics ? newSong.lyrics.substring(0, 200) : '',
        created_at: newSong.created_at,
        updated_at: newSong.updated_at
      }

      // Add to search index (avoid duplicates)
      const existingIndex = searchData.findIndex(song => song.song_id === newSong.song_id)
      if (existingIndex >= 0) {
        searchData[existingIndex] = searchEntry
      } else {
        searchData.push(searchEntry)
      }

      // Sort by title
      searchData.sort((a, b) => a.title.localeCompare(b.title))

      // Upload updated search index
      const searchContent = JSON.stringify(searchData, null, 2)
      const base64Content = btoa(unescape(encodeURIComponent(searchContent)))
      
      await this.github.uploadFile(
        'search.json',
        base64Content,
        `Update search index: add ${newSong.title}`,
        this.branch
      )

      return 'search.json'
    } catch (error) {
      console.error('Error updating search index:', error)
      throw error
    }
  }

  async updateThemeFile(theme, newSong) {
    try {
      // Get existing theme file
      let themeData = {
        theme: theme,
        song_count: 0,
        songs: {}
      }
      
      try {
        const themeFile = await this.github.getFile(`themes/${theme}.json`, this.branch)
        themeData = JSON.parse(atob(themeFile.content))
      } catch (error) {
        console.log(`Creating new theme file: ${theme}.json`)
      }

      // Create theme entry
      const themeEntry = {
        title: newSong.title,
        status: newSong.status || 'private',
        lyrics: newSong.lyrics,
        suggested_venues: newSong.suggested_venues || []
      }

      // Add to theme file
      themeData.songs[newSong.song_id] = themeEntry
      themeData.song_count = Object.keys(themeData.songs).length

      // Upload updated theme file
      const themeContent = JSON.stringify(themeData, null, 2)
      const base64Content = btoa(unescape(encodeURIComponent(themeContent)))
      
      await this.github.uploadFile(
        `themes/${theme}.json`,
        base64Content,
        `Update theme ${theme}: add ${newSong.title}`,
        this.branch
      )

      return `themes/${theme}.json`
    } catch (error) {
      console.error(`Error updating theme file ${theme}:`, error)
      throw error
    }
  }

  async updateVenueFile(venue, newSong) {
    try {
      // Get existing venue file
      let venueData = {
        venue_type: venue,
        song_count: 0,
        songs: {}
      }
      
      try {
        const venueFile = await this.github.getFile(`venues/${venue}.json`, this.branch)
        venueData = JSON.parse(atob(venueFile.content))
      } catch (error) {
        console.log(`Creating new venue file: ${venue}.json`)
      }

      // Create venue entry
      const venueEntry = {
        title: newSong.title,
        status: newSong.status || 'private',
        lyrics: newSong.lyrics,
        themes: newSong.themes || []
      }

      // Add to venue file
      venueData.songs[newSong.song_id] = venueEntry
      venueData.song_count = Object.keys(venueData.songs).length

      // Upload updated venue file
      const venueContent = JSON.stringify(venueData, null, 2)
      const base64Content = btoa(unescape(encodeURIComponent(venueContent)))
      
      await this.github.uploadFile(
        `venues/${venue}.json`,
        base64Content,
        `Update venue ${venue}: add ${newSong.title}`,
        this.branch
      )

      return `venues/${venue}.json`
    } catch (error) {
      console.error(`Error updating venue file ${venue}:`, error)
      throw error
    }
  }

  async updateStatusFile(status, newSong) {
    try {
      // Get existing status file
      let statusData = {
        status: status,
        song_count: 0,
        songs: {}
      }
      
      try {
        const statusFile = await this.github.getFile(`status/${status}.json`, this.branch)
        statusData = JSON.parse(atob(statusFile.content))
      } catch (error) {
        console.log(`Creating new status file: ${status}.json`)
      }

      // Create status entry
      const statusEntry = {
        title: newSong.title,
        themes: newSong.themes || [],
        suggested_venues: newSong.suggested_venues || [],
        lyrics: newSong.lyrics
      }

      // Add to status file
      statusData.songs[newSong.song_id] = statusEntry
      statusData.song_count = Object.keys(statusData.songs).length

      // Upload updated status file
      const statusContent = JSON.stringify(statusData, null, 2)
      const base64Content = btoa(unescape(encodeURIComponent(statusContent)))
      
      await this.github.uploadFile(
        `status/${status}.json`,
        base64Content,
        `Update status ${status}: add ${newSong.title}`,
        this.branch
      )

      return `status/${status}.json`
    } catch (error) {
      console.error(`Error updating status file ${status}:`, error)
      throw error
    }
  }
}