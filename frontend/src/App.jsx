import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import InstitutionsTicker from './components/InstitutionsTicker';
import SystemInfrastructure from './components/SystemInfrastructure';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <InstitutionsTicker />
      <SystemInfrastructure />
      <CTASection />
      <Footer />
    </div>
  );
}

export default App;