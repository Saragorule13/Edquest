import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
    
    // Style for inactive links
    const inactiveClass = "flex items-center gap-4 px-6 py-4 hover:bg-gray-100 cursor-pointer text-gray-600 transition-colors";
    
    // Style for active link
    const activeClass = "flex items-center gap-4 px-6 py-4 bg-black text-white cursor-pointer";

    return (
        <div className="w-64 border-r-4 border-black bg-white flex flex-col h-screen shrink-0 sticky top-0 z-40">
            {/* Logo Area */}
            <div className="p-6 border-b-4 border-black flex items-center gap-3">
                <div className="bg-[#F5A623] w-8 h-8 flex items-center justify-center rounded-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <h1 className="text-xl font-bold tracking-widest font-serif">FAIREXAM</h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col pt-6 font-bold text-gray-800">
                <NavLink 
                    to="/admin" 
                    end
                    className={({ isActive }) => isActive ? activeClass : inactiveClass}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="7" height="9" x="3" y="3" rx="1" />
                        <rect width="7" height="5" x="14" y="3" rx="1" />
                        <rect width="7" height="9" x="14" y="12" rx="1" />
                        <rect width="7" height="5" x="3" y="16" rx="1" />
                    </svg>
                    Dashboard
                </NavLink>
                
                <NavLink 
                    to="/admin/live" 
                    className={({ isActive }) => isActive ? activeClass : inactiveClass}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 7l-7 5 7 5V7z" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    Live Monitoring
                </NavLink>
                
                <NavLink 
                    to="/admin/archive" 
                    className={({ isActive }) => isActive ? activeClass : inactiveClass}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                    Session Archive
                </NavLink>
                
                <NavLink 
                    to="/admin/violations" 
                    className={({ isActive }) => isActive ? activeClass : inactiveClass}
                >
                    <div className="flex items-center gap-4 w-full">
                        <div className="flex items-center gap-4 flex-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                <path d="M12 9v4" />
                                <path d="M12 17h.01" />
                            </svg>
                            Violation Reports
                        </div>
                        <span className="bg-[#F5A623] text-black text-xs px-2 py-0.5 font-bold border-2 border-black ml-auto">42</span>
                    </div>
                </NavLink>
                
                <NavLink 
                    to="/admin/users" 
                    className={({ isActive }) => isActive ? activeClass : inactiveClass}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    User Management
                </NavLink>

                <NavLink 
                    to="/admin/add-test" 
                    className={({ isActive }) => isActive ? activeClass : inactiveClass}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                    Create Test
                </NavLink>

                <NavLink 
                    to="/admin/add-questions" 
                    className={({ isActive }) => isActive ? activeClass : inactiveClass}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <path d="M12 7v6" />
                        <path d="M12 17h.01" />
                    </svg>
                    Add Questions
                </NavLink>
                
                <NavLink 
                    to="/admin/settings" 
                    className={({ isActive }) => isActive ? activeClass : inactiveClass}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    Settings
                </NavLink>
                
                <NavLink 
                    to="/admin/status" 
                    className={({ isActive }) => isActive ? activeClass : inactiveClass}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" x2="18" y1="20" y2="10" />
                        <line x1="12" x2="12" y1="20" y2="4" />
                        <line x1="6" x2="6" y1="20" y2="14" />
                    </svg>
                    System Status
                </NavLink>
            </nav>

            {/* Profile Section */}
            <div className="border-t-4 border-black p-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#e6ceb3] border-2 border-black"></div>
                    <div>
                        <div className="font-bold text-sm">A. VANDERBILT</div>
                        <div className="text-xs text-gray-500 font-bold tracking-widest text-[10px]">SUPER ADMIN</div>
                    </div>
                </div>
                <button className="w-full border-2 border-black p-2 font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                    LOGOUT
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
