import { useRef, useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/shared/utils/login";
import { isValidPhone, isValidPassword } from "@/shared/utils/validation";
import { Eye, EyeOff } from 'lucide-react';
import { formatPhoneNumber } from "@/shared/utils/format";

export const CustomerLogin = () => {
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loginPhone, setPhone] = useState("");
  const [loginPassword, setPassword] = useState("");
  const navigate = useNavigate();

  // 사용자의 전화번호 입력값을 하이픈 포함 형식으로 자동 포맷하는 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  const [showPassword, setShowPassword] = useState(false);

  // 수요자 로그인
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
      await login("CUSTOMER", loginPhone, loginPassword);
      navigate("/");
    } catch (err: any) {
      alert(err.message || "로그인 실패");
    }
  };

  return (
    <Fragment>
      <div className="w-full h-screen bg-slate-100 flex justify-center items-center">
        <div className="w-[480px] p-10 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)] outline outline-1 outline-offset-[-1px] outline-zinc-100 flex flex-col justify-start items-start gap-8">
          <div className="self-stretch flex flex-col justify-center items-center gap-2">
            <div className="justify-start text-zinc-800 text-3xl font-bold font-['Inter'] leading-loose">로그인</div>
            <div className="justify-start text-stone-500 text-base font-normal font-['Inter'] leading-tight">HaloCare 서비스를 이용하려면 로그인해주세요</div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            {/* <div className="self-stretch p-3 bg-red-50 rounded-lg inline-flex justify-start items-center gap-3">
              <div className="w-5 h-5 relative overflow-hidden">
                <div className="w-5 h-5 left-0 top-0 absolute bg-red-100" />
                <div className="w-0 h-2 left-[10px] top-[6px] absolute bg-black outline outline-2 outline-offset-[-1px] outline-red-500" />
              </div>
              <div className="flex-1 justify-start text-red-500 text-sm font-normal font-['Inter'] leading-none">이메일 또는 비밀번호가 올바르지 않습니다.</div>
            </div> */}
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
                  className="w-full justify-start text-gray-400 text-sm font-normal font-['Inter'] leading-none focus:outline-none"
                  placeholder="숫자만 입력하세요 (예: 01012345678)"
                  value={loginPhone}
                  onChange={handlePhoneChange}
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="self-stretch flex flex-col justify-start items-start gap-2 relative">
              <div className="flex justify-between w-full text-sm font-medium font-['Inter'] leading-none">
                <span className="text-gray-700">비밀번호</span>
                <p className="text-xs text-gray-400">※ 8~20자, 대/소문자·숫자·특수문자 중 3가지 이상 포함</p>
              </div>
              <div className="self-stretch h-11 px-4 bg-gray-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center">
                <input
                  ref={passwordRef}
                  className="w-full justify-start text-gray-400 text-sm font-normal font-['Inter'] leading-none focus:outline-none"
                  placeholder="비밀번호를 입력하세요"
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => { // 이 부분을 추가합니다.
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                />
                <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-3 top-9">
            {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
          </button>
              </div>
            </div>


            {/* 아이디 찾기, 비밀번호 찾기 */}
            {/*<div className="w-full flex justify-center gap-2 text-sm font-medium">
              <Link to="/auth/recovery-id" className="text-indigo-600 hover:underline">
                아이디 찾기
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/auth/recovery-pwd" className="text-indigo-600 hover:underline">
                비밀번호 찾기
              </Link>
            </div>
*/}
            {/* 로그인 */}
            <button
              className="self-stretch h-12 bg-indigo-600 rounded-lg flex flex-col justify-center items-center cursor-pointer"
              onClick={handleLogin}
            >
              <div className="justify-start text-white text-base font-semibold font-['Inter'] leading-tight">로그인</div>
            </button>
            <div className="self-stretch inline-flex justify-center items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="justify-start text-gray-400 text-sm font-normal font-['Inter'] leading-none">또는</div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {/* 구글 로그인
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch h-12 px-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-center items-center gap-3">
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google Logo"
                  className="w-5 h-5 mr-2"
                />
                <div className="justify-start text-zinc-800 text-base font-medium font-['Inter'] leading-tight">Google로 로그인</div>
              </div>
            </div>
              */}
          </div>
          <div className="self-stretch inline-flex justify-center items-center gap-2">
            <div className="justify-start text-stone-500 text-base font-normal font-['Inter'] leading-tight">아직 계정이 없으신가요?</div>
            <Link to="/auth/signup" className="justify-start text-indigo-600 text-base font-semibold font-['Inter'] leading-tight">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};