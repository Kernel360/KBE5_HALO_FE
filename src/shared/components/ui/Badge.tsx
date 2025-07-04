import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  children: React.ReactNode;
}

export const Badge = ({ children, className = "", ...rest }: BadgeProps) => (
  <span className={className} {...rest}>
    {children}
  </span>
);

export default Badge;
