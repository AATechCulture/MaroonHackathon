'use client'

import DashboardComponent from './dashboardComponent'
import { useDashboardStore } from '@/store/dashboardStore'

export default function Dashboard() {
  const { funFact } = useDashboardStore()

  return (
    <>
      <DashboardComponent />
    </>
  )
}

