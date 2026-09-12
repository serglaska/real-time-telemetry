import { useVehicleStore } from '@/entities/vehicle'
import { CONNECTION_STATUS } from '@/shared/config/constants'

const STATUS_COPY = {
  [CONNECTION_STATUS.OPEN]: { label: 'Live', dot: 'bg-emerald-400' },
  [CONNECTION_STATUS.CONNECTING]: { label: 'Connecting…', dot: 'bg-amber-400 animate-pulse' },
  [CONNECTION_STATUS.CLOSED]: { label: 'Disconnected', dot: 'bg-red-400' },
}

export function ConnectionStatusBar() {
  const status = useVehicleStore((state) => state.connectionStatus)
  const { label, dot } = STATUS_COPY[status]

  return (
    <header className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
      <h1 className="text-sm font-semibold tracking-wide text-neutral-200">Fleet Telemetry Dashboard</h1>
      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        {label}
      </div>
    </header>
  )
}
