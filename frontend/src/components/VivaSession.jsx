import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Vapi from '@vapi-ai/web';

const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;

const VivaSession = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null);
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState('loading'); // loading, ready, connecting, active, speaking, error
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [volumeLevel, setVolumeLevel] = useState(0);

    const vapiRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Fetch topic info
    useEffect(() => {
        const fetchTopic = async () => {
            const { data, error: fetchError } = await supabase
                .from('viva_topics')
                .select('*')
                .eq('id', topicId)
                .single();
            if (fetchError || !data) {
                setError('Topic not found');
                setStatus('error');
                return;
            }
            setTopic(data);
            setStatus('ready');
        };
        fetchTopic();
    }, [topicId]);

    // Initialize Vapi
    useEffect(() => {
        if (!VAPI_PUBLIC_KEY) {
            setError('Vapi public key not configured. Add VITE_VAPI_PUBLIC_KEY to your .env file.');
            setStatus('error');
            return;
        }

        const vapi = new Vapi(VAPI_PUBLIC_KEY);
        vapiRef.current = vapi;

        vapi.on('call-start', () => {
            setIsConnected(true);
            setStatus('active');
        });

        vapi.on('call-end', () => {
            setIsConnected(false);
            setStatus('ready');
        });

        vapi.on('speech-start', () => {
            setStatus('speaking');
        });

        vapi.on('speech-end', () => {
            if (isConnected) setStatus('active');
        });

        vapi.on('volume-level', (level) => {
            setVolumeLevel(level);
        });

        vapi.on('message', (message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                setMessages(prev => [...prev, {
                    role: message.role === 'user' ? 'student' : 'examiner',
                    text: message.transcript
                }]);
            }
        });

        vapi.on('error', (err) => {
            console.error('Vapi error:', err);
            setError(`Voice agent error: ${err.message || 'Unknown error'}`);
        });

        return () => {
            vapi.stop();
        };
    }, []);

    // Start viva call
    const startCall = useCallback(() => {
        if (!vapiRef.current || !topic) return;

        setStatus('connecting');
        setMessages([]);
        setError(null);

        const systemPrompt = `You are an oral examiner conducting a viva voce examination on the topic: "${topic.title}".

${topic.system_prompt || ''}

Guidelines:
- Ask one question at a time and wait for the student's response
- Start with a foundational question and gradually increase difficulty
- Follow up on the student's answers to probe deeper understanding
- If the student gives a wrong answer, guide them gently without giving the answer directly
- Be conversational but maintain academic rigor
- Keep your responses concise (2-3 sentences max) since they will be spoken aloud
- After 8-10 exchanges, wrap up the viva with a brief summary of the student's performance
- Begin by greeting the student and asking your first question about ${topic.title}`;

        vapiRef.current.start({
            model: {
                provider: 'openai',
                model: 'gpt-4o-mini',
                temperature: 0.7,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    }
                ]
            },
            voice: {
                provider: '11labs',
                voiceId: 'paula'
            },
            name: `Viva: ${topic.title}`,
            firstMessage: `Hello! Welcome to your oral viva examination on ${topic.title}. Are you ready to begin?`,
        });
    }, [topic]);

    // End call
    const endCall = useCallback(() => {
        if (vapiRef.current) {
            vapiRef.current.stop();
        }
        setIsConnected(false);
        setStatus('ready');
    }, []);

    // End session and go back
    const endSession = () => {
        endCall();
        navigate('/dashboard');
    };

    const statusLabels = {
        loading: 'LOADING...',
        ready: 'READY — TAP TO START',
        connecting: 'CONNECTING...',
        active: '● LISTENING...',
        speaking: '🔊 EXAMINER SPEAKING...',
        error: 'ERROR',
    };

    const statusColors = {
        loading: 'bg-yellow-400',
        ready: 'bg-green-400',
        connecting: 'bg-yellow-400',
        active: 'bg-red-500',
        speaking: 'bg-[#F5A623]',
        error: 'bg-red-600',
    };

    if (status === 'error' && !topic) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-mono">
                <div className="bg-white border-4 border-black p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center max-w-md">
                    <h2 className="text-2xl font-black uppercase mb-4">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button onClick={() => navigate('/dashboard')} className="bg-black text-white font-bold uppercase py-3 px-8 hover:bg-[#F5A623] hover:text-black border-2 border-black transition-colors">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-mono text-white">
            {/* Header */}
            <div className="border-b-4 border-[#F5A623] bg-black px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-[#F5A623] w-8 h-8 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" x2="12" y1="19" y2="22" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-lg font-black uppercase tracking-widest">ORAL VIVA</h1>
                        {topic && <p className="text-xs text-[#F5A623] font-bold uppercase tracking-wider">{topic.title}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 text-xs font-black uppercase tracking-widest text-black ${statusColors[status] || 'bg-gray-400'} border-2 border-black ${status === 'active' || status === 'connecting' ? 'animate-pulse' : ''}`}>
                        {statusLabels[status] || status}
                    </div>
                    <button
                        onClick={endSession}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase py-2 px-4 border-2 border-red-800 text-sm transition-colors"
                    >
                        End Session
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-8 max-w-4xl mx-auto w-full">
                {messages.length === 0 && !isConnected && status !== 'connecting' && (
                    <div className="text-center text-gray-500 py-20">
                        <div className="text-6xl mb-6">🎤</div>
                        <p className="font-bold uppercase tracking-widest text-lg mb-2">Ready for your viva?</p>
                        <p className="text-sm text-gray-600">Click the microphone button below to start your session.</p>
                        <p className="text-sm text-gray-600 mt-1">The AI examiner will ask you questions about <span className="text-[#F5A623]">{topic?.title}</span>.</p>
                    </div>
                )}

                {messages.length === 0 && status === 'connecting' && (
                    <div className="text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse py-20">
                        Connecting to voice agent...
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`mb-6 flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] ${msg.role === 'student'
                                ? 'bg-[#F5A623] text-black border-4 border-[#c78410]'
                                : 'bg-[#1a1a1a] text-white border-4 border-[#333]'
                            } p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]`}>
                            <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">
                                {msg.role === 'student' ? 'YOU' : 'EXAMINER'}
                            </div>
                            <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                        </div>
                    </div>
                ))}

                {status === 'speaking' && (
                    <div className="mb-6 flex justify-start">
                        <div className="bg-[#1a1a1a] border-4 border-[#333] p-5">
                            <div className="flex gap-2 items-center">
                                <div className="w-3 h-3 bg-[#F5A623] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-3 h-3 bg-[#F5A623] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-3 h-3 bg-[#F5A623] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-2">Speaking...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-900 border-t-4 border-red-500 px-6 py-3 text-center font-bold text-sm uppercase tracking-wider">
                    {error}
                </div>
            )}

            {/* Microphone Control */}
            <div className="border-t-4 border-[#333] bg-black px-6 py-8 flex flex-col items-center gap-4">
                {!isConnected ? (
                    <button
                        onClick={startCall}
                        disabled={status === 'loading' || status === 'connecting' || status === 'error'}
                        className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all cursor-pointer
                            bg-[#222] border-[#555] hover:border-[#F5A623] hover:bg-[#333] active:scale-95
                            disabled:opacity-30 disabled:cursor-not-allowed
                        `}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" x2="12" y1="19" y2="22" />
                        </svg>
                    </button>
                ) : (
                    <button
                        onClick={endCall}
                        className="w-24 h-24 rounded-full border-4 border-red-400 bg-red-600 flex items-center justify-center transition-all cursor-pointer hover:bg-red-700 active:scale-95"
                        style={{
                            boxShadow: `0 0 ${20 + volumeLevel * 40}px rgba(239, 68, 68, ${0.3 + volumeLevel * 0.5})`
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="6" y="6" width="12" height="12" rx="2" />
                        </svg>
                    </button>
                )}
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                    {isConnected ? 'Tap to end call' : status === 'connecting' ? 'Connecting...' : 'Tap to start viva'}
                </p>
            </div>
        </div>
    );
};

export default VivaSession;
