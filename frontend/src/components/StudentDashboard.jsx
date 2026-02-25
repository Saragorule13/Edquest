import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import TopBar from './TopBar';

const StudentDashboard = () => {
    const [tests, setTests] = useState([]);
    const [vivaTopics, setVivaTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const { data, error } = await supabase
                    .from('tests')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (!error) setTests(data || []);
            } catch (e) {
                console.error('Error fetching tests:', e);
            }

            try {
                const { data, error } = await supabase
                    .from('viva_topics')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (!error) setVivaTopics(data || []);
            } catch (e) {
                console.warn('Viva topics not available:', e.message);
            }

            setLoading(false);
        };

        fetchAll();
    }, []);

    const handleStartTest = (testId) => {
        navigate(`/exam/${testId}`);
    };

    const handleStartViva = (topicId) => {
        navigate(`/viva/${topicId}`);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-mono text-black">
            <TopBar />

            <main className="flex-1 px-8 md:px-16 pt-12 pb-24 w-full max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black uppercase mb-4 tracking-tighter">Available Assessments</h1>
                    <p className="text-lg text-gray-600 max-w-2xl">Select an exam or viva from the list below to begin your session. Ensure you have a stable connection and a quiet environment.</p>
                </div>

                {loading ? (
                    <div className="font-bold text-xl tracking-widest uppercase animate-pulse">Scanning available modules...</div>
                ) : (tests.length === 0 && vivaTopics.length === 0) ? (
                    <div className="p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                        <h2 className="text-2xl font-bold uppercase mb-2">No Assessments Scheduled</h2>
                        <p className="text-gray-600">Please check back later or contact your administrator.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Regular Test Cards */}
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

                        {/* Viva Topic Cards */}
                        {vivaTopics.map(topic => (
                            <div key={topic.id} className="bg-white border-4 border-black p-6 flex flex-col h-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all relative group">
                                <div className="absolute top-0 right-0 flex">
                                    <span className="bg-purple-500 text-white border-b-4 border-l-4 border-black px-3 py-1 font-bold text-sm uppercase tracking-wider">
                                        🎤 Viva
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    {topic.subject && (
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{topic.subject}</span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold uppercase mb-3 pr-20">{topic.title}</h3>
                                <p className="text-gray-600 flex-1 mb-4">{topic.description || 'Oral viva examination — speak with an AI examiner on this topic.'}</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`text-[10px] px-2 py-0.5 font-bold border-2 border-black uppercase ${topic.difficulty === 'easy' ? 'bg-green-200' :
                                        topic.difficulty === 'hard' ? 'bg-red-200' : 'bg-yellow-200'
                                        }`}>
                                        {topic.difficulty || 'medium'}
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 font-bold border-2 border-black uppercase bg-purple-100">Voice Agent</span>
                                </div>

                                <button
                                    onClick={() => handleStartViva(topic.id)}
                                    className="w-full bg-purple-600 text-white hover:bg-purple-700 border-2 border-black font-bold uppercase py-3 transition-colors flex items-center justify-center gap-2 group-hover:gap-4"
                                >
                                    START VIVA
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all">
                                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                        <line x1="12" x2="12" y1="19" y2="22" />
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

