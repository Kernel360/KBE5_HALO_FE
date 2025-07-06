import { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { PenLine, Trash2 } from "lucide-react";
import {
  getAdminInquiry,
  deleteAdminInquiry,
  answerAdminInquiry,
} from "@/features/admin/api/adminInquiry";
import Loading from "@/shared/components/ui/Loading";
import ErrorToast from "@/shared/components/ui/toast/ErrorToast";
import SuccessToast from "@/shared/components/ui/toast/SuccessToast";
import Toast from "@/shared/components/ui/toast/Toast";
import type { InquiryDetail } from "@/features/admin/types/AdminInquiryType";

export const AdminInquiryDetail = () => {
  const { inquiryId } = useParams();
  const location = useLocation();
  const authorId = location.state?.authorId;
  const [inquiry, setInquiry] = useState<InquiryDetail | null>(null);
  const navigate = useNavigate();
  const answerTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  // Toast 상태 관리
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null);
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null);

  // HTML formatting handlers
  const formatText = (tag: string) => {
    const textarea = answerTextareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);
    let insert = selected;
    if (tag === "ul") {
      // Split lines and wrap each in <li>
      insert =
        "<ul>\n" +
        selected
          .split("\n")
          .map((line) => (line ? `<li>${line}</li>` : ""))
          .join("\n") +
        "\n</ul>";
    } else {
      insert = `<${tag}>${selected}</${tag}>`;
    }
    textarea.value = before + insert + after;
    // Move cursor after inserted text
    textarea.selectionStart = textarea.selectionEnd =
      before.length + insert.length;
    textarea.focus();
  };

  // 날짜 포맷 함수
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  }

  // 문의사항 조회
  useEffect(() => {
    if (!inquiryId) return;
    getAdminInquiry(Number(inquiryId)).then(
      (data: InquiryDetail) => {
        setInquiry(data);
        if (data.replyDetail) {
          setAnswer(data.replyDetail.content || "");
        }
      },
    ).catch((error) => {
      console.error("문의사항 조회 실패:", error);
      setErrorToastMsg("문의사항을 불러오는 중 오류가 발생했습니다.");
    });
  }, [inquiryId]);
  
  if (!inquiry) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading
          message="문의사항을 불러오는 중..."
          size="lg"
        />
      </div>
    );
  }

  // 답변 상태 구분
  const isAnswered = !!inquiry.replyDetail;

  // 문의사항 삭제
  const handleDelete = async () => {
    if (!inquiryId) return;
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteAdminInquiry("customer", Number(inquiryId));
      setSuccessToastMsg("삭제가 완료되었습니다.");
      setTimeout(() => {
        navigate("/admin/inquiries");
      }, 1000);
    } catch (error) {
      console.error(error);
      setErrorToastMsg("삭제 중 오류가 발생했습니다.");
    }
  };

  // 답변 등록
  const handleAnswer = async () => {
    if (!inquiryId || !answer.trim()) return;
    setLoading(true);
    try {
      await answerAdminInquiry(Number(inquiryId), {
        replyContent: answer,
      });
      setSuccessToastMsg("답변이 등록되었습니다.");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setErrorToastMsg("답변 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="w-full min-h-0 flex flex-col">
        {/* 상단 헤더 */}
        <div className="h-16 px-6 bg-white border-b border-gray-200 flex justify-between items-center">
          <div className="text-gray-900 text-xl font-bold">문의사항 상세</div>
          <div className="flex justify-end gap-2">
            {!inquiry.replyDetail && (
              <Fragment>
                <button
                  onClick={handleDelete}
                  className="h-9 px-3 flex items-center gap-2 text-red-500 border border-red-500 bg-white rounded-md text-sm font-semibold hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  삭제
                </button>
              </Fragment>
            )}
            <Link
              to="/admin/inquiries"
              className="h-9 px-3 flex items-center gap-2 text-gray-500 border border-gray-300 bg-white rounded-md text-sm font-semibold hover:bg-gray-50"
            >
              목록으로
            </Link>
          </div>
        </div>

        {/* 본문 */}
        <div className="p-6 flex flex-col gap-6">
          {/* 문의 내용 카드 */}
          <div className="p-8 bg-white rounded-xl shadow flex flex-col gap-6">
               <div className="flex items-center gap-2 text-sm text-slate-500">
                  {/* 상태 뱃지 */}
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      inquiry.replyDetail
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-yellow-100 text-orange-600'
                    }`}
                  >
                    {inquiry.replyDetail ? '답변 완료' : '답변 대기'}
                  </div>

                  {/* 접수일 */}
                  <span>
                    접수일:{" "}
                    <span className="text-slate-700">{formatDate(inquiry.createdAt)}</span>
                  </span>
                </div>
            
            <div className="h-px bg-slate-200" />
            <div className="flex flex-col gap-6">
              {/* 문의 유형 */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="font-bold mr-10 text-base text-gray-900">문의 유형 </div>
                  <div className="text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">
                    {inquiry.categoryName || "-"}
                  </div>
                </div>
              </div>
              
              {/* 문의자 정보 */}
                <div className="space-y-4">
                  <div className="font-bold text-base text-gray-900">문의자 정보</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex">
                      <div className="w-20 mr-10 text-slate-500">이름</div>
                      <div className="text-gray-900">{inquiry.authorName}</div>
                    </div>
                    <div className="flex">
                      <div className="w-20 mr-10 text-slate-500">작성자 타입</div>
                      <div className="text-gray-900">{inquiry.authorType || "-"}</div>
                    </div>
                    <div className="flex">
                      <div className="w-20 mr-10 text-slate-500">연락처</div>
                      <div className="text-gray-900">{inquiry.phone || "-"}</div>
                    </div>
                    <div className="flex">
                      <div className="w-20 mr-10 text-slate-500">이메일</div>
                      <div className="text-gray-900">{inquiry.email || "-"}</div>
                    </div>
                  </div>
                </div>
              
              {/* 문의글 정보 */}
              <div className="flex flex-col">
                <div className="font-bold text-base text-gray-900">문의 제목</div>
                <div className="p-4 bg-slate-50 rounded-lg text-slate-800 text-sm">
                  {inquiry.title}
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="font-bold text-base text-gray-900">문의 내용</div>
                <div className="p-4 bg-slate-50 rounded-lg text-slate-800 text-sm whitespace-pre-wrap h-48 overflow-y-auto">
                  {inquiry.content}
                </div>
              </div>
              
              {/* 첨부파일 */}
              {inquiry.fileId && (
                <div className="flex flex-col">
                  <div className="font-semibold text-sm text-slate-500 mb-1">첨부파일</div>
                  <div className="h-10 px-4 bg-slate-50 rounded-lg flex items-center gap-2 outline outline-1 outline-slate-200">
                    <span className="material-symbols-outlined text-slate-500">description</span>
                    <span className="text-slate-700 text-sm font-medium">첨부파일</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 답변 섹션 */}
          {isAnswered ? (
            // 답변이 있을 때: 답변 카드 표시
            <div className="p-8 bg-white rounded-xl shadow flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="text-slate-800 text-xl font-bold">답변</div>
                <div className="flex gap-4 text-sm text-slate-500">
                  <div>
                    <span className="text-slate-700">
                      {inquiry.replyDetail?.createdAt ? formatDate(inquiry.replyDetail.createdAt) : ""}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="h-px bg-slate-200" />
              
              <div className="p-4 bg-blue-50 rounded-lg text-slate-800 text-sm whitespace-pre-wrap h-48 overflow-y-auto">
                {inquiry.replyDetail?.content || ""}
              </div>
            </div>
          ) : (
            // 답변이 없을 때: 답변 입력 폼 표시
            <div className="p-8 bg-white rounded-xl shadow flex flex-col gap-6">
              <div className="text-slate-800 text-xl font-bold">답변 작성</div>
              
              <div className="h-px bg-slate-200" />
              
              <div className="h-40 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 flex flex-col justify-start items-start">
                <div className="self-stretch h-11 px-3 bg-gray-50 border-b border-gray-200 flex flex-row justify-start items-center gap-2">
                  {/* HTML Formatting Toolbar */}
                  <button
                    type="button"
                    title="Bold"
                    className="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded"
                    onClick={() => formatText("b")}
                  >
                    <b>B</b>
                  </button>
                  <button
                    type="button"
                    title="Italic"
                    className="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded"
                    onClick={() => formatText("i")}
                  >
                    <i>I</i>
                  </button>
                  <button
                    type="button"
                    title="Bullet List"
                    className="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded"
                    onClick={() => formatText("ul")}
                  >
                    • List
                  </button>
                </div>
                <div className="self-stretch flex-1 p-3 flex flex-col justify-start items-start">
                  <textarea
                    ref={answerTextareaRef}
                    className="self-stretch w-full h-full resize-none bg-transparent text-gray-900 text-sm font-normal font-['Inter'] leading-none focus:outline-none"
                    placeholder="답변을 입력해주세요..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className={`h-9 px-4 rounded-lg flex justify-center items-center text-white text-sm font-semibold ${answer.trim() ? "bg-indigo-600 hover:bg-indigo-800" : "bg-gray-300 cursor-not-allowed"}`}
                  disabled={!answer.trim() || loading}
                  onClick={handleAnswer}
                >
                  답변하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Toast 컴포넌트들 */}
      <SuccessToast
        open={!!successToastMsg}
        message={successToastMsg || ""}
        onClose={() => setSuccessToastMsg(null)}
      />
      <ErrorToast
        open={!!errorToastMsg}
        message={errorToastMsg || ""}
        onClose={() => setErrorToastMsg(null)}
      />
      <Toast
        open={!!toastMsg}
        message={toastMsg || ""}
        onClose={() => setToastMsg(null)}
      />
    </Fragment>
  );
};