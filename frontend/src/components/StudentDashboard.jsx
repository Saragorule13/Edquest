import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import TopBar from './TopBar';

const StudentDashboard = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const { data, error } = await supabase
                    .from('tests')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                setTests(data);
            } catch (error) {
                console.error('Error fetching tests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, []);

    const handleStartTest = (testId) => {
        navigate(`/exam/${testId}`);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-mono text-black">
            <TopBar />

            <main className="flex-1 px-8 md:px-16 pt-12 pb-24 w-full max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black uppercase mb-4 tracking-tighter">Available Assessments</h1>
                    <p className="text-lg text-gray-600 max-w-2xl">Select an exam from the list below to begin your session. Ensure you have a stable connection and a quiet environment.</p>
                </div>

                {loading ? (
                    <div className="font-bold text-xl tracking-widest uppercase animate-pulse">Scanning available modules...</div>
                ) : tests.length === 0 ? (
                    <div className="p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                        <h2 className="text-2xl font-bold uppercase mb-2">No Exams Scheduled</h2>
                        <p className="text-gray-600">Please check back later or contact your administrator.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tests.map(test => (
                            <div key={test.id} className="bg-white border-4 border-black p-6 flex flex-col h-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all relative group">
                                <div className="absolute top-0 right-0 bg-[#F5A623] border-b-4 border-l-4 border-black px-3 py-1 font-bold text-sm">
                                    {test.duration} MIN
                                </div>
                                <h3 className="text-2xl font-bold uppercase mb-3 pr-16">{test.title}</h3>
                                <p className="text-gray-600 flex-1 mb-6">{test.description || 'No description available for this assessment.'}</p>
                                
                                <button 
                                    onClick={() => handleStartTest(test.id)}
                                    className="w-full bg-black text-white hover:bg-[#F5A623] hover:text-black border-2 border-black font-bold uppercase py-3 transition-colors flex items-center justify-center gap-2 group-hover:gap-4"
                                >
                                    START SESSION
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;
