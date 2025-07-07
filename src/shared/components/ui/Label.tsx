import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  children: React.ReactNode;
}

export const Label = ({ children, className = "", ...rest }: LabelProps) => (
  <label className={className} {...rest}>
    {children}
  </label>
);

export default Label;
