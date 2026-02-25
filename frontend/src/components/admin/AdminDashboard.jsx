import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import StatCard from './StatCard';
import ActivityChart from './ActivityChart';
import ViolationBreakdown from './ViolationBreakdown';
import RecentViolations from './RecentViolations';

const ALERT_ACTIONS = ['FOCUS_LOST', 'COPY_ATTEMPT', 'PASTE_ATTEMPT', 'RIGHT_CLICK', 'EXAM_LOAD_ERROR', 'EXAM_SUBMIT_ERROR', 'VISIBILITY_CHANGE'];

const AdminDashboard = () => {
    const [activityLogs, setActivityLogs] = useState([]);
    const [examAttempts, setExamAttempts] = useState([]);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [logsRes, attemptsRes, testsRes] = await Promise.all([
                    supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(100),
                    supabase.from('exam_attempts').select('*').order('created_at', { ascending: false }),
                    supabase.from('tests').select('id, title'),
                ]);

                if (logsRes.data) setActivityLogs(logsRes.data);
                if (attemptsRes.data) setExamAttempts(attemptsRes.data);
                if (testsRes.data) setTests(testsRes.data);
            } catch (err) {
                console.error('Dashboard fetch error:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();

        // Real-time for activity logs
        const channel = supabase
            .channel('dashboard_realtime')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, (payload) => {
                setActivityLogs(prev => [payload.new, ...prev]);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'exam_attempts' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setExamAttempts(prev => [payload.new, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    setExamAttempts(prev => prev.map(a => a.id === payload.new.id ? payload.new : a));
                }
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    // ─── Compute stats ───────────────────────────────────────────────────────
    const activeSessions = examAttempts.filter(a => a.status === 'in_progress').length;
    const completedSessions = examAttempts.filter(a => a.status === 'completed').length;

    // Flatten all log entries
    const allEvents = activityLogs.flatMap(s => s.logs || []);
    const alertEvents = allEvents.filter(l => ALERT_ACTIONS.includes(l.action));
    const totalViolations = alertEvents.length;

    // Recovery = focus regained after focus lost
    const recoveryEvents = allEvents.filter(l => l.action === 'FOCUS_REGAINED').length;

    // Build test name map
    const testNameMap = {};
    tests.forEach(t => { testNameMap[t.id] = t.title; });

    // Session activity per hour (from activity_logs created_at)
    const hourlyData = (() => {
        const hours = {};
        for (let h = 0; h < 24; h++) hours[h] = 0;
        activityLogs.forEach(s => {
            const hour = new Date(s.created_at).getHours();
            hours[hour] += 1;
        });
        return Object.entries(hours).map(([h, count]) => ({
            name: `${String(h).padStart(2, '0')}:00`,
            volume: count,
            highlight: count > 0,
        }));
    })();

    // Violation breakdown from real alert actions
    const violationBreakdownData = (() => {
        const counts = {};
        alertEvents.forEach(e => {
            counts[e.action] = (counts[e.action] || 0) + 1;
        });
        const total = alertEvents.length || 1;
        const labelMap = {
            FOCUS_LOST: 'FOCUS LOST',
            COPY_ATTEMPT: 'COPY ATTEMPT',
            PASTE_ATTEMPT: 'PASTE ATTEMPT',
            RIGHT_CLICK: 'RIGHT CLICK',
            VISIBILITY_CHANGE: 'TAB SWITCH',
            EXAM_LOAD_ERROR: 'LOAD ERROR',
            EXAM_SUBMIT_ERROR: 'SUBMIT ERROR',
        };
        const colorMap = {
            FOCUS_LOST: 'bg-[#F5A623]',
            COPY_ATTEMPT: 'bg-red-500',
            PASTE_ATTEMPT: 'bg-red-400',
            RIGHT_CLICK: 'bg-black',
            VISIBILITY_CHANGE: 'bg-[#526482]',
            EXAM_LOAD_ERROR: 'bg-[#a3b1c6]',
            EXAM_SUBMIT_ERROR: 'bg-red-600',
        };
        return Object.entries(counts)
            .map(([action, count]) => ({
                label: labelMap[action] || action,
                percentage: Math.round((count / total) * 100),
                color: colorMap[action] || 'bg-gray-400',
                count,
            }))
            .sort((a, b) => b.count - a.count);
    })();

    // Recent violations: individual alert events with context
    const recentViolations = (() => {
        const violations = [];
        activityLogs.forEach(session => {
            (session.logs || []).forEach(entry => {
                if (ALERT_ACTIONS.includes(entry.action)) {
                    violations.push({
                        id: session.session_id ? session.session_id.substring(0, 10).toUpperCase() : '—',
                        userId: session.user_id ? session.user_id.substring(0, 8) : 'anon',
                        testName: testNameMap[session.test_id] || 'Unknown Exam',
                        type: entry.action.replace(/_/g, ' '),
                        time: entry.timestamp,
                        action: entry.action,
                    });
                }
            });
        });
        violations.sort((a, b) => new Date(b.time) - new Date(a.time));
        return violations.slice(0, 20);
    })();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-black border-t-[#F5A623] rounded-full animate-spin"></div>
                    <span className="font-bold tracking-widest text-gray-400 text-sm">LOADING DASHBOARD...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    title="ACTIVE SESSIONS"
                    value={activeSessions.toLocaleString()}
                    detail={<><span className="text-blue-600">{completedSessions} completed</span> total</>}
                    detailColor="text-gray-500"
                    live={true}
                />
                <StatCard
                    title="FLAGGED VIOLATIONS"
                    value={totalViolations.toLocaleString()}
                    warning={totalViolations > 0}
                    detail={totalViolations > 0 ? 'Alerts Detected' : 'No Alerts'}
                    detailColor={totalViolations > 0 ? 'text-[#d96745]' : 'text-green-600'}
                    detailIcon={totalViolations > 0 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#d96745]">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                        </svg>
                    ) : null}
                />
                <StatCard
                    title="RECOVERY EVENTS"
                    value={recoveryEvents.toLocaleString()}
                    detail="Focus Regained"
                    detailColor="text-gray-500"
                    detailIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                    }
                />
                <StatCard
                    title="TOTAL EVENTS"
                    value={allEvents.length.toLocaleString()}
                    detail={`${activityLogs.length} Sessions Logged`}
                    detailColor="text-green-600"
                    detailIcon={
                        <div className="w-3 h-3 rounded-full bg-green-500 border border-green-700"></div>
                    }
                />
            </div>

            {/* Middle Section: Chart & Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                    <ActivityChart data={hourlyData} />
                </div>
                <div className="lg:col-span-1">
                    <ViolationBreakdown violations={violationBreakdownData} />
                </div>
            </div>

            {/* Bottom Section: Recent Violations */}
            <RecentViolations violations={recentViolations} />
        </>
    );
};

export default AdminDashboard;
