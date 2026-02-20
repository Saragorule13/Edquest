import React from 'react';

const Sidebar = ({ totalQuestions = 50, currentQuestion = 14 }) => {
    const blocks = Array.from({ length: 17 }, (_, i) => i + 1);

    return (
        <div className="w-16 md:w-20 border-r-4 border-black bg-white flex flex-col h-[calc(110vh-76px)] overflow-y-auto shrink-0 sticky top-[68px] z-40">
            <div className="py-8 flex flex-col items-center">
                <span className="text-xs font-bold tracking-widest rotate-[-90deg] whitespace-nowrap mb-12 transform -translate-x-1">PROGRESS<br />MAP</span>

                <div className="flex flex-col gap-3 w-full px-2 md:px-4">
                    {blocks.map((num) => {
                        const isCurrent = num === currentQuestion;
                        const isAnswered = num < 5 && num !== currentQuestion;
                        const hasFlag = num === 5;

                        return (
                            <div
                                key={num}
                                className={`
                  w-full aspect-square border-2 border-black flex items-center justify-center font-bold text-sm cursor-pointer transition-colors relative
                  ${isCurrent ? 'bg-[#c44f35] text-white' : ''}
                  ${isAnswered ? 'bg-black text-white' : ''}
                  ${!isCurrent && !isAnswered ? 'bg-white hover:bg-gray-100' : ''}
                `}
                            >
                                {hasFlag && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#c44f35]"></div>
                                )}
                                {num.toString().padStart(2, '0')}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
