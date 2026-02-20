import React from 'react';

const QuestionBlock = ({ questionNumber = 14, questionText, type = "MULTIPLE CHOICE", points = 2.0 }) => {
    return (
        <div className="w-full max-w-5xl mx-auto mt-8 mb-12 relative">
            <div className="flex items-center justify-between mb-8 pl-4 pr-2">
                <div className="bg-black text-white px-4 py-2 text-xs font-bold tracking-widest">
                    {type}
                </div>
                <div className="flex-1 border-t-2 border-gray-300 mx-4"></div>
                <div className="text-gray-500 text-xs font-bold tracking-widest uppercase">
                    WORTH {points.toFixed(1)} POINTS
                </div>
            </div>

            <div className="relative">
                <div className="absolute -top-5 -left-4 bg-[#c44f35] text-white px-4 py-2 border-2 border-black font-bold text-lg z-10 shadow-neo-sm transform -rotate-2 origin-bottom-left">
                    Q. {questionNumber}
                </div>

                <div className="bg-white border-4 border-black p-8 pt-12 shadow-neo w-full transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] duration-200">
                    <p className="font-serif text-4xl leading-snug font-medium text-black">
                        {questionText}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QuestionBlock;
