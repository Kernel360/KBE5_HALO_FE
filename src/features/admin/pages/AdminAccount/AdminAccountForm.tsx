import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { signupAdmin, updateAdminAccount } from "@/features/admin/api/adminAuth";
import type { createAdminSignup } from "@/features/admin/types/AdminAuthType";

// 전화번호 자동 하이픈 포맷 함수
function formatPhoneNumber(value: string) {
  const numbersOnly = value.replace(/\D/g, "");
  if (numbersOnly.length < 4) return numbersOnly;
  if (numbersOnly.length < 7) {
    return numbersOnly.replace(/(\d{3})(\d{1,3})/, "$1-$2");
  }
  if (numbersOnly.length < 11) {
    return numbersOnly.replace(/(\d{3})(\d{3})(\d{1,4})/, "$1-$2-$3");
  }
  return numbersOnly.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3");
}

export const AdminAccountForm = () => {
  const { adminId } = useParams();
  const isEditMode = !!adminId;
  const location = useLocation();
  const adminData = location.state;
  const [form, setForm] = useState<createAdminSignup>({
    userName: isEditMode && adminData?.userName ? adminData.userName : "",
    email: isEditMode && adminData?.email ? adminData.email : "",
    password: "",
    phone: isEditMode && adminData?.phone ? adminData.phone : "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // 수정 모드에서는 email만 변경 가능
    if (isEditMode && name !== "email") return;
    if (name === "phone") {
      setForm((prev) => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 필수값 체크
    if (!form.userName.trim()) return alert("이름을 입력하세요.");
    if (!form.email.trim()) return alert("이메일을 입력하세요.");
    if (!isEditMode && !(form.password ?? "").trim()) return alert("비밀번호를 입력하세요.");
    if (!form.phone.trim()) return alert("전화번호를 입력하세요.");
    try {
      if (isEditMode && adminId) {
        // 이메일만 업데이트
        const updateData = { email: form.email };
        await updateAdminAccount(adminId, updateData as any);
        alert("관리자 정보가 수정되었습니다.");
      } else {
        await signupAdmin(form);
        alert("관리자 등록이 완료되었습니다.");
      }
      navigate("/admin/accounts");
    } catch (err: any) {
      alert(err.message || (isEditMode ? "관리자 수정 실패" : "관리자 등록 실패"));
    }
  };

  return (
    <Fragment>
      <form 
        onSubmit={handleSubmit} 
        className="flex-1 self-stretch h-[968px] inline-flex flex-col justify-start items-start">
        <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start">
          <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
            <div className="justify-start text-gray-900 text-xl font-bold font-['Inter'] leading-normal">
              {isEditMode ? "관리자 계정 수정" : "관리자 계정 등록"}
            </div>
            <Link 
              to="/admin/accounts"
              className="h-10 px-4 flex justify-center items-center border rounded-md text-sm text-gray-500 hover:bg-gray-100">목록으로</Link>
          </div>
          <div className="self-stretch flex-1 p-6 flex flex-col justify-start items-start gap-6">
            <div className="self-stretch p-6 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <label className="self-stretch inline-flex justify-start items-center gap-1">
                  <span className="text-gray-700 text-sm font-medium">이름</span>
                  <span className="text-red-500 text-sm font-medium">*</span>
                </label>
                <input type="text" name="userName" value={form.userName} onChange={handleChange} className={`self-stretch h-11 px-4 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 text-gray-900 text-sm bg-gray-50 ${isEditMode ? 'bg-gray-100 !text-gray-300 cursor-not-allowed' : ''}`} placeholder="이름을 입력하세요" disabled={isEditMode} />
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <label className="self-stretch inline-flex justify-start items-center gap-1">
                  <span className="text-gray-700 text-sm font-medium">전화번호</span>
                  <span className="text-red-500 text-sm font-medium">*</span>
                </label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={`self-stretch h-11 px-4 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 text-gray-900 text-sm bg-gray-50 ${isEditMode ? 'bg-gray-100 !text-gray-300 cursor-not-allowed' : ''}`} placeholder="전화번호를 입력하세요" disabled={isEditMode} />
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <label className="self-stretch inline-flex justify-start items-center gap-1">
                  <span className="text-gray-700 text-sm font-medium">이메일</span>
                  <span className="text-red-500 text-sm font-medium">*</span>
                </label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="self-stretch h-11 px-4 bg-gray-50 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 text-gray-900 text-sm" placeholder="이메일 주소를 입력하세요" disabled={false} />
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <label className="self-stretch inline-flex justify-start items-center gap-1">
                  <span className="text-gray-700 text-sm font-medium">비밀번호</span>
                  <span className="text-red-500 text-sm font-medium">{isEditMode ? "(변경 시에만 입력)" : "*"}</span>
                </label>
                <input type="password" name="password" value={form.password} onChange={handleChange} className={`self-stretch h-11 px-4 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 text-gray-900 text-sm bg-gray-50 ${isEditMode ? 'bg-gray-100 !text-gray-300 cursor-not-allowed' : ''}`} placeholder={isEditMode ? "비밀번호를 변경하려면 입력하세요" : "비밀번호를 입력하세요"} autoComplete="new-password" disabled={isEditMode} />
              </div>
              {/* 등록/수정 버튼 */}
              <button
                type="submit"
                className="self-stretch h-12 bg-indigo-600 rounded-lg inline-flex justify-center items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-white">{isEditMode ? "edit" : "add"}</span>
                <span className="text-white text-base font-semibold font-['Inter'] leading-tight">
                  {isEditMode ? "관리자 수정하기" : "관리자 등록하기"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};
