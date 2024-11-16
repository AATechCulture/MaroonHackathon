'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Book, Youtube, DollarSign, ChevronRight, ChevronLeft, Globe, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import Link from 'next/link'
import { useDashboardStore } from '@/store/dashboardStore'
import bethuneCookmanData from '@/bethune-cookman_university_transformed.json'
import { Input } from '@/components/ui/input'
import NavBar from '@/components/navbar'

const yearData = {
  Freshman: 'Freshman',
  Sophomore: 'Sophomore',
  Junior: 'Junior',
  Senior: 'Senior'
} as const;

type YearKey = keyof typeof yearData;

const getYearData = (majorName: string) => {
  const major = bethuneCookmanData.majors.find(m => m.name === majorName);
  if (!major) return null;

  return {
    Freshman: {
      fall: major.curriculum.freshman?.fall || [],
      spring: major.curriculum.freshman?.spring || []
    },
    Sophomore: {
      fall: major.curriculum.sophomore?.fall || [],
      spring: major.curriculum.sophomore?.spring || []
    },
    Junior: {
      fall: major.curriculum.junior?.fall || [],
      spring: major.curriculum.junior?.spring || []
    },
    Senior: {
      fall: major.curriculum.senior?.fall || [],
      spring: major.curriculum.senior?.spring || []
    }
  };
};

const resources = [
  { title: 'Introduction to Algorithms', type: 'video', url: 'https://www.youtube.com/watch?v=0IAPZzGSbME' },
  { title: 'Cracking the Coding Interview', type: 'book', url: 'https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850' },
  { title: 'FreeCodeCamp', type: 'website', url: 'https://www.freecodecamp.org/' },
  { title: 'CS50: Introduction to Computer Science', type: 'video', url: 'https://www.youtube.com/watch?v=8mAITcNt710' }
]

const WavyRoad = () => (
  <svg viewBox="0 0 1440 120" className="w-full h-24 mb-4">
    <path
      fill="none"
      stroke="#313BA8"
      strokeWidth="6"
      strokeLinecap="round"
      d="M0,60 C320,130 420,10 640,60 C880,110 1100,30 1440,60"
    >
      <animate
        attributeName="d"
        dur="5s"
        repeatCount="indefinite"
        values="
          M0,60 C320,130 420,10 640,60 C880,110 1100,30 1440,60;
          M0,60 C320,10 420,130 640,60 C880,30 1100,110 1440,60;
          M0,60 C320,130 420,10 640,60 C880,110 1100,30 1440,60
        "
      />
    </path>
    <g>
      <circle cx="0" cy="60" r="10" fill="#FF0100">
        <animate
          attributeName="cx"
          dur="5s"
          repeatCount="indefinite"
          values="0;1440;0"
        />
      </circle>
    </g>
  </svg>
)

const WavingHand = () => (
  <motion.span
    className="inline-block"
    animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }}
    transition={{
      duration: 2.5,
      ease: "easeInOut",
      times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 1],
      repeat: Infinity,
      repeatDelay: 1
    }}
  >
    👋
  </motion.span>
)

export default function DashboardComponent() {
  const { 
    activeYear, 
    greeting, 
    funFact, 
    selectedMajor,
    setActiveYear, 
    setSelectedMajor 
  } = useDashboardStore()
  
  const [courseData, setCourseData] = useState<any>(null)
  const [resources, setResources] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const fetchResources = async (additionalInfo?: string) => {
    try {
      const response = await fetch('http://localhost:5000/learning-resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          major: selectedMajor,
          additional_info: additionalInfo || ''
        }),
      })
      
      const data = await response.json()
      if (Array.isArray(data)) {
        setResources(data)
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
    }
  }

  useEffect(() => {
    const yearData = getYearData(selectedMajor)
    if (yearData) {
      setCourseData(yearData)
      fetchResources()
    }
  }, [selectedMajor])

  const handleSearch = () => {
    setIsSearching(true)
    fetchResources(searchQuery)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <motion.h1 
              className="text-3xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {greeting} <WavingHand />
            </motion.h1>
            
            {funFact && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm text-gray-600 italic mb-6 flex items-center"
              >
                <span className="inline-block mr-2">✨</span>
                <span className="font-medium">Fun Fact:</span> {funFact}
              </motion.p>
            )}
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Roadmap for {selectedMajor}!</CardTitle>
              <CardDescription>Track your progress through your degree</CardDescription>
            </CardHeader>
            <CardContent>
              <WavyRoad />
              <div className="flex justify-between items-center mb-4">
                {Object.keys(yearData).map((year, index) => (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant={activeYear === year ? "default" : "outline"}
                      onClick={() => setActiveYear(year as YearKey)}
                      className="rounded-full"
                    >
                      {year}
                    </Button>
                  </motion.div>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeYear}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      {/* <CardTitle>{activeYear} Year</CardTitle> */}
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Fall Semester */}
                        <div>
                          <h3 className="font-semibold mb-2 text-[#313BA8]">Fall Semester</h3>
                          <ul className="space-y-2">
                            {courseData && courseData[activeYear]?.fall.map((course: string, index: number) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center"
                              >
                                <Book className="mr-2 h-4 w-4 text-[#313BA8]" />
                                {course}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Spring Semester */}
                        <div>
                          <h3 className="font-semibold mb-2 text-[#313BA8]">Spring Semester</h3>
                          <ul className="space-y-2">
                            {courseData && courseData[activeYear]?.spring.map((course: string, index: number) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center"
                              >
                                <Book className="mr-2 h-4 w-4 text-[#313BA8]" />
                                {course}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Resources</CardTitle>
                <CardDescription>Recommended materials to support your studies</CardDescription>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Search for specific topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {resources.length > 0 ? (
                  <ul className="space-y-2">
                    {resources.map((resource, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center hover:text-[#313BA8] transition-colors"
                        >
                          {resource.type === 'video' && <Youtube className="mr-2 h-4 w-4" />}
                          {resource.type === 'book' && <Book className="mr-2 h-4 w-4" />}
                          {resource.type === 'website' && <Globe className="mr-2 h-4 w-4" />}
                          {resource.type === 'course' && <Book className="mr-2 h-4 w-4" />}
                          {resource.title}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500">Loading resources...</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Buddy</CardTitle>
                <CardDescription>Powered by Fidelity Investments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Take control of your financial future with our partner, Fidelity Investments.</p>
                <Link href="/finance">
                  <Button className="w-full bg-gradient-to-r from-[#313BA8] to-blue-600">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Explore Financial Resources
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}