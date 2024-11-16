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

// Get majors list once at initialization
const allMajors = majorsData.majors.map(major => major.name)

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
  availableMajors: allMajors  // Initialize with the majors list
}

export const useOnboardingStore = create<OnboardingState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // UI state actions
        setStep: (step) => {
          if (step === 0) {
            get().resetState(); // Clear everything when returning to first step
          } else {
            set({ step });
          }
        },
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),

        // User choice actions
        setSchool: (school) => set({ school }), // Simplified - no need to call setAvailableMajors
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
            
            if (!school || interests.length === 0) {
              throw new Error('School and interests are required')
            }

            const response = await fetch('http://127.0.0.1:5000/recommend-majors', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                interests: interests.map(i => i.toLowerCase()),
                school_name: school
              })
            })
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}))
              throw new Error(errorData.message || 'Failed to fetch majors')
            }
            
            const data: MajorRecommendationResponse = await response.json()
            if (!data.recommended_majors?.length) {
              throw new Error('No matching majors found')
            }

            const topThreeMajors = data.recommended_majors.slice(0, 3)
            set({ 
              suggestedMajors: topThreeMajors,
              isLoading: false 
            })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'An error occurred',
              isLoading: false,
              suggestedMajors: [] // Reset suggestions on error
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

        // Add this with the other actions
        setAvailableMajors: (schoolName: string) => {
          const schoolMajors = majorsData.majors.map(major => major.name)
          set({ availableMajors: schoolMajors })
        },

        // Add this initialization effect
        onMount: (state: OnboardingState) => {
          // Reset state on page load/refresh
          window.addEventListener('beforeunload', () => {
            state.resetState();
          });

          // Optional: Clean up the event listener
          return () => {
            window.removeEventListener('beforeunload', () => {
              state.resetState();
            });
          };
        },
      }),
      {
        name: 'onboarding-storage',
        // Only persist essential data
        partialize: (state) => ({
          // Only persist these specific fields
          school: state.school,
          selectedMajor: state.knowsMajor ? state.selectedMajor : null,
          // Don't persist step or other navigation state
        }),
        storage: createJSONStorage(() => localStorage),
        version: 1,
      }
    ),
    { name: 'OnboardingStore' }
  )
)
