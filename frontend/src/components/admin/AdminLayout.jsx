import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-white flex font-body text-black">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <AdminTopBar />

                {/* Outlet for Inner Pages */}
                <div className="p-6 md:p-8 flex-1 overflow-auto bg-gray-50">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
