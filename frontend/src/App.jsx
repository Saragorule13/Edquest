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
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import LiveMonitoring from './components/admin/LiveMonitoring';
import SessionArchive from './components/admin/SessionArchive';
import ViolationReports from './components/admin/ViolationReports';
import UserManagement from './components/admin/UserManagement';
import Settings from './components/admin/Settings';
import SystemStatus from './components/admin/SystemStatus';
import AddTest from './components/admin/AddTest';
import AddQuestions from './components/admin/AddQuestions';
import StudentDashboard from './components/StudentDashboard';
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
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="live" element={<LiveMonitoring />} />
          <Route path="archive" element={<SessionArchive />} />
          <Route path="violations" element={<ViolationReports />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="add-test" element={<AddTest />} />
          <Route path="add-questions" element={<AddQuestions />} />
          <Route path="settings" element={<Settings />} />
          <Route path="status" element={<SystemStatus />} />
        </Route>
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route
        path='/exam'
        element={
          <StudentDashboard/>
        }>

        </Route>
        <Route 
          path="/exam/:testId" 
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