'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { User, Sparkles, Save, GraduationCap, Coffee, Music } from 'lucide-react'
import NavBar from '@/components/navbar'
import { useDashboardStore } from '@/store/dashboardStore'
import { toast } from 'react-hot-toast'

export default function ProfilePage() {
  const { setGreeting, setFunFact: setStoreFunFact } = useDashboardStore()
  const [name, setName] = useState('')
  const [funFact, setFunFact] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    if (name) {
      setGreeting?.(name)
      setStoreFunFact?.(funFact)
      setIsSaved(true)
      toast.success('Check your dashboard for a surprise! 🎉')
      setTimeout(() => setIsSaved(false), 2000)
    }
  }

  const funEmojis = ["🎮", "🎨", "🎭", "🎪", "🎢", "🎡", "🎠"]
  const [currentEmoji, setCurrentEmoji] = useState(funEmojis[0])

  const rotateEmoji = () => {
    const currentIndex = funEmojis.indexOf(currentEmoji)
    const nextIndex = (currentIndex + 1) % funEmojis.length
    setCurrentEmoji(funEmojis[nextIndex])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <motion.h1 
                className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={rotateEmoji}
                style={{ cursor: 'pointer' }}
              >
                Your Fun Profile {currentEmoji}
              </motion.h1>
              <p className="text-xl text-gray-600">Let's make your experience more personal!</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 mb-12">
              {/* Personal Info Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-[#313BA8]" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>Tell us a bit about yourself</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Your Name</label>
                        <Input
                          placeholder="Enter your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Fun Fact About You</label>
                        <Input
                          placeholder="Share something interesting!"
                          value={funFact}
                          onChange={(e) => setFunFact(e.target.value)}
                          className="mt-1 h-24 align-top"
                          style={{ verticalAlign: 'top', paddingTop: '8px' }}
                        />
                      </div>
                      <Button 
                        onClick={handleSave}
                        className="w-full bg-gradient-to-r from-[#313BA8] to-blue-600"
                      >
                        {isSaved ? (
                          <Sparkles className="mr-2 h-4 w-4" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        {isSaved ? 'Saved!' : 'Save Changes'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Fun Facts Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-[#313BA8]" />
                      Did You Know?
                    </CardTitle>
                    <CardDescription>Fun facts about student life</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <motion.li 
                        className="flex items-start gap-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Coffee className="h-5 w-5 text-[#313BA8] mt-1" />
                        <p className="text-gray-600">The average college student drinks 3.1 cups of coffee per day!</p>
                      </motion.li>
                      <motion.li 
                        className="flex items-start gap-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Music className="h-5 w-5 text-[#313BA8] mt-1" />
                        <p className="text-gray-600">Students who study with background music retain 20% more information!</p>
                      </motion.li>
                      {funFact && (
                        <motion.li 
                          className="flex items-start gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Sparkles className="h-5 w-5 text-[#313BA8] mt-1" />
                          <p className="text-gray-600">Your fun fact: {funFact}</p>
                        </motion.li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
