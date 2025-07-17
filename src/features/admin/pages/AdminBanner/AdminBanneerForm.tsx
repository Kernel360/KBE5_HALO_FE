import React, { useState, useRef, useEffect, Fragment } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FileUploadSection } from '@/shared/components/FileUploadSection'
import { isValidLength, isValidDateRange } from '@/shared/utils/validation'
import {
  creatAdminBanner,
  updateAdminBanner
} from '@/features/admin/api/adminBanners'
import type { AdminBannerDetail } from '@/features/admin/types/AdminBannerType'

export const AdminBannerForm = () => {
  const location = useLocation();
  const existingData = location.state?.banner as AdminBannerDetail | undefined;
  const isEditMode = !!existingData;

  const [title, setTitle] = useState("");
  const [path, setPath] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [fileId, setFileId] = useState<number | undefined>();
  const [files, setFiles] = useState<File[]>([]);

  const navigate = useNavigate();
  const startAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditMode && existingData) {
      setTitle(existingData.title);
      setPath(existingData.path);
      setStartAt(existingData.startAt);
      setEndAt(existingData.endAt);
      setFileId(existingData.fileId ?? undefined);
      setFiles([]); // 실제 File 객체로 복원 불가, 이후 참고용 UI 필요 시 fileName 사용
    }
  }, [isEditMode, existingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidLength(title, 1, 50)) {
      alert("제목은 필수 입력 항목이며, 50자 이하로 입력해주세요.");
      return;
    }

    if (!isValidLength(path, 1, 255)) {
      alert("경로는 필수 입력 항목이며, 255자 이하로 입력해주세요.");
      return;
    }

    if (!isValidDateRange(startAt, endAt)) {
      alert("게시기간의 시작일은 종료일보다 늦을 수 없습니다.");
      startAtRef.current?.focus();
      return;
    }

    try {
      if (isEditMode && existingData) {
        await updateAdminBanner(existingData.bannerId, {
          title,
          path,
          startAt,
          endAt,
          fileId,
        });
        alert("배너가 수정되었습니다.");
        navigate(`/admin/banners/${existingData.bannerId}`);
      } else {
        await creatAdminBanner({ title, path, startAt, endAt, fileId });
        alert("배너가 등록되었습니다.");
        navigate(`/admin/banners`);
      }
    } catch (error) {
      alert(
        isEditMode
          ? "수정 중 오류가 발생했습니다."
          : "등록 중 오류가 발생했습니다.",
      );
    }
  };

  return (
    <Fragment>
      <form
        onSubmit={handleSubmit}
        className="flex-1 self-stretch h-[968px] inline-flex flex-col justify-start items-start"
      >
        {/* 상단 헤더 */}
        <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
          <div className="text-gray-900 text-xl font-bold font-['Inter'] leading-normal">
            {isEditMode ? "배너 수정" : "배너 등록"}
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-10 px-4 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-center items-center cursor-pointer hover:bg-gray-100 transition"
          >
            <span className="text-gray-500 text-sm font-semibold font-['Inter'] leading-none">
              취소
            </span>
          </button>
        </div>

        {/* 본문 */}
        <div className="self-stretch p-6 inline-flex flex-col justify-start items-start gap-6">
          <div className="self-stretch p-8 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-6">
            {/* 제목 */}
            <div className="self-stretch flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">
                제목 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="배너 제목을 입력하세요"
                className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 text-slate-700 text-sm placeholder:text-slate-400"
                required
              />
            </div>

            {/* 게시기간 */}
            <div className="self-stretch flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">
                게시기간 *
              </label>
              <div className="flex flex-row items-center gap-2">
                <input
                  type="date"
                  ref={startAtRef}
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  className="flex-1 h-12 px-4 bg-gray-100 text-slate-500 rounded-lg outline outline-1 outline-slate-200 text-sm placeholder-slate-400"
                />
                <span className="text-slate-500 text-sm">~</span>
                <input
                  type="date"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  className="flex-1 h-12 px-4 bg-gray-100 text-slate-500 rounded-lg outline outline-1 outline-slate-200 text-sm placeholder-slate-400"
                />
              </div>
            </div>

            {/* 경로 */}
            <div className="self-stretch flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">
                경로 *
              </label>
              <input
                type="text"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="경로를 입력하세요"
                className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 text-slate-700 text-sm placeholder:text-slate-400"
                required
              />
            </div>

            {/* 첨부파일 */}
            <FileUploadSection
              files={files}
              setFiles={setFiles}
              title={"배너 이미지"}
              multiple={false}
              isRequired={true}
            />

            {/* 기존 첨부파일명 보여주기 (선택사항) */}
            {/* {isEditMode && existingData.fileName && (
              <div className="text-slate-500 text-sm">
                기존 첨부파일: <span className="text-slate-700 font-medium">{existingData.fileName}</span>
              </div>
            )} */}

            {/* 등록/수정 버튼 */}
            <button
              type="submit"
              className="self-stretch h-12 bg-indigo-600 rounded-lg inline-flex justify-center items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-white">
                {isEditMode ? "edit" : "add"}
              </span>
              <span className="text-white text-base font-semibold font-['Inter'] leading-tight">
                {isEditMode ? "배너 수정하기" : "배너 등록하기"}
              </span>
            </button>
          </div>
        </div>
      </form>
    </Fragment>
  );
};
