import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import InstitutionsTicker from './components/InstitutionsTicker';
import SystemInfrastructure from './components/SystemInfrastructure';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import ExamScreen from './components/ExamScreen';
import Login from './components/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import { supabase } from './supabaseClient';

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

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold tracking-widest text-xl">VERIFYING SESSION...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route 
          path="/exam" 
          element={
            <ProtectedRoute>
              <ExamScreen />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;