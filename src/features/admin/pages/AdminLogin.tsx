import { Fragment } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/shared/utils/login";
import { isValidPhone, isValidPassword } from "@/shared/utils/validation";
import { formatPhoneNumber } from "@/shared/utils/format";

export const AdminLogin = () => {
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loginPhone, setPhone] = useState("");
  const [loginPassword, setPassword] = useState("");
  const navigate = useNavigate();

  // 사용자의 전화번호 입력값을 하이픈 포함 형식으로 자동 포맷하는 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  // 관리자 로그인
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      // 연락처 유효성 검사 (010-1234-5678 형식)
      if(!isValidPhone(loginPhone)) {
        alert("연락처 형식이 올바르지 않습니다. 예: 010-1234-5678");
        phoneRef.current?.focus(); // alert 닫힌 후 포커싱
        return;
      }
      // 비밀번호 유효성 검사 (8~20자, 대/소문자/숫자/특수문자 중 3가지 이상 포함)
      if(!isValidPassword(loginPassword)) {
        alert("비밀번호는 8~20자, 대/소문자/숫자/특수문자 중 3가지 이상 포함하여야 합니다.");
        passwordRef.current?.focus(); // alert 닫힌 후 포커싱
        return;
      }
      await login("ADMIN", loginPhone, loginPassword);
      navigate("/admin");
    } catch (err: any) {
      alert(err.message || "로그인 실패");
    }
  };

  return (
    <Fragment>
      <div className="w-full min-h-screen bg-gray-50 inline-flex justify-center items-center">
        <div
          className="w-[480px] p-12 bg-white rounded-2xl shadow-[0px_4px_24px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-8">
          <div className="self-stretch flex flex-col justify-center items-center gap-4">
            <div className="inline-flex justify-center items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg inline-flex flex-col justify-center items-center">
                <div className="justify-start text-white text-xl font-bold font-['Inter'] leading-normal">H</div>
              </div>
              <div className="justify-start text-gray-900 text-2xl font-bold font-['Inter'] leading-7">HaloCare</div>
            </div>
            <div className="justify-start text-gray-500 text-base font-medium font-['Inter'] leading-tight">관리자 포털</div>
          </div>
          <form className="self-stretch flex flex-col justify-start items-start gap-6" onSubmit={handleLogin}>
            {/* 연락처 입력 */}
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="flex justify-between w-full text-sm font-medium font-['Inter'] leading-none">
                <span className="text-gray-700">연락처</span>
                <p className="text-xs text-gray-400">※ 숫자만 입력하면 하이픈(-)이 자동으로 추가됩니다.</p>
              </div>
              <div className="self-stretch h-11 px-4 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center mt-1">
                <input
                  type="tel"
                  ref={phoneRef}
                  className="w-full justify-start text-gray-400 text-sm font-normal font-['Inter'] leading-none"
                  placeholder="숫자만 입력하세요 (예: 01012345678)"
                  value={loginPhone}
                  onChange={handlePhoneChange}
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="flex justify-between w-full text-sm font-medium font-['Inter'] leading-none">
                <span className="text-gray-700">비밀번호</span>
                <p className="text-xs text-gray-400">※ 8~20자, 대/소문자·숫자·특수문자 중 3가지 이상 포함</p>
              </div>
              <div className="self-stretch h-11 px-4 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center">
                <input
                  type="password"
                  ref={passwordRef}
                  className="w-full justify-start text-gray-400 text-sm font-normal font-['Inter'] leading-none"
                  placeholder="비밀번호를 입력하세요"
                  value={loginPassword}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* 로그인 */}
            <button
              type="submit"
              className="self-stretch h-12 bg-indigo-600 rounded-lg inline-flex justify-center items-center cursor-pointer"
            >
              <div className="justify-start text-white text-base font-semibold font-['Inter'] leading-tight">로그인</div>
            </button>

          </form>
        </div>
      </div>
    </Fragment>
  );
};