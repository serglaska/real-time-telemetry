import { ConnectionStatusBar } from '@/widgets/connection-status-bar'
import { FleetMap } from '@/widgets/fleet-map'
import { VehicleDetailPanel } from '@/widgets/vehicle-detail-panel'
import { VehicleList } from '@/widgets/vehicle-list'

export function FleetDashboardPage() {
  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-neutral-200">
      <ConnectionStatusBar />
      <div className="grid flex-1 grid-cols-[240px_1fr_320px] overflow-hidden">
        <aside className="overflow-hidden border-r border-neutral-800">
          <VehicleList />
        </aside>
        <main>
          <FleetMap />
        </main>
        <aside className="overflow-y-auto border-l border-neutral-800">
          <VehicleDetailPanel />
        </aside>
      </div>
    </div>
  )
}
