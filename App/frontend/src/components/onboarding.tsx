'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, School, BookOpen, Sparkles, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image'
import Link from 'next/link'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import { useEffect } from 'react'

export default function Onboarding() {
  const {
    step,
    school,
    knowsMajor,
    selectedMajor,
    interests,
    suggestedMajors,
    availableMajors,
    isLoading,
    error,
    setStep,
    setSchool,
    setKnowsMajor,
    setSelectedMajor,
    toggleInterest,
    fetchSuggestedMajors,
  } = useOnboardingStore()

  const interestOptions = [
    'Technology', 'Science', 'Arts', 'Humanities', 'Business',
    'Health', 'Engineering', 'Social Sciences', 'Education'
  ]

  // Check for existing onboarding data on mount
  useEffect(() => {
    if (school || interests.length > 0 || knowsMajor !== null) {
      console.log('Existing onboarding data found')
    }
  }, [school, interests, knowsMajor])

  const isNextDisabled = () => {
    if (step === 1 && !school) return true
    if (step === 2 && knowsMajor === null) return true
    if (step === 3 && knowsMajor && !selectedMajor) return true
    if (step === 3 && !knowsMajor && interests.length === 0) return true
    return false
  }

  const handleNextStep = async () => {
    if (isNextDisabled()) return

    if (step === 2) {
      // After major knowledge check
      if (knowsMajor === true) {
        setStep(3) // Go to major selection
      } else {
        setStep(3) // Go to interests
      }
    } else if (step === 3) {
      if (knowsMajor === true) {
        setStep(5) // Known major: go straight to results
      } else {
        try {
          await fetchSuggestedMajors()
          setStep(4) // Unknown major: fetch suggestions and go to results
        } catch (error) {
          console.error('Failed to fetch majors')
        }
      }
    } else {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => setStep(step - 1)

  const steps = [
    // Welcome Screen
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-6F6gxaIu3r7QwYCQTgl2vw4K97T1C7.svg"
        alt="Career Compass Logo"
        width={200}
        height={60}
        className="mx-auto mb-8"
      />
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#313BA8] to-blue-600">
        Find Your Path
      </h1>
      <p className="text-xl mb-8 text-gray-600">Let's discover the perfect major for your future</p>
      <Button onClick={handleNextStep} size="lg" className="rounded-full bg-gradient-to-r from-[#313BA8] to-blue-600">
        Begin Your Journey
      </Button>
    </motion.div>,

    // School Selection
    <motion.div
      key="school"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <School className="w-16 h-16 mx-auto mb-4 text-[#313BA8]" />
      <h2 className="text-2xl font-semibold text-center">Which school do you attend?</h2>
      <div className="max-w-sm mx-auto">
        <Label htmlFor="school" className="text-gray-600">School Name</Label>
        <Input
          id="school"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          placeholder="Enter your school name"
          className="mt-1 rounded-full"
        />
      </div>
    </motion.div>,

    // Major Knowledge Check
    <motion.div
      key="major-check"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      <BookOpen className="w-16 h-16 mx-auto mb-4 text-[#313BA8]" />
      <h2 className="text-2xl font-semibold text-center">Do you know your major?</h2>
      <RadioGroup 
        value={knowsMajor === true ? 'yes' : knowsMajor === false ? 'no' : ''} 
        onValueChange={(value) => setKnowsMajor(value === 'yes')}
        className="max-w-sm mx-auto space-y-4"
      >
        <div className="flex items-center space-x-2 p-4 rounded-xl border-2 border-gray-100 hover:border-[#313BA8] transition-colors">
          <RadioGroupItem value="yes" id="yes" />
          <Label htmlFor="yes" className="flex-grow cursor-pointer">Yes, I know my major</Label>
        </div>
        <div className="flex items-center space-x-2 p-4 rounded-xl border-2 border-gray-100 hover:border-[#313BA8] transition-colors">
          <RadioGroupItem value="no" id="no" />
          <Label htmlFor="no" className="flex-grow cursor-pointer">No, I'd like to explore options</Label>
        </div>
      </RadioGroup>
    </motion.div>,

    // Conditional Step: Either Major Selection or Interest Selection
    knowsMajor ? (
      // Major Selection
      <motion.div
        key="major-selection"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="space-y-6"
      >
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-[#313BA8]" />
        <h2 className="text-2xl font-semibold text-center">Select Your Major</h2>
        <div className="max-w-sm mx-auto">
          <Select
            value={selectedMajor || ''}
            onValueChange={setSelectedMajor}
          >
            <SelectTrigger className="w-full rounded-full">
              <SelectValue placeholder="Choose your major" />
            </SelectTrigger>
            <SelectContent>
              {availableMajors.map((major) => (
                <SelectItem key={major} value={major}>
                  {major}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>
    ) : (
      // Interest Selection
      <motion.div
        key="interests"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <Sparkles className="w-16 h-16 mx-auto mb-4 text-[#313BA8]" />
        <h2 className="text-2xl font-semibold text-center">What interests you?</h2>
        <p className="text-center text-gray-600">Select all that spark your curiosity</p>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {interestOptions.map((interest) => (
            <motion.div
              key={interest}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 p-4 rounded-xl border-2 border-gray-100 hover:border-[#313BA8] transition-colors"
            >
              <Checkbox
                id={interest}
                checked={interests.includes(interest)}
                onCheckedChange={() => toggleInterest(interest)}
              />
              <Label htmlFor={interest} className="flex-grow cursor-pointer">{interest}</Label>
            </motion.div>
          ))}
        </div>
      </motion.div>
    ),

    // Results Display
    <motion.div
      key="results"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6 text-center"
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-6F6gxaIu3r7QwYCQTgl2vw4K97T1C7.svg"
        alt="Career Compass Logo"
        width={150}
        height={45}
        className="mx-auto mb-6"
      />
      <h2 className="text-2xl font-semibold">
        {knowsMajor 
          ? "Great choice! Let's explore your major:"
          : "Here are your recommended majors:"}
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#313BA8]"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4">
          {error}
          <Button onClick={() => handleNextStep()} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : (
        <div className="space-y-4 my-8">
          {knowsMajor ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-gradient-to-r from-[#313BA8]/5 to-blue-600/5"
            >
              <h3 className="text-xl font-medium text-[#313BA8]">{selectedMajor}</h3>
            </motion.div>
          ) : (
            suggestedMajors.map((major, index) => (
              <motion.div
                key={major}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-4 rounded-xl bg-gradient-to-r from-[#313BA8]/5 to-blue-600/5"
              >
                <h3 className="text-xl font-medium text-[#313BA8]">{major}</h3>
              </motion.div>
            ))
          )}
        </div>
      )}
      <p className="text-lg text-gray-600">
        {knowsMajor
          ? "Let's explore your chosen path and plan your academic journey."
          : "Great start! Let's explore these paths in detail and plan your academic journey."}
      </p>
    </motion.div>
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Your existing nav component remains the same */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-6F6gxaIu3r7QwYCQTgl2vw4K97T1C7.svg"
                  alt="Career Compass Logo"
                  width={120}
                  height={40}
                />
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="#" className="border-[#313BA8] text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Home
                </Link>
                <Link href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  About
                </Link>
                <Link href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Contact
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Button variant="outline" className="rounded-full">
                Sign In
              </Button>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#313BA8]">
                    <span className="sr-only">Open main menu</span>
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="#">Home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="#">About</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="#">Contact</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="#">Sign In</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full relative overflow-hidden">
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {steps[step]}
            </AnimatePresence>
          </div>
          <div className="flex justify-between mt-8 relative z-10">
            {step > 0 && (
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="rounded-full"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            {step < steps.length - 1 && (
              <Button
                onClick={handleNextStep}
                disabled={isLoading || isNextDisabled()}
                className="ml-auto rounded-full bg-gradient-to-r from-[#313BA8] to-blue-600"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>Next <ChevronRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-50 to-transparent rounded-b-2xl"></div>
        </div>
      </div>
    </div>
  )
}