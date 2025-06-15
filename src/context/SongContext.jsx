import React, { createContext, useContext, useState, useEffect } from 'react'

const SongContext = createContext()

export const useSongs = () => {
  const context = useContext(SongContext)
  if (!context) {
    throw new Error('useSongs must be used within a SongProvider')
  }
  return context
}

export const SongProvider = ({ children }) => {
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [themes, setThemes] = useState({})
  const [venues, setVenues] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Determine if we're running on Netlify or locally
      const isNetlify = window.location.hostname.includes('netlify.app')
      const baseUrl = isNetlify 
        ? 'https://raw.githubusercontent.com/egodevrjm/awsongstore/main'
        : ''
      
      console.log('Loading data from:', baseUrl || 'local server')
      
      // Load catalog first for faster initial load
      let catalogData = []
      try {
        const catalogResponse = await fetch(`${baseUrl}/catalog.json`)
        if (catalogResponse.ok) {
          catalogData = await catalogResponse.json()
        } else {
          console.warn('Failed to load catalog, status:', catalogResponse.status)
        }
      } catch (err) {
        console.warn('Failed to load catalog:', err)
      }
      
      // Load all song files
      const songFiles = catalogData.length > 0 
        ? catalogData.map(song => song.song_id)
        : [
            'a_song_and_a_beer', 'backroad_heart', 'be_better_for_the_next_guy',
            'blackberry_creek_blues', 'blackberry_creek_revival', 'born_in_hell',
            'broken_hallelujah', 'canyons_cry', 'church_of_country', 'coal_dust_on_the_lamb',
            'coal_dust_sunrise', 'country_city_girl', 'devil_came_back_for_georgia',
            'digital_bonfire', 'diner_life', 'drink_to_the_family', 'drivin_to_you',
            'embers_to_inferno', 'empty_seat', 'faded_mountain_truths', 'feels_like_home',
            'forever_happy', 'friday_night_lights_in_honky_tonk_heaven', 'full_and_gone',
            'georgia_makes_the_devil_her_toy', 'get_it_on', 'gimme_that_black_brew',
            'going_viral', 'going_viral_2', 'guilt_and_grief', 'hell_and_hymns',
            'heres_to_the_ghosts_i_leave_behind', 'hollow_turns_hallelujah',
            'i_raised_myself', 'if_youre_breathing_youre_worth_saving',
            'it_took_losing_you_to_find_me', 'keep_singin_on', 'keep_singing_on',
            'kentucky_steel', 'lantern_i_left_behind', 'love_aint_enough',
            'mamma_make_him_stop', 'miles_of_heartache', 'miles_of_sorrow',
            'morning_after_rain', 'my_kentucky_heartbeat', 'my_mothers_eyes',
            'phoenix_flight', 'red_dirt_road', 'roots_torn_slow', 'run_from_the_reaper',
            'running_free', 'runnin_late_to_church', 'saturday_night_salvation',
            'scars_and_smoke', 'shadows_holler', 'skin_on_mine', 'sometimes_cowboys_stay',
            'soul_food', 'sound_of_silence', 'taco_town', 'tailgate_nights',
            'tailgate_testament', 'that_good_ol_90s_country', 'the_devil_went_down_on_georgia',
            'the_girl_in_the_summer_dress', 'the_mourning_after', 'the_music',
            'the_reveal', 'the_road_to_nashville', 'the_songs_that_saved_me',
            'the_way_you_make_me_feel', 'the_weight_of_silence', 'through_the_silence',
            'through_the_silence_2', 'tumbleweed_promises', 'under_a_southern_sky',
            'what_dad_left_behind', 'when_mountains_weep', 'when_you_cant_be_near_me',
            'whiskey_dont_lie', 'whispers_from_the_hemlock_holler', 'wild_la',
            'wildflower_heart', 'workin_for_a_living', 'yes_boys_do_cry_sometimes'
          ]

      const songPromises = songFiles.map(async (songId) => {
        try {
          const response = await fetch(`${baseUrl}/songs/${songId}.json`)
          if (response.ok) {
            const songData = await response.json()
            return { ...songData, id: songId }
          } else {
            console.warn(`Failed to load song: ${songId}, status: ${response.status}`)
          }
        } catch (err) {
          console.warn(`Failed to load song: ${songId}`, err)
        }
        return null
      })

      const songResults = await Promise.all(songPromises)
      const loadedSongs = songResults.filter(song => song !== null)
      
      console.log(`Loaded ${loadedSongs.length} songs`)

      // Load albums
      try {
        const albumsResponse = await fetch(`${baseUrl}/albums.json`)
        if (albumsResponse.ok) {
          const albumsData = await albumsResponse.json()
          setAlbums(albumsData)
          console.log(`Loaded ${albumsData.length} albums`)
        } else {
          console.warn('Failed to load albums, status:', albumsResponse.status)
        }
      } catch (err) {
        console.warn('Failed to load albums:', err)
      }

      // Load themes
      const themeFiles = [
        'bar_setting', 'nostalgia', 'partying_celebration',
        'abuse_trauma', 'faith_spirituality', 'family',
        'freedom_wandering', 'heartbreak_loss', 'hometown_roots',
        'love_romance', 'music_songwriting', 'nature_outdoors',
        'rebellion_outlaw', 'resilience_survival', 'working_class_labor'
      ]

      const themePromises = themeFiles.map(async (theme) => {
        try {
          const response = await fetch(`${baseUrl}/themes/${theme}.json`)
          if (response.ok) {
            const themeData = await response.json()
            return [theme, themeData]
          } else {
            console.warn(`Failed to load theme: ${theme}, status: ${response.status}`)
          }
        } catch (err) {
          console.warn(`Failed to load theme: ${theme}`, err)
        }
        return null
      })

      const themeResults = await Promise.all(themePromises)
      const loadedThemes = Object.fromEntries(themeResults.filter(theme => theme !== null))
      console.log(`Loaded ${Object.keys(loadedThemes).length} themes`)

      // Load venues
      const venueFiles = [
        'arena', 'bar_setting', 'church', 'dive_bar', 'revival', 'stadium',
        'amphitheater', 'coffee_shop', 'festival', 'honky_tonk', 'house_concert',
        'listening_room', 'outdoor_venue', 'roadhouse', 'small_theater'
      ]

      const venuePromises = venueFiles.map(async (venue) => {
        try {
          const response = await fetch(`${baseUrl}/venues/${venue}.json`)
          if (response.ok) {
            const venueData = await response.json()
            return [venue, venueData]
          } else {
            console.warn(`Failed to load venue: ${venue}, status: ${response.status}`)
          }
        } catch (err) {
          console.warn(`Failed to load venue: ${venue}`, err)
        }
        return null
      })

      const venueResults = await Promise.all(venuePromises)
      const loadedVenues = Object.fromEntries(venueResults.filter(venue => venue !== null))
      console.log(`Loaded ${Object.keys(loadedVenues).length} venues`)

      setSongs(loadedSongs)
      setThemes(loadedThemes)
      setVenues(loadedVenues)
      setError(null)
    } catch (err) {
      setError('Failed to load song data')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateSong = (songId, updatedData) => {
    setSongs(prevSongs => {
      // Check if the song already exists
      const existingSong = prevSongs.find(song => 
        song.song_id === songId || song.id === songId
      )
      
      if (existingSong) {
        // Update existing song
        return prevSongs.map(song => 
          (song.song_id === songId || song.id === songId) 
            ? { ...song, ...updatedData } 
            : song
        )
      } else {
        // Add new song
        return [...prevSongs, { ...updatedData, id: songId }]
      }
    })
  }

  const getSongById = (songId) => {
    return songs.find(song => song.song_id === songId || song.id === songId)
  }

  const getSongsByTheme = (theme) => {
    return songs.filter(song => song.themes && song.themes.includes(theme))
  }

  const getSongsByVenue = (venue) => {
    return songs.filter(song => song.suggested_venues && song.suggested_venues.includes(venue))
  }

  const value = {
    songs,
    albums,
    themes,
    venues,
    loading,
    error,
    updateSong,
    getSongById,
    getSongsByTheme,
    getSongsByVenue,
    reload: loadData
  }

  return (
    <SongContext.Provider value={value}>
      {children}
    </SongContext.Provider>
  )
}