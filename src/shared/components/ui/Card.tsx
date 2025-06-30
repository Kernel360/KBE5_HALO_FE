import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const Card = ({ children, className = "", ...rest }: CardProps) => (
  <div className={className} {...rest}>{children}</div>
);

export default Card; 