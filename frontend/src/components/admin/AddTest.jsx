import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

const AddTest = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(60);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const { data, error } = await supabase
                .from('tests')
                .insert([
                    { title, description, duration }
                ])
                .select();

            if (error) throw error;
            
            setMessage('Test created successfully!');
            setTitle('');
            setDescription('');
            setDuration(60);
        } catch (error) {
            setMessage('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 h-full flex flex-col font-mono">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-2 inline-block">Create New Test</h2>
            </div>

            <div className="bg-white border-4 border-black p-8 max-w-2xl relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {message && (
                    <div className={`mb-6 p-4 border-l-4 font-bold ${message.includes('Error') ? 'border-red-500 bg-red-50 text-red-700' : 'border-green-500 bg-green-50 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Test Title</label>
                        <input 
                            type="text" 
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-[#F5A623] transition-all bg-[#FAFAFA]"
                            placeholder="e.g. Midterm Computer Science"
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Description</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border-2 border-black p-3 h-32 focus:outline-none focus:ring-4 focus:ring-[#F5A623] transition-all bg-[#FAFAFA] resize-none"
                            placeholder="Brief description of the test..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Duration (Minutes)</label>
                        <input 
                            type="number" 
                            required
                            min="1"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-[#F5A623] transition-all bg-[#FAFAFA]"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="mt-4 bg-[#F5A623] hover:bg-black text-black hover:text-[#F5A623] border-4 border-black font-black uppercase py-4 px-8 text-lg transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'CREATING...' : 'CREATE TEST'}
                        {!loading && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTest;
