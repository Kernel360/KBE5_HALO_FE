import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getManagerInquiry, deleteManagerInquiry } from "@/features/manager/api/managerInquiry";
import type { ManagerInquiryDetail as ManagerInquiryType } from "@/features/manager/types/ManagerInquirylType";



export const ManagerInquiryDetail = () => {
  const { inquiryId } = useParams();
  const [inquiry, setInquiry] = useState<ManagerInquiryType | null>(null);
  const navigate = useNavigate();

  // 문의사항 조회
  useEffect(() => {
    if (!inquiryId) return;
    getManagerInquiry(Number(inquiryId)).then(setInquiry);
  }, [inquiryId]);
  if (!inquiry) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }


  // 문의사항 수정
  const handleEdit = () => {
    if (!inquiryId) return;
    navigate(`/managers/inquiries/${inquiryId}/edit`, {
    state: { inquiry }, // inquiry 전체 객체를 state로 전달
  });
  };

  // 문의사항 삭제
  const handleDelete = async () => {
    if (!inquiryId) return;
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteManagerInquiry(Number(inquiryId));
      alert("삭제가 완료되었습니다.");
      navigate("/managers/inquiries");
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <Fragment>
      <div className="w-full min-h-screen flex flex-col">
        {/* 상단 헤더 */}
        <div className="h-16 px-6 bg-white border-b border-gray-200 flex justify-between items-center">
          <div className="text-gray-900 text-xl font-bold">문의사항 상세</div>
          <div className="flex gap-2">
            <Link 
              to="/managers/inquiries"
              className="h-10 px-4 flex justify-center items-center border rounded-md text-sm text-gray-500 hover:bg-gray-100">목록으로</Link>
            {!inquiry.answerId && (
              <Fragment>
                <button
                  onClick={handleEdit}
                  className="h-10 px-4 bg-[#4f39f6] text-white rounded-md text-sm font-semibold hover:bg-[#3d2ee6]">
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="h-10 px-4 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600">
                  삭제
                </button>
              </Fragment>
            )}
          </div>
        </div>

        {/* 본문 */}
        <div className="p-6 flex flex-col gap-6">
          {/* 문의 내용 카드 */}
          <div className="p-8 bg-white rounded-xl shadow flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div className="text-slate-800 text-xl font-bold">
                <span className="text-sm font-semibold text-white bg-slate-500 px-2 py-1 rounded mr-3">질문</span>
                {inquiry.title}
                </div>
              <div className="flex gap-4 text-sm text-slate-500">
                <div>작성일시: <span className="text-slate-700">{inquiry.createdAt}</span></div>
              </div>
            </div>

            <div className="h-px bg-slate-200" />

            <div className="p-4 bg-slate-50 rounded-lg text-slate-700 text-sm whitespace-pre-wrap min-h-[200px]">
              {inquiry.content}
            </div>

            {/* 첨부파일 (있을 때만 표시) */}
            {inquiry.fileId && (
              <div className="flex flex-col gap-2">
                <div className="text-base font-semibold text-slate-800">첨부파일</div>
                <div className="h-12 px-4 bg-slate-50 rounded-lg flex items-center gap-2 outline outline-1 outline-slate-200">
                  <span className="material-symbols-outlined text-slate-500">description</span>
                  {/* <a
                    href={inquiry.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-700 text-sm font-medium underline hover:text-blue-600"
                  >
                    {inquiry.fileName}
                  </a> */}
                </div>
              </div>
            )}
          </div>

          <hr className="my-1 border-t border-slate-200" />

          {/* 답변 카드 */}
          <div className="p-8 bg-white rounded-xl shadow flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div className="text-slate-800 text-xl font-bold">
                <span className="text-sm font-semibold text-white bg-indigo-600 px-2 py-1 rounded">답변</span>
              </div>
              {inquiry.answerId && (
                <div className="flex gap-4 text-sm text-slate-500">
                  <div>작성일시: <span className="text-slate-700">{inquiry.replyCreatedAt ?? "-"}</span></div>
                </div>
              )}
            </div>
            <div className="h-px bg-slate-200" />
            <div className="p-4 bg-slate-50 rounded-lg text-slate-700 text-sm whitespace-pre-wrap min-h-[200px]">
              {inquiry.replyContent ?? "아직 관리자의 답변이 등록되지 않았습니다."}
            </div>

            {/* 첨부파일 (있을 때만 표시) */}
          {inquiry.replyFileId && (
            <div className="flex flex-col gap-2">
              <div className="text-base font-semibold text-slate-800">첨부파일</div>
              <div className="h-12 px-4 bg-slate-50 rounded-lg flex items-center gap-2 outline outline-1 outline-slate-200">
                <span className="material-symbols-outlined text-slate-500">description</span>
                {/* <a
                  href={inquiry.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-700 text-sm font-medium underline hover:text-blue-600"
                >
                  {inquiry.fileName}
                </a> */}
              </div>
            </div>
          )}

          </div>


        </div>
      </div>
    </Fragment>
  );
};
