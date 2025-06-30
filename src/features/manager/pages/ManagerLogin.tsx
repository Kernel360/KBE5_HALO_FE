import { Fragment } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/shared/utils/login";
import { isValidPhone, isValidPassword } from "@/shared/utils/validation";
import { formatPhoneNumber } from "@/shared/utils/format";
import { useUserStore } from "@/store/useUserStore";

export const ManagerLogin = () => {
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loginPhone, setPhone] = useState("");
  const [loginPassword, setPassword] = useState("");
  const navigate = useNavigate();

  // 사용자의 전화번호 입력값을 하이픈 포함 형식으로 자동 포맷하는 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  // 매니저 로그인
  const handleLogin = async () => {
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
      await login("MANAGER", loginPhone, loginPassword);
      const status = useUserStore.getState().status;
      switch(status) {
        case "ACTIVE":               // 활성
        case "TERMINATION_PENDING":  // 계약해지요청
          navigate("/managers"); // 대시보드로 이동
          break;
        default:
          navigate("/managers/my");  // 마이페이지로 이동
          break;
      }
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
            <div className="justify-start text-gray-500 text-base font-medium font-['Inter'] leading-tight">매니저 포털</div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-6">
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

            {/* 아이디 찾기, 비밀번호 찾기 */}
            {/* <div className="w-full flex justify-center gap-2 text-sm font-medium">
              <Link to="/managers/auth/recovery-id" className="text-indigo-600 hover:underline">
                아이디 찾기
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/managers/auth/recovery-pwd" className="text-indigo-600 hover:underline">
                비밀번호 찾기
              </Link>
            </div> */}

            {/* 로그인 */}
            <button
              className="self-stretch h-12 bg-indigo-600 rounded-lg inline-flex justify-center items-center cursor-pointer"
              onClick={handleLogin}
            >
              <div className="justify-start text-white text-base font-semibold font-['Inter'] leading-tight">로그인</div>
            </button>

            {/* <div className="self-stretch inline-flex justify-center items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="justify-start text-gray-400 text-sm font-normal font-['Inter'] leading-none">또는</div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch h-12 px-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-center items-center gap-3">
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google Logo"
                  className="w-5 h-5 mr-2"
                />
                <div className="justify-start text-zinc-800 text-base font-medium font-['Inter'] leading-tight">Google로 로그인</div>
              </div>
            </div> */}

            <div className="self-stretch inline-flex justify-center items-center gap-2">
              <div className="justify-start text-stone-500 text-base font-normal font-['Inter'] leading-tight">아직 계정이 없으신가요?</div>
              <Link to="/managers/auth/signup" className="justify-start text-indigo-600 text-base font-semibold font-['Inter'] leading-tight">
                회원가입
              </Link>
            </div>

          </div>
        </div>
      </div>
    </Fragment>
  );
};