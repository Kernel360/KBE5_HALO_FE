import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Star } from "lucide-react";
import homeIcon from '@/assets/home.svg';
import airconIcon from '@/assets/aircon.svg';
import strollerIcon from '@/assets/stroller.svg';

export const CustomerMain = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  return (
    <Fragment>
      <div className="self-stretch h-[600px] p-28 bg-gradient-to-l from-indigo-600 to-violet-600 flex flex-col justify-center items-start">
        <div className="w-[600px] flex flex-col justify-start items-start gap-6">
          <div className="self-stretch justify-start text-white text-5xl font-bold font-['Inter'] leading-[57.60px]">전문 매니저와 깔끔한 생활,<br/>지금 시작하세요!</div>
          <div className="self-stretch justify-start text-white text-lg font-normal font-['Inter'] leading-relaxed">HaloCare와 함께라면 청소와 가사 걱정은 끝!<br/>전문 매니저가 당신의 일상을 더 편안하게 만들어 드립니다.</div>
          <div
            onClick={() => {
              if (accessToken) {
                navigate("/reservations/new");
              } else {
                navigate("/auth/login");
              }
            }}
            className="w-48 h-14 bg-white rounded-lg flex flex-col justify-center items-center cursor-pointer"
          >
            <div className="justify-start text-indigo-600 text-base font-semibold font-['Inter'] leading-tight">지금 예약하기</div>
          </div>
        </div>
      </div>
      {/* 이 아래 div 옆으로 튀어나와있어... */}
      <div className="w-full h-28 px-28 bg-gray-50 inline-flex justify-center items-center">
        <div className="w-full h-20 px-6 py-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-indigo-600/80 flex justify-between items-center">
          <div className="inline-flex flex-col justify-center items-start gap-1">
            <div className="justify-start text-zinc-800 text-lg font-bold font-['Inter'] leading-snug">첫 예약 30% 할인 이벤트</div>
            <div className="justify-start text-stone-500 text-sm font-normal font-['Inter'] leading-none">신규 회원 대상, 6월 30일까지</div>
          </div>
          <div className="w-28 h-10 bg-indigo-600 rounded-lg inline-flex flex-col justify-center items-center">
            <div className="justify-start text-white text-sm font-semibold font-['Inter'] leading-none">자세히 보기</div>
          </div>
        </div>
      </div>
      <div className="self-stretch px-28 py-20 flex flex-col justify-start items-start gap-12">
        <div className="self-stretch flex flex-col justify-center items-center gap-4">
          <div className="justify-start text-zinc-800 text-3xl font-bold font-['Inter'] leading-10">서비스 카테고리</div>
          <div className="justify-start text-stone-500 text-lg font-normal font-['Inter'] leading-snug">다양한 청소 서비스 중 필요한 서비스를 선택하세요</div>
        </div>
        <div className="self-stretch inline-flex justify-center items-start gap-6">
          <div className="w-96 h-96 p-8 bg-white rounded-2xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-[0px_10px_28px_4px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex flex-col justify-start items-center gap-6">
            <img
              src={homeIcon}
              alt="가사 아이콘"
              className="w-20 h-20 object-contain"
            />
            <div className="self-stretch text-center justify-start text-zinc-800 text-2xl font-bold font-['Inter'] leading-7">가사 서비스</div>
            <div className="self-stretch text-center justify-start text-stone-500 text-base font-normal font-['Inter'] leading-normal">일상적인 집안일부터 대청소까지, 전문 매니저가 도와드립니다.</div>
            <div className="w-40 h-12 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-indigo-600 flex flex-col justify-center items-center">
              <div className="justify-start text-indigo-600 text-base font-semibold font-['Inter'] leading-tight">자세히 보기</div>
            </div>
          </div>
          <div className="w-96 h-96 p-8 bg-white rounded-2xl shadow-[0px_4px_6px_0px_rgba(0,0,0,0.10)] shadow-[0px_10px_28px_20px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex flex-col justify-start items-center gap-6">
            <img
              src={airconIcon}
              alt="에어컨 청소 아이콘"
              className="w-20 h-20 object-contain"
            />
            <div className="self-stretch text-center justify-start text-zinc-800 text-2xl font-bold font-['Inter'] leading-7">에어컨 청소</div>
            <div className="self-stretch text-center justify-start text-stone-500 text-base font-normal font-['Inter'] leading-normal">에어컨 내부 세척부터 필터 교체까지, 쾌적한 공기를 위한 서비스입니다.</div>
            <div className="w-40 h-12 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-indigo-600 flex flex-col justify-center items-center">
              <div className="justify-start text-indigo-600 text-base font-semibold font-['Inter'] leading-tight">자세히 보기</div>
            </div>
          </div>
          <div className="w-96 h-96 p-8 bg-white rounded-2xl shadow-[0px_4px_6px_0px_rgba(0,0,0,0.10)] shadow-[0px_10px_28px_20px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex flex-col justify-start items-center gap-6">
            <img
              src={strollerIcon}
              alt="돌봄 아이콘"
              className="w-20 h-20 object-contain"
            />
            <div className="self-stretch text-center justify-start text-zinc-800 text-2xl font-bold font-['Inter'] leading-7">돌봄 서비스</div>
            <div className="self-stretch text-center justify-start text-stone-500 text-base font-normal font-['Inter'] leading-normal">아이돌봄, 노인돌봄 등 맞춤형 돌봄 서비스를 제공합니다.</div>
            <div className="w-40 h-12 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-indigo-600 flex flex-col justify-center items-center">
              <div className="justify-start text-indigo-600 text-base font-semibold font-['Inter'] leading-tight">자세히 보기</div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch px-28 py-20 bg-gray-50 flex flex-col justify-start items-start gap-12">
        <div className="self-stretch flex flex-col justify-center items-center gap-4">
          <div className="justify-start text-zinc-800 text-3xl font-bold font-['Inter'] leading-10">간편한 HaloCare 이용 방법</div>
          <div className="justify-start text-stone-500 text-lg font-normal font-['Inter'] leading-snug">간편한 3단계로 청소 서비스를 이용해보세요</div>
        </div>
        <div className="self-stretch inline-flex justify-center items-start gap-10">
          <div className="w-80 inline-flex flex-col justify-start items-center gap-6">
            <div className="w-20 h-20 bg-indigo-600 rounded-[40px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.10)] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.10)] flex flex-col justify-center items-center">
              <div className="justify-start text-white text-3xl font-bold font-['Inter'] leading-10">1</div>
            </div>
            <div className="self-stretch text-center justify-start text-zinc-800 text-xl font-bold font-['Inter'] leading-normal">서비스 선택</div>
            <div className="self-stretch text-center justify-start text-stone-500 text-base font-normal font-['Inter'] leading-normal">필요한 서비스와 날짜, 시간을 선택하세요.</div>
          </div>
          <div className="w-80 inline-flex flex-col justify-start items-center gap-6">
            <div className="w-20 h-20 bg-indigo-600 rounded-[40px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.10)] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.10)] flex flex-col justify-center items-center">
              <div className="justify-start text-white text-3xl font-bold font-['Inter'] leading-10">2</div>
            </div>
            <div className="self-stretch text-center justify-start text-zinc-800 text-xl font-bold font-['Inter'] leading-normal">매니저 매칭</div>
            <div className="self-stretch text-center justify-start text-stone-500 text-base font-normal font-['Inter'] leading-normal">검증된 전문 매니저가 배정됩니다.</div>
          </div>
          <div className="w-80 inline-flex flex-col justify-start items-center gap-6">
            <div className="w-20 h-20 bg-indigo-600 rounded-[40px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.10)] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.10)] flex flex-col justify-center items-center">
              <div className="justify-start text-white text-3xl font-bold font-['Inter'] leading-10">3</div>
            </div>
            <div className="self-stretch text-center justify-start text-zinc-800 text-xl font-bold font-['Inter'] leading-normal">서비스 완료</div>
            <div className="self-stretch text-center justify-start text-stone-500 text-base font-normal font-['Inter'] leading-normal">깔끔하게 정리된 공간을 확인하세요.</div>
          </div>
        </div>
      </div>
      <div className="self-stretch px-28 py-20 flex flex-col justify-start items-start gap-12">
        <div className="self-stretch flex flex-col justify-center items-center gap-4">
          <div className="justify-start text-zinc-800 text-3xl font-bold font-['Inter'] leading-10">고객 후기</div>
          <div className="justify-start text-stone-500 text-lg font-normal font-['Inter'] leading-snug">HaloCare 서비스를 이용한 고객님들의 생생한 후기</div>
        </div>
        <div className="self-stretch inline-flex justify-center items-start gap-6">
          <div className="w-72 h-80 p-6 bg-white rounded-2xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-[0px_10px_15px_-4px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex flex-col justify-start items-start gap-4">
            <div className="inline-flex justify-start items-center gap-1">
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            <div className="self-stretch justify-start text-stone-500 text-base font-normal font-['Inter'] leading-normal">"매니저님이 꼼꼼하게 청소해주셔서 집이 새집처럼 깨끗해졌어요. 다음에도 꼭 이용할 예정입니다!"</div>
            <div className="self-stretch inline-flex justify-start items-center gap-3">
              <div className="inline-flex flex-col justify-center items-start">
                <div className="justify-start text-zinc-800 text-base font-semibold font-['Inter'] leading-tight">김지영</div>
                <div className="justify-start text-stone-500 text-sm font-normal font-['Inter'] leading-none">가사 서비스 이용</div>
              </div>
            </div>
          </div>
          <div className="w-72 h-80 p-6 bg-white rounded-2xl shadow-[0px_4px_6px_0px_rgba(0,0,0,0.10)] shadow-[0px_10px_15px_-4px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex flex-col justify-start items-start gap-4">
            <div className="inline-flex justify-start items-center gap-1">
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            <div className="self-stretch justify-start text-stone-500 text-base font-normal font-['Inter'] leading-normal">"에어컨 청소를 맡겼는데 냄새도 없어지고 시원함이 달라졌어요. 전문가의 손길이 느껴졌습니다."</div>
            <div className="self-stretch inline-flex justify-start items-center gap-3">
              <div className="inline-flex flex-col justify-center items-start">
                <div className="justify-start text-zinc-800 text-base font-semibold font-['Inter'] leading-tight">박현우</div>
                <div className="justify-start text-stone-500 text-sm font-normal font-['Inter'] leading-none">에어컨 청소 이용</div>
              </div>
            </div>
          </div>
          <div className="w-72 h-80 p-6 bg-white rounded-2xl shadow-[0px_4px_6px_0px_rgba(0,0,0,0.10)] shadow-[0px_10px_15px_-4px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex flex-col justify-start items-start gap-4">
            <div className="inline-flex justify-start items-center gap-1">
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            <div className="self-stretch justify-start text-stone-500 text-base font-normal font-['Inter'] leading-normal">"아이 돌봄 서비스를 이용했는데, 매니저님이 아이와 잘 놀아주시고 안전하게 돌봐주셔서 안심이 됐어요."</div>
            <div className="self-stretch inline-flex justify-start items-center gap-3">
              <div className="inline-flex flex-col justify-center items-start">
                <div className="justify-start text-zinc-800 text-base font-semibold font-['Inter'] leading-tight">이수진</div>
                <div className="justify-start text-stone-500 text-sm font-normal font-['Inter'] leading-none">돌봄 서비스 이용</div>
              </div>
            </div>
          </div>
          <div className="w-72 h-80 p-6 bg-white rounded-2xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-[0px_10px_15.399999618530273px_-4px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex flex-col justify-start items-start gap-4">
            <div className="inline-flex justify-start items-center gap-1">
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            <div className="self-stretch justify-start text-stone-500 text-base font-normal font-['Inter'] leading-normal">"정기적으로 이용하고 있어요. 매번 깔끔하게 청소해주시고 친절하셔서 만족스럽습니다."</div>
            <div className="self-stretch inline-flex justify-start items-center gap-3">
              <div className="inline-flex flex-col justify-center items-start">
                <div className="justify-start text-zinc-800 text-base font-semibold font-['Inter'] leading-tight">최민준</div>
                <div className="justify-start text-stone-500 text-sm font-normal font-['Inter'] leading-none">가사 서비스 이용</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-28 py-20 bg-gray-50 flex justify-between items-start gap-12">
        {/* 공지사항 */}
        <div className="w-1/2 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-zinc-800 text-2xl font-bold font-['Inter'] leading-7">공지사항</h2>
            <span className="justify-start text-indigo-600 text-base font-medium font-['Inter'] leading-tight">전체 보기</span>
          </div>
          <ul className="space-y-4">
            {[
              { title: "HaloCare 서비스 지역 확장 안내", date: "2023.06.15" },
              { title: "여름맞이 에어컨 청소 예약 오픈", date: "2023.06.10" },
              { title: "앱 업데이트 안내 (v2.0)", date: "2023.06.05" },
            ].map((notice, i) => (
              <li key={i} className="flex justify-between items-center text-sm text-zinc-700 border-b border-zinc-100 pb-2">
                <span>{notice.title}</span>
                <span className="text-stone-400">{notice.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 이벤트 */}
        <div className="w-1/2 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-zinc-800 text-2xl font-bold font-['Inter'] leading-7">이벤트</h2>
            <span className="justify-start text-indigo-600 text-base font-medium font-['Inter'] leading-tight">전체 보기</span>
          </div>
          <div className="flex flex-col gap-4">
            {[
              {
                type: "EVENT",
                title: "친구 추천 이벤트",
                desc: "친구 추천하고 10,000원 적립금 받으세요!",
                period: "2023.06.01 ~ 2023.06.30",
              },
              {
                type: "SALE",
                title: "여름 특별 할인",
                desc: "에어컨 청소 20% 할인 프로모션",
                period: "2023.06.15 ~ 2023.07.15",
              },
            ].map((event, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              >
                <div className="w-16 h-16 bg-indigo-600 rounded-lg flex justify-center items-center text-white font-bold text-sm">
                  {event.type}
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="text-zinc-800 text-sm font-semibold">{event.title}</div>
                  <div className="text-stone-500 text-sm">{event.desc}</div>
                  <div className="text-indigo-600 text-xs">{event.period}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};