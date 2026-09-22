import React from "react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className = "",
  ...props
}) => {
  const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    primary: "bg-slate-900 text-white border-slate-800",
    secondary: "bg-sky-50 text-sky-700 border-sky-200",
    accent: "bg-amber-50 text-amber-800 border-amber-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    outline: "bg-transparent text-slate-700 border-slate-300",
  };

  const dotClasses: Record<BadgeVariant, string> = {
    default: "bg-slate-500",
    primary: "bg-amber-400",
    secondary: "bg-sky-500",
    accent: "bg-amber-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    outline: "bg-slate-500",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider rounded-md border ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotClasses[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
