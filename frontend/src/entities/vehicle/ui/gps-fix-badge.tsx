import { GPS_FIX_LABEL } from '@/shared/config/constants'
import type { GpsFix } from '../model/vehicle-types'

export function GpsFixBadge({ fix }: { fix: GpsFix }) {
  const tone = fix === 'fix-3d' ? 'bg-sky-500/15 text-sky-400' : 'bg-neutral-500/15 text-neutral-400'

  return <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${tone}`}>{GPS_FIX_LABEL[fix]}</span>
}
