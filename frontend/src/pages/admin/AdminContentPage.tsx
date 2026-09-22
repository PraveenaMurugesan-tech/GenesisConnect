import React from "react";
import { FileText, Image, Layout } from "lucide-react";

export const AdminContentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
          Route: /admin/content
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Website Content Management</h1>
        <p className="text-xs text-slate-400">Control homepage hero announcements, client logos, and trust statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <Layout className="w-6 h-6 text-amber-500" />
          <h3 className="font-bold text-white text-base">Hero Section Banners</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Update main tagline, background banners, and promotional CTAs displayed on the public landing page.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <Image className="w-6 h-6 text-amber-500" />
          <h3 className="font-bold text-white text-base">Client Brand Showcase</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Manage industrial client brand logos, factory references, and certification badges.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <FileText className="w-6 h-6 text-amber-500" />
          <h3 className="font-bold text-white text-base">Corporate Announcements</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Publish company news, exhibitions, new product line announcements, and technical articles.
          </p>
        </div>
      </div>
    </div>
  );
};
