import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

interface OnboardingState {
  // Current UI state
  step: number
  isLoading: boolean
  error: string | null

  // User choices
  school: string
  knowsMajor: boolean | null
  selectedMajor: string | null
  interests: string[]
  suggestedMajors: string[]
  availableMajors: string[]
 

  // Actions for UI state
  setStep: (step: number) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void

  // Actions for user choices
  setSchool: (school: string) => void
  setKnowsMajor: (knows: boolean) => void
  setSelectedMajor: (major: string) => void
  toggleInterest: (interest: string) => void
  setSuggestedMajors: (majors: string[]) => void

  // API and state management
  fetchSuggestedMajors: () => Promise<void>
  resetState: () => void
}

const initialState = {
  // UI state
  step: 0,
  isLoading: false,
  error: null,

  // User choices
  school: '',
  knowsMajor: null,
  selectedMajor: null,
  interests: [],
  suggestedMajors: [],
  // to be updated with actual majors
  availableMajors: [
    'Computer Science',
    'Business Administration',
    'Psychology',
    'Engineering',
    'Biology',
    'Mathematics',
    'English Literature',
    'Chemistry',
    'Economics',
    'History',
    'Physics',
    'Political Science',
    'Sociology',
    'Art and Design',
    'Music',
  ]
}

export const useOnboardingStore = create<OnboardingState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // UI state actions
        setStep: (step) => set({ step }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),

        // User choice actions
        setSchool: (school) => set({ school }),
        setKnowsMajor: (knows) => set({ knowsMajor: knows }),
        setSelectedMajor: (major) => set({ selectedMajor: major }),
        toggleInterest: (interest) => set((state) => ({
          interests: state.interests.includes(interest)
            ? state.interests.filter(i => i !== interest)
            : [...state.interests, interest]
        })),
        setSuggestedMajors: (majors) => set({ suggestedMajors: majors }),

        // API actions
        fetchSuggestedMajors: async () => {
          set({ isLoading: true, error: null })
          try {
            const { school, interests } = get()
            const response = await fetch('/api/suggest-majors', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ school, interests }),
            })
            
            if (!response.ok) {
              throw new Error('Failed to fetch majors')
            }
            
            const majors = await response.json()
            set({ suggestedMajors: majors, isLoading: false })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'An error occurred',
              isLoading: false 
            })
            throw error
          }
        },

        // Reset action
        resetState: () => set({...initialState})
      }),
      {
        name: 'onboarding-storage',
        // Persist everything except loading and error states
        partialize: (state) => Object.fromEntries(
          Object.entries(state).filter(([key]) => 
            !['isLoading', 'error'].includes(key)
          )
        ),
        // Storage configuration
        storage: createJSONStorage(() => localStorage),
        // Version the storage in case you need to migrate data later
        version: 1,
        // Optional: Migrate old stored data to new format
        migrate: (persistedState: any, version: number) => {
          if (version === 0) {
            // Handle migration from version 0 to 1
            return {
              ...persistedState,
              // Add any new fields with default values
            }
          }
          return persistedState as OnboardingState
        }
      }
    ),
    { name: 'OnboardingStore' }
  )
)
