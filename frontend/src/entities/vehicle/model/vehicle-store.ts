import { create } from 'zustand'

import { CONNECTION_STATUS } from '@/shared/config/constants'
import { pushSample } from '../lib/telemetry-history'
import type { FleetSnapshot, Vehicle } from './vehicle-types'

type ConnectionStatus = (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS]

type VehicleStore = {
  vehicles: Map<string, Vehicle>
  history: Map<string, { battery: number[]; altitude: number[] }>
  selectedId: string | null
  connectionStatus: ConnectionStatus
  applySnapshot: (snapshot: FleetSnapshot) => void
  setConnectionStatus: (status: ConnectionStatus) => void
  selectVehicle: (id: string) => void
}

export const useVehicleStore = create<VehicleStore>((set) => ({
  vehicles: new Map(),
  history: new Map(),
  selectedId: null,
  connectionStatus: CONNECTION_STATUS.CONNECTING,
  applySnapshot: (snapshot) =>
    set((state) => {
      const vehicles = new Map(state.vehicles)
      const history = new Map(state.history)
      for (const vehicle of snapshot.vehicles) {
        vehicles.set(vehicle.id, vehicle)
        history.set(vehicle.id, pushSample(history.get(vehicle.id), vehicle))
      }
      return {
        vehicles,
        history,
        selectedId: state.selectedId ?? snapshot.vehicles[0]?.id ?? null,
      }
    }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  selectVehicle: (id) => set({ selectedId: id }),
}))
