import { TELEMETRY_HISTORY_LENGTH } from '@/shared/config/constants'
import type { Vehicle } from '../model/vehicle-types'

export type TelemetryHistory = {
  battery: number[]
  altitude: number[]
}

export function pushSample(history: TelemetryHistory | undefined, vehicle: Vehicle): TelemetryHistory {
  const battery = [...(history?.battery ?? []), vehicle.batteryPercent].slice(-TELEMETRY_HISTORY_LENGTH)
  const altitude = [...(history?.altitude ?? []), vehicle.altitudeM].slice(-TELEMETRY_HISTORY_LENGTH)
  return { battery, altitude }
}
