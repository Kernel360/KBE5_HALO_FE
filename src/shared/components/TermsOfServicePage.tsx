import React from 'react'
import { Link } from 'react-router-dom'

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* 헤더 */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">HaloCare 서비스 이용약관</h1>
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

          {/* 약관 내용 */}
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">제1조 (목적)</h2>
                <p className="mb-4 text-gray-700">
                  이 약관은 HaloCare(이하 “회사”라 합니다)가 제공하는 모든 서비스(이하 “서비스”)의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </section>
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">제2조 (용어의 정의)</h2>
                <ol className="list-decimal pl-6 text-gray-700">
                  <li>“이용자”란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
                  <li>“회원”이란 회사와 서비스 이용계약을 체결하고 이용자 ID를 부여받은 자를 말합니다.</li>
                  <li>“콘텐츠”란 서비스에서 제공되는 모든 정보, 문서, 이미지, 영상, 소프트웨어 등을 말합니다.</li>
                </ol>
              </section>
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">제3조 (약관의 효력 및 변경)</h2>
                <ol className="list-decimal pl-6 text-gray-700">
                  <li>이 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력이 발생합니다.</li>
                  <li>회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다. 개정 시 공지사항을 통해 사전 공지하며, 이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있습니다.</li>
                </ol>
              </section>
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">제4조 (서비스의 제공 및 변경)</h2>
                <ol className="list-decimal pl-6 text-gray-700">
                  <li>회사는 다음과 같은 서비스를 제공합니다:
                    <ul className="list-disc pl-6">
                      <li>건강관리 관련 정보 제공 및 상담</li>
                      <li>전문가 예약 서비스</li>
                      <li>기타 회사가 정하는 서비스</li>
                    </ul>
                  </li>
                  <li>회사는 서비스의 내용, 운영상 또는 기술상의 필요에 따라 변경할 수 있으며, 변경 사항은 사전 공지합니다.</li>
                </ol>
              </section>
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">제5조 (서비스 이용의 제한 및 중단)</h2>
                <p className="mb-4 text-gray-700">회사는 다음의 경우 서비스 제공을 중단하거나 제한할 수 있습니다:</p>
                <ol className="list-decimal pl-6 text-gray-700">
                  <li>시스템 정기점검 또는 유지보수가 필요한 경우</li>
                  <li>설비 장애 또는 이용 폭주로 정상적인 서비스 이용이 어려운 경우</li>
                  <li>천재지변 등 불가항력적 사유가 있는 경우</li>
                </ol>
              </section>
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">제6조 (회원가입 및 탈퇴)</h2>
                <ol className="list-decimal pl-6 text-gray-700">
                  <li>이용자는 회사가 정한 절차에 따라 회원가입을 신청할 수 있으며, 회사는 이에 대한 승낙 여부를 결정합니다.</li>
                  <li>회원은 언제든지 서비스 내 기능을 통해 탈퇴를 요청할 수 있으며, 회사는 즉시 탈퇴 처리합니다.</li>
                </ol>
              </section>
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">제7조 (이용자의 의무)</h2>
                <p className="mb-4 text-gray-700">이용자는 다음 행위를 하여서는 안 됩니다:</p>
                <ol className="list-decimal pl-6 text-gray-700">
                  <li>허위 정보의 등록</li>
                  <li>타인의 정보 도용</li>
                  <li>회사의 운영을 방해하거나 타인에게 피해를 주는 행위</li>
                  <li>관련 법령 및 약관에서 금지하는 행위</li>
                </ol>
              </section>
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">제8조 (지적재산권)</h2>
                <p className="mb-4 text-gray-700">
                  서비스 및 관련 콘텐츠에 대한 지적재산권은 회사 또는 정당한 권리자로부터 사용권을 부여받은 자에게 있으며, 이용자는 이를 무단 복제, 배포, 전송, 가공해서는 안 됩니다.
                </p>
              </section>
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">제9조 (면책조항)</h2>
                <ol className="list-decimal pl-6 text-gray-700">
                  <li>회사는 천재지변, 전쟁, 기간통신사업자의 장애 등 불가항력적 사유로 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.</li>
                  <li>회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.</li>
                </ol>
              </section>
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">제10조 (준거법 및 관할법원)</h2>
                <p className="mb-4 text-gray-700">
                  이 약관은 대한민국 법령에 따르며, 서비스 이용과 관련하여 발생한 분쟁은 민사소송법 상의 관할법원에 제소합니다.
                </p>
              </section>
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">부칙</h2>
                <p className="mb-4 text-gray-700">
                  본 약관은 2024년 1월 1일부터 적용됩니다.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfServicePage 