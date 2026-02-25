import React, { useState, useEffect } from 'react';

const TopBar = () => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return (
        <div className="flex border-b-4 border-black bg-white sticky top-0 z-50">

            {/* Left section matching Sidebar width (w-16 md:w-20) */}
            <div className="w-16 md:w-20 border-r-4 border-black shrink-0 flex items-center justify-center pt-3 pb-3">
                <div className="bg-black text-white p-2 flex items-center justify-center rounded-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
            </div>

            {/* Main TopBar area */}
            <div className="flex-1 flex items-center justify-between px-6 py-3">
                <h1 className="text-2xl font-bold tracking-widest font-serif pl-2">FAIREXAM</h1>

                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 border-2 border-black px-4 py-1 bg-white shadow-neo-sm font-bold text-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        {hours}<span className="animate-pulse">:</span>{minutes}<span className="animate-pulse">:</span>{seconds}
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold border-r-2 border-black pr-8">
                        <div className="w-3 h-3 bg-[#c44f35]"></div>
                        SYNC ACTIVE
                        <span className="text-gray-500 font-normal ml-2">LAST SAVED: 2 MINS AGO</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right flex flex-col justify-center">
                            <span className="text-xs text-gray-500 font-bold tracking-widest leading-none">FE-99283</span>
                            <span className="font-bold tracking-wider leading-none mt-1">CANDIDATE</span>
                        </div>
                        <div className="border-2 border-black p-1 bg-white flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TopBar;

