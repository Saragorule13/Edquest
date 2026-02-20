import React, { useEffect, useState } from 'react';

const Notification = ({ type = 'alert', title = 'ALERT', systemMsg = 'SYSTEM MSG: 0X4F', message = '', onClose, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation shortly after mount
        const enterTimer = setTimeout(() => {
            setIsVisible(true);
        }, 10);

        let exitTimer;
        if (duration > 0) {
            exitTimer = setTimeout(() => {
                handleClose();
            }, duration);
        }

        return () => {
            clearTimeout(enterTimer);
            if (exitTimer) clearTimeout(exitTimer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 300); // 300ms for exit animation
    };

    const isAlert = type === 'alert';

    // Theme variables based on type
    const headerBg = isAlert ? 'bg-[#c44f35]' : 'bg-[#1a201f]'; // matches the dark greenish/black SUCCESS header
    const headerTextColor = 'text-white';

    // Icons
    const AlertIconHeader = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
    );

    const SuccessIconHeader = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    );

    const AlertIconBody = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="black" /><path d="M12 8v4" stroke="white" /><path d="M12 16h.01" stroke="white" /></svg>
    );

    const SuccessIconBody = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="black" /><path d="m9 12 2 2 4-4" stroke="white" /></svg>
    );

    return (
        <div
            className={`
        w-[400px] border-4 border-black bg-white shadow-neo z-[100] font-mono flex flex-col transition-all duration-300 ease-out pointer-events-auto origin-top-right
        ${isVisible ? 'translate-y-0 translate-x-0 opacity-100 scale-100' : '-translate-y-4 translate-x-4 opacity-0 scale-95'}
      `}
        >
            {/* Header */}
            <div className={`px-4 py-2 border-b-4 border-black flex justify-between items-center ${headerBg} ${headerTextColor}`}>
                <h3 className="font-bold text-lg tracking-widest leading-none">{title}</h3>
                {isAlert ? <AlertIconHeader /> : <SuccessIconHeader />}
            </div>

            {/* Body */}
            <div className="p-4 flex gap-4 min-h-[100px]">
                <div className="flex-shrink-0 mt-1">
                    {isAlert ? <AlertIconBody /> : <SuccessIconBody />}
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-500 tracking-widest mb-2 uppercase">{systemMsg}</span>
                    <p className="text-sm font-medium leading-relaxed font-mono whitespace-pre-line">
                        {message}
                    </p>
                </div>
            </div>

            {/* Optional decorative bottom bar as seen in the alert (orange sliver) */}
            {isAlert && (
                <div className="h-1 bg-[#c44f35] w-2/3 absolute bottom-0 left-0"></div>
            )}
        </div>
    );
};

export default Notification;
