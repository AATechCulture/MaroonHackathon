import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type YearKey = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior'

interface DashboardState {
  activeYear: YearKey
  greeting: string
  funFact: string
  selectedMajor: string
  setActiveYear: (year: YearKey) => void
  setGreeting: (name?: string) => void
  setFunFact: (fact: string) => void
  setSelectedMajor: (major: string) => void
  reset: () => void
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      activeYear: 'Freshman',
      greeting: new Date().getHours() < 12 
        ? 'Good morning' 
        : new Date().getHours() < 18 
          ? 'Good afternoon'
          : 'Good evening',
      funFact: '',
      selectedMajor: 'Computer Science',
      setActiveYear: (year) => set({ activeYear: year }),
      setGreeting: (name) => {
        const currentHour = new Date().getHours()
        const greeting = currentHour < 12 
          ? `Good morning${name ? `, ${name}` : ''}`
          : currentHour < 18 
            ? `Good afternoon${name ? `, ${name}` : ''}`
            : `Good evening${name ? `, ${name}` : ''}`
        set({ greeting })
      },
      setFunFact: (fact) => set({ funFact: fact }),
      setSelectedMajor: (major) => set({ selectedMajor: major }),
      reset: () => set({
        activeYear: 'Freshman',
        greeting: new Date().getHours() < 12 
          ? 'Good morning' 
          : new Date().getHours() < 18 
            ? 'Good afternoon'
            : 'Good evening',
        funFact: '',
        selectedMajor: 'Computer Science'
      })
    }),
    {
      name: 'dashboard-storage'
    }
  )
) 