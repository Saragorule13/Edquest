import React from 'react';

const ActivityChart = () => {
    // Data matched to the visual representation in the image
    const data = [
        { label: '00:00', value: 40, color: 'bg-[#a3b1c6]' },
        { label: '', value: 60, color: 'bg-[#a3b1c6] opacity-60' },
        { label: '04:00', value: 30, color: 'bg-[#a3b1c6] opacity-40' },
        { label: '', value: 50, color: 'bg-[#8292a8]' },
        { label: '08:00', value: 90, color: 'bg-[#F5A623]', topBorder: true }, 
        { label: '', value: 45, color: 'bg-[#a3b1c6] opacity-60' },
        { label: '12:00', value: 35, color: 'bg-[#a3b1c6] opacity-40' },
        { label: '', value: 65, color: 'bg-[#8292a8]' },
        { label: '16:00', value: 80, color: 'bg-[#F5A623]', topBorder: true }, 
        { label: '', value: 25, color: 'bg-[#a3b1c6] opacity-30' },
        { label: '20:00', value: 40, color: 'bg-[#a3b1c6] opacity-50' },
        { label: '', value: 20, color: 'bg-[#a3b1c6] opacity-20' },
        { label: '23:59', value: 0, color: 'transparent' } // Spacer for label
    ];

    return (
        <div className="border-4 border-black bg-white flex flex-col h-full h-[400px]">
            {/* Header */}
            <div className="border-b-4 border-black p-4 flex items-center justify-between">
                <h2 className="font-bold tracking-widest text-sm uppercase">Session Activity Volume</h2>
                <div className="flex border-2 border-black font-bold text-xs bg-white">
                    <button className="px-3 py-1 border-r-2 border-black bg-white hover:bg-gray-100 transition-colors">24H</button>
                    <button className="px-3 py-1 text-gray-400 hover:text-black transition-colors">7D</button>
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 p-6 pb-12 relative flex items-end">
                <div className="flex items-end justify-between h-full w-full gap-2 relative z-10">
                    {data.map((item, index) => (
                        <div key={index} className="flex flex-col items-center w-full h-[80%] relative justify-end">
                            {/* The Bar */}
                            {item.value > 0 && (
                                <div 
                                    className={`w-full transition-all duration-500 ease-out origin-bottom relative ${item.color}`}
                                    style={{ height: `${item.value}%` }}
                                >
                                    {item.topBorder && (
                                        <div className="w-full h-1 bg-black absolute top-0 left-0"></div>
                                    )}
                                </div>
                            )}
                            
                            {/* Label underneath */}
                            {item.label && (
                                <div className="absolute -bottom-8 text-[10px] font-bold text-gray-500 tracking-widest whitespace-nowrap">
                                    {item.label}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    );
};

export default ActivityChart;
