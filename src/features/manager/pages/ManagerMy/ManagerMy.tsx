import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getManager } from "@/features/manager/api/managerMy";
import type { ManagerInfo } from "@/features/manager/types/ManagerMyType";
import { Loading } from "@/shared/components/ui/Loading";
import ErrorToast from "@/shared/components/ui/toast/ErrorToast";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";

export const ManagerMy = () => {
  const [manager, setManager] = useState<ManagerInfo | null>(null);
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const body = await getManager();
        setManager(body);
      } catch {
        setErrorToastMsg("매니저 정보 조회 중 오류가 발생하였습니다.");
      }
    };
    fetchManager();
  }, []);

  // 로딩 화면은 여기서 처리
  if (!manager) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loading />
        <ErrorToast
          open={!!errorToastMsg}
          message={errorToastMsg || ""}
          onClose={() => setErrorToastMsg(null)}
        />
      </div>
    )
  }

  return (
    <Fragment>
      <ErrorToast
        open={!!errorToastMsg}
        message={errorToastMsg || ""}
        onClose={() => setErrorToastMsg(null)}
      />
      <div className="max-w-4xl mx-auto py-10 px-4 flex flex-col gap-8">
        {/* 1. 프로필/상태 */}
        <Card className="p-6 flex flex-col items-center gap-3 bg-white shadow rounded-xl">
          {/* 프로필 이미지/이니셜 */}
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 mb-2">
            {manager.userName?.charAt(0) || "?"}
          </div>
          {/* 이름 + 상태 뱃지 */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-800">{manager.userName}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${manager.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
              {manager.statusName}
            </span>
          </div>
          {/* 주요 정보 */}
          <div className="flex flex-col items-center gap-1 text-slate-600 text-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">mail</span>
              {manager.email}
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">call</span>
              {manager.phone}
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">person</span>
              {manager.genderName}
              <span className="material-symbols-outlined text-base">cake</span>
              {manager.birthDate}
            </div>
          </div>
          {/* 상태 메시지 */}
          {manager.bio && (
            <div className="mt-2 text-center text-slate-500 text-sm">{manager.bio}</div>
          )}
        </Card>

        {/* 2. 서비스 지역(주소+지도) */}
        <Card className="bg-white border border-gray-200 shadow-md rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-indigo-500">
              location_on
            </span>
            <span className="text-lg font-bold text-slate-800">
              서비스 지역
            </span>
          </div>
          {manager.roadAddress ? (
            <>
              <div className="text-base text-slate-700 font-medium">
                {manager.roadAddress}
                {manager.detailAddress && (
                  <span className="text-slate-500 ml-1">
                    {manager.detailAddress}
                  </span>
                )}
              </div>
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    (manager.roadAddress?.replace(/^대한민국\s+/, "") || "") +
                    " " +
                    (manager.detailAddress || ""),
                  )}&z=14&output=embed`}
                  width="100%"
                  height="320"
                  style={{ border: 0, borderRadius: "12px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="서비스 위치"
                />
              </div>
              <div className="text-sm text-slate-500 mt-2">
                지도에 표시된 위치를 중심으로
                <span className="font-semibold text-indigo-600">반경 5km</span>
                가 서비스 지역입니다.
              </div>
            </>
          ) : (
            <div className="text-slate-400 text-base">
              주소 정보가 없어 서비스 지역 지도를 표시할 수 없습니다.
            </div>
          )}
        </Card>

        {/* 3. 첨부파일 */}
        {manager.fileId && (
          <Card className="p-6 flex flex-col gap-2">
            <div className="text-base font-semibold text-slate-800 mb-2">
              첨부파일
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500">
                description
              </span>
              {/* <a
                href={manager.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 text-sm font-medium underline hover:text-blue-600"
              >
                {manager.fileName}
              </a> */}
              <span className="text-slate-700 text-sm font-medium">
                {manager.fileName}
              </span>
            </div>
          </Card>
        )}

        {/* 4. 계약 정보 */}
        <Card className="bg-white border border-indigo-200 shadow-lg rounded-2xl p-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-indigo-500 text-2xl">
              gavel
            </span>
            <span className="text-xl font-bold text-slate-800">계약 정보</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="w-32 font-medium text-slate-500">계약 상태</span>
              <span className="flex items-center">
                <span className="mr-2">
                  <Button className="px-3 py-1 text-xs font-medium cursor-default bg-indigo-100 text-indigo-700">
                    {manager.statusName}
                  </Button>
                </span>
              </span>
            </div>
            {manager.status === "ACTIVE" && (
              <div className="flex items-center gap-3">
                <span className="w-32 font-medium text-slate-500">
                  계약 시작일
                </span>
                <span className="text-slate-700 text-sm font-medium">
                  {manager.contractAt}
                </span>
              </div>
            )}
            {manager.status === "TERMINATION_PENDING" && (
              <div className="flex flex-col gap-2">
                <div className="w-32 font-medium text-slate-500">
                  계약 해지 사유
                </div>
                <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700 whitespace-pre-wrap">
                  {manager.terminationReason}
                </div>
              </div>
            )}
            {manager.status === "ACTIVE" && (
              <div className="flex justify-end mt-4">
                <Link
                  to="/managers/my/contract-cancel"
                  state={{
                    contractAt: manager.contractAt,
                    statusName: manager.statusName,
                  }}
                >
                  <Button className="h-10 w-40 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow">
                    계약 해지 요청
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Fragment>
  )
}
