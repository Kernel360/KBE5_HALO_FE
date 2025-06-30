import { Fragment } from "react";

export const ManagerMain = () => {
  return (
    <Fragment>
      <div className="flex-1 flex flex-col justify-start items-start w-full min-w-0">
        <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-start items-center">
          <div className="justify-start text-gray-900 text-xl font-bold font-['Inter'] leading-normal">대시보드</div>
        </div>
        <div className="self-stretch p-6 flex flex-col justify-start items-start gap-6">
          <div className="self-stretch inline-flex justify-start items-start gap-4">
            <div className="flex-1 h-28 p-5 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-3">
              <div className="self-stretch justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">이번 달 총 예약건수</div>
              <div className="self-stretch inline-flex justify-start items-end">
                <div className="justify-start text-slate-800 text-3xl font-bold font-['Inter'] leading-10">24</div>
                <div className="justify-start text-green-500 text-sm font-medium font-['Inter'] leading-none">↑ 12%</div>
              </div>
            </div>
            <div className="flex-1 h-28 p-5 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-3">
              <div className="self-stretch justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">평균 평점</div>
              <div className="self-stretch inline-flex justify-start items-end">
                <div className="justify-start text-slate-800 text-3xl font-bold font-['Inter'] leading-10">4.8</div>
                <div className="justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">/5.0</div>
              </div>
            </div>
            <div className="flex-1 h-28 p-5 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-3">
              <div className="self-stretch justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">완료된 예약</div>
              <div className="self-stretch inline-flex justify-start items-end">
                <div className="justify-start text-slate-800 text-3xl font-bold font-['Inter'] leading-10">18</div>
                <div className="justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">건</div>
              </div>
            </div>
          </div>


          {/* 두번째 */}
          <div className="self-stretch p-6 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-4">
              <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">이번주 스케줄</div>
              <div className="self-stretch inline-flex justify-start items-start">
                <div className="flex-1 inline-flex flex-col justify-start items-center gap-2">
                  <div className="self-stretch text-center justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">월</div>
                  <div className="self-stretch h-24 bg-indigo-100 rounded-lg inline-flex justify-center items-center">
                    <div className="justify-start text-indigo-600 text-sm font-semibold font-['Inter'] leading-none">2건</div>
                  </div>
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-center gap-2">
                  <div className="self-stretch text-center justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">화</div>
                  <div className="self-stretch h-24 bg-slate-50 rounded-lg inline-flex justify-center items-center">
                    <div className="justify-start text-slate-500 text-sm font-semibold font-['Inter'] leading-none">1건</div>
                  </div>
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-center gap-2">
                  <div className="self-stretch text-center justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">수</div>
                  <div className="self-stretch h-24 bg-slate-50 rounded-lg inline-flex justify-center items-center">
                    <div className="justify-start text-slate-500 text-sm font-semibold font-['Inter'] leading-none">0건</div>
                  </div>
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-center gap-2">
                  <div className="self-stretch text-center justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">목</div>
                  <div className="self-stretch h-24 bg-slate-50 rounded-lg inline-flex justify-center items-center">
                    <div className="justify-start text-slate-500 text-sm font-semibold font-['Inter'] leading-none">3건</div>
                  </div>
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-center gap-2">
                  <div className="self-stretch text-center justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">금</div>
                  <div className="self-stretch h-24 bg-slate-50 rounded-lg inline-flex justify-center items-center">
                    <div className="justify-start text-slate-500 text-sm font-semibold font-['Inter'] leading-none">2건</div>
                  </div>
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-center gap-2">
                  <div className="self-stretch text-center justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">토</div>
                  <div className="self-stretch h-24 bg-slate-50 rounded-lg inline-flex justify-center items-center">
                    <div className="justify-start text-slate-500 text-sm font-semibold font-['Inter'] leading-none">0건</div>
                  </div>
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-center gap-2">
                  <div className="self-stretch text-center justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">일</div>
                  <div className="self-stretch h-24 bg-slate-50 rounded-lg inline-flex justify-center items-center">
                    <div className="justify-start text-slate-500 text-sm font-semibold font-['Inter'] leading-none">0건</div>
                  </div>
                </div>
              </div>

              <div className="self-stretch p-6 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-4">
                <div className="self-stretch p-4 bg-slate-50 rounded-lg inline-flex justify-between items-center">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-slate-800 text-base font-semibold font-['Inter'] leading-tight">홍길동 고객 방문 청소</div>
                    <div className="self-stretch justify-start text-slate-500 text-sm font-normal font-['Inter'] leading-none">서울시 강남구 테헤란로 123</div>
                    <div className="self-stretch justify-start text-indigo-600 text-sm font-medium font-['Inter'] leading-none">09:00 - 12:00</div>
                  </div>
                  <div className="flex justify-end items-center gap-2">
                    <div className="w-24 h-10 bg-indigo-100 rounded-md flex justify-center items-center">
                      <div className="justify-start text-indigo-600 text-sm font-medium font-['Inter'] leading-none">체크인</div>
                    </div>
                    <div className="w-24 h-10 bg-slate-100 rounded-md flex justify-center items-center">
                      <div className="justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">체크아웃</div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch p-4 bg-slate-50 rounded-lg inline-flex justify-between items-center">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-slate-800 text-base font-semibold font-['Inter'] leading-tight">김철수 고객 방문 청소</div>
                    <div className="self-stretch justify-start text-slate-500 text-sm font-normal font-['Inter'] leading-none">서울시 서초구 서초대로 456</div>
                    <div className="self-stretch justify-start text-indigo-600 text-sm font-medium font-['Inter'] leading-none">14:00 - 17:00</div>
                  </div>
                  <div className="flex justify-end items-center gap-2">
                    <div className="w-24 h-10 bg-slate-100 rounded-md flex justify-center items-center">
                      <div className="justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">체크인</div>
                    </div>
                    <div className="w-24 h-10 bg-slate-100 rounded-md flex justify-center items-center">
                      <div className="justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">체크아웃</div>
                    </div>
                  </div>
                </div>
              </div>
          </div>






          {/* 세번째 */}
          <div className="self-stretch inline-flex justify-start items-start gap-4">
            <div className="flex-1 p-6 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-4">
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">최근 리뷰</div>
                <div className="justify-start text-indigo-600 text-sm font-medium font-['Inter'] leading-none">모두 보기</div>
              </div>
              <div className="self-stretch p-4 bg-slate-50 rounded-lg flex flex-col justify-start items-start gap-2">
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="flex justify-start items-center gap-2">
                    <div className="justify-start text-slate-800 text-base font-semibold font-['Inter'] leading-tight">김철수</div>
                  </div>
                  <div className="flex justify-end items-center gap-1">
                      <span className="material-icons-outlined text-base text-yellow-400">star</span>
                      <span className="material-icons-outlined text-base text-yellow-400">star</span>
                      <span className="material-icons-outlined text-base text-yellow-400">star</span>
                      <span className="material-icons-outlined text-base text-slate-300">star</span>
                      <span className="material-icons-outlined text-base text-slate-300">star</span>
                  </div>
                </div>
                <div className="self-stretch justify-start text-slate-700 text-sm font-normal font-['Inter'] leading-none">청소가 꼼꼼하게 잘 되어있어요. 다음에도 같은 매니저님 부탁드립니다.</div>
                <div className="self-stretch justify-start text-slate-500 text-xs font-normal font-['Inter'] leading-none">2023.05.10</div>
              </div>
              <div className="self-stretch p-4 bg-slate-50 rounded-lg flex flex-col justify-start items-start gap-2">
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="flex justify-start items-center gap-2">
                    <div className="justify-start text-slate-800 text-base font-semibold font-['Inter'] leading-tight">이영희</div>
                  </div>
                  <div className="flex justify-end items-center gap-1">
                      <span className="material-icons-outlined text-base text-yellow-400">star</span>
                      <span className="material-icons-outlined text-base text-yellow-400">star</span>
                      <span className="material-icons-outlined text-base text-yellow-400">star</span>
                      <span className="material-icons-outlined text-base text-yellow-400">star</span>
                      <span className="material-icons-outlined text-base text-yellow-400">star</span>
                  </div>
                </div>
                <div className="self-stretch justify-start text-slate-700 text-sm font-normal font-['Inter'] leading-none">시간 약속을 잘 지키시고 친절하게 응대해주셔서 좋았습니다.</div>
                <div className="self-stretch justify-start text-slate-500 text-xs font-normal font-['Inter'] leading-none">2023.05.08</div>
              </div>
            </div>
          </div>


          {/* 네번째 */}
          <div className="self-stretch p-6 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-4">
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">공지사항</div>
              <div className="justify-start text-indigo-600 text-sm font-medium font-['Inter'] leading-none">모두 보기</div>
            </div>
            <div className="self-stretch py-4 border-b border-slate-200 inline-flex justify-between items-center">
              <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">[필독] 서비스 이용 가이드라인 안내</div>
              <div className="justify-start text-slate-500 text-sm font-normal font-['Inter'] leading-none">2023.05.01</div>
            </div>
            <div className="self-stretch py-4 border-b border-slate-200 inline-flex justify-between items-center">
              <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">5월 휴무일 안내</div>
              <div className="justify-start text-slate-500 text-sm font-normal font-['Inter'] leading-none">2023.04.28</div>
            </div>
            <div className="self-stretch py-4 inline-flex justify-between items-center">
              <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">서비스 품질 향상을 위한 설문조사 참여 안내</div>
              <div className="justify-start text-slate-500 text-sm font-normal font-['Inter'] leading-none">2023.04.15</div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};