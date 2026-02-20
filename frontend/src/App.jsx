import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import InstitutionsTicker from './components/InstitutionsTicker';
import SystemInfrastructure from './components/SystemInfrastructure';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import ExamScreen from './components/ExamScreen';
import Login from './components/Login';

function MainLayout() {
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/exam" element={<ExamScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;