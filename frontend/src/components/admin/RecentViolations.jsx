import React from 'react';

const TYPE_STYLES = {
    'FOCUS LOST': 'text-red-600 bg-red-50',
    'COPY ATTEMPT': 'text-red-600 bg-red-50',
    'PASTE ATTEMPT': 'text-red-600 bg-red-50',
    'RIGHT CLICK': 'text-yellow-700 bg-yellow-50',
    'VISIBILITY CHANGE': 'text-yellow-700 bg-yellow-50',
    'EXAM LOAD ERROR': 'text-red-600 bg-red-50',
    'EXAM SUBMIT ERROR': 'text-red-600 bg-red-50',
};

const SEVERITY = {
    'FOCUS LOST': { text: 'HIGH', style: 'bg-[#F5A623] text-black border-black' },
    'COPY ATTEMPT': { text: 'CRITICAL', style: 'bg-red-500 text-white border-red-700' },
    'PASTE ATTEMPT': { text: 'CRITICAL', style: 'bg-red-500 text-white border-red-700' },
    'RIGHT CLICK': { text: 'MEDIUM', style: 'bg-[#a3b1c6] text-black border-black opacity-70' },
    'VISIBILITY CHANGE': { text: 'HIGH', style: 'bg-black text-white border-black' },
    'EXAM LOAD ERROR': { text: 'HIGH', style: 'bg-[#F5A623] text-black border-black' },
    'EXAM SUBMIT ERROR': { text: 'CRITICAL', style: 'bg-red-500 text-white border-red-700' },
};

const RecentViolations = ({ violations = [] }) => {
    const formatTime = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };

    return (
        <div className="border-4 border-black bg-white mt-6 overflow-hidden">
            {/* Header */}
            <div className="border-b-4 border-black p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="font-bold tracking-widest text-sm uppercase">Recent Violation Flags</h2>
                    {violations.length > 0 && (
                        <span className="text-[10px] font-bold tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 border border-gray-200">
                            {violations.length}
                        </span>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
                {violations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <div className="w-14 h-14 bg-green-50 border-2 border-green-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                        <span className="font-bold tracking-widest text-gray-300 text-sm">NO VIOLATIONS RECORDED</span>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-black text-[10px] text-gray-800 tracking-widest font-bold">
                                <th className="p-4 uppercase w-[12%]">Session</th>
                                <th className="p-4 uppercase w-[10%]">User</th>
                                <th className="p-4 uppercase w-[25%]">Exam Name</th>
                                <th className="p-4 uppercase w-[18%] text-center">Violation Type</th>
                                <th className="p-4 uppercase w-[15%] text-center">Severity</th>
                                <th className="p-4 uppercase w-[15%] text-center">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {violations.map((v, i) => {
                                const typeStyle = TYPE_STYLES[v.type] || 'text-gray-700 bg-gray-100';
                                const severity = SEVERITY[v.type] || { text: 'LOW', style: 'bg-gray-200 text-gray-700 border-gray-400' };

                                return (
                                    <tr key={`${v.id}-${i}`} className={i !== violations.length - 1 ? "border-b border-gray-200" : ""}>
                                        <td className="p-4 font-mono text-gray-500 tracking-widest text-xs">{v.id}</td>
                                        <td className="p-4 font-mono text-gray-400 text-xs">{v.userId}</td>
                                        <td className="p-4 font-bold text-black text-sm">{v.testName}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 text-[10px] font-bold tracking-widest border border-gray-200 ${typeStyle}`}>
                                                {v.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 text-[10px] font-bold tracking-widest border-2 ${severity.style}`}>
                                                {severity.text}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center font-mono text-gray-500 tracking-widest text-xs">
                                            {formatTime(v.time)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RecentViolations;
