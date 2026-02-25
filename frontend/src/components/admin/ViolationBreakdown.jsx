import React from 'react';

const ViolationBreakdown = ({ violations = [] }) => {
    return (
        <div className="border-4 border-black bg-white h-full flex flex-col">
            {/* Header */}
            <div className="border-b-4 border-black p-4">
                <h2 className="font-bold tracking-widest text-sm uppercase">Violation Breakdown</h2>
            </div>

            {/* List */}
            <div className="p-6 flex-1 flex flex-col gap-6 justify-center">
                {violations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                        <div className="w-12 h-12 bg-green-50 border-2 border-green-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                        <span className="font-bold tracking-widest text-gray-300 text-xs text-center">NO VIOLATIONS<br />DETECTED</span>
                    </div>
                ) : (
                    violations.map((item, index) => (
                        <div key={index} className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-xs font-bold tracking-widest">
                                <span>{item.label}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-[10px]">{item.count || 0}</span>
                                    <span className="text-[#F5A623]">{item.percentage}%</span>
                                </div>
                            </div>
                            {/* Progress Bar Container */}
                            <div className="h-4 w-full border-2 border-black bg-gray-100 p-0.5">
                                {/* Progress Bar Fill */}
                                <div
                                    className={`h-full border-r-2 border-black ${item.color}`}
                                    style={{ width: `${Math.max(item.percentage, 2)}%` }}
                                ></div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer Text */}
            <div className="px-6 pb-6 text-[10px] text-gray-500 font-bold leading-tight">
                Data represents aggregated flags from recorded activity logs.
                <br />Real-time analysis from proctor sessions.
            </div>
        </div>
    );
};

export default ViolationBreakdown;
