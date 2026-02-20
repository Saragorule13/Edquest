import React from 'react';

const BottomBar = ({ onPreviousClick, onSubmitClick }) => {
    return (
        <div className="fixed bottom-0 left-16 md:left-20 right-0 bg-white border-t-4 border-black px-8 py-4 flex flex-col md:flex-row shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)] z-50">

            {/* Top row of buttons */}
            <div className="flex justify-between items-center w-full mb-4 md:absolute md:bottom-20 md:left-0 md:px-8 md:mb-0">
                <button
                    onClick={onPreviousClick}
                    className="flex items-center gap-3 border-4 border-black px-8 py-4 font-bold tracking-widest bg-white shadow-neo hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                    PREVIOUS
                </button>

                <button className="flex items-center gap-3 border-4 border-black px-8 py-4 font-bold tracking-widest bg-black text-white shadow-neo hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                    SAVE & CONTINUE
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
            </div>

            {/* Bottom informational bar */}
            <div className="flex flex-col md:flex-row justify-between items-center w-full relative z-10 pt-4 border-t-2 md:border-none border-gray-200">

                {/* Progress bar */}
                <div className="flex-1 max-w-sm w-full mb-4 md:mb-0">
                    <div className="flex justify-between text-xs font-bold tracking-widest mb-1">
                        <span>TOTAL PROGRESS</span>
                        <span>72%</span>
                    </div>
                    <div className="h-3 w-full border-2 border-black flex items-center bg-white p-[2px]">
                        <div className="h-full bg-[#c44f35] border-r-2 border-black patterned-bg" style={{ width: '72%' }}></div>
                    </div>
                </div>

                {/* Status text */}
                <div className="flex-1 flex justify-center text-xs font-bold tracking-widest">
                    SESSION STATUS: <span className="text-[#c44f35] ml-2 font-black">LOCKED</span> | 36 / 50 COMPLETED
                </div>

                {/* Action text */}
                <div className="flex-1 flex justify-end">
                    <button onClick={onSubmitClick} className="flex items-center gap-3 bg-black text-white px-6 py-3 font-bold tracking-widest text-sm hover:bg-gray-800 transition-colors">
                        SUBMIT EXAMINATION
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default BottomBar;
