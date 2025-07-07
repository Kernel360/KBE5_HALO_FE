import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  signupAdmin,
  updateAdminAccount,
} from "@/features/admin/api/adminAuth";
import type { createAdminSignup } from "@/features/admin/types/AdminAuthType";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import FormField from "@/shared/components/ui/FormField";
import Toast from "@/shared/components/ui/toast/Toast";
import SuccessToast from "@/shared/components/ui/toast/SuccessToast";

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!isEditMode && !form.userName.trim())
      newErrors.userName = "이름을 입력하세요.";
    if (!form.email.trim()) {
      newErrors.email = "이메일을 입력하세요.";
    } else {
      // 이메일 유효성 검사
      const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "유효한 이메일 주소를 입력하세요.";
      }
    }
    if (!isEditMode && !(form.password ?? "").trim())
      newErrors.password = "비밀번호를 입력하세요.";
    if (!isEditMode && !form.phone.trim()) {
      newErrors.phone = "전화번호를 입력하세요.";
    } else if (!isEditMode && form.phone) {
      // 전화번호 유효성 검사 (010-1234-5678 또는 01012345678)
      const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
      if (
        !phoneRegex.test(form.phone.replace(/-/g, "")) &&
        !phoneRegex.test(form.phone)
      ) {
        newErrors.phone = "유효한 전화번호를 입력하세요. (예: 010-1234-5678)";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEditMode && name !== "email") return;
    if (name === "phone") {
      setForm((prev) => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEditMode && adminId) {
        // 이름, 전화번호는 수정 불가이므로 기존 값 사용, 이메일은 입력값, 비밀번호는 입력값이 있으면 포함
        const updateData: createAdminSignup = {
          userName: form.userName,
          phone: form.phone,
          email: form.email,
        };
        if (form.password && form.password.trim()) {
          updateData.password = form.password;
        }
        await updateAdminAccount(adminId, updateData);
        setSuccessToastMsg("관리자 정보가 수정되었습니다.");
      } else {
        await signupAdmin(form);
        setSuccessToastMsg("관리자 등록이 완료되었습니다.");
      }
      setTimeout(() => navigate("/admin/accounts"), 1200);
    } catch (err: any) {
      setToastMsg(
        err?.message ||
          err?.toString() ||
          (isEditMode ? "관리자 수정 실패" : "관리자 등록 실패"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-none flex flex-col md:flex-row md:items-center md:justify-center items-center justify-center bg-gray-50 px-2 md:px-16 gap-8">
      <Toast
        open={!!toastMsg}
        message={toastMsg || ""}
        onClose={() => setToastMsg(null)}
      />
      <SuccessToast
        open={!!successToastMsg}
        message={successToastMsg || ""}
        onClose={() => setSuccessToastMsg(null)}
      />
      {/* 안내/주의사항 카드 */}
      <Card className="w-full max-w-md mb-8 md:mb-0 p-8" variant="login">
        <h3 className="text-lg font-bold text-indigo-700 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-500">
            info
          </span>
          {isEditMode ? "관리자 계정 수정 안내" : "관리자 계정 등록 안내"}
        </h3>
        {isEditMode ? (
          <ul className="text-sm text-gray-700 list-disc pl-4 space-y-2">
            <li>
              관리자 계정의 <b>이메일만 수정</b>할 수 있습니다.
            </li>
            <li>이름, 전화번호는 수정이 제한됩니다.</li>
            <li>
              비밀번호 변경이 필요할 경우, 별도의 절차를 통해 진행해 주세요.
            </li>
            <li>수정 후 반드시 변경된 정보를 확인해 주세요.</li>
          </ul>
        ) : (
          <ul className="text-sm text-gray-700 list-disc pl-4 space-y-2">
            <li>
              관리자 계정은 서비스 운영 및 관리 권한을 가지므로 신중히 등록해
              주세요.
            </li>
            <li>이메일은 로그인 ID로 사용되며, 중복 등록이 불가합니다.</li>
            <li>
              비밀번호는 8자 이상, 영문/숫자/특수문자를 조합해 설정해 주세요.
            </li>
            <li>전화번호는 정확히 입력해 주세요. (예: 010-1234-5678)</li>
            <li>계정 정보는 등록 후 수정이 제한될 수 있습니다.</li>
            <li>권한이 없는 사용자의 계정 등록을 방지해 주세요.</li>
          </ul>
        )}
      </Card>
      {/* 등록/수정 폼 카드 */}
      <Card className="w-full max-w-md p-8" variant="login">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "관리자 계정 수정" : "관리자 계정 등록"}
          </h2>
        </div>
        {!isEditMode && (
          <p className="text-sm text-gray-500 mb-6">
            필수 정보를 입력해 주세요.
          </p>
        )}
        <form onSubmit={handleSubmit} autoComplete="off">
          {!isEditMode && (
            <>
              <FormField
                label="이름"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                placeholder="예) 홍길동"
                required
                error={errors.userName}
              />
              <FormField
                label="전화번호"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="예) 010-1234-5678"
                required
                error={errors.phone}
              />
            </>
          )}
          <FormField
            label="이메일"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="예) admin@email.com"
            required
            error={errors.email}
          />
          <FormField
            label="비밀번호"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder={
              isEditMode
                ? "비밀번호를 변경하려면 입력하세요"
                : "비밀번호를 입력하세요"
            }
            autoComplete="new-password"
            disabled={isEditMode}
            error={errors.password}
            required={!isEditMode}
          />
          <div className="flex gap-2 mt-8">
            <Button
              type="button"
              className="w-1/2 h-12 border border-gray-300 text-gray-600 bg-white hover:bg-gray-100 font-semibold rounded-xl shadow transition text-base active:scale-95"
              onClick={() => navigate("/admin/accounts")}
            >
              취소
            </Button>
            <Button
              type="submit"
              className={`w-1/2 h-12 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition flex justify-center items-center gap-2 text-base active:scale-95 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : (
                <span className="material-symbols-outlined text-white">
                  {isEditMode ? "edit" : "add"}
                </span>
              )}
              <span className="text-white text-base font-semibold">
                {isEditMode ? "관리자 수정하기" : "관리자 등록하기"}
              </span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
