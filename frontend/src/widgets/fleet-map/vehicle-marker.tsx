import L from 'leaflet'
import { Marker, Tooltip } from 'react-leaflet'

import type { Vehicle } from '@/entities/vehicle'

function buildIcon(headingDeg: number, selected: boolean) {
  const color = selected ? '#38bdf8' : '#a3a3a3'
  return L.divIcon({
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<svg width="22" height="22" viewBox="0 0 24 24" style="transform: rotate(${headingDeg}deg)">
      <path d="M12 2 L20 20 L12 15.5 L4 20 Z" fill="${color}" stroke="#171717" stroke-width="1" />
    </svg>`,
  })
}

export function VehicleMarker({
  vehicle,
  selected,
  onSelect,
}: {
  vehicle: Vehicle
  selected: boolean
  onSelect: () => void
}) {
  return (
    <Marker
      position={[vehicle.lat, vehicle.lon]}
      icon={buildIcon(vehicle.headingDeg, selected)}
      eventHandlers={{ click: onSelect }}
    >
      <Tooltip direction="top" offset={[0, -10]}>
        {vehicle.name}
      </Tooltip>
    </Marker>
  )
}
