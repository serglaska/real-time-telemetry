import { useEffect } from 'react'

import { connectTelemetry } from '@/entities/vehicle'
import { FleetDashboardPage } from '@/pages/fleet-dashboard'

export function App() {
  useEffect(() => connectTelemetry(), [])

  return <FleetDashboardPage />
}
