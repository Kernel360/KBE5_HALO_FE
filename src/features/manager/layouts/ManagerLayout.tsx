import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import { ManagerSidebar } from "@/features/manager/components/ManagerSidebar";

interface ManagerLayoutProps {
  children?: ReactNode;
}

export const ManagerLayout = ({ children }: ManagerLayoutProps) => {
  return (
    <Fragment>
      <div className="flex h-screen w-full bg-slate-100">
        <ManagerSidebar />
        <div className="flex-1 w-full overflow-y-auto">
          {children || <Outlet />}
        </div>
      </div>
    </Fragment>
  );
};
