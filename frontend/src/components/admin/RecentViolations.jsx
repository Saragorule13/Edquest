import React from 'react';

const RecentViolations = () => {
    const violations = [
        { id: 'FE-882193', name: 'Advanced Thermodynamics I', type: 'Forbidden App', confText: '98.2% CRITICAL', confColor: 'bg-[#F5A623]', confBorder: 'border-black', typeColor: 'text-red-500 bg-red-50', time: '14:19:33' },
        { id: 'FE-772101', name: 'Organic Chemistry 101', type: 'Multi-Person', confText: '84.5% HIGH', confColor: 'bg-black text-white', confBorder: 'border-black', typeColor: 'text-gray-700 bg-gray-100', time: '14:15:02' },
        { id: 'FE-993210', name: 'Microeconomics Final', type: 'Face Not Found', confText: '72.1% MED', confColor: 'bg-[#a3b1c6] text-black', confBorder: 'border-black opacity-50', typeColor: 'text-gray-700 bg-gray-100', time: '14:12:44' }
    ];

    return (
        <div className="border-4 border-black bg-white mt-6 overflow-hidden">
            {/* Header */}
            <div className="border-b-4 border-black p-4 flex items-center justify-between">
                <h2 className="font-bold tracking-widest text-sm uppercase">Recent Violation Flags</h2>
                <button className="border-2 border-black px-4 py-1 text-xs font-bold tracking-widest hover:bg-gray-100 transition-colors bg-white">
                    EXPORT CSV
                </button>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-black text-[10px] text-gray-800 tracking-widest font-bold">
                            <th className="p-4 uppercase w-[15%]">Student ID</th>
                            <th className="p-4 uppercase w-[30%]">Exam Name</th>
                            <th className="p-4 uppercase w-[15%] text-center">Violation Type</th>
                            <th className="p-4 uppercase w-[15%] text-center">Confidence</th>
                            <th className="p-4 uppercase w-[15%] text-center">Timestamp</th>
                            <th className="p-4 uppercase w-[10%] text-right pr-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {violations.map((v, i) => (
                            <tr key={v.id} className={i !== violations.length - 1 ? "border-b border-gray-200" : ""}>
                                <td className="p-4 font-mono text-gray-600 tracking-widest text-sm">{v.id}</td>
                                <td className="p-4 font-bold text-black">{v.name}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-3 py-1 text-[10px] font-bold tracking-widest border border-gray-200 ${v.typeColor}`}>
                                        {v.type}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-3 py-1 text-[10px] font-bold tracking-widest border-2 ${v.confBorder} ${v.confColor}`}>
                                        {v.confText}
                                    </span>
                                </td>
                                <td className="p-4 text-center font-mono text-gray-500 tracking-widest text-sm">
                                    {v.time}
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <div className="flex items-center justify-end gap-3 text-xs font-bold tracking-widest">
                                        <button className="underline hover:text-[#F5A623] transition-colors">VIEW</button>
                                        <button className="underline hover:text-red-500 transition-colors">FLAG</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentViolations;
