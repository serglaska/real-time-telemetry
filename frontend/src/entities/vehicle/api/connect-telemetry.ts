import { connectReconnectingSocket } from '@/shared/api/websocket-client'
import { WS_URL } from '@/shared/config/constants'
import { useVehicleStore } from '../model/vehicle-store'
import type { FleetSnapshot } from '../model/vehicle-types'

export function connectTelemetry() {
  return connectReconnectingSocket(WS_URL, {
    onMessage: (data) => useVehicleStore.getState().applySnapshot(data as FleetSnapshot),
    onStatusChange: (status) => useVehicleStore.getState().setConnectionStatus(status),
  })
}
