import React from 'react';
import StatCard from './StatCard';
import ActivityChart from './ActivityChart';
import ViolationBreakdown from './ViolationBreakdown';
import RecentViolations from './RecentViolations';

const AdminDashboard = () => {
    return (
        <>
            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard 
                    title="ACTIVE SESSIONS" 
                    value="1,284" 
                    detail={<><span className="text-green-600">↗ +12.5%</span> vs Last Hour</>} 
                    detailColor="text-gray-500"
                    live={true} 
                />
                <StatCard 
                    title="FLAGGED VIOLATIONS" 
                    value="42" 
                    warning={true}
                    detail="High Risk Detected" 
                    detailColor="text-[#d96745]"
                    detailIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#d96745]">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                        </svg>
                    }
                />
                <StatCard 
                    title="RECOVERY EVENTS" 
                    value="156" 
                    detail="Total Today" 
                    detailColor="text-gray-500"
                    detailIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                    }
                />
                <StatCard 
                    title="SYSTEM HEALTH" 
                    value="99.8%" 
                    detail="All Nodes Green" 
                    detailColor="text-green-600"
                    detailIcon={
                        <div className="w-3 h-3 rounded-full bg-green-500 border border-green-700"></div>
                    }
                />
            </div>

            {/* Middle Section: Chart & Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                    <ActivityChart />
                </div>
                <div className="lg:col-span-1">
                    <ViolationBreakdown />
                </div>
            </div>

            {/* Bottom Section: Recent Violations */}
            <RecentViolations />
        </>
    );
};

export default AdminDashboard;
