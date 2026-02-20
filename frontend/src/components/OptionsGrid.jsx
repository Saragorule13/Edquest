import React from 'react';

const OptionItem = ({ option, index, isSelected, onClick }) => {
    return (
        <div
            onClick={() => onClick(index)}
            className={`
        border-4 border-black p-6 cursor-pointer flex items-center gap-6 relative shadow-neo transition-all duration-200
        ${isSelected ? 'bg-[#c44f35] text-white -translate-y-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100/50 hover:bg-white hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'}
      `}
        >
            <div className={`
        w-8 h-8 flex-shrink-0 border-4 border-black flex items-center justify-center bg-white
        ${isSelected ? 'text-[#c44f35]' : 'text-transparent'}
      `}>
                {/* Simple square mimicking a checkbox */}
                <div className={`w-3 h-3 ${isSelected ? 'bg-black' : 'bg-transparent'}`}></div>
            </div>
            <p className="font-bold text-lg tracking-wide uppercase leading-snug">
                {option}
            </p>
        </div>
    );
};

const OptionsGrid = ({ options, selectedOptionIndex, onOptionSelect }) => {
    return (
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 relative z-0">
            {options.map((option, index) => (
                <OptionItem
                    key={index}
                    option={option}
                    index={index}
                    isSelected={selectedOptionIndex === index}
                    onClick={onOptionSelect}
                />
            ))}
        </div>
    );
};

export default OptionsGrid;
