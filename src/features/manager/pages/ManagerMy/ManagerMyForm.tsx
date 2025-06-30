import AddressSearch from "@/shared/components/AddressSearch";
import { FileUploadSection } from "@/shared/components/FileUploadSection";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { useAddressStore } from "@/store/useAddressStore";
import type { ManagerInfo } from "@/features/manager/types/ManagerMyType";
import { getManager, updateManager } from "@/features/manager/api/managerMy";
import { isValidEmail, isValidPassword } from "@/shared/utils/validation";

// form 상태에 사용할 타입 확장 (기본 필드 + 비밀번호 확인 + 약관 동의)
interface ManagerUpdateForm extends ManagerInfo {
  password: string;
  confirmPassword: string;
}

// 요일, 시간대 정의 (업무 가능 시간표용)
const days = ["월", "화", "수", "목", "금", "토", "일"];
const hours = Array.from({ length: 16 }, (_, i) => `${(i + 8).toString().padStart(2, "0")}시`);

export const ManagerMyForm = () => {
  const navigate = useNavigate();
  
  // 파일 업로드 상태
  const [files, setFiles] = useState<File[]>([]);

  // 업무 가능 시간 (요일-시간 Set)
  const [selectedTimes, setSelectedTimes] = useState<Record<string, Set<string>>>({});

  // 주소 정보 상태 (Zustand에서 관리)
  const { roadAddress, latitude, longitude, detailAddress } = useAddressStore();

  // form 입력 상태 초기값
  const [form, setForm] = useState<ManagerUpdateForm | null>(null);

  useEffect(() => {
    const fetchManagerInfo = async () => {
      const data = await getManager();
      useAddressStore.getState().setAddress(data.roadAddress, data.latitude, data.longitude, data.detailAddress);

      setForm({
        ...data,
        password: "",
        confirmPassword: "",
        availableTimes: data.availableTimes || [],
      });

      const dayMap: Record<string, string> = {
        MONDAY: "월",
        TUESDAY: "화",
        WEDNESDAY: "수",
        THURSDAY: "목",
        FRIDAY: "금",
        SATURDAY: "토",
        SUNDAY: "일",
      };

      const initSelectedTimes: Record<string, Set<string>> = {};
      for (const { dayOfWeek, time } of data.availableTimes || []) {
        const hour = `${time.slice(0, 2)}시`;
        const korDay = dayMap[dayOfWeek]; // 영어 요일을 한글로 변환

        if (!korDay) continue; // 매핑 실패한 경우 무시

        if (!initSelectedTimes[korDay]) initSelectedTimes[korDay] = new Set();
        initSelectedTimes[korDay].add(hour);
      }
      setSelectedTimes(initSelectedTimes);
    };
    fetchManagerInfo();
  }, []);

  // 주소 정보가 바뀔 때 form에도 자동 반영
  useEffect(() => {
    if (latitude == null || longitude == null) return;

    setForm((prev) => {
      if (!prev) return prev;

      const isSame =
        prev.roadAddress === roadAddress &&
        prev.latitude === latitude &&
        prev.longitude === longitude &&
        prev.detailAddress === detailAddress;

      if (isSame) return prev; // 값이 같으면 업데이트 안 함

      return {
        ...prev,
        latitude,
        longitude,
        roadAddress,
        detailAddress,
      };
    });
  }, [roadAddress, latitude, longitude, detailAddress]);

  // 업무 가능 시간 선택/해제 토글
  const toggleTimeSlot = (day: string, hour: string) => {
  setSelectedTimes((prev) => {
    const updated = { ...prev };
    const currentSet = new Set(updated[day] || []);
    currentSet.has(hour) ? currentSet.delete(hour) : currentSet.add(hour);
    updated[day] = currentSet;

    const newAvailableTimes = Object.entries(updated).flatMap(([korDay, hours]) =>
      Array.from(hours).map((h) => ({
        dayOfWeek: convertToEnum(korDay),
        time: h.replace("시", ":00"),
      }))
    );

    setForm((prev): ManagerUpdateForm | null => {
      if (!prev) return null;
      return {
        ...prev,
        availableTimes: newAvailableTimes,
      };
    });

    return updated;
  });
};

  // 모든 선택된 시간 초기화
  const clearAllSelectedTimes = () => setSelectedTimes({});

  // 선택된 시간 텍스트 포맷 (예: "월요일: 09시, 10시")
  const formatSelectedTimeText = (day: string, hours: Set<string>) => {
    const sorted = Array.from(hours).sort();
    return `${day}요일: ${sorted.join(", ")}`;
  };

  // 한글 요일 → 영문 ENUM 매핑
  const convertToEnum = (dayKor: string): string => {
    switch (dayKor) {
      case "월": return "MONDAY";
      case "화": return "TUESDAY";
      case "수": return "WEDNESDAY";
      case "목": return "THURSDAY";
      case "금": return "FRIDAY";
      case "토": return "SATURDAY";
      case "일": return "SUNDAY";
      default: return "";
    }
  };

  // 필수 입력 필드
  const requiredFields = [
    { name: "email", label: "이메일"},
    { name: "password", label: "비밀번호"},
    { name: "confirmPassword", label: "비밀번호 확인"},
    { name: "bio", label: "한줄소개"},
  ];

  // 필수 입력 validate
  const validateRequiredFields = () => {
    if (!form) return;

    for (const field of requiredFields) {
      const key = field.name as keyof ManagerUpdateForm;
      const value = form[key];

      // 문자열인 경우: 공백 제거하고 비어있으면 invalid
      if (typeof value === "string" && value.trim() === "") {
        alert(`${field.label}을(를) 입력해주세요.`);
        return false;
      }

      // null 또는 undefined 체크
      if (value === null || value === undefined) {
        alert(`${field.label}을(를) 입력해주세요.`);
        return false;
      }
    }
    return true;
  };

  // 추가 필수 입력 validate
  const validateExtraFields = () => {
    if (!form) return;
    if (!form.roadAddress.trim()) {
      alert("도로명 주소를 입력해주세요.");
      return;
    }
    if (!form.detailAddress.trim()) {
      alert("상세 주소를 입력해주세요.");
      return;
    }
    if (  form.latitude == null || isNaN(form.latitude) ||
          form.longitude == null || isNaN(form.longitude) ) 
    {
      alert("잘못된 주소입니다. 다시 입력해주세요.");
      return;
    }
    // if (form.profileImageId === null) {
    //   alert("프로필 사진을 업로드해주세요.");
    //   return false;
    // }
    // if (form.fileId === null) {
    //   alert("첨부파일을 등록해주세요.");
    //   return false;
    // }
    if (form.availableTimes.length === 0) {
      alert("업무 가능 시간을 1개 이상 선택해주세요.");
      return false;
    }
    return true;
  };

  // 나의 정보 수정
  const handleSubmit = async () => {
    if (!form) return;

    // 필수 입력값 체크
    if (!validateRequiredFields()) return;
    // 추가 필수 입력값 체크
    if (!validateExtraFields()) return;

    // 이메일 유효성 검사
    if (!isValidEmail(form.email)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }
    // 비밀번호 유효성 검사
    if (!isValidPassword(form.password)) {
      alert("비밀번호는 8~20자, 대소문자/숫자/특수문자 중 3가지 이상 포함해야 합니다.");
      return;
    }
    // 비밀번호 확인
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 업무 가능 시간 포맷 변환 (요일, 시간 → ENUM + hh:mm)
    const availableTimes = Object.entries(selectedTimes).flatMap(([day, hours]) =>
      Array.from(hours).map((hour) => ({
        dayOfWeek: convertToEnum(day),
        time: hour.replace("시", ":00"),
      }))
    );

    // 최종 요청 객체 생성
    const requestBody = {
      ...form,
      availableTimes,
    };

    try {
      await updateManager(requestBody);
      alert("정보 수정이 완료되었습니다.");
      navigate("/managers/my");
    } catch (err: any) {
      alert(err.message || "매니저 수정 실패");
    }
  };

  // 로딩 화면은 여기서 처리
  if (!form) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="w-full self-stretch inline-flex flex-col justify-start items-start">
        <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
          <div className="justify-start text-gray-900 text-xl font-bold font-['Inter'] leading-normal">나의 정보 수정</div>
          <Link 
              to="/managers/my"
              className="h-10 px-4 flex justify-center items-center border rounded-md text-sm text-gray-500 hover:bg-gray-100">취소</Link>
        </div>
        <div className="self-stretch p-6 flex flex-col justify-start items-start gap-6">
          <div className="self-stretch p-8 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-6">
            <div className="w-full inline-flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">기본 정보</div>
                <div className="self-stretch inline-flex justify-start items-start gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-slate-700 text-sm font-medium font-['Inter'] leading-none whitespace-nowrap">
                        연락처 *
                      </span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      readOnly
                      className="h-12 px-4 bg-gray-100 text-slate-500 rounded-lg outline outline-1 outline-slate-200 text-sm placeholder-slate-400"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">이름 *</label>
                    <input
                      type="text"
                      name="userName"
                      value={form.userName}
                      readOnly
                      className="h-12 px-4 bg-gray-100 text-slate-500 rounded-lg outline outline-1 outline-slate-200 text-sm placeholder-slate-400"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">생년월일 *</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={form.birthDate}
                      readOnly
                      className="h-12 px-4 bg-gray-100 text-slate-500 rounded-lg outline outline-1 outline-slate-200 text-sm placeholder-slate-400"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">성별 *</label>
                    <input
                      type="tex"
                      name="genderName"
                      value={form.genderName}
                      readOnly
                      className="h-12 px-4 bg-gray-100 text-slate-500 rounded-lg outline outline-1 outline-slate-200 text-sm placeholder-slate-400"
                    />
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-slate-700 text-sm font-medium font-['Inter'] leading-none whitespace-nowrap">
                        비밀번호 *
                      </span>
                      <span className="text-xs text-gray-400">
                        ※ 8~20자, 대/소문자·숫자·특수문자 중 3가지 이상 포함
                      </span>
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm((prev) => prev ? { ...prev, password: e.target.value } : prev)
                      }
                      placeholder="비밀번호"
                      className="h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-slate-200 text-sm text-slate-700 placeholder-slate-400"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">비밀번호 확인 *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm((prev) => prev ? { ...prev, confirmPassword: e.target.value } : prev)
                      }
                      placeholder="비밀번호"
                      className="h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-slate-200 text-sm text-slate-700 placeholder-slate-400"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">이메일 *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => prev ? { ...prev, email: e.target.value } : prev)
                      }
                      className="h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-slate-200 text-sm text-slate-700 placeholder-slate-400"
                    />
                  </div>
                </div>
                {/* 주소 입력 */}
                <AddressSearch
                  roadAddress={form.roadAddress}
                  detailAddress={form.detailAddress}
                  setRoadAddress={(val) =>
                    setForm((prev) => prev ? { ...prev, roadAddress: val } : prev)
                  }
                  setDetailAddress={(val) =>
                    setForm((prev) => prev ? { ...prev, detailAddress: val } : prev)
                  }
                />
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">프로필 정보</div>
                <div className="self-stretch inline-flex justify-start items-start gap-4">
                  <div className="w-28 h-28 bg-slate-100 rounded-[60px] flex justify-center items-center">
                    <span className="material-symbols-outlined text-[64px] text-slate-500 leading-none inline-block">
                      face
                    </span>
                  </div>
                  <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                    <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">프로필 사진</div>
                    <div className="w-40 h-10 px-4 bg-slate-50 rounded-md outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-center items-center">
                      <div className="justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">파일 선택</div>
                    </div>
                    <div className="self-stretch justify-start text-slate-500 text-xs font-normal font-['Inter'] leading-none">JPG, PNG 파일 (최대 5MB)</div>
                  </div>
                </div>
                {/* 주소 입력 */}
                <FileUploadSection files={files} setFiles={setFiles} multiple={true} isRequired={true}/>

                {/* 한줄소개 */}
                <div className="self-stretch flex flex-col gap-2">
                  <label className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">
                    한줄소개 *
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={(e) =>
                      setForm((prev) => prev ? { ...prev, bio: e.target.value } : prev)
                    }
                    placeholder="자신을 소개하는 한 줄을 작성해주세요"
                    className="self-stretch h-20 px-4 py-3 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 text-slate-700 text-sm font-normal resize-none"
                  />
                </div>
                {/* 업무 가능 시간 */}
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">업무 가능 시간 *</label>
                    <p className="text-xs text-slate-500">가능한 시간대를 선택해주세요.</p>
                  </div>

                  <div className="w-full overflow-x-auto">
                    <table className="w-full table-fixed border border-slate-200">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="w-16 border-r border-slate-200 text-sm text-slate-700 py-2">시간</th>
                          {days.map((day) => (
                            <th key={day} className="w-20 border-r border-slate-200 text-sm text-slate-700 py-2">{day}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {hours.map((hour) => (
                          <tr key={hour}>
                            <td className="border-t border-r border-slate-200 text-sm text-slate-600 text-center py-1 bg-slate-50">{hour}</td>
                            {days.map((day) => {
                              const isSelected = selectedTimes[day]?.has(hour);
                              return (
                                <td
                                  key={`${day}-${hour}`}
                                  className={`border-t border-r border-slate-200 h-9 text-sm text-center cursor-pointer ${isSelected ? 'bg-indigo-100 text-indigo-600 font-medium' : 'hover:bg-indigo-50'}`}
                                  onClick={() => toggleTimeSlot(day, hour)}
                                >
                                  {hour}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 선택된 시간 영역 */}
                  {Object.values(selectedTimes).some((set) => set.size > 0) && (
                    <div className="w-full mt-4 p-4 bg-slate-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">
                          선택된 업무 가능 시간
                        </div>
                        <button
                          onClick={clearAllSelectedTimes}
                          className="px-3 py-1 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 transition"
                        >
                          전체 초기화
                        </button>
                      </div>
                      <div className="space-y-1 text-sm text-slate-700">
                        {days.map((day) => {
                          const hoursSet = selectedTimes[day];
                          return hoursSet && hoursSet.size > 0 ? (
                            <div key={day}>{formatSelectedTimeText(day, hoursSet)}</div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

             <button
                onClick={handleSubmit}
                className="self-stretch h-12 mt-6 bg-indigo-600 rounded-lg inline-flex justify-center items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-white">edit</span>
                <span className="text-white text-base font-semibold font-['Inter'] leading-tight">
                  수정하기
                </span>
              </button>
          </div>
        </div>
      </div>
    </Fragment>
  )
};