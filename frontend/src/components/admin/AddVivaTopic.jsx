import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const AddVivaTopic = () => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [topics, setTopics] = useState([]);
    const [fetchingTopics, setFetchingTopics] = useState(true);

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const { data, error } = await supabase
                .from('viva_topics')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setTopics(data || []);
        } catch (error) {
            console.error('Error fetching topics:', error);
        } finally {
            setFetchingTopics(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const { data, error } = await supabase
                .from('viva_topics')
                .insert([{
                    title,
                    subject: subject || null,
                    description: description || null,
                    system_prompt: systemPrompt || null,
                    difficulty
                }])
                .select();

            if (error) throw error;

            setMessage('Viva topic created successfully!');
            setTitle('');
            setSubject('');
            setDescription('');
            setSystemPrompt('');
            setDifficulty('medium');
            fetchTopics();
        } catch (error) {
            setMessage('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('viva_topics')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setTopics(topics.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting topic:', error);
        }
    };

    return (
        <div className="p-6 h-full flex flex-col font-mono">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-2 inline-block">Viva Topics</h2>
                <span className="bg-[#F5A623] text-black text-xs px-3 py-1 font-bold border-2 border-black uppercase tracking-widest">Agent Config</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Form */}
                <div className="bg-white border-4 border-black p-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-black uppercase mb-6 border-b-2 border-black pb-2">Create New Topic</h3>

                    {message && (
                        <div className={`mb-6 p-4 border-l-4 font-bold ${message.includes('Error') ? 'border-red-500 bg-red-50 text-red-700' : 'border-green-500 bg-green-50 text-green-700'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Topic Title *</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-[#F5A623] transition-all bg-[#FAFAFA]"
                                placeholder="e.g. Data Structures & Algorithms"
                            />
                        </div>

                        <div>
                            <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-[#F5A623] transition-all bg-[#FAFAFA]"
                                placeholder="e.g. Computer Science"
                            />
                        </div>

                        <div>
                            <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border-2 border-black p-3 h-24 focus:outline-none focus:ring-4 focus:ring-[#F5A623] transition-all bg-[#FAFAFA] resize-none"
                                placeholder="Brief description of the viva topic..."
                            />
                        </div>

                        <div>
                            <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Custom Agent Prompt</label>
                            <textarea
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                className="w-full border-2 border-black p-3 h-24 focus:outline-none focus:ring-4 focus:ring-[#F5A623] transition-all bg-[#FAFAFA] resize-none font-mono text-sm"
                                placeholder="Custom instructions for the AI examiner... (optional)"
                            />
                        </div>

                        <div>
                            <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Difficulty</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-[#F5A623] transition-all bg-[#FAFAFA]"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 bg-[#F5A623] hover:bg-black text-black hover:text-[#F5A623] border-4 border-black font-black uppercase py-4 px-8 text-lg transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'CREATING...' : 'CREATE VIVA TOPIC'}
                            {!loading && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            )}
                        </button>
                    </form>
                </div>

                {/* Existing Topics List */}
                <div>
                    <h3 className="text-xl font-black uppercase mb-6 border-b-2 border-black pb-2">Existing Topics</h3>
                    {fetchingTopics ? (
                        <div className="font-bold text-lg tracking-widest uppercase animate-pulse">Loading topics...</div>
                    ) : topics.length === 0 ? (
                        <div className="p-6 border-4 border-dashed border-gray-300 text-center text-gray-500 font-bold uppercase">
                            No viva topics created yet
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {topics.map(topic => (
                                <div key={topic.id} className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-lg font-black uppercase">{topic.title}</h4>
                                                <span className={`text-[10px] px-2 py-0.5 font-bold border-2 border-black uppercase tracking-wider ${topic.difficulty === 'easy' ? 'bg-green-200' :
                                                        topic.difficulty === 'hard' ? 'bg-red-200' : 'bg-yellow-200'
                                                    }`}>
                                                    {topic.difficulty}
                                                </span>
                                            </div>
                                            {topic.subject && <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">{topic.subject}</p>}
                                            {topic.description && <p className="text-sm text-gray-600">{topic.description}</p>}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(topic.id)}
                                            className="text-red-600 hover:bg-red-100 border-2 border-red-600 px-2 py-1 text-xs font-bold uppercase transition-colors ml-4"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddVivaTopic;
