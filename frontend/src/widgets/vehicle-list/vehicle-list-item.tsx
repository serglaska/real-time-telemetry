import { BatteryBadge, GpsFixBadge, type Vehicle } from '@/entities/vehicle'

export function VehicleListItem({
  vehicle,
  selected,
  onSelect,
}: {
  vehicle: Vehicle
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
        selected ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-400 hover:bg-neutral-800/60'
      }`}
    >
      <span className="font-medium">{vehicle.name}</span>
      <span className="flex items-center gap-1.5">
        <GpsFixBadge fix={vehicle.gpsFix} />
        <BatteryBadge percent={vehicle.batteryPercent} />
      </span>
    </button>
  )
}
