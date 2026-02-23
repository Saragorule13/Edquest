import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import QuestionBlock from './QuestionBlock';
import OptionsGrid from './OptionsGrid';
import BottomBar from './BottomBar';
import Notification from './Notification';

const ExamScreen = () => {
    const { testId } = useParams();
    const navigate = useNavigate();

    const [testInfo, setTestInfo] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // answers is an object mapping question INDEX to the selected option string
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    
    const [notifications, setNotifications] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const addNotification = (type, title, systemMsg, message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, title, systemMsg, message }]);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    useEffect(() => {
        const fetchExamData = async () => {
            if (!testId) return;

            try {
                // Fetch test
                const { data: testData, error: testError } = await supabase
                    .from('tests')
                    .select('*')
                    .eq('id', testId)
                    .single();

                if (testError) throw testError;
                setTestInfo(testData);

                // Fetch questions
                const { data: qData, error: qError } = await supabase
                    .from('questions')
                    .select('*')
                    .eq('test_id', testId);

                if (qError) throw qError;
                setQuestions(qData);
            } catch (error) {
                console.error('Error fetching exam data:', error);
                addNotification('alert', 'ERROR', 'SYSTEM MSG: 500', 'Failed to load exam data.');
            } finally {
                setLoading(false);
            }
        };

        fetchExamData();
    }, [testId]);

    const handleOptionSelect = (optionIndex) => {
        const currentQuestion = questions[currentQuestionIndex];
        const selectedText = currentQuestion.options[optionIndex];
        
        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: selectedText
        }));
    };

    const handlePreviousClick = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleNextClick = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleSubmitClick = async () => {
        // Calculate score
        let earnedPoints = 0;
        let totalPoints = 0;
        
        questions.forEach((q, idx) => {
            totalPoints += Number(q.points);
            if (answers[idx] === q.correct_answer) {
                earnedPoints += Number(q.points);
            }
        });
        
        // Final score out of 100 optional, but let's just use raw points.
        const calculatedScore = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
        
        setSubmitting(true);
        
        try {
            // Get user
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                // Insert attempt
                const { error } = await supabase
                    .from('exam_attempts')
                    .insert([{
                        user_id: user.id,
                        test_id: testId,
                        score: calculatedScore,
                        status: 'completed',
                        completed_at: new Date().toISOString()
                    }]);
                
                if (error) throw error;
            }

            setScore(calculatedScore);
            setSubmitted(true);

            addNotification(
                'success',
                'SUCCESS',
                'LOG: 200_OK',
                'Examination submitted successfully to proctor server.'
            );
        } catch (error) {
            console.error('Error submitting exam:', error);
            addNotification('alert', 'ERROR', 'SYSTEM MSG: 500', 'Failed to submit exam.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-bold font-mono tracking-widest text-2xl uppercase">Initializing Secure Environment...</div>;
    }

    if (questions.length === 0 && !loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-8 font-mono">
                <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center text-xl font-bold uppercase">
                    No questions mapped for this designation.<br/>
                    <button onClick={() => navigate('/dashboard')} className="mt-6 bg-[#F5A623] px-6 py-2 border-2 border-black">RETURN</button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    // Find selected option index for current question
    const selectedText = answers[currentQuestionIndex];
    const selectedOptionIndex = selectedText ? currentQuestion.options.indexOf(selectedText) : -1;

    const completedCount = Object.keys(answers).length;
    const progressPercentage = (completedCount / questions.length) * 100;

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-mono text-black">
            <TopBar />

            {/* Success Overlay */}
            {submitted && (
                <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4">
                    <div className="bg-white border-4 border-black p-12 max-w-2xl w-full shadow-[16px_16px_0px_0px_rgba(245,166,35,1)] relative flex flex-col items-center text-center">
                        <div className="w-24 h-24 border-4 border-black bg-green-400 rounded-full flex items-center justify-center mb-8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Exam Completed</h2>
                        <p className="text-xl font-bold mb-8 uppercase text-gray-600">Secure Submission Verified.</p>
                        
                        <div className="bg-gray-100 border-2 border-black p-6 w-full mb-8 font-bold text-lg">
                            SCORE: {score.toFixed(1)}%
                        </div>

                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-black text-white hover:bg-[#F5A623] hover:text-black border-4 border-black font-black uppercase py-4 px-8 text-xl transition-colors tracking-widest"
                        >
                            RETURN TO DASHBOARD
                        </button>
                    </div>
                </div>
            )}

            <div className={`flex flex-1 overflow-visible relative ${submitted ? 'blur-sm pointer-events-none' : ''}`}>
                <Sidebar 
                    totalQuestions={questions.length} 
                    currentQuestion={currentQuestionIndex + 1} 
                    answers={answers}
                />

                <main className="flex-1 overflow-y-auto px-8 md:px-16 pt-8 pb-48 w-full max-w-7xl mx-auto">
                    <div className="mb-4 text-sm font-bold tracking-widest text-[#F5A623] uppercase">
                        TEST: {testInfo?.title || 'Unknown'}
                    </div>

                    <QuestionBlock
                        questionNumber={currentQuestionIndex + 1}
                        questionText={currentQuestion?.question_text || ''}
                        type={currentQuestion?.type || "MULTIPLE CHOICE"}
                        points={Number(currentQuestion?.points || 1)}
                    />

                    {currentQuestion && (
                        <OptionsGrid
                            options={currentQuestion.options}
                            selectedOptionIndex={selectedOptionIndex}
                            onOptionSelect={handleOptionSelect}
                        />
                    )}
                </main>
            </div>

            <BottomBar
                onPreviousClick={handlePreviousClick}
                onNextClick={handleNextClick}
                onSubmitClick={handleSubmitClick}
                progressPercentage={progressPercentage}
                completedCount={completedCount}
                totalCount={questions.length}
                isFirstQuestion={currentQuestionIndex === 0}
                isLastQuestion={currentQuestionIndex === questions.length - 1}
            />

            {/* Notifications Container */}
            <div className="fixed top-24 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
                {notifications.map(n => (
                    <Notification
                        key={n.id}
                        type={n.type}
                        title={n.title}
                        systemMsg={n.systemMsg}
                        message={n.message}
                        onClose={() => removeNotification(n.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExamScreen;
