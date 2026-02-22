import React from 'react';

const AdminTopBar = () => {
    return (
        <div className="flex items-center justify-between border-b-4 border-black bg-white px-6 py-4 sticky top-0 z-30 min-h-[76px]">
            
            {/* Search Bar */}
            <div className="flex items-center w-full max-w-sm border-2 border-black px-3 py-2 bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mr-2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" x2="16.65" y1="21" y2="16.65" />
                </svg>
                <input 
                    type="text" 
                    placeholder="SEARCH SYSTEM RECORDS..." 
                    className="w-full outline-none text-sm font-bold placeholder-gray-400 tracking-wider"
                />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-6">
                
                {/* Status Bar */}
                <div className="flex items-center gap-6 text-xs font-bold tracking-widest">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#F5A623]"></div>
                        SERVER TIME: 14:22:05 <span className="text-green-600">(VERIFIED)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-[#d96745] animate-pulse"></div>
                        SYNC: ACTIVE
                    </div>
                </div>

                <div className="flex items-center gap-4 border-l-2 border-black pl-6">
                    {/* Notification Bell */}
                    <button className="border-2 border-black p-2 bg-white hover:bg-gray-100 transition-colors relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        </svg>
                    </button>

                    {/* New Session Button */}
                    <button className="bg-[#F5A623] hover:bg-[#E8951A] text-black border-2 border-black px-6 py-2 font-bold tracking-widest text-sm transition-colors shadow-neo-sm">
                        NEW SESSION
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AdminTopBar;
