import React from "react";
import { X } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl w-[500px] max-h-[80vh] overflow-hidden border border-indigo-300">
          {/* Header */}
          <div className="bg-[#6366F1] text-white px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-bold">개인정보처리방침</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-6 text-sm text-gray-700">
              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3">제1조 개인정보의 처리 목적</h3>
                <p className="leading-relaxed">
                  HaloCare는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="mt-2 ml-4 space-y-1">
                  <li>• 회원가입 및 관리</li>
                  <li>• 서비스 제공에 관한 계약 이행</li>
                  <li>• 고객 상담 및 불만처리</li>
                  <li>• 안전한 서비스 이용환경 구축</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3">제2조 개인정보의 처리 및 보유 기간</h3>
                <p className="leading-relaxed">
                  HaloCare는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </p>
                <div className="mt-2 ml-4 space-y-1">
                  <p>• 회원가입 및 관리: 서비스 이용계약 종료 시까지</p>
                  <p>• 서비스 제공: 서비스 제공완료 시까지</p>
                  <p>• 고객 상담 및 불만처리: 처리완료 후 3년</p>
                </div>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3">제3조 처리하는 개인정보의 항목</h3>
                <p className="leading-relaxed">
                  HaloCare는 다음의 개인정보 항목을 처리하고 있습니다:
                </p>
                <ul className="mt-2 ml-4 space-y-1">
                  <li>• 필수항목: 이름, 생년월일, 성별, 연락처, 주소</li>
                  <li>• 선택항목: 이메일</li>
                  <li>• 자동수집항목: 접속 IP, 쿠키, 방문일시</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3">제4조 개인정보의 제3자 제공</h3>
                <p className="leading-relaxed">
                  HaloCare는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3">제5조 개인정보의 파기</h3>
                <p className="leading-relaxed">
                  HaloCare는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다. 파기의 절차, 기한 및 방법은 다음과 같습니다:
                </p>
                <ul className="mt-2 ml-4 space-y-1">
                  <li>• 파기절차: 불필요한 개인정보 및 개인정보파일은 개인정보보호책임자의 승인을 받아 파기</li>
                  <li>• 파기기한: 개인정보의 보유기간 경과 시 즉시 파기</li>
                  <li>• 파기방법: 전자적 파일 형태는 복구가 불가능한 방법으로 영구삭제</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3">제6조 정보주체의 권리·의무 및 행사방법</h3>
                <p className="leading-relaxed">
                  정보주체는 HaloCare에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
                </p>
                <ul className="mt-2 ml-4 space-y-1">
                  <li>• 개인정보 처리정지 요구</li>
                  <li>• 개인정보 열람요구</li>
                  <li>• 개인정보 정정·삭제요구</li>
                  <li>• 개인정보 처리정지 요구</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3">제7조 개인정보 보호책임자</h3>
                <p className="leading-relaxed">
                  HaloCare는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p>개인정보 보호책임자: HaloCare 개인정보보호팀</p>
                  <p>연락처: privacy@halocare.com</p>
                </div>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3">제8조 개인정보처리방침의 변경</h3>
                <p className="leading-relaxed">
                  이 개인정보처리방침은 2024년 1월 1일부터 적용됩니다. 이전의 개인정보처리방침은 아래에서 확인하실 수 있습니다.
                </p>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-[#6366F1] text-white rounded-xl text-base hover:bg-[#5558E3] cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
};