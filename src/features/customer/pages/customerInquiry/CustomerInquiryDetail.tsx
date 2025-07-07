import { Fragment, useEffect, useState } from "react";
import { PenLine, Trash2 } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getCustomerInquiry, deleteCustomerInquiry } from "@/features/customer/api/CustomerInquiries";
import type { InquiryDetail } from "@/shared/types/InquiryType";
import { useAuthStore } from "@/store/useAuthStore";



export const CustomerInquiryDetail = () => {
  const { inquiryId } = useParams();
  const [inquiry, setInquiry] = useState<InquiryDetail | null>(null);
  const navigate = useNavigate();

  // 문의사항 조회
  useEffect(() => {
    if (!inquiryId) return;
    
    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/auth/login");
      return;
    }

    const fetchInquiry = async () => {
      try {
        const data = await getCustomerInquiry(Number(inquiryId));
        setInquiry(data);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "문의사항을 조회하는데 실패하였습니다.";
        alert(errorMessage);
      }
    };

    fetchInquiry();
  }, [inquiryId, navigate]);
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
    navigate(`/my/inquiries/${inquiryId}/edit`, {
      state: { inquiry },
    });
  };

  // 문의사항 삭제
  const handleDelete = async () => {
    if (!inquiryId) return;
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/auth/login");
      return;
    }

    try {
      await deleteCustomerInquiry(Number(inquiryId));
      alert("삭제가 완료되었습니다.");
      navigate("/my/inquiries");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "삭제 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  return (
    <Fragment>
      <div className="w-full min-h-0 flex flex-col">
        {/* 상단 헤더 */}
        <div className="h-16 px-6 bg-white border-b border-gray-200 flex justify-between items-center">
          <div className="text-gray-900 text-xl font-bold">문의사항 상세</div>
          <div className="flex justify-end gap-2">
            <Link
              to="/my/inquiries"
              className="h-9 px-3 flex items-center gap-2 text-gray-500 border border-gray-300 rounded-md text-sm font-semibold hover:bg-gray-50 cursor-pointer"
            >
              목록으로
            </Link>
          </div>
        </div>

        {/* 본문 */}
        <div className="p-6 flex flex-col gap-6">
          {/* 문의 내용 카드 */}
          <div className="p-8 bg-white rounded-xl shadow flex flex-col gap-6">
            <div className="flex flex-col gap-4 text-sm text-slate-800">
              <div className="flex flex-col">
                <div className="font-semibold text-sm text-slate-500 mb-1">문의 유형</div>
                <div className="p-4 bg-slate-50 rounded-lg text-slate-800 text-sm">
                  {inquiry.categoryName}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-semibold text-sm text-slate-500 mb-1">문의 제목</div>
                <div className="p-4 bg-slate-50 rounded-lg text-slate-800 text-sm">
                  {inquiry.title}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-semibold text-sm text-slate-500 mb-1">문의 내용</div>
                <div className="p-4 bg-slate-50 rounded-lg text-slate-800 text-sm whitespace-pre-wrap h-48 overflow-y-auto">
                  {inquiry.content}
                </div>
              </div>
              {inquiry.fileId && (
                <div className="flex flex-col">
                  <div className="font-semibold text-sm text-slate-500 mb-1">첨부 파일</div>
                  <div className="h-10 px-4 bg-slate-50 rounded-lg flex items-center gap-2 outline outline-1 outline-slate-200">
                    <span className="material-symbols-outlined text-slate-500">description</span>
                    <span className="text-slate-700 text-sm font-medium">{/* 파일 이름 삽입 가능 */}첨부파일</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
          {!inquiry.reply && (
              <Fragment>
                <button
                  onClick={handleEdit}
                  className="h-9 px-3 flex items-center gap-2 text-[#4f39f6] border border-[#4f39f6] rounded-md text-sm font-semibold hover:bg-indigo-50 cursor-pointer"
                >
                  <PenLine size={16} />
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="h-9 px-3 flex items-center gap-2 text-red-500 border border-red-500 rounded-md text-sm font-semibold hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 size={16} />
                  삭제
                </button>
              </Fragment>
            )}
            </div>

          {/* 답변 카드 (답변 있을 경우만) */}
          {inquiry.reply && (
            <div className="p-8 bg-white rounded-xl shadow flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="text-slate-800 text-xl font-bold">답변</div>
                <div className="flex gap-4 text-sm text-slate-500">
                  <div>
                    <span className="text-slate-700">
                      {new Date(inquiry.reply.createdAt).toLocaleString("ko-KR", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }).replace(/\./g, ".").replace(/(?<=\d{2}) (?=\d{2}:)/, " ")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="p-4 bg-blue-50 rounded-lg text-slate-800 text-sm whitespace-pre-wrap h-48 overflow-y-auto">
                {inquiry.reply.content}
              </div>

            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};
