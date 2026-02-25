import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';

const ALERT_ACTIONS = ['FOCUS_LOST', 'COPY_ATTEMPT', 'PASTE_ATTEMPT', 'RIGHT_CLICK', 'VISIBILITY_CHANGE', 'EXAM_LOAD_ERROR', 'EXAM_SUBMIT_ERROR'];

const TYPE_LABEL = {
    FOCUS_LOST: 'Focus Lost',
    COPY_ATTEMPT: 'Copy Attempt',
    PASTE_ATTEMPT: 'Paste Attempt',
    RIGHT_CLICK: 'Right Click',
    VISIBILITY_CHANGE: 'Tab Switch',
    EXAM_LOAD_ERROR: 'Load Error',
    EXAM_SUBMIT_ERROR: 'Submit Error',
};

const SEVERITY = {
    COPY_ATTEMPT: { text: 'CRITICAL', style: 'bg-red-500 text-white border-red-700' },
    PASTE_ATTEMPT: { text: 'CRITICAL', style: 'bg-red-500 text-white border-red-700' },
    EXAM_SUBMIT_ERROR: { text: 'CRITICAL', style: 'bg-red-500 text-white border-red-700' },
    FOCUS_LOST: { text: 'HIGH', style: 'bg-[#F5A623] text-black border-black' },
    VISIBILITY_CHANGE: { text: 'HIGH', style: 'bg-black text-white border-black' },
    EXAM_LOAD_ERROR: { text: 'HIGH', style: 'bg-[#F5A623] text-black border-black' },
    RIGHT_CLICK: { text: 'MEDIUM', style: 'bg-[#a3b1c6] text-black border-black' },
};

const TYPE_COLOR = {
    FOCUS_LOST: 'text-red-600 bg-red-50 border-red-200',
    COPY_ATTEMPT: 'text-red-600 bg-red-50 border-red-200',
    PASTE_ATTEMPT: 'text-red-600 bg-red-50 border-red-200',
    RIGHT_CLICK: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    VISIBILITY_CHANGE: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    EXAM_LOAD_ERROR: 'text-red-600 bg-red-50 border-red-200',
    EXAM_SUBMIT_ERROR: 'text-red-600 bg-red-50 border-red-200',
};

const ViolationReports = () => {
    const [activityLogs, setActivityLogs] = useState([]);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('ALL');
    const [filterSeverity, setFilterSeverity] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [logRes, testRes] = await Promise.all([
                    supabase.from('activity_logs').select('*').order('created_at', { ascending: false }),
                    supabase.from('tests').select('id, title'),
                ]);
                if (logRes.data) setActivityLogs(logRes.data);
                if (testRes.data) setTests(testRes.data);
            } catch (err) {
                console.error('ViolationReports fetch error:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Real-time subscription
        const channel = supabase
            .channel('violation_reports_rt')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, (payload) => {
                setActivityLogs(prev => [payload.new, ...prev]);
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    const testNameMap = useMemo(() => {
        const map = {};
        tests.forEach(t => { map[t.id] = t.title; });
        return map;
    }, [tests]);

    // Extract all individual violations
    const allViolations = useMemo(() => {
        const violations = [];
        activityLogs.forEach(session => {
            (session.logs || []).forEach(entry => {
                if (ALERT_ACTIONS.includes(entry.action)) {
                    violations.push({
                        sessionId: session.session_id || '—',
                        userId: session.user_id || null,
                        testId: session.test_id,
                        testName: testNameMap[session.test_id] || 'Unknown Exam',
                        action: entry.action,
                        label: TYPE_LABEL[entry.action] || entry.action,
                        timestamp: entry.timestamp,
                        sessionCreated: session.created_at,
                        question: entry.currentQuestion || null,
                        severity: SEVERITY[entry.action] || { text: 'LOW', style: 'bg-gray-200 text-gray-700 border-gray-400' },
                        typeColor: TYPE_COLOR[entry.action] || 'text-gray-700 bg-gray-100 border-gray-200',
                    });
                }
            });
        });
        violations.sort((a, b) => new Date(b.timestamp || b.sessionCreated) - new Date(a.timestamp || a.sessionCreated));
        return violations;
    }, [activityLogs, testNameMap]);

    // Stats
    const stats = useMemo(() => {
        const typeCounts = {};
        ALERT_ACTIONS.forEach(a => { typeCounts[a] = 0; });
        allViolations.forEach(v => { typeCounts[v.action] = (typeCounts[v.action] || 0) + 1; });
        const critical = allViolations.filter(v => v.severity.text === 'CRITICAL').length;
        const high = allViolations.filter(v => v.severity.text === 'HIGH').length;
        const medium = allViolations.filter(v => v.severity.text === 'MEDIUM').length;
        const uniqueUsers = new Set(allViolations.filter(v => v.userId).map(v => v.userId)).size;
        return { total: allViolations.length, critical, high, medium, uniqueUsers, typeCounts };
    }, [allViolations]);

    // Filtered list
    const filtered = useMemo(() => {
        let list = [...allViolations];
        if (filterType !== 'ALL') list = list.filter(v => v.action === filterType);
        if (filterSeverity !== 'ALL') list = list.filter(v => v.severity.text === filterSeverity);
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            list = list.filter(v =>
                v.testName.toLowerCase().includes(term) ||
                v.sessionId.toLowerCase().includes(term) ||
                (v.userId && v.userId.toLowerCase().includes(term))
            );
        }
        return list;
    }, [allViolations, filterType, filterSeverity, searchTerm]);

    const formatTime = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-black border-t-[#F5A623] rounded-full animate-spin"></div>
                    <span className="font-bold tracking-widest text-gray-400 text-sm">LOADING VIOLATIONS...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-2xl font-bold tracking-widest font-serif">VIOLATION REPORTS</h1>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold tracking-widest text-gray-400">LIVE</span>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border-4 border-black bg-white p-4">
                    <div className="text-[10px] font-bold tracking-widest text-gray-500 mb-1">TOTAL FLAGS</div>
                    <div className="text-3xl font-bold font-serif">{stats.total}</div>
                </div>
                <div className="border-4 border-red-500 bg-red-50 p-4">
                    <div className="text-[10px] font-bold tracking-widest text-red-400 mb-1">CRITICAL</div>
                    <div className="text-3xl font-bold font-serif text-red-600">{stats.critical}</div>
                </div>
                <div className="border-4 border-[#F5A623] bg-orange-50 p-4">
                    <div className="text-[10px] font-bold tracking-widest text-[#F5A623] mb-1">HIGH</div>
                    <div className="text-3xl font-bold font-serif text-[#F5A623]">{stats.high}</div>
                </div>
                <div className="border-4 border-black bg-white p-4">
                    <div className="text-[10px] font-bold tracking-widest text-gray-500 mb-1">USERS FLAGGED</div>
                    <div className="text-3xl font-bold font-serif">{stats.uniqueUsers}</div>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="border-4 border-black bg-white p-4 flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[200px] flex items-center gap-2 border-2 border-black px-3 py-2 bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="SEARCH EXAM, SESSION, USER..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent outline-none flex-1 font-bold text-xs tracking-widest placeholder:text-gray-400"
                    />
                </div>

                {/* Type Filter */}
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border-2 border-black px-3 py-2 font-bold text-xs tracking-widest bg-white cursor-pointer"
                >
                    <option value="ALL">ALL TYPES</option>
                    {ALERT_ACTIONS.map(a => (
                        <option key={a} value={a}>{TYPE_LABEL[a] || a} ({stats.typeCounts[a] || 0})</option>
                    ))}
                </select>

                {/* Severity Filter */}
                <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="border-2 border-black px-3 py-2 font-bold text-xs tracking-widest bg-white cursor-pointer"
                >
                    <option value="ALL">ALL SEVERITY</option>
                    <option value="CRITICAL">CRITICAL ({stats.critical})</option>
                    <option value="HIGH">HIGH ({stats.high})</option>
                    <option value="MEDIUM">MEDIUM ({stats.medium})</option>
                </select>
            </div>

            {/* Results count */}
            <div className="text-[10px] font-bold tracking-widest text-gray-400">
                SHOWING {filtered.length} OF {allViolations.length} VIOLATIONS
            </div>

            {/* Violations Table */}
            {filtered.length === 0 ? (
                <div className="border-4 border-black bg-white p-12 flex flex-col items-center justify-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="font-bold tracking-widest text-gray-300 text-sm">NO VIOLATIONS FOUND</span>
                </div>
            ) : (
                <div className="border-4 border-black bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-black text-[10px] text-gray-800 tracking-widest font-bold bg-gray-50">
                                    <th className="p-4 uppercase w-[12%]">Session</th>
                                    <th className="p-4 uppercase w-[10%]">User</th>
                                    <th className="p-4 uppercase w-[20%]">Exam</th>
                                    <th className="p-4 uppercase w-[15%] text-center">Type</th>
                                    <th className="p-4 uppercase w-[12%] text-center">Severity</th>
                                    <th className="p-4 uppercase w-[8%] text-center">Q#</th>
                                    <th className="p-4 uppercase w-[18%] text-center">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filtered.map((v, i) => (
                                    <tr
                                        key={`${v.sessionId}-${i}`}
                                        className={`transition-colors hover:bg-gray-50 ${i !== filtered.length - 1 ? 'border-b border-gray-200' : ''}`}
                                    >
                                        <td className="p-4 font-mono text-gray-500 tracking-wider text-xs">
                                            {v.sessionId.substring(0, 10)}
                                        </td>
                                        <td className="p-4 font-mono text-gray-400 text-xs">
                                            {v.userId ? v.userId.substring(0, 8) : <span className="text-gray-300">anon</span>}
                                        </td>
                                        <td className="p-4 font-bold text-black text-sm truncate max-w-[200px]">
                                            {v.testName}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 text-[10px] font-bold tracking-widest border ${v.typeColor}`}>
                                                {v.label}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 text-[10px] font-bold tracking-widest border-2 ${v.severity.style}`}>
                                                {v.severity.text}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center font-mono text-gray-500 text-xs">
                                            {v.question || '—'}
                                        </td>
                                        <td className="p-4 text-center font-mono text-gray-500 tracking-wider text-xs">
                                            {formatTime(v.timestamp)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViolationReports;
