import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "login";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = "", variant = "default", ...rest }, ref) => {
    let variantClass = "";
    if (variant === "login") {
      variantClass = "bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden";
    }
    return (
      <div ref={ref} className={variantClass + (className ? ` ${className}` : "")} {...rest}>{children}</div>
    );
  }
);

export default Card; 