import { FLIGHT_MODE_LABEL } from '@/shared/config/constants'
import type { FlightMode } from '../model/vehicle-types'

export function FlightModeBadge({ mode }: { mode: FlightMode }) {
  const tone = mode === 'rtl' ? 'bg-amber-500/15 text-amber-400' : 'bg-violet-500/15 text-violet-400'

  return <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${tone}`}>{FLIGHT_MODE_LABEL[mode]}</span>
}
