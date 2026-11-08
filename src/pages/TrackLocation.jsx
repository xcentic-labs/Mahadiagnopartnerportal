import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { ArrowLeft, Loader2, Radio } from 'lucide-react'
import { SERVER_URL } from '../utils/config'
import { defaultIcon } from '../utils/leafletIcon'

const Follow = ({ position }) => {
  const map = useMap()
  useEffect(() => {
    map.panTo(position)
  }, [map, position])
  return null
}

// Live location of a service boy, pushed by the backend over socket.io
const TrackLocation = () => {
  const { id } = useParams()
  const { state } = useLocation()
  const [point, setPoint] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = io(SERVER_URL)
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('tracklocation', ({ userId, userName, latitude, longitude }) => {
      if (String(userId) === String(id) && latitude && longitude) {
        setPoint({ name: userName || state?.name || 'Service boy', lat: Number(latitude), lng: Number(longitude), at: new Date() })
      }
    })
    return () => socket.disconnect()
  }, [id, state?.name])

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Link to="/service-boys" className="p-2 rounded-lg hover:bg-gray-200" aria-label="Back"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Track {state?.name || 'Service Boy'}</h2>
            <p className="text-sm text-gray-500">
              {point ? `Last updated ${point.at.toLocaleTimeString('en-IN')}` : 'Waiting for location updates...'}
            </p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${connected ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
          <Radio className="w-3.5 h-3.5" /> {connected ? 'Live' : 'Connecting'}
        </span>
      </div>

      <div className="card overflow-hidden h-[calc(100vh-14rem)] min-h-96">
        {point ? (
          <MapContainer center={[point.lat, point.lng]} zoom={16} scrollWheelZoom>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Follow position={[point.lat, point.lng]} />
            <Marker position={[point.lat, point.lng]} icon={defaultIcon}>
              <Popup>{point.name}<br />Updated at {point.at.toLocaleTimeString('en-IN')}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="mt-3">Waiting for location updates...</p>
            <p className="text-xs mt-1">The service boy must be online with the app open.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackLocation
