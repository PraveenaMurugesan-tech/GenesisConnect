import React from "react";
import { Badge } from "./Badge";

export interface SectionHeaderProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = "left",
  className = "",
}) => {
  const isCenter = align === "center";

  return (
    <div
      className={`space-y-3 ${
        isCenter ? "text-center max-w-3xl mx-auto" : "max-w-3xl"
      } ${className}`}
    >
      {badge && (
        <div>
          <Badge variant="accent" dot>
            {badge}
          </Badge>
        </div>
      )}
      <h2 className="heading-h2">{title}</h2>
      {subtitle && <p className="body-large">{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;
