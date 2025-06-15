import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSongs } from '../context/SongContext'
import SongGrid from '../components/SongGrid'
import { ArrowLeft, MapPin } from 'lucide-react'

const VenuePage = () => {
  const { venue } = useParams()
  const { getSongsByVenue, loading } = useSongs()
  
  const songs = getSongsByVenue(venue)
  const venueName = venue.replace(/_/g, ' ')

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/" 
          className="btn btn-ghost"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Songs
        </Link>
        
        <div className="flex items-center gap-3">
          <MapPin className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold capitalize">{venueName}</h1>
            <p className="text-gray-400">
              {songs.length} song{songs.length !== 1 ? 's' : ''} suggested for this venue
            </p>
          </div>
        </div>
      </div>

      {/* Songs */}
      <SongGrid songs={songs} loading={loading} />
    </div>
  )
}

export default VenuePage