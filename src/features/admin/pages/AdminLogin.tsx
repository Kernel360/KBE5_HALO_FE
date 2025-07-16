import { Fragment, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/shared/utils/login";
import { formatPhoneNumber } from "@/shared/utils/format";
import { isValidPhone } from "@/shared/utils/validation";
import { Card } from "@/shared/components/ui/Card";
import { CardContent } from "@/shared/components/ui/CardContent";
import { Button } from "@/shared/components/ui/Button";
import ErrorToast from "@/shared/components/ui/toast/ErrorToast";
import FormField from "@/shared/components/ui/FormField";

// 개선된 로그인 카드 공통 컴포넌트
const LoginCard = ({
  loginPhone,
  loginPassword,
  setPassword,
  handlePhoneChange,
  handleLogin,
  errors,
}: {
  phoneRef: React.RefObject<HTMLInputElement | null>;
  passwordRef: React.RefObject<HTMLInputElement | null>;
  loginPhone: string;
  loginPassword: string;
  setPassword: (v: string) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: (e?: React.FormEvent) => void;
  errors: { phone?: string; password?: string };
}) => (
  <Card variant="login" className="w-[480px] p-0 flex flex-col gap-0">
    {/* 상단 영역 - gradient 배경, 하단은 흰색 */}
    <div className="pt-10 pb-6 border-b border-gray-100 bg-gradient-to-b from-indigo-50 to-white rounded-t-2xl flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <span className="text-indigo-700 text-2xl font-bold">HaloCare</span>
        <span className="text-gray-500 text-lg font-semibold tracking-wide">
          관리자 포털
        </span>
      </div>
      <div className="text-gray-400 text-xs mt-1">
        HaloCare 운영을 위한 관리자 전용 공간입니다.
      </div>
    </div>
    {/* 폼 영역 */}
    <CardContent className="flex flex-col gap-7 p-10 bg-white rounded-b-2xl">
      <form className="flex flex-col gap-7" onSubmit={handleLogin}>
        {/* 연락처 */}
        <FormField
          label="연락처"
          name="admin-login-phone"
          type="tel"
          value={loginPhone}
          onChange={handlePhoneChange}
          placeholder="숫자만 입력하세요 (예: 01012345678)"
          required
          error={errors.phone}
        />
        {/* 비밀번호 */}
        <FormField
          label="비밀번호"
          name="admin-login-password"
          type="password"
          value={loginPassword}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          required
          error={errors.password}
        />
        {/* 로그인 버튼 */}
        <Button
          type="submit"
          className="w-full h-12 bg-indigo-600 rounded-lg text-white text-lg font-bold shadow hover:bg-indigo-700 transition"
        >
          로그인
        </Button>
      </form>
      {/* 안내 문구 */}
      <div className="text-center text-gray-400 text-xs mt-2">
        관리자 계정이 없으신가요?
        <br />
        담당자에게 문의하세요.
      </div>
    </CardContent>
  </Card>
);

export const AdminLogin = () => {
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loginPhone, setPhone] = useState("");
  const [loginPassword, setPassword] = useState("");
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const [openFeatureIndex, setOpenFeatureIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>(
    {},
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 기능별 세부 설명
  const featureDetails = [
    "💡 관리자 계정을 추가/수정/삭제하고, 권한을 부여하거나 회수할 수 있습니다.",
    "💡 고객과 매니저의 상세 정보, 계약 현황, 평가, 예약 내역을 한눈에 관리할 수 있습니다.",
    "💡 고객 문의에 답변하고, 예약 내역, 배너, 공지/이벤트 게시글을 효율적으로 관리할 수 있습니다.",
  ];

  // 팝오버 바깥 클릭 시 닫힘 처리
  useEffect(() => {
    if (openFeatureIndex === null) return;
    const handleClick = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setOpenFeatureIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openFeatureIndex]);

  // 사용자의 전화번호 입력값을 하이픈 포함 형식으로 자동 포맷하는 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
    setErrors((prev) => ({ ...prev, phone: undefined }));
  };

  // 관리자 로그인
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // 유효성 검사
    const newErrors: { phone?: string; password?: string } = {};
    if (!isValidPhone(loginPhone)) {
      newErrors.phone = "연락처 형식이 올바르지 않습니다. 예: 010-1234-5678";
    }
    if (!loginPassword.trim()) {
      newErrors.password = "비밀번호를 입력하세요.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      await login("ADMIN", loginPhone, loginPassword);
      navigate("/admin");
    } catch (err: any) {
      setToast({ open: true, message: err.message || "로그인 실패" });
    }
  };

  return (
    <Fragment>
      <div className="w-full min-h-screen bg-gray-50 flex justify-center items-center px-2 py-8">
        <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-12 items-center w-full max-w-4xl">
          {/* 관리자 기능 소개 카드 - 디자인 개선 + 팝오버 */}
          <Card
            ref={cardRef}
            className="w-full max-w-xs md:max-w-[400px] mt-6 md:mt-0 p-0 bg-gradient-to-br from-indigo-50 via-white to-white rounded-2xl shadow flex flex-col gap-0 border border-indigo-100"
          >
            <div className="flex flex-col gap-2 px-6 md:px-10 pt-8 md:pt-10 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 flex items-center justify-center bg-indigo-100 rounded-full text-indigo-600 text-xl font-bold">
                  ★
                </span>
                <span className="text-indigo-700 text-lg md:text-xl font-extrabold font-['Inter'] tracking-tight">
                  HALO 관리자 주요 기능
                </span>
              </div>
              <div className="text-gray-600 text-sm md:text-base font-semibold font-['Inter'] mt-1">
                무엇을 할 수 있나요?
              </div>
            </div>
            <CardContent className="flex flex-col gap-3 p-4 md:p-8 pt-2">
              {[
                {
                  title: "관리자 계정 관리",
                  desc: "계정 추가, 수정, 삭제 및 권한 관리",
                },
                {
                  title: "고객/매니저 정보 관리",
                  desc: "고객·매니저 정보, 계약, 평가, 예약 현황 관리",
                },
                {
                  title: "문의/예약/배너/공지 관리",
                  desc: "문의, 예약, 배너, 공지/이벤트 게시글 관리",
                },
              ].map((item, idx) => (
                <div
                  key={item.title}
                  className="relative flex items-center gap-3 group rounded-lg transition bg-indigo-50/0 hover:bg-indigo-50 cursor-pointer px-2 md:px-3 py-2"
                  onClick={() =>
                    setOpenFeatureIndex(openFeatureIndex === idx ? null : idx)
                  }
                >
                  <span className="w-8 h-8 flex items-center justify-center bg-indigo-100 rounded-full text-indigo-600 text-lg font-bold">
                    {["①", "②", "③"][idx]}
                  </span>
                  <div>
                    <div className="text-gray-900 font-bold text-base md:text-base">
                      {item.title}
                    </div>
                    <div className="text-gray-500 text-xs md:text-sm">
                      {item.desc}
                    </div>
                  </div>
                  {/* 팝오버 말풍선 */}
                  {openFeatureIndex === idx && (
                    <div
                      className={`absolute z-20 w-[90vw] max-w-xs left-1/2 -translate-x-1/2 top-full mt-2
                        md:left-full md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:ml-4 md:mt-0`}
                    >
                      <div className="relative bg-white border border-indigo-200 rounded-lg shadow-lg px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 w-full animate-fade-in">
                        {/* 꼬리(삼각형) */}
                        <div
                          className={`absolute left-1/2 -translate-x-1/2 -top-2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white border-t-0
                            md:left-[-8px] md:top-1/2 md:-translate-x-0 md:-translate-y-1/2
                            md:border-x-8 md:border-x-transparent md:border-y-8 md:border-y-transparent md:border-r-8 md:border-r-white md:border-l-0 md:border-b-0`}
                        ></div>
                        {featureDetails[idx]}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
          {/* 개선된 로그인 카드 */}
          <LoginCard
            phoneRef={phoneRef}
            passwordRef={passwordRef}
            loginPhone={loginPhone}
            loginPassword={loginPassword}
            setPassword={setPassword}
            handlePhoneChange={handlePhoneChange}
            handleLogin={handleLogin}
            errors={errors}
          />
        </div>
        <ErrorToast
          open={toast.open}
          message={toast.message}
          onClose={() => setToast({ open: false, message: "" })}
        />
      </div>
    </Fragment>
  );
};
