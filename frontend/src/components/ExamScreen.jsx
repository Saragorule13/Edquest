import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import QuestionBlock from './QuestionBlock';
import OptionsGrid from './OptionsGrid';
import BottomBar from './BottomBar';
import Notification from './Notification';
import ProctorAgent from './ProctorAgent';

// ─── Activity Logger Hook ────────────────────────────────────────────────────
const useActivityLogger = (testId) => {
    const logsRef = useRef([]);
    const sessionStartRef = useRef(Date.now());
    const sessionIdRef = useRef(
        `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
    );

    const log = useCallback((action, details = {}) => {
        const entry = {
            timestamp: new Date().toISOString(),
            elapsedMs: Date.now() - sessionStartRef.current,
            action,
            testId,
            ...details,
        };
        logsRef.current.push(entry);
        console.log(
            `%c[ACTIVITY LOG]%c ${action}`,
            'background:#F5A623;color:#000;font-weight:bold;padding:2px 6px;border-radius:3px;',
            'color:#333;font-weight:bold;',
            entry
        );
    }, [testId]);

    const getAllLogs = useCallback(() => [...logsRef.current], []);

    const sendLogsToSupabase = useCallback(async (userId) => {
        try {
            const { data, error } = await supabase
                .from('activity_logs')
                .insert([{
                    test_id: testId,
                    user_id: userId || null,
                    session_id: sessionIdRef.current,
                    log_count: logsRef.current.length,
                    logs: logsRef.current,
                }])
                .select('id')
                .single();

            if (error) throw error;

            console.log(
                '%c[ACTIVITY LOG]%c LOGS_SAVED_TO_SUPABASE',
                'background:#22c55e;color:#000;font-weight:bold;padding:2px 6px;border-radius:3px;',
                'color:#333;font-weight:bold;',
                { id: data.id, logCount: logsRef.current.length }
            );
        } catch (error) {
            console.error('[ACTIVITY LOG] Failed to save logs to Supabase:', error.message);
        }
    }, [testId]);

    return { log, getAllLogs, sendLogsToSupabase };
};

const ExamScreen = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { log, getAllLogs, sendLogsToSupabase } = useActivityLogger(testId);

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
    const [isBlurred, setIsBlurred] = useState(false);

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
            log('EXAM_SESSION_INIT', { status: 'loading' });

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

                log('EXAM_DATA_LOADED', {
                    testTitle: testData?.title,
                    totalQuestions: qData?.length,
                });
            } catch (error) {
                console.error('Error fetching exam data:', error);
                log('EXAM_LOAD_ERROR', { error: error.message });
                addNotification('alert', 'ERROR', 'SYSTEM MSG: 500', 'Failed to load exam data.');
            } finally {
                setLoading(false);
            }
        };

        fetchExamData();
    }, [testId]);

    useEffect(() => {
        const handleBlur = () => {
            setIsBlurred(true);
            log('FOCUS_LOST', { currentQuestion: currentQuestionIndex + 1 });
        };
        const handleFocus = () => {
            setIsBlurred(false);
            log('FOCUS_REGAINED', { currentQuestion: currentQuestionIndex + 1 });
        };

        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, [currentQuestionIndex, log]);

    // ─── Block & log: copy, paste, cut, right-click, screenshots, dev tools ─────
    useEffect(() => {
        const warn = (msg) => addNotification('alert', 'BLOCKED', 'SECURITY', msg);

        const handleCopy = (e) => {
            e.preventDefault();
            log('COPY_ATTEMPT', { currentQuestion: currentQuestionIndex + 1 });
            warn('Copy is disabled during the exam.');
        };
        const handlePaste = (e) => {
            e.preventDefault();
            log('PASTE_ATTEMPT', { currentQuestion: currentQuestionIndex + 1 });
            warn('Paste is disabled during the exam.');
        };
        const handleCut = (e) => {
            e.preventDefault();
            log('COPY_ATTEMPT', { currentQuestion: currentQuestionIndex + 1, variant: 'cut' });
            warn('Cut is disabled during the exam.');
        };
        const handleContextMenu = (e) => {
            e.preventDefault();
            log('RIGHT_CLICK', { currentQuestion: currentQuestionIndex + 1 });
        };
        const handleDragStart = (e) => {
            e.preventDefault();
        };

        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();

            // Block PrintScreen
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                log('KEY_COMBO', { key: 'PrintScreen', currentQuestion: currentQuestionIndex + 1 });
                warn('Screenshots are disabled during the exam.');
                // Clear clipboard to prevent screenshot capture
                navigator.clipboard?.writeText?.('').catch(() => { });
                return;
            }

            // Block F12 (dev tools)
            if (e.key === 'F12') {
                e.preventDefault();
                log('KEY_COMBO', { key: 'F12', currentQuestion: currentQuestionIndex + 1 });
                warn('Developer tools are disabled during the exam.');
                return;
            }

            // Block Ctrl/Cmd shortcuts
            if (e.ctrlKey || e.metaKey) {
                // Block: Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+P, Ctrl+S, Ctrl+U
                if (['c', 'v', 'x', 'a', 'p', 's', 'u'].includes(key)) {
                    e.preventDefault();
                    log('KEY_COMBO', { key: e.key, ctrl: true, currentQuestion: currentQuestionIndex + 1 });
                    if (key === 'c' || key === 'x') warn('Copy is disabled during the exam.');
                    else if (key === 'v') warn('Paste is disabled during the exam.');
                    else if (key === 'p') warn('Printing is disabled during the exam.');
                    else if (key === 'u') warn('View source is disabled during the exam.');
                    return;
                }

                // Block: Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (dev tools)
                if (e.shiftKey && ['i', 'j', 'c'].includes(key)) {
                    e.preventDefault();
                    log('KEY_COMBO', { key: `Ctrl+Shift+${e.key}`, currentQuestion: currentQuestionIndex + 1 });
                    warn('Developer tools are disabled during the exam.');
                    return;
                }

                // Log any other Ctrl combos
                log('KEY_COMBO', {
                    key: e.key,
                    ctrl: e.ctrlKey,
                    alt: e.altKey,
                    shift: e.shiftKey,
                    currentQuestion: currentQuestionIndex + 1,
                });
            }
        };

        // Disable text selection via CSS
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.msUserSelect = 'none';

        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('cut', handleCut);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('dragstart', handleDragStart);

        return () => {
            // Restore text selection
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.body.style.msUserSelect = '';

            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('cut', handleCut);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('dragstart', handleDragStart);
        };
    }, [currentQuestionIndex, log]);

    // Log visibility change (tab switch)
    useEffect(() => {
        const handleVisibilityChange = () => {
            log('VISIBILITY_CHANGE', {
                hidden: document.hidden,
                currentQuestion: currentQuestionIndex + 1,
            });
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [currentQuestionIndex, log]);

    const handleOptionSelect = (optionIndex) => {
        const currentQuestion = questions[currentQuestionIndex];
        const selectedText = currentQuestion.options[optionIndex];
        const previousAnswer = answers[currentQuestionIndex];

        log('OPTION_SELECTED', {
            questionIndex: currentQuestionIndex,
            questionNumber: currentQuestionIndex + 1,
            selectedOption: selectedText,
            optionIndex,
            previousAnswer: previousAnswer || null,
            wasChanged: !!previousAnswer && previousAnswer !== selectedText,
        });

        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: selectedText
        }));
    };

    const handlePreviousClick = () => {
        if (currentQuestionIndex > 0) {
            log('NAVIGATE_PREVIOUS', {
                from: currentQuestionIndex + 1,
                to: currentQuestionIndex,
            });
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleNextClick = () => {
        if (currentQuestionIndex < questions.length - 1) {
            log('NAVIGATE_NEXT', {
                from: currentQuestionIndex + 1,
                to: currentQuestionIndex + 2,
            });
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

        const answeredCount = Object.keys(answers).length;
        log('EXAM_SUBMIT_INITIATED', {
            answeredCount,
            totalQuestions: questions.length,
            unanswered: questions.length - answeredCount,
            score: calculatedScore.toFixed(1),
        });

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

            log('EXAM_SUBMITTED_SUCCESS', {
                score: calculatedScore.toFixed(1),
                userId: user?.id,
            });

            // Print full activity log summary on submit
            console.groupCollapsed(
                '%c[ACTIVITY LOG] 📋 Full Session Log',
                'background:#000;color:#F5A623;font-weight:bold;padding:4px 8px;border-radius:3px;font-size:14px;'
            );
            console.table(getAllLogs());
            console.groupEnd();

            // Save activity logs to Supabase
            await sendLogsToSupabase(user?.id);

            addNotification(
                'success',
                'SUCCESS',
                'LOG: 200_OK',
                'Examination submitted successfully to proctor server.'
            );
        } catch (error) {
            console.error('Error submitting exam:', error);
            log('EXAM_SUBMIT_ERROR', { error: error.message });
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
                    No questions mapped for this designation.<br />
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

            {/* Focus Lost Blur Overlay */}
            {isBlurred && !submitted && (
                <div className="fixed inset-0 bg-white/40 backdrop-blur-md z-[300] flex items-center justify-center p-4">
                    <div className="bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-lg">
                        <div className="w-16 h-16 border-4 border-black bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <h2 className="text-3xl font-black uppercase mb-4 text-red-600 tracking-tighter">Focus Lost</h2>
                        <p className="text-lg font-bold uppercase text-gray-700">Please return to the exam screen to continue.</p>
                    </div>
                </div>
            )}

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

            {/* Real-time Proctor Agent Overlay */}
            {!submitted && (
                <ProctorAgent addNotification={addNotification} />
            )}
        </div>
    );
};

export default ExamScreen;
