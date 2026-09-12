const VIEW_WIDTH = 120
const VIEW_HEIGHT = 32

export function TelemetrySparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return <svg width={VIEW_WIDTH} height={VIEW_HEIGHT} />

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * VIEW_WIDTH
      const y = VIEW_HEIGHT - ((value - min) / range) * VIEW_HEIGHT
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg width={VIEW_WIDTH} height={VIEW_HEIGHT} viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  )
}
