import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const AddQuestions = () => {
    const [tests, setTests] = useState([]);
    const [selectedTestId, setSelectedTestId] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [points, setPoints] = useState(1);
    const [options, setOptions] = useState(['', '', '', '']); // 4 options by default
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const { data, error } = await supabase
                    .from('tests')
                    .select('id, title')
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                setTests(data);
                if (data.length > 0) {
                    setSelectedTestId(data[0].id);
                }
            } catch (error) {
                console.error('Error fetching tests:', error);
            } finally {
                setFetchLoading(false);
            }
        };

        fetchTests();
    }, []);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTestId) {
            setMessage('Error: Select a test first.');
            return;
        }

        // Validate options
        if (options.some(opt => opt.trim() === '')) {
            setMessage('Error: All options must be filled.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const correctAnswerText = options[correctAnswerIndex];

            const { data, error } = await supabase
                .from('questions')
                .insert([
                    { 
                        test_id: selectedTestId,
                        question_text: questionText,
                        type: 'MULTIPLE CHOICE',
                        options: options,
                        correct_answer: correctAnswerText,
                        points: parseFloat(points)
                    }
                ]);

            if (error) throw error;
            
            setMessage('Question added successfully!');
            setQuestionText('');
            setOptions(['', '', '', '']);
            setCorrectAnswerIndex(0);
        } catch (error) {
            setMessage('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return <div className="p-6 font-mono font-bold">LOADING TESTS...</div>;
    }

    return (
        <div className="p-6 h-full flex flex-col font-mono">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-2 inline-block">Add Questions</h2>
            </div>

            <div className="bg-white border-4 border-black p-8 max-w-3xl relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {message && (
                    <div className={`mb-6 p-4 border-l-4 font-bold ${message.includes('Error') ? 'border-red-500 bg-red-50 text-red-700' : 'border-green-500 bg-green-50 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Select Test</label>
                        <select 
                            value={selectedTestId}
                            onChange={(e) => setSelectedTestId(e.target.value)}
                            className="w-full border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-[#F5A623] transition-all bg-[#FAFAFA] font-bold"
                            required
                        >
                            {tests.map(test => (
                                <option key={test.id} value={test.id}>{test.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Question Text</label>
                        <textarea 
                            required
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            className="w-full border-2 border-black p-3 h-24 focus:outline-none focus:ring-4 focus:ring-[#F5A623] transition-all bg-[#FAFAFA] resize-none"
                            placeholder="e.g. What is the time complexity of QuickSort in the worst case?"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {options.map((opt, idx) => (
                            <div key={idx} className="flex flex-col gap-2 relative">
                                <label className="font-bold text-xs flex items-center gap-2">
                                    <input 
                                        type="radio" 
                                        name="correctAnswer" 
                                        checked={correctAnswerIndex === idx}
                                        onChange={() => setCorrectAnswerIndex(idx)}
                                        className="w-4 h-4 cursor-pointer accent-[#F5A623]"
                                    />
                                    OPTION {idx + 1} {correctAnswerIndex === idx && <span className="text-green-600">(CORRECT)</span>}
                                </label>
                                <textarea
                                    required
                                    value={opt}
                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                    className={`w-full border-2 p-2 focus:outline-none focus:ring-2 focus:ring-[#F5A623] transition-all bg-[#FAFAFA] resize-none h-16 ${correctAnswerIndex === idx ? 'border-[#F5A623]' : 'border-black'}`}
                                    placeholder={`Option text...`}
                                ></textarea>
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Points</label>
                        <input 
                            type="number" 
                            required
                            min="0.5"
                            step="0.5"
                            value={points}
                            onChange={(e) => setPoints(e.target.value)}
                            className="w-32 border-2 border-black p-3 focus:outline-none focus:ring-4 focus:ring-[#F5A623] transition-all bg-[#FAFAFA]"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="mt-4 bg-[#F5A623] hover:bg-black text-black hover:text-[#F5A623] border-4 border-black font-black uppercase py-4 px-8 text-lg transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'ADDING...' : 'ADD QUESTION'}
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

export default AddQuestions;
