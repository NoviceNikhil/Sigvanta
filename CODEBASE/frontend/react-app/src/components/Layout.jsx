import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

// ─── Layout ────────────────────────────────────────────────────────────────────
// Shared layout for both Admin and User dashboard routes.
// Receives user from App.jsx (later will come from auth context/localStorage).
// Passes user.role to Sidebar so it knows which menu items to show.

const Layout = ({ user }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Redirect to login if not logged in
    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-100">
            <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

            <div className="pt-16 flex">
                {/* Sidebar receives role to show correct menu items */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    role={user.role}
                />

                {/* Mobile backdrop */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-hidden="true"
                    />
                )}

                <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-auto p-4 sm:p-6 lg:p-8 bg-slate-100 text-slate-900">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
