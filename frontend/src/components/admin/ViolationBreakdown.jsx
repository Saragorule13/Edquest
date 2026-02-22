import React from 'react';

const ViolationBreakdown = () => {
    const violations = [
        { label: 'FACE NOT DETECTED', percentage: 42, color: 'bg-[#F5A623]' },
        { label: 'FORBIDDEN APP USAGE', percentage: 28, color: 'bg-black' },
        { label: 'MULTIPLE PEOPLE DETECTED', percentage: 15, color: 'bg-[#526482]' },
        { label: 'AUDIO ANOMALIES', percentage: 10, color: 'bg-[#a3b1c6]' }
    ];

    return (
        <div className="border-4 border-black bg-white h-full flex flex-col">
            {/* Header */}
            <div className="border-b-4 border-black p-4">
                <h2 className="font-bold tracking-widest text-sm uppercase">Violation Breakdown</h2>
            </div>

            {/* List */}
            <div className="p-6 flex-1 flex flex-col gap-6 justify-center">
                {violations.map((item, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs font-bold tracking-widest">
                            <span>{item.label}</span>
                            <span className="text-[#F5A623]">{item.percentage}%</span>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="h-4 w-full border-2 border-black bg-gray-100 p-0.5">
                            {/* Progress Bar Fill */}
                            <div 
                                className={`h-full border-r-2 border-black ${item.color}`} 
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Footer Text */}
            <div className="px-6 pb-6 text-[10px] text-gray-500 font-bold leading-tight">
                Data represents aggregated flags over the last 24-hour cycle. 
                <br />High-confidence AI scoring applied.
            </div>
        </div>
    );
};

export default ViolationBreakdown;
