import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export const Button = ({ children, className = "", ...rest }: ButtonProps) => (
  <button className={className} {...rest}>
    {children}
  </button>
);

export default Button;
