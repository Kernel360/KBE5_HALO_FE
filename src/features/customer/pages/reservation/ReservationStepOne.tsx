// ReservationStepOne.tsx
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReservationReqType, ServiceCategoryTreeType } from '@/features/customer/types/CustomerReservationType';
import type { CustomerInfoType } from '@/features/customer/types/CustomerInfoType';
import { getServiceCategories, createReservation, getCustomerInfo } from '@/features/customer/api/CustomerReservation';
import { formatPhoneNumber } from '@/shared/utils/format';
import AddressSearch from '@/shared/components/AddressSearch';
import { useAddressStore } from '@/store/useAddressStore';
import { ReservationStepIndicator } from '@/features/customer/components/ReservationStepIndicator';
import { MapPin, Phone, Sparkles, StickyNote, CalendarClock } from 'lucide-react';

export const ReservationStepOne: React.FC = () => {
  const navigate = useNavigate();
  const phoneRef = useRef<HTMLInputElement>(null);
  const { roadAddress, detailAddress, latitude, longitude } = useAddressStore();
  const setAddress = useAddressStore(state => state.setAddress);

  const [form, setForm] = useState<ReservationReqType>({
    mainServiceId: 0,
    additionalServiceIds: [],
    phone: '',
    roadAddress: '',
    detailAddress: '',
    latitude: 0,
    longitude: 0,
    requestDate: '',
    startTime: '',
    turnaround: 0,
    price: 0,
    memo: '',
  });

  const [categories, setCategories] = useState<ServiceCategoryTreeType[]>([]);
  const [, setUserInfo] = useState<CustomerInfoType[]>([]);

  // 주소 store 값 변경 시 form 동기화
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      roadAddress: roadAddress || '',
      detailAddress: detailAddress || '',
      latitude: latitude || 0,
      longitude: longitude || 0,
    }));
  }, [roadAddress, detailAddress, latitude, longitude]);

  useEffect(() => {
    const controller = new AbortController();

    // 카테고리 조회
    getServiceCategories()
      .then((data) => {
        if (!controller.signal.aborted) {
          setCategories(data.body);
          setForm(prev => ({ ...prev, mainServiceId: data.body[0]?.serviceId || 0 }));
        }
      })
      .catch(console.error);

    // 고객 정보 조회
    getCustomerInfo()
      .then((res) => {
        const customer: CustomerInfoType = res.body;
        setUserInfo([customer]);
        setForm(prev => ({
          ...prev,
          phone: customer.phone ?? '',
        }));
        setAddress(
          customer.roadAddress ?? '',
          customer.latitude ?? 0,
          customer.longitude ?? 0,
          customer.detailAddress ?? ''
        );
      })
      .catch(console.error);

    return () => controller.abort();
  }, [setAddress]);

  const selectedMain = categories.find(c => c.serviceId === form.mainServiceId);
  const children = selectedMain?.children ?? [];
  const includedServices = children.filter(item => item.price === 0);
  const additionalItems = children.filter(item => item.price > 0);


  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
  const dd = String(tomorrow.getDate()).padStart(2, '0');
  const availableDate = `${yyyy}-${mm}-${dd}`;


  const timeOptions = useMemo(() => {
    // Generate hours from 6:00 to 20:00 (8PM) in 1-hour increments (6,7,...,20)
    return Array.from({ length: 15 }, (_, i) => {
      const hour = 6 + i;
      const timeStr = `${String(hour).padStart(2, '0')}:00`;

      return timeStr;
    }).filter(Boolean) as string[];
  }, [form.requestDate]);

  const handleChange = <K extends keyof ReservationReqType>(key: K, value: ReservationReqType[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const totalExtra = useMemo(() => {
    return additionalItems
      .filter(item => form.additionalServiceIds.includes(item.serviceId))
      .reduce(
        (acc, cur) => ({
          price: acc.price + (cur.price ?? 0),
          time: acc.time + (cur.serviceTime ?? 0),
        }),
        { price: 0, time: 0 }
      );
  }, [form.additionalServiceIds, additionalItems]);

  const totalPrice = (selectedMain?.price ?? 0) + totalExtra.price;
  const totalTime = (selectedMain?.serviceTime ?? 0) + totalExtra.time;

  const formatEndTime = () => {
    if (!form.startTime || !totalTime) return '';
    const [startHour, startMinute] = form.startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(startHour);
    endDate.setMinutes(startMinute);
    endDate.setHours(endDate.getHours() + totalTime);
    const endHour = String(endDate.getHours()).padStart(2, '0');
    const endMin = String(endDate.getMinutes()).padStart(2, '0');
    return `${form.startTime} ~ ${endHour}:${endMin} (${totalTime}시간)`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setForm(prev => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async () => {
    if (!roadAddress?.trim()) return alert('도로명 주소를 입력해주세요.');
    if (!detailAddress?.trim()) return alert('상세 주소를 입력해주세요.');
    if (!form.phone) return alert('연락처를 입력해주세요.');
    if (!form.requestDate) return alert('예약 날짜를 선택해주세요.');
    if (!form.startTime) return alert('예약 시간을 선택해주세요.');
    if (!form.mainServiceId) return alert('서비스를 선택해주세요.');

    const reservationRequest: ReservationReqType = {
      ...form,
      roadAddress,
      detailAddress,
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
      turnaround: totalTime,
      price: totalPrice,
    };

    try {
      const response = await createReservation(reservationRequest);

      if (response?.body?.reservation?.reservationId) {
        const reservationId = response.body.reservation.reservationId;
        const targetUrl = `/reservations/${reservationId}/step-2`;
        
        // 네비게이션 실행
        await navigate(targetUrl, {
          state: response.body
        });

      } else {
        console.error('reservationId not found in response');
        alert('예약 생성은 완료되었지만 예약 ID를 찾을 수 없습니다.');
      }
    } catch (e) {
      alert('예약 요청 중 오류가 발생했습니다.');
      console.error(e);
    }
  };

  const renderAdditionalServiceLabel = (item: ServiceCategoryTreeType) => {
    const time = item.serviceTime ?? 0;
    const price = item.price ?? 0;
    return (
      <>
        <div>{item.serviceName}</div>
        <div className="text-xs text-gray-500">
          {item.description && <p>{item.description}</p>}
          {time > 0
            ? `+${time}h / +${price.toLocaleString()}원`
            : `+${price.toLocaleString()}원`}
        </div>
      </>
    );
  };

  const isNextDisabled = selectedMain?.depth === 0 && (selectedMain?.price ?? 0) === 0;

  return (
    <div className="w-full px-16 py-10 flex flex-col items-center">
      <ReservationStepIndicator step={1} />
      <div className="max-w-[1200px] w-full flex gap-8">
        {/* 좌측 */}
        <div className="flex-1 flex flex-col gap-8">
          {/* 주소 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={18} className="text-indigo-600" />
              서비스 주소
            </h2>
            <AddressSearch
              roadAddress={roadAddress}
              detailAddress={detailAddress}
              setRoadAddress={(value) => setAddress(value, latitude ?? 0, longitude ?? 0, detailAddress)}
              setDetailAddress={(value) => setAddress(roadAddress, latitude ?? 0, longitude ?? 0, value)}
            />
          </div>

          {/* 연락처 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Phone size={18} className="text-indigo-600" />
              연락처
            </h2>
            <input
              id="phone"
              type="tel"
              ref={phoneRef}
              className="h-11 w-full px-4 bg-gray-50 rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400"
              placeholder="숫자만 입력하세요 (예: 01012345678)"
              value={form.phone}
              onChange={handlePhoneChange}
            />
          </div>


          {/* 서비스 선택 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-5">
            <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-600" />
              서비스 종류
            </div>
            <select
              value={form.mainServiceId}
              onChange={(e) => handleChange('mainServiceId', Number(e.target.value))}
              className="h-11 px-3 rounded-md bg-gray-50 border border-gray-300"
            >
              {categories.map((cat) => (
                <option key={cat.serviceId} value={cat.serviceId}>{cat.serviceName}</option>
              ))}
            </select>

            {includedServices.length > 0 ? (
                <>
                  <div className="text-sm font-medium text-gray-700">포함 서비스</div>
                  <ul className="text-sm text-gray-900 list-disc pl-4">
                    {includedServices.map((item) => (
                      <li key={item.serviceId}>
                        <div>{item.serviceName}</div>

                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                selectedMain?.description && (
                  <div className="text-sm text-gray-500 whitespace-pre-wrap">
                    {selectedMain.description}
                  </div>
                )
              )}

              {additionalItems.length > 0 && (
                <>
                  <div className="text-sm font-medium text-gray-700 mt-4">서비스 추가</div>
                  <div className="grid grid-cols-3 gap-2">
                    {additionalItems.map((item) => (
                      <label
                        key={item.serviceId}
                        className={`px-4 py-2 rounded-md text-sm border text-center cursor-pointer whitespace-nowrap ${
                          form.additionalServiceIds.includes(item.serviceId)
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-gray-50 text-gray-900 border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.additionalServiceIds.includes(item.serviceId)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            handleChange(
                              'additionalServiceIds',
                              checked
                                ? [...form.additionalServiceIds, item.serviceId]
                                : form.additionalServiceIds.filter(id => id !== item.serviceId)
                            );
                          }}
                          className="hidden"
                        />
                        {renderAdditionalServiceLabel(item)}
                      </label>
                    ))}
                  </div>
                </>
              )}
          </div>
        </div>

        {/* 우측 */}
        <div className="w-96 flex flex-col gap-6">
          {/* 날짜 및 시간 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CalendarClock size={18} className="text-indigo-600" />
              서비스 날짜 및 시간
            </h2>
            <input
              type="date"
              min={availableDate}
              className="h-11 px-3 bg-gray-50 rounded-md border border-gray-300"
              value={form.requestDate}
              onChange={(e) => handleChange('requestDate', e.target.value)}
            />
            <select
              className="h-11 px-3 bg-gray-50 rounded-md border border-gray-300"
              value={form.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
            >
              <option value="">시간 선택</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          {/* 메모 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <StickyNote size={18} className="text-indigo-600" />
              전달 사항
            </h2>
            <textarea
              className="h-24 px-3 py-2 bg-gray-50 rounded-md border border-gray-300"
              placeholder="반려동물 유무와 기타 요청사항을 입력해주세요."
              value={form.memo}
              onChange={(e) => handleChange('memo', e.target.value)}
            />
          </div>

          {/* 요약 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-gray-900">예약 정보</h2>
            <div className="flex justify-between text-sm"><span className="text-gray-500">서비스 종류</span><span>{selectedMain?.serviceName || '-'}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">서비스 날짜</span><span>{form.requestDate}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">서비스 시간</span><span>{formatEndTime()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">서비스 비용</span><span>{totalPrice.toLocaleString()}원</span></div>
            <div className="border-t border-gray-200 my-2" />
            <div className="flex justify-between text-base font-semibold"><span>총 결제 금액</span><span className="text-indigo-600 text-lg">{totalPrice.toLocaleString()}원</span></div>
          </div>
          <button
            disabled={isNextDisabled}
            onClick={handleSubmit}
            className={`h-12 rounded-lg flex justify-center items-center text-base font-semibold transition
              ${isNextDisabled
                ? 'bg-gray-300 text-white cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'}
            `}
          >
            다음 단계로
          </button>
        </div>
      </div>
    </div>
  );
};
