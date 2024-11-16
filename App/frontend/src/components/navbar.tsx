'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDashboardStore } from '@/store/dashboardStore'

export default function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { setGreeting, setFunFact } = useDashboardStore()

  const handleSignOut = () => {
    // Clear all local storage
    localStorage.clear()
    
    // Reset Zustand store states with current time greeting
    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 
      ? 'Good morning'
      : currentHour < 18 
        ? 'Good afternoon'
        : 'Good evening'
    
    setGreeting('')  // This will trigger the default time-based greeting
    setFunFact('')
    
    // Redirect to home page
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-6F6gxaIu3r7QwYCQTgl2vw4K97T1C7.svg"
                  alt="Career Compass Logo"
                  width={120}
                  height={40}
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/dashboard" 
                className={`${pathname === '/dashboard' ? 'border-[#313BA8] text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </Link>
              <Link 
                href="/finance" 
                className={`${pathname === '/finance' ? 'border-[#313BA8] text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Finance
              </Link>
              <Link 
                href="/profile" 
                className={`${pathname === '/profile' ? 'border-[#313BA8] text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button 
              variant="outline" 
              className="rounded-full"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}