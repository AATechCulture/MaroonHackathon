import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import majorsData from '../bethune-cookman_university_transformed.json'

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
  setAvailableMajors: (schoolName: string) => void
}

interface MajorRecommendationResponse {
  recommended_majors: string[];
  school_name: string;
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
        setSchool: (school) => {
            set({ school })
            get().setAvailableMajors(school)
        },
        setAvailableMajors: (schoolName) => {
            const schoolData = majorsData.majors
            const majorsList = schoolData.map(major => major.name)
            set({ availableMajors: majorsList })
        },
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
            const response = await fetch('http://localhost:5000/recommend-majors', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                interests: interests.map(i => i.toLowerCase()),
                school_name: school
              })
            })
            
            if (!response.ok) {
              throw new Error('Failed to fetch majors')
            }
            
            const data: MajorRecommendationResponse = await response.json()
            const topThreeMajors = data.recommended_majors.slice(0, 3)
            set({ 
              suggestedMajors: topThreeMajors,
              isLoading: false 
            })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'An error occurred',
              isLoading: false 
            })
            throw error
          }
        },

        // Reset action
        resetState: () => {
          set({
            step: 0,
            isLoading: false,
            error: null,
            school: '',
            knowsMajor: null,
            selectedMajor: null,
            interests: [],
            suggestedMajors: [],
            availableMajors: initialState.availableMajors
          })
          // Clear localStorage
          localStorage.removeItem('onboarding-storage')
        },
      }),
      {
        name: 'onboarding-storage',
        // Only persist essential data
        partialize: (state) => ({
          // Only persist these specific fields
          school: state.school,
          selectedMajor: state.selectedMajor,
          // Don't persist step or other navigation state
        }),
        storage: createJSONStorage(() => localStorage),
        version: 1,
      }
    ),
    { name: 'OnboardingStore' }
  )
)
