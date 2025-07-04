import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

export const AdminLayout = () => {
  return (
    <Fragment>
      <div className="w-full min-h-screen bg-slate-100 inline-flex justify-start items-start">
        <AdminSidebar />
        <Outlet />
      </div>
    </Fragment>
  );
};
