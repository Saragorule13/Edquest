import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';

// ─── Icons for each action type ──────────────────────────────────────────────
const ActionIcon = ({ action }) => {
    const icons = {
        EXAM_SESSION_INIT: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        ),
        EXAM_DATA_LOADED: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        ),
        OPTION_SELECTED: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
        ),
        NAVIGATE_NEXT: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        ),
        NAVIGATE_PREVIOUS: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        ),
        FOCUS_LOST: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
        ),
        FOCUS_REGAINED: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
        ),
        VISIBILITY_CHANGE: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
        ),
        COPY_ATTEMPT: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
        ),
        PASTE_ATTEMPT: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
        ),
        RIGHT_CLICK: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z" /></svg>
        ),
        KEY_COMBO: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10" /></svg>
        ),
        EXAM_SUBMIT_INITIATED: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
        ),
        EXAM_SUBMITTED_SUCCESS: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
        ),
        EXAM_SUBMIT_ERROR: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
        ),
        EXAM_LOAD_ERROR: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
        ),
    };
    return icons[action] || (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
    );
};

// ─── Styling map ─────────────────────────────────────────────────────────────
const ACTION_CONFIG = {
    EXAM_SESSION_INIT: { label: 'Session Started', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
    EXAM_DATA_LOADED: { label: 'Data Loaded', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
    OPTION_SELECTED: { label: 'Answer Selected', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
    NAVIGATE_NEXT: { label: 'Next Question', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
    NAVIGATE_PREVIOUS: { label: 'Prev Question', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
    FOCUS_LOST: { label: 'Focus Lost', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
    FOCUS_REGAINED: { label: 'Focus Regained', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
    VISIBILITY_CHANGE: { label: 'Tab Switch', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
    COPY_ATTEMPT: { label: 'Copy Attempt', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
    PASTE_ATTEMPT: { label: 'Paste Attempt', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
    RIGHT_CLICK: { label: 'Right Click', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
    KEY_COMBO: { label: 'Key Combo', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
    EXAM_SUBMIT_INITIATED: { label: 'Submitting Exam', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
    EXAM_SUBMITTED_SUCCESS: { label: 'Exam Submitted', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
    EXAM_SUBMIT_ERROR: { label: 'Submit Failed', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
    EXAM_LOAD_ERROR: { label: 'Load Failed', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
};
const DEFAULT_CONFIG = { label: 'Event', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' };

const ALERT_ACTIONS = ['FOCUS_LOST', 'COPY_ATTEMPT', 'PASTE_ATTEMPT', 'RIGHT_CLICK', 'EXAM_LOAD_ERROR', 'EXAM_SUBMIT_ERROR', 'VISIBILITY_CHANGE'];

// Generate consistent colour from a string for user avatars
const stringToColor = (str) => {
    if (!str) return '#9ca3af';
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'];
    return colors[Math.abs(hash) % colors.length];
};

const LiveMonitoring = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [selectedUser, setSelectedUser] = useState('SYSTEM'); // 'SYSTEM' = all users
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const { data, error } = await supabase
                    .from('activity_logs')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(50);
                if (error) throw error;
                setSessions(data || []);
            } catch (err) {
                console.error('Failed to fetch activity logs:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();

        const channel = supabase
            .channel('activity_logs_realtime')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, (payload) => {
                setSessions(prev => [payload.new, ...prev]);
            })
            .subscribe();
        return () => supabase.removeChannel(channel);
    }, []);

    // ─── Unique users list ───────────────────────────────────────────────────
    const uniqueUsers = useMemo(() => {
        const userMap = new Map();
        sessions.forEach(s => {
            const uid = s.user_id || 'anonymous';
            if (!userMap.has(uid)) {
                userMap.set(uid, {
                    id: uid,
                    sessionCount: 0,
                    alertCount: 0,
                    eventCount: 0,
                });
            }
            const u = userMap.get(uid);
            u.sessionCount += 1;
            u.eventCount += (s.log_count || 0);
            u.alertCount += (s.logs || []).filter(l => ALERT_ACTIONS.includes(l.action)).length;
        });
        return Array.from(userMap.values()).sort((a, b) => b.sessionCount - a.sessionCount);
    }, [sessions]);

    // ─── Filter sessions by user first ───────────────────────────────────────
    const userFilteredSessions = useMemo(() => {
        if (selectedUser === 'SYSTEM') return sessions;
        return sessions.filter(s => (s.user_id || 'anonymous') === selectedUser);
    }, [sessions, selectedUser]);

    // Flatten
    const allLogs = useMemo(() => {
        const logs = userFilteredSessions.flatMap(session =>
            (session.logs || []).map(entry => ({
                ...entry,
                _sessionId: session.session_id,
                _userId: session.user_id,
                _testId: session.test_id,
            }))
        );
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return logs;
    }, [userFilteredSessions]);

    // Action filter
    const filteredLogs = useMemo(() => {
        if (filter === 'ALL') return allLogs;
        if (filter === 'ALERTS') return allLogs.filter(l => ALERT_ACTIONS.includes(l.action));
        if (filter === 'NAVIGATION') return allLogs.filter(l => l.action.startsWith('NAVIGATE'));
        if (filter === 'ANSWERS') return allLogs.filter(l => l.action === 'OPTION_SELECTED');
        return allLogs;
    }, [allLogs, filter]);

    // Stats (for currently visible scope)
    const totalSessions = userFilteredSessions.length;
    const totalAlerts = allLogs.filter(l => ALERT_ACTIONS.includes(l.action)).length;
    const totalEvents = allLogs.length;

    const formatTime = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };

    const getDetails = (entry) => {
        const details = [];
        if (entry.currentQuestion) details.push({ label: 'Question', value: `Q${entry.currentQuestion}` });
        if (entry.selectedOption) details.push({ label: 'Answer', value: entry.selectedOption });
        if (entry.wasChanged) details.push({ label: 'Status', value: 'Changed' });
        if (entry.from && entry.to) details.push({ label: 'Nav', value: `Q${entry.from} → Q${entry.to}` });
        if (entry.key) details.push({ label: 'Key', value: entry.key.toUpperCase() });
        if (entry.hidden !== undefined) details.push({ label: 'Tab', value: entry.hidden ? 'Hidden' : 'Visible' });
        if (entry.answeredCount !== undefined) details.push({ label: 'Progress', value: `${entry.answeredCount}/${entry.totalQuestions}` });
        if (entry.score) details.push({ label: 'Score', value: `${entry.score}%` });
        if (entry.testTitle) details.push({ label: 'Exam', value: entry.testTitle });
        if (entry.totalQuestions && entry.answeredCount === undefined) details.push({ label: 'Questions', value: entry.totalQuestions });
        return details;
    };

    const selectedUserData = selectedUser !== 'SYSTEM' ? uniqueUsers.find(u => u.id === selectedUser) : null;

    return (
        <div className="h-full flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold tracking-widest font-serif">LIVE MONITORING</h1>
                    <div className="flex items-center gap-2 bg-green-50 border-2 border-green-300 px-3 py-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold tracking-widest text-green-700">REALTIME</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {['ALL', 'ALERTS', 'NAVIGATION', 'ANSWERS'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-[10px] font-bold tracking-widest border-2 border-black transition-all duration-150 ${filter === f
                                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(245,166,35,1)]'
                                    : 'bg-white text-black hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                }`}
                        >
                            {f === 'ALERTS' ? `⚠ ${f}` : f}
                        </button>
                    ))}
                </div>
            </div>

            {/* User Scope Selector + Stats Row */}
            <div className="flex gap-4 flex-wrap">
                {/* User Selector Panel */}
                <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 min-w-[280px]">
                    <div className="border-b-2 border-black px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-5 bg-[#F5A623]"></div>
                            <span className="text-[10px] font-bold tracking-widest text-gray-500">VIEWING</span>
                        </div>
                        {selectedUser !== 'SYSTEM' && (
                            <button
                                onClick={() => setSelectedUser('SYSTEM')}
                                className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-black transition-colors underline"
                            >
                                CLEAR
                            </button>
                        )}
                    </div>
                    <div className="p-4 flex items-center gap-4">
                        {/* Current selection display */}
                        <div className="relative flex-1">
                            <button
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="w-full flex items-center gap-3 px-4 py-3 border-2 border-black hover:bg-gray-50 transition-colors text-left"
                            >
                                {selectedUser === 'SYSTEM' ? (
                                    <>
                                        <div className="w-8 h-8 bg-black flex items-center justify-center shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">ALL USERS</div>
                                            <div className="text-[10px] text-gray-400 font-bold tracking-widest">SYSTEM-WIDE VIEW</div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-8 h-8 flex items-center justify-center shrink-0 border-2 border-black text-white text-xs font-black" style={{ backgroundColor: stringToColor(selectedUser) }}>
                                            {selectedUser.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-sm font-mono truncate">{selectedUser === 'anonymous' ? 'ANONYMOUS' : selectedUser.substring(0, 12) + '…'}</div>
                                            <div className="text-[10px] text-gray-400 font-bold tracking-widest">
                                                {selectedUserData?.sessionCount || 0} SESSIONS · {selectedUserData?.alertCount || 0} ALERTS
                                            </div>
                                        </div>
                                    </>
                                )}
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0 text-gray-400"><polyline points="6 9 12 15 18 9" /></svg>
                            </button>

                            {/* Dropdown */}
                            {userDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-4 border-black z-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-h-[300px] overflow-y-auto">
                                    {/* System option */}
                                    <button
                                        onClick={() => { setSelectedUser('SYSTEM'); setUserDropdownOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${selectedUser === 'SYSTEM' ? 'bg-gray-50' : ''}`}
                                    >
                                        <div className="w-7 h-7 bg-black flex items-center justify-center shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-xs">ALL USERS</div>
                                            <div className="text-[9px] text-gray-400 tracking-widest">{sessions.length} SESSIONS</div>
                                        </div>
                                        {selectedUser === 'SYSTEM' && <div className="w-2 h-2 rounded-full bg-[#F5A623] shrink-0"></div>}
                                    </button>
                                    {/* Per-user options */}
                                    {uniqueUsers.map(u => (
                                        <button
                                            key={u.id}
                                            onClick={() => { setSelectedUser(u.id); setUserDropdownOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${selectedUser === u.id ? 'bg-gray-50' : ''}`}
                                        >
                                            <div className="w-7 h-7 flex items-center justify-center shrink-0 text-white text-[9px] font-black border border-black/20" style={{ backgroundColor: stringToColor(u.id) }}>
                                                {u.id.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-xs font-mono truncate">{u.id === 'anonymous' ? 'ANONYMOUS' : u.id.substring(0, 16)}</div>
                                                <div className="text-[9px] text-gray-400 tracking-widest">
                                                    {u.sessionCount} SESS · {u.eventCount} EVENTS
                                                    {u.alertCount > 0 && <span className="text-red-500 ml-1">· {u.alertCount} ALERTS</span>}
                                                </div>
                                            </div>
                                            {selectedUser === u.id && <div className="w-2 h-2 rounded-full bg-[#F5A623] shrink-0"></div>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 flex-1 min-w-[400px]">
                    <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-blue-100 border-2 border-blue-300 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold tracking-widest text-gray-400 mb-1">SESSIONS</div>
                            <div className="text-3xl font-black leading-none">{totalSessions}</div>
                        </div>
                    </div>
                    <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-[#FFF5E6] border-2 border-[#F5A623] flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold tracking-widest text-gray-400 mb-1">EVENTS</div>
                            <div className="text-3xl font-black leading-none">{totalEvents}</div>
                        </div>
                    </div>
                    <div className={`border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 flex-1 ${totalAlerts > 0 ? 'bg-red-50' : 'bg-white'}`}>
                        <div className={`w-12 h-12 border-2 flex items-center justify-center shrink-0 ${totalAlerts > 0 ? 'bg-red-100 border-red-300' : 'bg-gray-100 border-gray-300'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={totalAlerts > 0 ? '#ef4444' : '#9ca3af'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold tracking-widest text-gray-400 mb-1">ALERTS</div>
                            <div className={`text-3xl font-black leading-none ${totalAlerts > 0 ? 'text-red-600' : ''}`}>{totalAlerts}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Log Feed */}
            <div className="border-4 border-black bg-white flex-1 overflow-hidden flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                {/* Feed Header */}
                <div className="border-b-4 border-black p-4 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-6 bg-[#F5A623]"></div>
                        <h2 className="font-bold tracking-widest text-sm uppercase">
                            {selectedUser === 'SYSTEM' ? 'System Activity Feed' : 'User Activity Feed'}
                        </h2>
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 bg-gray-100 px-3 py-1 border border-gray-200">
                        {filteredLogs.length} EVENT{filteredLogs.length !== 1 ? 'S' : ''}
                    </span>
                </div>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
                        <div className="w-10 h-10 border-4 border-black border-t-[#F5A623] rounded-full animate-spin"></div>
                        <span className="font-bold tracking-widest text-gray-400 text-sm">LOADING EVENTS...</span>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3">
                        <div className="w-16 h-16 bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                        </div>
                        <span className="font-bold tracking-widest text-gray-300 text-sm">NO EVENTS FOUND</span>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        {filteredLogs.map((entry, i) => {
                            const config = ACTION_CONFIG[entry.action] || DEFAULT_CONFIG;
                            const isAlert = ALERT_ACTIONS.includes(entry.action);
                            const details = getDetails(entry);

                            return (
                                <div
                                    key={`${entry._sessionId}-${i}`}
                                    className={`flex items-start gap-4 px-5 py-4 border-b border-gray-100 hover:bg-gray-50/60 transition-all duration-150 group ${isAlert ? 'border-l-4' : 'border-l-4 border-l-transparent'}`}
                                    style={isAlert ? { borderLeftColor: config.color } : {}}
                                >
                                    {/* Icon circle */}
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 transition-transform duration-150 group-hover:scale-110"
                                        style={{ backgroundColor: config.bg, borderColor: config.border, color: config.color }}
                                    >
                                        <ActionIcon action={entry.action} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <span className="font-bold text-sm text-gray-900">{config.label}</span>
                                            {isAlert && (
                                                <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 bg-red-500 text-white border border-red-600">ALERT</span>
                                            )}
                                            {entry.wasChanged && (
                                                <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 bg-[#F5A623] text-black border border-black">CHANGED</span>
                                            )}
                                        </div>

                                        {details.length > 0 && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {details.map((d, j) => (
                                                    <span key={j} className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                                                        <span className="text-gray-300 font-bold">{d.label}:</span>
                                                        <span className="font-semibold text-gray-600">{d.value}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* User info (shown in system view) */}
                                        <div className="flex items-center gap-3 mt-1.5">
                                            {selectedUser === 'SYSTEM' && (
                                                <>
                                                    <div
                                                        className="w-4 h-4 flex items-center justify-center text-white text-[7px] font-black shrink-0"
                                                        style={{ backgroundColor: stringToColor(entry._userId) }}
                                                    >
                                                        {(entry._userId || 'AN').substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-mono">
                                                        {entry._userId ? entry._userId.substring(0, 8) : 'anon'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-200">·</span>
                                                </>
                                            )}
                                            <span className="text-[10px] text-gray-300 font-mono truncate">
                                                {entry._sessionId ? entry._sessionId.substring(0, 18) : '—'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right side: time */}
                                    <div className="flex flex-col items-end shrink-0 gap-1 mt-0.5">
                                        <span className="font-mono text-xs text-gray-800 font-bold">
                                            {formatTime(entry.timestamp)}
                                        </span>
                                        <span
                                            className="font-mono text-[10px] px-2 py-0.5 font-bold"
                                            style={{ backgroundColor: config.bg, color: config.color, border: `1px solid ${config.border}` }}
                                        >
                                            +{(entry.elapsedMs / 1000).toFixed(1)}s
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveMonitoring;
