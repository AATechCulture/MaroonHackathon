'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, DollarSign, Info, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import NavBar from '@/components/navbar'

export default function FinancePage() {
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
                className="text-3xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Financial Planning with Fidelity
              </motion.h1>
              <p className="text-xl text-gray-600">Your Journey to Financial Success Starts Here</p>
            </div>

            {/* Fidelity Banner */}
            <Card className="mb-12">
              <CardContent className="p-0">
                <div className="relative w-full h-64">
                  <Image
                    src="/fidelity.jpg" // Add this image to your public folder
                    alt="Fidelity Investments"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-xl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Three Cards Section */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {/* About Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-[#313BA8]" />
                      About Fidelity
                    </CardTitle>
                    <CardDescription>Learn why Fidelity is the right choice for students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-600">
                      Discover how Fidelity helps students build strong financial foundations with:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                      <li>No minimum balance requirements</li>
                      <li>Zero account fees</li>
                      <li>Student-focused financial education</li>
                      <li>Mobile-first banking experience</li>
                    </ul>
                    <Link href="https://www.fidelity.com/about-fidelity/our-company" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full">
                        Learn More
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Meet Advisor Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-[#313BA8]" />
                      Meet Your Advisor
                    </CardTitle>
                    <CardDescription>Schedule a personalized financial consultation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-600">
                      Get personalized guidance from a Fidelity advisor who can help you:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                      <li>Create a financial plan</li>
                      <li>Understand investment options</li>
                      <li>Plan for student loan management</li>
                      <li>Set up your first account</li>
                    </ul>
                    <Link href="https://digital.fidelity.com/prgw/digital/faa/0/connect-with-an-advisor" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full">
                        Schedule Meeting
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Start Investing Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-[#313BA8]" />
                      Start Investing
                    </CardTitle>
                    <CardDescription>Begin your investment journey today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-600">
                      Take advantage of Fidelity&apos;s student-friendly features:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                      <li>Commission-free trading</li>
                      <li>Fractional share investing</li>
                      <li>Educational resources</li>
                      <li>24/7 customer support</li>
                    </ul>
                    <Link href="https://www.fidelity.com" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full">
                        Visit Fidelity
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Why Choose Fidelity Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Why Choose Fidelity as a Student?</CardTitle>
                  <CardDescription>Your financial future starts with smart choices today</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    As a student, you&apos;re at the perfect stage to start building your financial foundation. 
                    Fidelity Investments offers specialized tools and resources designed specifically for students 
                    entering their college journey. With Fidelity, you get:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Financial Education</h3>
                      <p className="text-gray-600">
                        Access to comprehensive learning resources, webinars, and workshops tailored for students 
                        new to financial planning and investing.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Student-Friendly Features</h3>
                      <p className="text-gray-600">
                        No minimum balances, zero account fees, and special student programs designed to help 
                        you start your financial journey right.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
