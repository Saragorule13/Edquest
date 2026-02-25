import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';

const ALERT_ACTIONS = ['FOCUS_LOST', 'COPY_ATTEMPT', 'PASTE_ATTEMPT', 'RIGHT_CLICK', 'VISIBILITY_CHANGE', 'EXAM_LOAD_ERROR', 'EXAM_SUBMIT_ERROR'];

const UserManagement = () => {
    const [examAttempts, setExamAttempts] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('lastActive');
    const [expandedUser, setExpandedUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [attRes, logRes, testRes] = await Promise.all([
                    supabase.from('exam_attempts').select('*').order('created_at', { ascending: false }),
                    supabase.from('activity_logs').select('*').order('created_at', { ascending: false }),
                    supabase.from('tests').select('id, title'),
                ]);
                if (attRes.data) setExamAttempts(attRes.data);
                if (logRes.data) setActivityLogs(logRes.data);
                if (testRes.data) setTests(testRes.data);
            } catch (err) {
                console.error('UserManagement fetch error:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const testNameMap = useMemo(() => {
        const map = {};
        tests.forEach(t => { map[t.id] = t.title; });
        return map;
    }, [tests]);

    // Build user profiles from exam_attempts + activity_logs
    const users = useMemo(() => {
        const userMap = {};

        // From exam_attempts
        examAttempts.forEach(a => {
            if (!a.user_id) return;
            if (!userMap[a.user_id]) {
                userMap[a.user_id] = {
                    id: a.user_id,
                    attempts: [],
                    sessions: [],
                    totalAlerts: 0,
                    lastActive: null,
                };
            }
            userMap[a.user_id].attempts.push(a);
            const ts = a.completed_at || a.created_at;
            if (!userMap[a.user_id].lastActive || new Date(ts) > new Date(userMap[a.user_id].lastActive)) {
                userMap[a.user_id].lastActive = ts;
            }
        });

        // From activity_logs
        activityLogs.forEach(s => {
            if (!s.user_id) return;
            if (!userMap[s.user_id]) {
                userMap[s.user_id] = {
                    id: s.user_id,
                    attempts: [],
                    sessions: [],
                    totalAlerts: 0,
                    lastActive: null,
                };
            }
            userMap[s.user_id].sessions.push(s);
            const alerts = (s.logs || []).filter(l => ALERT_ACTIONS.includes(l.action)).length;
            userMap[s.user_id].totalAlerts += alerts;
            if (!userMap[s.user_id].lastActive || new Date(s.created_at) > new Date(userMap[s.user_id].lastActive)) {
                userMap[s.user_id].lastActive = s.created_at;
            }
        });

        return Object.values(userMap).map(u => {
            const completed = u.attempts.filter(a => a.status === 'completed');
            const avgScore = completed.length > 0
                ? completed.reduce((sum, a) => sum + Number(a.score || 0), 0) / completed.length
                : null;
            const inProgress = u.attempts.filter(a => a.status === 'in_progress').length;

            return {
                ...u,
                shortId: u.id.substring(0, 8),
                totalAttempts: u.attempts.length,
                completedAttempts: completed.length,
                inProgress,
                avgScore,
                totalSessions: u.sessions.length,
                riskLevel: u.totalAlerts > 10 ? 'HIGH' : u.totalAlerts > 3 ? 'MEDIUM' : 'LOW',
            };
        });
    }, [examAttempts, activityLogs]);

    // Sort & filter
    const filteredUsers = useMemo(() => {
        let list = [...users];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            list = list.filter(u => u.id.toLowerCase().includes(term) || u.shortId.toLowerCase().includes(term));
        }
        if (sortBy === 'lastActive') list.sort((a, b) => new Date(b.lastActive || 0) - new Date(a.lastActive || 0));
        else if (sortBy === 'alerts') list.sort((a, b) => b.totalAlerts - a.totalAlerts);
        else if (sortBy === 'score') list.sort((a, b) => (b.avgScore || 0) - (a.avgScore || 0));
        else if (sortBy === 'attempts') list.sort((a, b) => b.totalAttempts - a.totalAttempts);
        return list;
    }, [users, searchTerm, sortBy]);

    const formatDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-black border-t-[#F5A623] rounded-full animate-spin"></div>
                    <span className="font-bold tracking-widest text-gray-400 text-sm">LOADING USERS...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-2xl font-bold tracking-widest font-serif">USER MANAGEMENT</h1>
                <div className="flex items-center gap-3 text-xs font-bold tracking-widest">
                    <span className="text-gray-400">{users.length} USERS</span>
                    <div className="w-px h-5 bg-gray-300"></div>
                    <span className="text-gray-400">{examAttempts.length} ATTEMPTS</span>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="border-4 border-black bg-white p-4 flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[200px] flex items-center gap-2 border-2 border-black px-3 py-2 bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="SEARCH BY USER ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent outline-none flex-1 font-bold text-xs tracking-widest placeholder:text-gray-400"
                    />
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest text-gray-500">SORT:</span>
                    {['lastActive', 'alerts', 'score', 'attempts'].map(s => (
                        <button
                            key={s}
                            onClick={() => setSortBy(s)}
                            className={`px-3 py-1.5 text-[10px] font-bold tracking-widest border-2 transition-colors ${sortBy === s
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-600 border-gray-300 hover:border-black'
                                }`}
                        >
                            {s === 'lastActive' ? 'RECENT' : s.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
                <div className="border-4 border-black bg-white p-12 flex flex-col items-center justify-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span className="font-bold tracking-widest text-gray-300 text-sm">NO USERS FOUND</span>
                </div>
            ) : (
                <div className="border-4 border-black bg-white overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-black text-[10px] text-gray-800 tracking-widest font-bold bg-gray-50">
                                <th className="p-4 uppercase w-[5%]"></th>
                                <th className="p-4 uppercase w-[20%]">User ID</th>
                                <th className="p-4 uppercase w-[12%] text-center">Exams</th>
                                <th className="p-4 uppercase w-[12%] text-center">Avg Score</th>
                                <th className="p-4 uppercase w-[12%] text-center">Sessions</th>
                                <th className="p-4 uppercase w-[12%] text-center">Alerts</th>
                                <th className="p-4 uppercase w-[12%] text-center">Risk</th>
                                <th className="p-4 uppercase w-[15%] text-center">Last Active</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredUsers.map((u, i) => {
                                const isExpanded = expandedUser === u.id;
                                const riskStyle = u.riskLevel === 'HIGH'
                                    ? 'bg-red-500 text-white border-red-700'
                                    : u.riskLevel === 'MEDIUM'
                                        ? 'bg-[#F5A623] text-black border-black'
                                        : 'bg-green-100 text-green-800 border-green-300';
                                const initials = u.shortId.substring(0, 2).toUpperCase();

                                return (
                                    <React.Fragment key={u.id}>
                                        <tr
                                            className={`cursor-pointer transition-colors ${isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'} ${i !== filteredUsers.length - 1 || isExpanded ? 'border-b border-gray-200' : ''}`}
                                            onClick={() => setExpandedUser(isExpanded ? null : u.id)}
                                        >
                                            <td className="pl-4 pr-0">
                                                <div className="w-8 h-8 bg-[#526482] border-2 border-black flex items-center justify-center text-white font-black text-[10px]">
                                                    {initials}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-mono text-xs text-gray-600 tracking-wider">{u.shortId}...</div>
                                                {u.inProgress > 0 && (
                                                    <span className="text-[10px] font-bold tracking-widest text-blue-600 bg-blue-50 px-1.5 py-0.5 border border-blue-200 mt-1 inline-block">
                                                        IN PROGRESS
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="font-bold">{u.completedAttempts}</span>
                                                <span className="text-gray-400 text-xs"> / {u.totalAttempts}</span>
                                            </td>
                                            <td className="p-4 text-center font-bold">
                                                {u.avgScore !== null ? (
                                                    <span className={u.avgScore >= 70 ? 'text-green-600' : u.avgScore >= 40 ? 'text-[#F5A623]' : 'text-red-500'}>
                                                        {u.avgScore.toFixed(1)}%
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300">—</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center font-bold">{u.totalSessions}</td>
                                            <td className="p-4 text-center">
                                                <span className={`font-bold ${u.totalAlerts > 0 ? 'text-red-500' : 'text-gray-300'}`}>
                                                    {u.totalAlerts}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-1 text-[10px] font-bold tracking-widest border-2 ${riskStyle}`}>
                                                    {u.riskLevel}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center text-xs font-mono text-gray-500">
                                                {formatDate(u.lastActive)}
                                            </td>
                                        </tr>

                                        {/* Expanded Row */}
                                        {isExpanded && (
                                            <tr className="border-b border-gray-200 bg-gray-50">
                                                <td colSpan={8} className="p-0">
                                                    <div className="p-6 border-t-2 border-dashed border-gray-300">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <span className="font-bold tracking-widest text-[10px] text-gray-500">FULL ID:</span>
                                                            <span className="font-mono text-xs text-gray-700 bg-white px-2 py-1 border border-gray-200">{u.id}</span>
                                                        </div>

                                                        {/* Exam Attempts */}
                                                        <h4 className="font-bold tracking-widest text-xs mb-3 text-gray-700">EXAM HISTORY</h4>
                                                        {u.attempts.length === 0 ? (
                                                            <p className="text-xs text-gray-400 font-bold tracking-widest">NO EXAM ATTEMPTS</p>
                                                        ) : (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                {u.attempts.slice(0, 6).map(a => (
                                                                    <div key={a.id} className="border-2 border-black bg-white p-3 flex flex-col gap-1">
                                                                        <div className="font-bold text-sm truncate">{testNameMap[a.test_id] || 'Unknown Test'}</div>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 border ${a.status === 'completed'
                                                                                    ? 'bg-green-50 text-green-700 border-green-300'
                                                                                    : 'bg-blue-50 text-blue-700 border-blue-300'
                                                                                }`}>
                                                                                {a.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
                                                                            </span>
                                                                            {a.status === 'completed' && (
                                                                                <span className={`font-bold text-sm ${Number(a.score) >= 70 ? 'text-green-600' : Number(a.score) >= 40 ? 'text-[#F5A623]' : 'text-red-500'}`}>
                                                                                    {Number(a.score).toFixed(1)}%
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-[10px] text-gray-400 font-mono">{formatDate(a.created_at)}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
