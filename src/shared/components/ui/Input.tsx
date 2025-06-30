import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = ({ className = "", ...rest }: InputProps) => (
  <input className={className} {...rest} />
);

export default Input; 