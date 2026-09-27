import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Megaphone, X, ExternalLink } from "lucide-react";
import { apiClient } from "../../services/api";
import { Announcement } from "../../types";

export const AnnouncementBanner: React.FC = () => {
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAnnouncements = async () => {
      try {
        const response = await apiClient.get<Announcement[]>("/announcements");
        if (isMounted && response.data && response.data.length > 0) {
          const latest = response.data[0];
          const dismissedId = sessionStorage.getItem("genesis_dismissed_announcement");
          if (dismissedId !== String(latest.id)) {
            setActiveAnnouncement(latest);
          }
        }
      } catch (err) {
        // Silently catch in public view if offline/unavailable
      }
    };

    fetchAnnouncements();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDismiss = () => {
    if (activeAnnouncement) {
      sessionStorage.setItem("genesis_dismissed_announcement", String(activeAnnouncement.id));
    }
    setIsDismissed(true);
  };

  if (!activeAnnouncement || isDismissed) {
    return null;
  }

  const isInternalLink = activeAnnouncement.link_url?.startsWith("/");

  return (
    <div
      role="region"
      aria-label="Corporate Announcement"
      className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white text-xs sm:text-sm py-2 px-4 shadow-inner relative z-50 border-b border-amber-500/30"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Megaphone className="w-3 h-3 text-white" aria-hidden="true" />
          </div>
          <p className="truncate">
            <strong className="font-bold mr-1.5">{activeAnnouncement.title}:</strong>
            <span className="text-amber-100">{activeAnnouncement.content}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {activeAnnouncement.link_url && (
            isInternalLink ? (
              <Link
                to={activeAnnouncement.link_url}
                className="inline-flex items-center gap-1 font-semibold text-white underline hover:text-amber-200 transition-colors"
              >
                <span>{activeAnnouncement.link_text || "Learn More"}</span>
              </Link>
            ) : (
              <a
                href={activeAnnouncement.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-white underline hover:text-amber-200 transition-colors"
              >
                <span>{activeAnnouncement.link_text || "Learn More"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )
          )}

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white/80 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
