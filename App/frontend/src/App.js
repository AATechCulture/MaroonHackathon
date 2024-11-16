// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Components/HomePage';
import Onboarding from './Components/Onboarding';
import AdvisingDashboard from './Components/AdvisingDashboard';
import DataFetcher from './Components/DataFetcher';
import Navbar from './Components/Navbar';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<AdvisingDashboard />} />
            <Route path="/fetch" element={<DataFetcher />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;