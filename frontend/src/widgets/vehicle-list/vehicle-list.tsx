import { useVehicleStore } from '@/entities/vehicle'
import { VehicleListItem } from './vehicle-list-item'

export function VehicleList() {
  const vehicles = useVehicleStore((state) => state.vehicles)
  const selectedId = useVehicleStore((state) => state.selectedId)
  const selectVehicle = useVehicleStore((state) => state.selectVehicle)

  return (
    <nav className="flex flex-col gap-1 overflow-y-auto p-2">
      {[...vehicles.values()].map((vehicle) => (
        <VehicleListItem
          key={vehicle.id}
          vehicle={vehicle}
          selected={vehicle.id === selectedId}
          onSelect={() => selectVehicle(vehicle.id)}
        />
      ))}
    </nav>
  )
}
