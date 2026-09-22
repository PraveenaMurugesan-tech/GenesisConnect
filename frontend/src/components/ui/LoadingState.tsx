import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export interface LoadingStateProps {
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = "Loading data...",
  description = "Retrieving system information from GenesisConnect servers",
  size = "md",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-xl bg-white border border-slate-200/80 shadow-industrial ${className}`}
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner
        size={size === "sm" ? "md" : size === "md" ? "lg" : "xl"}
        variant="secondary"
        className="mb-4"
      />
      <h4 className="text-base font-bold text-slate-800 tracking-tight">
        {title}
      </h4>
      {description && (
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default LoadingState;
