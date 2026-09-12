export function formatNumber(value: number, fractionDigits = 0) {
  return value.toFixed(fractionDigits)
}

export function formatCoordinate(value: number) {
  return value.toFixed(5)
}
