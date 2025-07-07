import { Fragment, useEffect, useState } from "react";
import { getCustomerInquiryCategories, createCustomerInquiry, updateCustomerInquiry } from "@/features/customer/api/CustomerInquiries";
import { useLocation, useNavigate } from "react-router-dom";
import { FileUploadSection } from "@/shared/components/FileUploadSection";
import { isValidLength } from "@/shared/utils/validation";
import type { InquiryCategory, InquiryDetail } from "@/shared/types/InquiryType";
import { useAuthStore } from "@/store/useAuthStore";

export const CustomerInquiryForm = () => {
  const location = useLocation();
  const existingData = location.state?.inquiry as InquiryDetail | undefined;
  const isEditMode = !!existingData;

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileId, setFileId] = useState<number | undefined>();
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<InquiryCategory[]>([]);
  const navigate = useNavigate();

  // 카테고리 조회 (한 번만 실행)
  useEffect(() => {
    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/auth/login");
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await getCustomerInquiryCategories();
        if (res?.body) {
          setCategories(res.body);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "카테고리 조회에 실패했습니다.";
        alert(errorMessage);
      }
    };

    fetchCategories();
  }, [navigate]);

  // 편집 모드 초기화 (카테고리가 로드된 후 실행)
  useEffect(() => {
    if (isEditMode && existingData && categories.length > 0) {
      // Find the category code that matches the category name
      const matchingCategory = categories.find(cat => cat.label === existingData.categoryName);
      setCategory(matchingCategory?.code || "");
      setTitle(existingData.title);
      setContent(existingData.content);
      setFileId(existingData.fileId ?? undefined);
      setFiles([]);
    }
  }, [isEditMode, existingData, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/auth/login");
      return;
    }

    if (!isValidLength(title, 2, 50)) {
      alert("제목은 2자 이상, 50자 이하로 입력해주세요.");
      return;
    }

    if (!isValidLength(content, 5, 1000)) {
      alert("내용은 5자 이상, 1000자 이하로 입력해주세요.");
      return;
    }

    // TODO: S3 업로드 후 받은 실제 fileId와 filePaths로 대체 필요
    setFileId(1);
    const filePaths = files.map(file => URL.createObjectURL(file));

    try {
      if (isEditMode && existingData) {
        await updateCustomerInquiry(existingData.inquiryId, { 
          category,
          title,
          content, 
          fileId, 
          filePaths 
        });
        alert("문의가 수정되었습니다.");
        navigate(`/my/inquiries/${existingData.inquiryId}`);
      } else {
        const result = await createCustomerInquiry({ 
          category,
          title, 
          content, 
          fileId, 
          filePaths 
        });
        alert("문의가 등록되었습니다.");
        navigate(`/my/inquiries/${result}`);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || (isEditMode ? "수정 중 오류가 발생했습니다." : "등록 중 오류가 발생했습니다.");
      alert(errorMessage);
    }
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-white rounded-xl flex flex-col gap-6">
        {/* 상단 헤더 */}
        <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
          <div className="text-gray-900 text-xl font-bold font-['Inter'] leading-normal">
            {isEditMode ? "문의사항 수정" : "문의사항 등록"}
          </div>
        </div>

        {/* 본문 */}
        <div className="self-stretch p-6 inline-flex flex-col justify-start items-start gap-6">
          <div className="self-stretch bg-white rounded-xl  flex flex-col justify-start items-start gap-6">

            {/* 문의유형 */}
            <div className="self-stretch flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">문의유형 *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 text-slate-700 text-sm"
                required
              >
                <option value="">문의유형을 선택하세요</option>
                {categories.map((cat) => (
                  <option key={cat.code} value={cat.code}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 제목 */}
            <div className="self-stretch flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">제목 *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="문의 제목을 입력하세요"
                className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 text-slate-700 text-sm placeholder:text-slate-400"
                required
              />
            </div>

            {/* 내용 */}
            <div className="self-stretch flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">내용 *</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="문의 내용을 상세히 작성해주세요"
                rows={10}
                className="self-stretch p-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 text-slate-700 text-sm placeholder:text-slate-400 resize-none"
                required
              />
            </div>

            {/* 첨부파일 */}
            <FileUploadSection files={files} setFiles={setFiles} multiple={true} isRequired={false}/>

            {/* 기존 첨부파일명 보여주기 (선택사항) */}
            {/* {isEditMode && existingData.fileName && (
              <div className="text-slate-500 text-sm">
                기존 첨부파일: <span className="text-slate-700 font-medium">{existingData.fileName}</span>
              </div>
            )} */}

            {/* 안내사항 */}
            <div className="self-stretch p-4 bg-gray-50 rounded-lg flex flex-col gap-2">
              <div className="text-slate-700 text-sm font-semibold font-['Inter'] leading-none">안내사항</div>
              <div className="text-slate-500 text-sm">• 서비스 이용 중 긴급한 문제는 고객센터(1234-5678)로 연락해주세요.</div>
              <div className="text-slate-500 text-sm">• 욕설, 비방, 광고 등의 내용이 포함된 문의는 답변이 제한될 수 있습니다.</div>
            </div>

            {/* 등록/수정/취소 버튼 그룹 */}
            <div className="self-stretch flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-[25%] h-12 border border-gray-300 bg-white rounded-lg text-gray-600 text-sm font-semibold hover:bg-gray-100"
              >
                취소
              </button>
              <button
                type="submit"
                className="w-[75%] h-12 bg-indigo-600 rounded-lg inline-flex justify-center items-center gap-2 cursor-pointer hover:bg-indigo-700"
              >
                <span className="material-symbols-outlined text-white">{isEditMode ? "edit" : "add"}</span>
                <span className="text-white text-base font-semibold font-['Inter'] leading-tight">
                  {isEditMode ? "수정하기" : "등록하기"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};
