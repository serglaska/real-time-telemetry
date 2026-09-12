export const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8765'
export const WS_RECONNECT_DELAY_MS = 2000

export const CONNECTION_STATUS = {
  CONNECTING: 'connecting',
  OPEN: 'open',
  CLOSED: 'closed',
} as const

export const GPS_FIX_LABEL = {
  'no-fix': 'No fix',
  'fix-2d': '2D fix',
  'fix-3d': '3D fix',
} as const

export const FLIGHT_MODE_LABEL = {
  auto: 'Auto',
  rtl: 'Return to launch',
} as const

export const BATTERY_THRESHOLDS = {
  LOW_PERCENT: 30,
  CRITICAL_PERCENT: 15,
}

export const TELEMETRY_HISTORY_LENGTH = 40

export const MAP_DEFAULTS = {
  CENTER: [50.4501, 30.5234] as [number, number],
  ZOOM: 14,
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  TILE_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}
