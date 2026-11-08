import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import { defaultIcon } from '../utils/leafletIcon'

const ClickHandler = ({ onChange }) => {
  useMapEvents({ click: (e) => onChange({ lat: e.latlng.lat, lng: e.latlng.lng }) })
  return null
}

const Recenter = ({ position }) => {
  const map = useMap()
  useEffect(() => {
    if (position) map.setView([position.lat, position.lng], Math.max(map.getZoom(), 15))
  }, [position?.lat, position?.lng]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

// Default centre: Maharashtra (Pune) when no location is known yet
const FALLBACK = { lat: 18.5204, lng: 73.8567 }

// Click the map or drag the pin to pick the hospital location
const LocationPicker = ({ value, onChange, height = 280 }) => {
  const centre = value || FALLBACK
  return (
    <div className="rounded-xl overflow-hidden border border-gray-300" style={{ height }}>
      <MapContainer center={[centre.lat, centre.lng]} zoom={value ? 15 : 6} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onChange={onChange} />
        <Recenter position={value} />
        {value && (
          <Marker
            position={[value.lat, value.lng]}
            icon={defaultIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng()
                onChange({ lat, lng })
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}

export default LocationPicker
