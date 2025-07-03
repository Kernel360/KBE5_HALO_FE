import { Fragment } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CustomerHeader } from "@/features/customer/components/CustomerHeader";
import { CustomerFooter } from "@/features/customer/components/CustomerFooter";
import CustomerSidebar from "@/features/customer/components/CustomerSidebar";

export const CustomerLayout = () => {
  const { pathname } = useLocation();
  // 사이드바를 보여주고 싶은 경로 배열
  const showSidebar = pathname.startsWith("/my");

  return (
    <Fragment>
      <div className="w-full min-h-screen bg-white inline-flex flex-col">
        <CustomerHeader />

       {/* 메인 컨테이너: 헤더와 푸터 사이에 위치하며, 콘텐츠 영역을 포함 */}
      <div className="w-full min-h-[calc(100vh-200px)] bg-gray-100 py-8"> {/* 뷰포트 높이에서 헤더/푸터 높이를 제외한 최소 높이, 배경색 회색, 위아래 패딩 */}
        <div className="max-w-screen-xl mx-auto px-6"> {/* 중앙 정렬 및 좌우 패딩 */}

          {/* 사이드바와 메인 콘텐츠 영역 (사이드바가 필요할 때만 좌우 레이아웃) */}
          {showSidebar ? (
            <div className="flex space-x-6 items-start">
              <CustomerSidebar />
              <main className="flex-1 bg-white p-6 rounded-lg shadow-sm">
                <Outlet />
              </main>
            </div>
          ) : (
            // 사이드바가 필요 없을 때의 메인 콘텐츠 영역
            <main className="bg-white p-6 rounded-lg shadow-sm">
              <Outlet />
            </main>
          )}
        </div>
      </div>

        <CustomerFooter />
      </div>
    </Fragment>
  );
};
