import React, { useState } from 'react';
import { Shield, HelpCircle, Wifi, Lock, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Login() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleStudentAuth = async (isSignUp, e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({ email, password });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (result.error) throw result.error;
      
      // On success, redirect to dashboard
      navigate('/exam');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      
      navigate('/exam'); // Assume admin goes to some dashboard, here we will send them to /exam for now
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-[var(--font-body)]">
      {/* Top Navbar */}
      <nav className="w-full bg-white border-b-2 border-black text-black px-8 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Shield className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-[var(--font-heading)] text-sm font-black tracking-[0.2em] uppercase leading-none">
              FAIREXAM
            </span>
            <span className="text-[7px] font-[var(--font-mono)] font-bold tracking-[0.2em] uppercase text-primary mt-1">
              MERIT. INTEGRITY. CERTAINTY.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <HelpCircle className="w-4 h-4 text-black" strokeWidth={2.5} />
            <span className="text-xs font-bold tracking-wide text-black">
              Technical Support
            </span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <Wifi className="w-4 h-4 text-black" strokeWidth={2.5} />
            <span className="text-xs font-bold tracking-wide text-black">
              System Status
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-70"></div>

        <div className="z-10 w-full max-w-md space-y-8 flex flex-col items-center">
          {/* Main Headings */}
          <div className="text-center space-y-3 mb-4">
            <h1 className="font-[var(--font-heading)] text-4xl md:text-5xl font-black text-[#111827] tracking-tight">
              {role === 'student' ? 'Secure Examination Gateway' : 'Institutional Management'}
            </h1>
            <p className="text-sm font-medium text-gray-600">
              Log in to your secure testing environment.
            </p>
          </div>

          {/* Login Card */}
          <div className="w-[420px] bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-md flex flex-col">
            <div className="flex-1 p-8 sm:p-10 flex flex-col gap-6">
              
              {/* Role Toggle */}
              <div className="grid grid-cols-2 border-[2px] border-black p-1 bg-gray-50">
                <button
                  onClick={() => {
                    setRole('student');
                    clearError();
                    setEmail('');
                    setPassword('');
                  }}
                  className={`py-3 text-[10px] font-black tracking-[0.15em] uppercase transition-all ${
                    role === 'student'
                      ? 'bg-primary border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  STUDENT
                </button>
                <button
                  onClick={() => {
                    setRole('admin');
                    clearError();
                    setEmail('');
                    setPassword('');
                  }}
                  className={`py-3 text-[10px] font-black tracking-[0.15em] uppercase transition-all ${
                    role === 'admin'
                      ? 'bg-primary border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  ADMIN
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-500 p-3 flex items-start gap-2">
                  <span className="text-red-500 text-sm font-black mt-0.5">!</span>
                  <p className="text-xs text-red-700 font-medium">{error}</p>
                </div>
              )}

              {role === 'student' ? (
                <>
                  {/* Status Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-sm border-2 border-black bg-gray-100 flex items-center justify-center">
                       {/* Dummy graduation cap icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    </div>
                    <div className="border-[2px] border-black px-3 py-1.5 bg-gray-50">
                      <span className="text-[8px] font-black tracking-[0.15em] text-black uppercase">
                        ACTIVE SESSION
                      </span>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-2">
                    <h2 className="font-[var(--font-heading)] text-2xl font-black text-black uppercase tracking-tight">
                      STUDENT LOGIN
                    </h2>
                    <p className="text-xs font-medium text-gray-500 leading-relaxed">
                      Access your personal examination dashboard using your institutional ID.
                    </p>
                  </div>

                  {/* Form */}
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black tracking-[0.15em] text-[#111827] uppercase">
                        STUDENT ID / EMAIL
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. stu@university.edu"
                        className="w-full border-[2px] border-black py-3 px-4 text-sm font-medium focus:outline-none focus:ring-0 placeholder:text-gray-400 bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[10px] font-black tracking-[0.15em] text-[#111827] uppercase">
                          PASSWORD
                        </label>
                        <a href="#" className="text-[9px] font-black tracking-[0.1em] text-primary hover:underline uppercase">
                          RESET
                        </a>
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border-[2px] border-black py-3 px-4 text-sm font-medium focus:outline-none focus:ring-0 placeholder:text-gray-400 bg-white"
                        required
                      />
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={(e) => handleStudentAuth(false, e)}
                        disabled={loading}
                        className="flex-1 bg-primary border-[3px] border-black text-black text-[11px] font-black tracking-[0.15em] uppercase py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SIGN IN'}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleStudentAuth(true, e)}
                        disabled={loading}
                        className="flex-1 bg-white border-[3px] border-black text-black text-[11px] font-black tracking-[0.15em] uppercase py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                      >
                         {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'REGISTER'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  {/* Title & Desc Admin */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-sm bg-[#e5e7eb] flex items-center justify-center">
                       {/* Shield admin icon */}
                       <Shield className="w-6 h-6 text-[#111827]" fill="currentColor" />
                    </div>
                    <div>
                      <h2 className="font-[var(--font-heading)] text-xl font-bold text-[#111827] tracking-tight">
                        Admin Portal
                      </h2>
                      <p className="text-[11px] text-gray-500 font-medium">
                        Institutional Management
                      </p>
                    </div>
                  </div>

                  {/* Form Admin */}
                  <form className="space-y-4" onSubmit={handleAdminLogin}>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black tracking-[0.15em] text-[#111827] uppercase">
                        INSTITUTIONAL EMAIL
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@university.edu"
                        className="w-full border-[2px] border-black py-3 px-4 text-sm font-medium focus:outline-none focus:ring-0 placeholder:text-gray-400 bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[10px] font-black tracking-[0.15em] text-[#111827] uppercase">
                          SECURITY KEY / PASSWORD
                        </label>
                        <a href="#" className="text-[9px] font-black tracking-[0.1em] text-primary hover:underline">
                          Request Access
                        </a>
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border-[2px] border-black py-3 px-4 text-sm font-medium focus:outline-none focus:ring-0 placeholder:text-gray-400 bg-white"
                        required
                      />
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center gap-2 pt-1 pb-1">
                      <input type="checkbox" className="w-4 h-4 border-2 border-black accent-black rounded-none" id="mfa" />
                      <label htmlFor="mfa" className="text-xs font-medium text-[#111827]">
                        Enforce MFA on this session
                      </label>
                    </div>

                    <div className="pt-2">
                      <button 
                         type="submit"
                         disabled={loading}
                         className="w-full bg-[#111827] border-[2px] border-black text-white text-[11px] font-black tracking-[0.15em] uppercase py-4 shadow-[4px_4px_0px_0px_var(--color-primary)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-primary)] transition-all flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'ADMINISTRATIVE ACCESS'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-[8px] tracking-[0.1em] text-gray-400 uppercase">
                        ACCESS: TIER 1 & 2
                      </span>
                      <span className="text-[8px] tracking-[0.1em] text-gray-400 uppercase">
                        INSTITUTIONAL SETUP
                      </span>
                    </div>
                  </form>
                </>
              )}
              
              {/* Encrypted Note */}
              <div className="flex items-center gap-2 pt-2">
                <Lock className="w-3 h-3 text-gray-400" />
                <span className="text-[9px] font-bold tracking-wide text-gray-400 uppercase">
                  END-TO-END ENCRYPTED CONNECTION
                </span>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t-2 border-black px-8 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            <span className="text-[9px] font-black tracking-[0.15em] text-black uppercase">
              SERVERS: OPERATIONAL
            </span>
          </div>
          <span className="text-[9px] font-bold tracking-[0.1em] text-gray-400 uppercase">
            © 2024 FAIREXAM INSTITUTIONAL SERVICES
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="text-[9px] font-black tracking-[0.15em] text-black uppercase hover:text-primary transition-colors">
            PRIVACY PROTOCOL
          </a>
          <a href="#" className="text-[9px] font-black tracking-[0.15em] text-black uppercase hover:text-primary transition-colors">
            TERMS OF INTEGRITY
          </a>
          <a href="#" className="text-[9px] font-black tracking-[0.15em] text-black uppercase hover:text-primary transition-colors">
            COOKIE POLICY
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Login;
