import { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import {
  getAdminInquiry,
  deleteAdminInquiry,
  answerAdminInquiry,
} from "@/features/admin/api/adminInquiry";
import Loading from "@/shared/components/ui/Loading";

export const AdminInquiryDetail = ({
  activeTab,
}: {
  activeTab: "manager" | "customer";
}) => {
  const { inquiryId } = useParams();
  const location = useLocation();
  const authorId = location.state?.authorId;
  const [inquiry, setInquiry] = useState<any>(null);
  const navigate = useNavigate();
  const answerTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
    if (!inquiryId || !authorId) return;
    getAdminInquiry(activeTab, Number(inquiryId), authorId).then(
      (data: any) => {
        setInquiry(data);
        if (data.replyStatus === true) {
          setAnswer(data.reply || "");
        } else {
          setAnswer(data.replyContent || "");
        }
      },
    );
  }, [inquiryId, activeTab, authorId]);
  if (!inquiry) {
    return (
      <Loading
        message="문의사항을 불러오는 중..."
        size="lg"
        className="h-screen"
      />
    );
  }

  // 답변 상태 구분
  const isAnswered = inquiry.replyStatus === true;
  const answerText = isAnswered ? "답변 완료" : "답변 대기";

  // 문의사항 삭제
  const handleDelete = async () => {
    if (!inquiryId) return;
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteAdminInquiry(activeTab, Number(inquiryId));
      alert("삭제가 완료되었습니다.");
      navigate("/admin/inquiries");
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 답변 등록
  const handleAnswer = async () => {
    if (!inquiryId || !answer.trim()) return;
    setLoading(true);
    try {
      await answerAdminInquiry(activeTab, Number(inquiryId), {
        replyContent: answer,
      });
      alert("답변이 등록되었습니다.");
      window.location.reload();
    } catch (error) {
      alert("답변 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
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
              to="/admin/inquiries"
              className="h-10 px-4 flex justify-center items-center border rounded-md text-sm text-gray-500 hover:bg-gray-100"
            >
              목록으로
            </Link>
            {!inquiry.answerId && (
              <Fragment>
                <button
                  onClick={handleDelete}
                  className="h-10 px-4 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600"
                >
                  삭제
                </button>
              </Fragment>
            )}
          </div>
        </div>

        {/* 본문 */}
        <div className="self-stretch bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-start items-start">
          <div className="self-stretch p-6 flex flex-col justify-start items-start gap-5">
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="flex justify-start items-center gap-2">
                <div
                  className={`h-7 px-3 rounded-2xl flex justify-center items-center ${isAnswered ? "bg-green-100" : "bg-amber-100"}`}
                >
                  <div
                    className={`justify-start text-xs font-semibold font-['Inter'] leading-none ${isAnswered ? "text-green-600" : "text-amber-600"}`}
                  >
                    {answerText}
                  </div>
                </div>
                <div className="justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-none">
                  접수일: {formatDate(inquiry.createdAt)}
                </div>
              </div>
              {activeTab === "customer" && (
                <div className="flex justify-start items-center gap-2">
                  <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">
                    분류:
                  </div>
                  <div className="h-7 px-3 bg-blue-100 rounded-2xl flex justify-center items-center">
                    <div className="justify-start text-blue-700 text-xs font-semibold font-['Inter'] leading-none">
                      {inquiry.categoryName || "-"}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-3 mt-6">
              <div className="self-stretch justify-start text-gray-900 text-base font-bold font-['Inter'] leading-tight">
                문의자 정보
              </div>
              <div className="self-stretch inline-flex justify-start items-start gap-4">
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-start items-center gap-3">
                    <div className="w-20 justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">
                      이름
                    </div>
                    <div className="justify-start text-gray-900 text-sm font-normal font-['Inter'] leading-none">
                      {inquiry.userName || "-"}
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-3">
                    <div className="w-20 justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">
                      이메일
                    </div>
                    <div className="justify-start text-gray-900 text-sm font-normal font-['Inter'] leading-none">
                      {inquiry.email || "-"}
                    </div>
                  </div>
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-start items-center gap-3">
                    <div className="w-20 justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">
                      연락처
                    </div>
                    <div className="justify-start text-gray-900 text-sm font-normal font-['Inter'] leading-none">
                      {inquiry.phone || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-2 md:h-4" />
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
              <div className="self-stretch justify-start text-gray-900 text-base font-bold font-['Inter'] leading-tight">
                문의 제목
              </div>
              <div className="self-stretch  border border-gray-200 rounded-lg p-4 text-gray-900 text-lg font-['Inter'] leading-snug whitespace-pre-line">
                {inquiry.title}
              </div>
              <div className="self-stretch justify-start text-gray-900 text-base font-bold font-['Inter'] leading-tight">
                문의 내용
              </div>
              <div className="self-stretch h-48 p-4  rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-start items-start">
                <div
                  className="self-stretch justify-start text-gray-700 text-sm font-normal font-['Inter'] leading-tight"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {inquiry.content}
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
              <div className="self-stretch justify-start text-gray-900 text-base font-bold font-['Inter'] leading-tight">
                첨부파일
              </div>
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                {inquiry.fileId ? (
                  <div className="flex-1 h-11 p-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-start items-center gap-3">
                    <div className="w-5 h-5 relative border-gray-500 overflow-hidden">
                      <div className="w-3.5 h-4 left-[3.33px] top-[1.67px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-gray-500" />
                      <div className="w-[5px] h-[5px] left-[11.67px] top-[1.67px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-gray-500" />
                    </div>
                    <div className="flex-1 justify-start text-gray-700 text-sm font-normal font-['Inter'] leading-none">
                      첨부파일이 있습니다
                    </div>
                    <div className="w-4 h-4 relative border-blue-500 overflow-hidden">
                      <div className="w-0 h-2 left-[8px] top-[2px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-blue-500" />
                      <div className="w-3 h-1 left-[2px] top-[10px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-blue-500" />
                      <div className="w-1.5 h-[3.33px] left-[4.67px] top-[6.67px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-blue-500" />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 h-11 p-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-start items-center text-gray-400 text-sm">
                    첨부파일없음
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="self-stretch h-px bg-gray-200" />
          <div className="self-stretch p-6 flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-gray-900 text-base font-bold font-['Inter'] leading-tight">
              관리자 답변
            </div>
            <div className="self-stretch h-48 flex flex-col justify-start items-start gap-3">
              {isAnswered ? (
                // 답변이 있을 때: 카드 형태로 답변 내용만 표시
                <div className="self-stretch h-40 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 flex flex-col justify-start items-start">
                  <div className="self-stretch h-11 px-3 bg-gray-50 border-b border-gray-200 flex flex-row justify-start items-center gap-2">
                    <span className="text-gray-700 text-sm">답변 내용</span>
                  </div>
                  <div className="self-stretch flex-1 p-3 flex flex-col justify-start items-start">
                    <div
                      className="self-stretch w-full h-full text-gray-900 text-sm font-normal font-['Inter'] leading-none"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {answer}
                    </div>
                  </div>
                </div>
              ) : (
                // 답변이 없을 때: 입력폼과 툴바, 답변하기 버튼 표시
                <>
                  <div className="self-stretch h-40 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 flex flex-col justify-start items-start">
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
                  <div className="self-stretch inline-flex justify-end items-center gap-3">
                    <button
                      type="button"
                      className={`w-28 h-10 px-4 rounded-lg flex justify-center items-center text-white text-sm font-semibold font-['Inter'] leading-none ${answer.trim() ? "bg-indigo-600 hover:bg-indigo-800" : "bg-gray-300 cursor-not-allowed"}`}
                      disabled={!answer.trim() || loading}
                      onClick={handleAnswer}
                    >
                      답변하기
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
