import { BATTERY_THRESHOLDS } from '@/shared/config/constants'
import { formatNumber } from '@/shared/lib/format'

export function BatteryBadge({ percent }: { percent: number }) {
  const tone =
    percent <= BATTERY_THRESHOLDS.CRITICAL_PERCENT
      ? 'bg-red-500/15 text-red-400'
      : percent <= BATTERY_THRESHOLDS.LOW_PERCENT
        ? 'bg-amber-500/15 text-amber-400'
        : 'bg-emerald-500/15 text-emerald-400'

  return (
    <span className={`rounded px-1.5 py-0.5 text-xs font-medium tabular-nums ${tone}`}>
      {formatNumber(percent)}%
    </span>
  )
}
