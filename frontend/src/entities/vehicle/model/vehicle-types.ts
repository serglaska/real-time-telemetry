import type { FLIGHT_MODE_LABEL, GPS_FIX_LABEL } from '@/shared/config/constants'

export type GpsFix = keyof typeof GPS_FIX_LABEL
export type FlightMode = keyof typeof FLIGHT_MODE_LABEL

export type Vehicle = {
  id: string
  name: string
  lat: number
  lon: number
  altitudeM: number
  headingDeg: number
  groundspeedMs: number
  batteryPercent: number
  voltageV: number
  gpsFix: GpsFix
  flightMode: FlightMode
  armed: boolean
}

export type FleetSnapshot = {
  type: 'fleet-snapshot'
  timestamp: number
  vehicles: Vehicle[]
}
