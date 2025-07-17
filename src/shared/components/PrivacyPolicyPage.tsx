import React from 'react'
import { Link } from 'react-router-dom'

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* 헤더 */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              개인정보처리방침
            </h1>
            <p className="text-gray-600">최종 업데이트: 2024년 1월 1일</p>
          </div>

          {/* 뒤로가기 버튼 */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              홈으로 돌아가기
            </Link>
          </div>

          {/* 개인정보처리방침 내용 */}
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  제1조 개인정보의 처리 목적
                </h2>
                <p className="mb-4 text-gray-700">
                  HaloCare는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고
                  있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
                  이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라
                  별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>회원가입 및 관리</li>
                  <li>서비스 제공에 관한 계약 이행</li>
                  <li>고객 상담 및 불만처리</li>
                  <li>안전한 서비스 이용환경 구축</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  제2조 개인정보의 처리 및 보유 기간
                </h2>
                <p className="mb-4 text-gray-700">
                  HaloCare는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
                  개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
                  개인정보를 처리·보유합니다.
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>회원가입 및 관리: 서비스 이용계약 종료 시까지</li>
                  <li>서비스 제공: 서비스 제공완료 시까지</li>
                  <li>고객 상담 및 불만처리: 처리완료 후 3년</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  제3조 처리하는 개인정보의 항목
                </h2>
                <p className="mb-4 text-gray-700">
                  HaloCare는 다음의 개인정보 항목을 처리하고 있습니다:
                </p>
                <div className="mb-4">
                  <h3 className="mb-2 font-medium text-gray-800">필수항목</h3>
                  <p className="text-gray-700">이름, 생년월일, 성별, 연락처, 주소</p>
                </div>
                <div className="mb-4">
                  <h3 className="mb-2 font-medium text-gray-800">선택항목</h3>
                  <p className="text-gray-700">이메일</p>
                </div>
                <div className="mb-4">
                  <h3 className="mb-2 font-medium text-gray-800">자동수집항목</h3>
                  <p className="text-gray-700">접속 IP, 쿠키, 방문일시</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  제4조 개인정보의 제3자 제공
                </h2>
                <p className="mb-4 text-gray-700">
                  HaloCare는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서
                  명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한
                  규정 등 개인정보 보호법 제17조에 해당하는 경우에만 개인정보를
                  제3자에게 제공합니다.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  제5조 개인정보의 파기
                </h2>
                <p className="mb-4 text-gray-700">
                  HaloCare는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
                  불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
                  파기의 절차, 기한 및 방법은 다음과 같습니다:
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>
                    파기절차: 불필요한 개인정보 및 개인정보파일은
                    개인정보보호책임자의 승인을 받아 파기
                  </li>
                  <li>파기기한: 개인정보의 보유기간 경과 시 즉시 파기</li>
                  <li>
                    파기방법: 전자적 파일 형태는 복구가 불가능한 방법으로 영구삭제
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  제6조 정보주체의 권리·의무 및 행사방법
                </h2>
                <p className="mb-4 text-gray-700">
                  정보주체는 HaloCare에 대해 언제든지 다음 각 호의 개인정보 보호
                  관련 권리를 행사할 수 있습니다:
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>개인정보 처리정지 요구</li>
                  <li>개인정보 열람요구</li>
                  <li>개인정보 정정·삭제요구</li>
                  <li>개인정보 처리정지 요구</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  제7조 개인정보 보호책임자
                </h2>
                <p className="mb-4 text-gray-700">
                  HaloCare는 개인정보 처리에 관한 업무를 총괄해서 책임지고,
                  개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을
                  위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-gray-700">
                    <strong>개인정보 보호책임자</strong>: HaloCare 개인정보보호팀
                    <br />
                    <strong>연락처</strong>: privacy@halocare.com
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  제8조 개인정보처리방침의 변경
                </h2>
                <p className="text-gray-700">
                  이 개인정보처리방침은 2024년 1월 1일부터 적용됩니다. 이전의
                  개인정보처리방침은 아래에서 확인하실 수 있습니다.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage 