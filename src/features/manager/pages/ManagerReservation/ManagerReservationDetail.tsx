import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { ManagerReservationDetail as ManagerReservationType } from "@/features/manager/types/ManagerReservationType";
import { checkIn, checkOut, getManagerReservation } from "@/features/manager/api/managerReservation";
import { CleanignLogModal } from "@/features/manager/components/ManagerCleaningLogModal";
import { createManagerReview } from "@/features/manager/api/managerReview";
import { isValidLength } from "@/shared/utils/validation";
import { getReservationStatusStyle } from "@/features/manager/utils/ManagerReservationStauts";
import { formatTimeRange } from "@/shared/utils/format";



export const ManagerReservationDetail = () => {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState<ManagerReservationType | null>(null);

  const [checkType, setCheckType] = useState<| "IN" | "OUT">("IN");
  const [openModal, setOpenModal] = useState(false);
  const [checkInFiles, setCheckInFiles] = useState<File[]>([]);
  const [checkOutFiles, setCheckOutFiles] = useState<File[]>([]);

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  // 문의사항 조회
  useEffect(() => {
    if (!reservationId) return;
    getManagerReservation(Number(reservationId)).then(setReservation);
  }, [reservationId]);
  if (!reservation) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  // 체크인/체크아웃 하기
  const handleCheck = async (checkType: "IN" | "OUT") => {
    try {
      if (checkType === "IN") {
        if (!reservationId) {
          alert("예약 ID가 없습니다.");
          return;
        }
        // if (reservation.inFileId == null || reservation.inFileId === 0) {
        //   alert("첨부파일은 필수입니다.");
        //   return;
        // }
        reservation.inFileId = 1; // TODO: 첨부파일 임시처리
        const res = await checkIn(Number(reservationId), reservation.inFileId);
        reservation.checkId = res.checkId;
        reservation.inTime = res.inTime;
        reservation.inFileId = res.inFileId;
        reservation.status = res.status;
        reservation.statusName = res.statusName;
        alert("체크인이 완료되었습니다.");
        setOpenModal(false);
      }

      if (checkType === "OUT") {
        if (!reservation?.checkId) {
          alert("체크인을 먼저 진행해주세요.");
          return;
        }
        // if (reservation.outFileId == null) {
        //   alert("첨부파일은 필수입니다.");
        //   return;
        // }
        reservation.outFileId = 1; // TODO: 첨부파일 임시처리
        const res = await checkOut(Number(reservationId), reservation.outFileId);
        reservation.checkId = res.checkId;
        reservation.outTime = res.outTime;
        reservation.outFileId = res.outFileId;
        reservation.status = res.status;
        reservation.statusName = res.statusName;
        alert("체크아웃이 완료되었습니다.");
        setOpenModal(false);
      }
    } catch (error) {
      alert(`${checkType === "IN" ? "체크인" : "체크아웃"} 요청 중 오류가 발생하였습니다.`);
    }
  };

  // 매니저 리뷰 등록하기
  const handleReview = async () => {
    try {
      if (rating < 1) {
        alert("별점은 1점 이상 가능합니다.");
        return;
      }
      if (!isValidLength(content, 1, 600)) {
        alert("리뷰 내용은 필수 입력 항목이며, 600자 이하로 입력해주세요.");
        return;
      }

      const res = await createManagerReview(Number(reservationId), rating, content);
      setReservation((prev) =>
      prev
        ? {
            ...prev,
            managerReviewId: res.reviewId,
            managerRating: res.rating,
            managerContent: res.content,
            managerCreateAt: res.createdAt,
          }
        : prev
    );
    } catch (error) {
      alert("리뷰 등록 중 오류가 발생하였습니다.");
    }
  };

  return (
    <Fragment>
      <div className="w-full self-stretch inline-flex flex-col justify-start items-start">
        {/* 상단 헤더 */}
        <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
          <div className="text-gray-900 text-xl font-bold font-['Inter'] leading-normal">예약 관리</div>
          <div className="flex gap-2">
            <Link 
              to="/managers/reservations"
              className="h-10 px-4 flex justify-center items-center border rounded-md text-sm text-gray-500 hover:bg-gray-100 cursor-pointer">
              목록으로
            </Link>
          </div>
        </div>
        {/* 본문 */}
        <div className="self-stretch p-6 flex flex-col justify-start items-start gap-6">
          <div className="self-stretch p-8 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-6">
            {/* 예약정보 */}
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">예약 정보</div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">예약 번호</div>
                  <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{reservation.reservationId}</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">예약 일시</div>
                  <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{reservation.requestDate}</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">예약 시간</div>
                  <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{formatTimeRange(reservation.startTime, reservation.turnaround)}</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">서비스 종류</div>
                  <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{reservation.serviceName}</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  {(() => {
                    const statusInfo = getReservationStatusStyle(reservation.status);
                    return (
                      <Fragment>
                        <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">예약 상태</div>
                        <div className={`h-7 px-3 rounded-2xl flex justify-center items-center ${statusInfo.bgColor}`}>
                          <div className={`text-sm font-medium font-['Inter'] leading-none ${statusInfo.textColor}`}>
                            {statusInfo.label}
                          </div>
                        </div>
                      </Fragment>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* 고객정보 */}
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">고객 정보</div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">고객명</div>
                  <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{reservation.customerName}</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">연락처</div>
                  <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{reservation.customerPhone}</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">주소</div>
                  <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{reservation.customerAddress}</div>
                </div>
              </div>
            </div>

            {/* 서비스 상세 */}
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">서비스 상세</div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">서비스 항목</div>
                  <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{reservation.extraServiceName}</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">요청사항</div>
                  <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{reservation.memo? reservation.memo : "-"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 체크인/체크아웃 */}
          {['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(reservation.status) && (
            <div className="self-stretch p-8 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">체크인/체크아웃</div>
                <div className="self-stretch inline-flex justify-start items-center gap-4">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch inline-flex justify-between items-center">
                      <div className="justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">체크인</div>
                      <div className="justify-start text-slate-500 text-sm font-normal font-['Inter'] leading-none">{reservation.inTime ? reservation.inTime : "미완료"}</div>
                    </div>
                    <button 
                      onClick={() => {
                        setCheckType("IN")
                        setOpenModal(true)
                      }}
                      disabled={!!reservation.inTime}
                      className={`self-stretch h-12 rounded-lg inline-flex justify-center items-center ${
                        reservation.inTime ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                      }`}
                    >
                        <div className="justify-start text-white text-base font-medium font-['Inter'] leading-tight">{reservation.inTime ? "체크인 완료" : "체크인 하기"}</div>
                    </button>
                  </div>
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch inline-flex justify-between items-center">
                      <div className="justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">체크아웃</div>
                      <div className="justify-start text-slate-500 text-sm font-normal font-['Inter'] leading-none">{reservation.outTime ? reservation.outTime : "미완료"}</div>
                    </div>
                    <button 
                      onClick={() => {
                        setCheckType("OUT")
                        setOpenModal(true)
                      }}
                      disabled={!reservation.inTime || !!reservation.outTime}
                      className={`self-stretch h-12 rounded-lg inline-flex justify-center items-center ${
                        (!reservation.inTime  || reservation.outTime) ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                      }`}
                    >
                        <div className="justify-start text-white text-base font-medium font-['Inter'] leading-tight">{reservation.outTime ? "체크아웃 완료" : "체크아웃 하기"}</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          

          {/* 리뷰 */}
          {reservation.outTime && reservation.status === 'COMPLETED' && (
            <div className="self-stretch p-8 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">수요자 리뷰</div>

              {/* 수요자 리뷰 */}
              {reservation.customerReviewId ? (
                <div
                  key={reservation.customerReviewId}
                  className="self-stretch p-6 bg-slate-50 rounded-lg flex flex-col justify-start items-start gap-4 mb-4"
                >
                  {/* 상단: 별점, 날짜 */}
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="flex justify-start items-center gap-1.5">
                      <div className="flex justify-end items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className={`material-icons-outlined text-base ${
                              (reservation.customerRating ?? 0) >= i ? 'text-yellow-400' : 'text-slate-300'
                            }`}
                          >
                            star
                          </span>
                        ))}
                        <div className="text-slate-700 text-sm font-semibold leading-none ml-1">
                          {(reservation.customerRating ?? 0).toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start items-center gap-3">
                      <div className="inline-flex flex-col justify-center items-start">
                        <div className="text-slate-500 text-sm font-normal leading-none">
                          {reservation.customerCreateAt}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 하단: 리뷰 내용 */}
                  <div className="self-stretch text-slate-700 text-base font-normal leading-tight">
                    {reservation.customerContent}
                  </div>
                </div>
              ) : (
                <div className="self-stretch p-6 bg-slate-50 rounded-lg flex flex-col justify-start items-start gap-4 mb-4">아직 등록된 리뷰가 없습니다.</div>
              )}

              <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">매니저 리뷰</div>

              {/* 매니저 리뷰 */}
              {reservation.managerReviewId ? (
                <div
                  key={reservation.managerReviewId}
                  className="self-stretch p-6 bg-slate-50 rounded-lg flex flex-col justify-start items-start gap-4 mb-4"
                >
                  {/* 상단: 별점, 날짜 */}
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="flex justify-start items-center gap-1.5">
                      <div className="flex justify-end items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className={`material-icons-outlined text-base ${
                              (reservation.managerRating ?? 0) >= i ? 'text-yellow-400' : 'text-slate-300'
                            }`}
                          >
                            star
                          </span>
                        ))}
                        <div className="text-slate-700 text-sm font-semibold leading-none ml-1">
                          {(reservation.managerRating ?? 0).toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start items-center gap-3">
                      <div className="inline-flex flex-col justify-center items-start">
                        <div className="text-slate-500 text-sm font-normal leading-none">
                          {reservation.managerCreateAt}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 하단: 리뷰 내용 */}
                  <div className="self-stretch text-slate-700 text-base font-normal leading-tight">
                    {reservation.managerContent}
                  </div>
                </div>
              ) : (
                <Fragment>
              <div className="self-stretch flex justify-start items-center gap-2">
                  <div className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">평점</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        onClick={() => setRating(i)}
                        className="w-8 h-8 flex justify-center items-center cursor-pointer"
                      >
                        <span
                          className={`material-icons-outlined text-base ${
                            rating >= i ? "text-yellow-400" : "text-slate-300"
                          }`}
                        >
                          star
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">리뷰 내용</div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="self-stretch h-28 px-4 py-3 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-start items-starte"
                    placeholder="서비스에 대한 리뷰를 작성해주세요"
                  />
                </div>
                <div className="self-stretch inline-flex justify-end items-center">
                  <button 
                    onClick={() => { handleReview() }}
                    className="w-40 h-12 rounded-lg flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
                    <div className="justify-start text-white text-base font-medium font-['Inter'] leading-tight">리뷰 작성하기</div>
                  </button>
                </div>
              </Fragment>
              )}

            </div>
          )}
        </div>
      </div>

      <CleanignLogModal
        open={openModal}
        checkType={checkType}
        // checkId={reservation.checkId ?? undefined}
        // fileId={
        //   checkType === "IN"
        //     ? reservation.inFileId ?? undefined
        //     : reservation.outFileId ?? undefined
        // }
        files={checkType === "IN" ? checkInFiles : checkOutFiles}
        setFiles={checkType === "IN" ? setCheckInFiles : setCheckOutFiles}
        onCheck={() => { 
          if (checkType === "IN" || checkType === "OUT") {
            handleCheck(checkType);
          } 
        }}
        onClose={() => setOpenModal(false)}
      />
    </Fragment>
  );
};
