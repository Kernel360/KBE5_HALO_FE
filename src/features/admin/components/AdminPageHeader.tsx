import React from "react";

interface AdminPageHeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export const AdminPageHeader = ({ title, actions, className = "" }: AdminPageHeaderProps) => (
  <div className={`w-full h-16 px-6 bg-white border-b border-gray-200 flex justify-between items-center ${className}`}>
    <div className="text-gray-900 text-xl font-bold">{title}</div>
    {actions && <div className="flex gap-2">{actions}</div>}
  </div>
);

export default AdminPageHeader; 