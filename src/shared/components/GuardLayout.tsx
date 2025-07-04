import { Outlet } from "react-router-dom";
import { useRouteGuard } from "@/shared/hooks/useRouteGuard";

export const GuardLayout = () => {
  const allowed = useRouteGuard();

  return allowed ? <Outlet /> : null; // 허용된 경우만 렌더링
};
