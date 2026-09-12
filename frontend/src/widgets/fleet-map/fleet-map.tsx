import 'leaflet/dist/leaflet.css'

import { MapContainer, TileLayer } from 'react-leaflet'

import { useVehicleStore } from '@/entities/vehicle'
import { MAP_DEFAULTS } from '@/shared/config/constants'
import { VehicleMarker } from './vehicle-marker'

export function FleetMap() {
  const vehicles = useVehicleStore((state) => state.vehicles)
  const selectedId = useVehicleStore((state) => state.selectedId)
  const selectVehicle = useVehicleStore((state) => state.selectVehicle)

  return (
    <MapContainer
      center={MAP_DEFAULTS.CENTER}
      zoom={MAP_DEFAULTS.ZOOM}
      className="h-full w-full"
      preferCanvas
    >
      <TileLayer url={MAP_DEFAULTS.TILE_URL} attribution={MAP_DEFAULTS.TILE_ATTRIBUTION} />
      {[...vehicles.values()].map((vehicle) => (
        <VehicleMarker
          key={vehicle.id}
          vehicle={vehicle}
          selected={vehicle.id === selectedId}
          onSelect={() => selectVehicle(vehicle.id)}
        />
      ))}
    </MapContainer>
  )
}
