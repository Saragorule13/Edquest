import React, { useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import QuestionBlock from './QuestionBlock';
import OptionsGrid from './OptionsGrid';
import BottomBar from './BottomBar';
import Notification from './Notification';

const ExamScreen = () => {
    const [selectedOption, setSelectedOption] = useState(1); // Default select the second option as in screenshot
    const [notifications, setNotifications] = useState([]);

    const addNotification = (type, title, systemMsg, message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, title, systemMsg, message }]);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handlePreviousClick = () => {
        addNotification(
            'alert',
            'ALERT',
            'SYSTEM MSG: 0X4F',
            'Connection instability\ndetected. Please refrain from\nrefreshing the page.'
        );
    };

    const handleSubmitClick = () => {
        addNotification(
            'success',
            'SUCCESS',
            'LOG: 200_OK',
            'Answer block 14-20\nsynchronized with proctor\nserver.'
        );
    };

    const currentQuestionText = "Which of the following best describes the primary function of a synchronized server timer in high-stakes online assessments?";

    const options = [
        "TO PROVIDE A LOCAL REFERENCE FOR THE CANDIDATE'S COMPUTER CLOCK.",
        "TO ENSURE ALL CANDIDATES HAVE AN IDENTICAL TESTING DURATION REGARDLESS OF LOCAL TIME ZONES.",
        "TO MONITOR THE LATENCY BETWEEN THE CLIENT AND THE PROCTORING SERVER.",
        "TO PREVENT THE CANDIDATE FROM MANUALLY ADJUSTING THEIR SYSTEM CLOCK."
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-mono text-black">
            <TopBar />

            <div className="flex flex-1 overflow-visible relative">
                <Sidebar currentQuestion={14} />

                <main className="flex-1 overflow-y-auto px-8 md:px-16 pt-8 pb-48 w-full max-w-7xl mx-auto">
                    <QuestionBlock
                        questionNumber={14}
                        questionText={currentQuestionText}
                        type="MULTIPLE CHOICE"
                        points={2.0}
                    />

                    <OptionsGrid
                        options={options}
                        selectedOptionIndex={selectedOption}
                        onOptionSelect={setSelectedOption}
                    />
                </main>
            </div>

            <BottomBar
                onPreviousClick={handlePreviousClick}
                onSubmitClick={handleSubmitClick}
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
