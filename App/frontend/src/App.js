import React from 'react'
import HomePage from './Components/HomePage'
import Navbar from './Components/Navbar'
import Onboarding from './Components/Onboarding'
import AdvisingDashboard from './Components/AdvisingDashboard'
import DataFetcher from './Components/DataFetcher'

const App = () => {
  return (
  <>
  <h1>Hello World</h1>
  <HomePage />
  <Navbar />
  <Onboarding />
  <AdvisingDashboard />
  <DataFetcher />
  </>
    
  )
}

export default App