import React from 'react';

const StatCard = ({ title, value, detail, detailColor, detailIcon, live = false, warning = false }) => {
    return (
        <div className={`
            border-4 border-black p-6 bg-white flex flex-col justify-between 
            h-40 relative shadow-neo-sm hover:translate-y-[-2px] hover:translate-x-[-2px] 
            hover:shadow-neo transition-all
            ${warning ? 'border-[#d96745]' : ''}
        `}>
            {/* Live Badge */}
            {live && (
                <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-2 py-1 tracking-widest">
                    LIVE
                </div>
            )}

            <div>
                <h3 className="text-gray-500 font-bold tracking-widest text-xs mb-2 uppercase">{title}</h3>
                <div className={`text-5xl font-bold font-serif ${warning ? 'text-[#d96745]' : 'text-black'}`}>
                    {value}
                </div>
            </div>

            <div className={`flex items-center gap-2 text-sm font-bold ${detailColor || 'text-gray-600'}`}>
                {detailIcon && <span>{detailIcon}</span>}
                {detail}
            </div>
        </div>
    );
};

export default StatCard;
