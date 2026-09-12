import { BatteryBadge, FlightModeBadge, GpsFixBadge, useVehicleStore } from '@/entities/vehicle'
import { formatCoordinate, formatNumber } from '@/shared/lib/format'
import { TelemetrySparkline } from './telemetry-sparkline'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-neutral-500">{label}</dt>
      <dd className="text-sm tabular-nums text-neutral-200">{value}</dd>
    </div>
  )
}

export function VehicleDetailPanel() {
  const selectedId = useVehicleStore((state) => state.selectedId)
  const vehicle = useVehicleStore((state) => (selectedId ? state.vehicles.get(selectedId) : undefined))
  const history = useVehicleStore((state) => (selectedId ? state.history.get(selectedId) : undefined))

  if (!vehicle) {
    return <p className="p-4 text-sm text-neutral-500">Select a vehicle to see telemetry.</p>
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-100">{vehicle.name}</h2>
        <div className="flex items-center gap-1.5">
          <FlightModeBadge mode={vehicle.flightMode} />
          <GpsFixBadge fix={vehicle.gpsFix} />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3">
        <Stat label="Altitude" value={`${formatNumber(vehicle.altitudeM)} m`} />
        <Stat label="Groundspeed" value={`${formatNumber(vehicle.groundspeedMs, 1)} m/s`} />
        <Stat label="Heading" value={`${formatNumber(vehicle.headingDeg)}°`} />
        <Stat label="Voltage" value={`${formatNumber(vehicle.voltageV, 1)} V`} />
        <Stat label="Latitude" value={formatCoordinate(vehicle.lat)} />
        <Stat label="Longitude" value={formatCoordinate(vehicle.lon)} />
      </dl>

      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-500">Battery</span>
        <BatteryBadge percent={vehicle.batteryPercent} />
      </div>
      <TelemetrySparkline values={history?.battery ?? []} color="#34d399" />

      <span className="text-xs text-neutral-500">Altitude, last {history?.altitude.length ?? 0} samples</span>
      <TelemetrySparkline values={history?.altitude ?? []} color="#38bdf8" />
    </div>
  )
}
