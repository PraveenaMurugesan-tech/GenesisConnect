import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-white">
      {/* Skip to Main Content accessibility link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        Skip to main content
      </a>

      {/* Corporate Public Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        <Outlet />
      </main>

      {/* Corporate Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
