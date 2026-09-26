import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/layout/AdminSidebar";
import { AdminTopbar } from "../components/layout/AdminTopbar";
import { useAuth } from "../auth/AuthContext";

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex selection:bg-amber-500 selection:text-slate-950">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={logout}
      />

      {/* Main Administrative Viewport */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <AdminTopbar
          onToggleSidebar={() => setSidebarOpen(true)}
          onLogout={logout}
          currentUser={user}
        />

        {/* Dynamic Admin Content Viewport */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
