import React from 'react';

const Sidebar = ({ totalQuestions = 0, currentQuestion = 1, answers = {} }) => {
    const blocks = Array.from({ length: totalQuestions }, (_, i) => i + 1);

    return (
        <div className="w-16 md:w-20 border-r-4 border-black bg-white flex flex-col h-[calc(110vh-76px)] overflow-y-auto shrink-0 sticky top-[68px] z-40">
            <div className="py-8 flex flex-col items-center">
                <span className="text-xs font-bold tracking-widest rotate-[-90deg] whitespace-nowrap mb-12 transform -translate-x-1">PROGRESS<br />MAP</span>

                <div className="flex flex-col gap-3 w-full px-2 md:px-4">
                    {blocks.map((num) => {
                        const isCurrent = num === currentQuestion;
                        // Determine if question is answered (using 0-based index for matching answers object if needed, but here answers is keyed by index normally or we can check Object.values)
                        // Wait, answers usually keyed by questionId. Let's assume prop answers is simply an array of booleans or a Set of answered 1-based indices
                        // Let's expect answers to be an object keyed by 1-based index OR 0-based index. Let's say 0-based index.
                        const isAnswered = answers[num - 1] !== undefined && answers[num - 1] !== null; 
                        
                        // We can remove the hardcoded hasFlag logic for now or reserve it
                        const hasFlag = false; 

                        return (
                            <div
                                key={num}
                                className={`
                  w-full aspect-square border-2 border-black flex items-center justify-center font-bold text-sm transition-colors relative
                  ${isCurrent ? 'bg-[#c44f35] text-white' : ''}
                  ${isAnswered && !isCurrent ? 'bg-black text-white' : ''}
                  ${!isCurrent && !isAnswered ? 'bg-white' : ''}
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
