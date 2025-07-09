import { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { ManagerReservationDetail as ManagerReservationType } from '@/features/manager/types/ManagerReservationType'
import {
  checkIn,
  checkOut,
  getManagerReservation,
  acceptReservation,
  rejectReservation
} from '@/features/manager/api/managerReservation'
import { MangerServiceCheckLogModal } from '@/features/manager/components/MangerServiceCheckLogModal'
import { createManagerReview } from '@/features/manager/api/managerReview'
import { isValidLength } from '@/shared/utils/validation'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/ui/Card'
import { Loading } from '@/shared/components/ui/Loading'
import { getCustomerProfile } from '@/features/manager/api/customerProfile'
import type { CustomerProfile } from '@/features/manager/types/CustomerProfileType'
import SuccessToast from '@/shared/components/ui/toast/SuccessToast'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import { ReservationInfoCard } from '@/features/manager/components/ReservationInfoCard'
import { ServiceDetailCard } from '@/features/manager/components/ServiceDetailCard'
import { AddressMapCard } from '@/features/manager/components/AddressMapCard'
import { CancelInfoCard } from '@/features/manager/components/CancelInfoCard'
import { CheckInOutCard } from '@/features/manager/components/CheckInOutCard'
import { ReviewSection } from '@/features/manager/components/ReviewSection'
import { CRMSection } from '@/features/manager/components/CRMSection'
import {
  createFileGroup,
  updateFileGroup,
  uploadFilesAndGetUrls,
} from '@/shared/utils/fileUpload'
import ManagerAcceptModal from '../../components/ManagerAcceptModal'
import ManagerRejectModal from '../../components/ManagerRejectModal'

// 명확한 타입 정의
interface CustomerNote {
  id: number;
  content: string;
  tag: string;
  createdAt: string;
  createdBy: string;
}

export const ManagerReservationDetail = () => {
  // 모든 훅 선언을 컴포넌트 함수 최상단에 위치
  const { reservationId } = useParams()
  const [reservation, setReservation] = useState<ManagerReservationType | null>(null)
  const [checkType, setCheckType] = useState<'IN' | 'OUT'>('IN')
  const [openModal, setOpenModal] = useState(false)
  const [checkInFileId, setCheckInFileId] = useState<number | null>(null)
  const [checkInFileUrls, setCheckInFileUrls] = useState<string[]>([])
  const [checkInFiles, setCheckInFiles] = useState<File[]>([])
  const [checkOutFileId, setCheckOutFileId] = useState<number | null>(null)
  const [checkOutFileUrls, setCheckOutFileUrls] = useState<string[]>([])
  const [checkOutFiles, setCheckOutFiles] = useState<File[]>([])
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [openRejectModal, setOpenRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [customerNotes, setCustomerNotes] = useState<CustomerNote[]>([
    {
      id: 1,
      content: '홈클리닝 서비스를 매우 만족해하시는 고객입니다. 꼼꼼한 청소를 선호하십니다.',
      tag: 'preference',
      createdAt: '2024-01-10T10:00:00Z',
      createdBy: '김매니저'
    },
    {
      id: 2,
      content: '반려동물(강아지)이 있어서 소음에 민감할 수 있습니다.',
      tag: 'attention',
      createdAt: '2024-01-05T14:30:00Z',
      createdBy: '이매니저'
    }
  ])
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null)
  const [openAcceptModal, setOpenAcceptModal] = useState(false)
  const [successToastMessage, setSuccessToastMessage] = useState<string | null>(null)
  const [errorToastMessage, setErrorToastMessage] = useState<string | null>(null)
  const [checkInUploadedFiles, setCheckInUploadedFiles] = useState<{ name: string; url: string; size: number }[]>([])
  const [checkOutUploadedFiles, setCheckOutUploadedFiles] = useState<{ name: string; url: string; size: number }[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // 문의사항 조회
  useEffect(() => {
    if (!reservationId) return;
    getManagerReservation(Number(reservationId)).then((data) => {
      // Map API fields to ReviewSection expected fields
      setReservation(
        data
          ? {
              ...data,
              customerContent: data.customerReviewContent ?? data.customerContent,
              customerRating: data.customerReviewRating ?? data.customerRating,
              managerContent: data.managerReviewContent ?? data.managerContent,
              managerRating: data.managerReviewRating ?? data.managerRating,
            }
          : null,
      );
    });
  }, [reservationId]);

  useEffect(() => {
    if (reservation?.customerId) {
      getCustomerProfile(reservation.customerId).then(setCustomerProfile);
    }
  }, [reservation?.customerId]);

  // 체크인 파일 자동 업로드
  useEffect(() => {
    if (checkInFiles.length > 0) {
      (async () => {
        setIsUploading(true)
        try {
          const newUrls = await uploadFilesAndGetUrls(checkInFiles)
          let fileId = checkInFileId
          const allUrls = [...checkInFileUrls, ...newUrls]
          if (!fileId) {
            fileId = await createFileGroup(checkInFiles)
            setCheckInFileId(fileId)
            setCheckInFileUrls(newUrls)
            setCheckInUploadedFiles(newUrls.map((url, i) => ({
              name: checkInFiles[i].name,
              url,
              size: checkInFiles[i].size,
            })))
          } else {
            await updateFileGroup(fileId, allUrls)
            setCheckInFileUrls(allUrls)
            setCheckInUploadedFiles(prev => [
              ...prev,
              ...newUrls.map((url, i) => ({
                name: checkInFiles[i].name,
                url,
                size: checkInFiles[i].size,
              })),
            ])
          }
          setCheckInFiles([])
        } finally {
          setIsUploading(false)
        }
      })()
    }
  }, [checkInFiles])

  // 체크아웃 파일 자동 업로드
  useEffect(() => {
    if (checkOutFiles.length > 0) {
      (async () => {
        setIsUploading(true)
        try {
          const newUrls = await uploadFilesAndGetUrls(checkOutFiles)
          let fileId = checkOutFileId
          const allUrls = [...checkOutFileUrls, ...newUrls]
          if (!fileId) {
            fileId = await createFileGroup(checkOutFiles)
            setCheckOutFileId(fileId)
            setCheckOutFileUrls(newUrls)
            setCheckOutUploadedFiles(newUrls.map((url, i) => ({
              name: checkOutFiles[i].name,
              url,
              size: checkOutFiles[i].size,
            })))
          } else {
            await updateFileGroup(fileId, allUrls)
            setCheckOutFileUrls(allUrls)
            setCheckOutUploadedFiles(prev => [
              ...prev,
              ...newUrls.map((url, i) => ({
                name: checkOutFiles[i].name,
                url,
                size: checkOutFiles[i].size,
              })),
            ])
          }
          setCheckOutFiles([])
        } finally {
          setIsUploading(false)
        }
      })()
    }
  }, [checkOutFiles])

  // reservation이 없을 때는 훅 실행 이후에 return
  if (!reservation) {
    return <Loading message="예약 정보를 불러오는 중..." fullScreen />;
  }

  // 체크인/체크아웃 하기
  const handleCheck = async (checkType: "IN" | "OUT") => {
    try {
      if (checkType === "IN") {
        if (!reservationId) {
          setErrorToastMessage("예약 ID가 없습니다.");
          return;
        }
        // 파일 업로드가 선택사항이므로, 파일이 없어도 진행
        const res = await checkIn(Number(reservationId), checkInFileId ?? undefined);
        setReservation((prev) =>
          prev
            ? {
                ...prev,
                checkId: res.checkId,
                inTime: res.inTime,
                inFileId: res.inFileId,
                status: res.status,
                statusName: res.statusName,
              }
            : prev,
        );
        setSuccessToastMessage("체크인이 완료되었습니다.");
        setOpenModal(false);
      }

      if (checkType === "OUT") {
        // 파일 업로드가 선택사항이므로, 파일이 없어도 진행
        if (!reservation?.checkId || !reservation?.inTime) {
          setErrorToastMessage("체크인을 먼저 진행해주세요.");
          return;
        }
        const res = await checkOut(Number(reservationId), checkOutFileId ?? undefined);
        setReservation((prev) =>
          prev
            ? {
                ...prev,
                checkId: res.checkId,
                outTime: res.outTime,
                outFileId: res.outFileId,
                status: res.status,
                statusName: res.statusName,
              }
            : prev,
        );
        setSuccessToastMessage("체크아웃이 완료되었습니다.");
        setOpenModal(false);
      }
    } catch (error) {
      // 우선순위: 응답 data의 message > error.message > 기본 메시지
      const errMsg = (error as any)?.response?.data?.message || (error as any)?.message || `${checkType === "IN" ? "체크인" : "체크아웃"} 요청 중 오류가 발생했습니다.`;
      setErrorToastMessage(errMsg);
    }
  };

  // 매니저 리뷰 등록하기
  const handleReview = async () => {
    try {
      if (rating < 1) {
        setErrorToastMessage("별점은 1점 이상 가능합니다.");
        return;
      }
      if (!isValidLength(content, 1, 600)) {
        setErrorToastMessage("리뷰 내용은 필수 입력 항목이며, 600자 이하로 입력해주세요.");
        return;
      }
      const res = await createManagerReview(
        Number(reservationId),
        rating,
        content,
      );
      setReservation(prev =>
        prev
          ? {
              ...prev,
              managerReviewId: res.reviewId,
              managerRating: res.rating,
              managerContent: res.content,
              managerCreateAt: res.createdAt,
            }
          : prev,
      );
      setSuccessToastMessage("리뷰가 등록되었습니다.");
    } catch (error) {
      const errMsg = (error as any)?.response?.data?.message || (error as any)?.message || "리뷰 등록 중 오류가 발생하였습니다.";
      setErrorToastMessage(errMsg);
    }
  };

  // 예약 수락
  const handleAccept = async () => {
    try {
      if (!reservationId) {
        setErrorToastMessage("예약 ID가 없습니다.");
        return;
      }
      await acceptReservation(Number(reservationId));
      setReservation(prev => prev ? {
        ...prev,
        status: "CONFIRMED",
      } : prev);
      setSuccessToastMessage("예약이 수락되었습니다.");
    } catch (error) {
      const errMsg = (error as any)?.response?.data?.message || (error as any)?.message || "예약 수락 중 오류가 발생하였습니다.";
      setErrorToastMessage(errMsg);
    }
  };

  // 예약 거절
  const handleReject = async () => {
    try {
      if (!reservationId) {
        setErrorToastMessage("예약 ID가 없습니다.");
        return;
      }
      if (!rejectReason.trim()) {
        setErrorToastMessage("거절 사유를 입력해주세요.");
        return;
      }
      await rejectReservation(Number(reservationId), rejectReason);
      setReservation(prev => prev ? {
        ...prev,
        status: "REJECTED",
      } : prev);
      setOpenRejectModal(false);
      setRejectReason("");
      setSuccessToastMessage("예약이 거절되었습니다.");
    } catch (error) {
      const errMsg = (error as any)?.response?.data?.message || (error as any)?.message || "예약 거절 중 오류가 발생하였습니다.";
      setErrorToastMessage(errMsg);
    }
  };

  // 고객 메모 추가
  const handleAddCustomerNote = (note: string, tag: string) => {
    const newNote = {
      id: Date.now(),
      content: note,
      tag,
      createdAt: new Date().toISOString(),
      createdBy: '현재매니저'
    }
    setCustomerNotes(prev => [newNote, ...prev])
    alert('메모가 추가되었습니다.')
  }

  // 고객 메모 삭제
  const handleDeleteCustomerNote = (noteId: number) => {
    if (confirm('이 메모를 삭제하시겠습니까?')) {
      setCustomerNotes(prev => prev.filter(note => note.id !== noteId))
      alert('메모가 삭제되었습니다.')
    }
  }

  // 고객에게 메시지 보내기
  const handleSendMessage = (message: string) => {
    // 실제로는 SMS API 또는 메시징 시스템 연동
    alert(`${reservation?.userName}님에게 메시지가 전송되었습니다.`)
  }

  // 고객 등급 업데이트
  const handleUpdateGrade = () => {
    // 고객 등급 업데이트 기능은 추후 구현 예정입니다.
    alert('고객 등급 업데이트 기능은 추후 구현 예정입니다.');
  }

  // 다음 예약 제안
  const handleProposeBooking = () => {
    const message = `${reservation?.userName}님, 안녕하세요! 다음주 같은 시간에 정기 서비스 예약은 어떠신가요? 미리 예약하시면 더 편리하실 것 같아요.`
    handleSendMessage(message)
  }

  // 체크인 파일 삭제 핸들러
  const handleRemoveCheckInUploadedFile = (idx: number) => {
    const newUploaded = checkInUploadedFiles.filter((_, i) => i !== idx);
    const newUrls = newUploaded.map(f => f.url);
    setCheckInUploadedFiles(newUploaded);
    setCheckInFileUrls(newUrls);
    if (checkInFileId) {
      updateFileGroup(checkInFileId, newUrls);
    }
  };
  // 체크아웃 파일 삭제 핸들러
  const handleRemoveCheckOutUploadedFile = (idx: number) => {
    const newUploaded = checkOutUploadedFiles.filter((_, i) => i !== idx);
    const newUrls = newUploaded.map(f => f.url);
    setCheckOutUploadedFiles(newUploaded);
    setCheckOutFileUrls(newUrls);
    if (checkOutFileId) {
      updateFileGroup(checkOutFileId, newUrls);
    }
  };

  return (
    <Fragment>
      <div className="inline-flex w-full flex-col items-start justify-start self-stretch">
        <PageHeader
          title="예약 관리"
          actions={
            <Link
              to="/managers/reservations"
              className="flex h-10 cursor-pointer items-center justify-center rounded-md border px-4 text-sm text-gray-500 hover:bg-gray-100">
              목록으로
            </Link>
          }
        />
        {/* 본문 */}
        <div className="flex flex-col items-start justify-start gap-6 self-stretch p-6">
          <Card className="flex flex-col items-start justify-start gap-6 self-stretch rounded-xl bg-white p-8 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)]">
            <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* 왼쪽: 예약 정보 + 서비스 상세 + 리뷰 */}
              <div className="flex flex-col gap-8">
                <ReservationInfoCard reservation={reservation} customerProfile={customerProfile} />
                <ServiceDetailCard reservation={reservation} />
                <ReviewSection
                  reservation={reservation}
                  rating={rating}
                  content={content}
                  onRatingChange={setRating}
                  onContentChange={setContent}
                  onSubmit={handleReview}
                  improvedDesign
                />
              </div>
              {/* 오른쪽: 서비스 주소(지도) + 체크인/체크아웃 */}
              <div className="flex flex-col gap-8">
                <AddressMapCard reservation={reservation} />
                {['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(reservation.status) && (
                  <CheckInOutCard
                    reservation={reservation}
                    setCheckType={setCheckType}
                    setOpenModal={setOpenModal}
                  />
                )}
              </div>
            </div>
            <CancelInfoCard reservation={reservation} />
            <CRMSection
              customerProfile={customerProfile}
              customerNotes={customerNotes}
              handleAddCustomerNote={handleAddCustomerNote}
              handleDeleteCustomerNote={handleDeleteCustomerNote}
              handleSendMessage={handleSendMessage}
              handleProposeBooking={handleProposeBooking}
              handleUpdateGrade={handleUpdateGrade}
            />
            {reservation.status === "REQUESTED" && (
              <div className="w-full flex justify-center mt-4">
                <div className="w-full max-w-xl rounded-2xl shadow-lg border border-yellow-200 bg-white p-6 flex flex-col items-center gap-4">
                  {/* 상단 아이콘/타이틀/뱃지 */}
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xl font-bold text-yellow-700">예약 요청 대기</span>
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">확인 필요</span>
                  </div>
                  {/* 안내 메시지 */}
                  <div className="text-sm text-yellow-700 font-medium mb-2 text-center">
                    고객의 예약 요청에 대해 수락 또는 거절을 선택해 주세요.
                  </div>
                  {/* 예약 정보 요약 */}
                  <div className="w-full flex flex-col gap-1 text-sm text-gray-700 bg-yellow-50 rounded-lg p-4 mb-2">
                    <div><span className="font-semibold text-gray-900">고객명</span> : {reservation.userName}</div>
                    <div><span className="font-semibold text-gray-900">서비스</span> : {reservation.serviceName}</div>
                    <div><span className="font-semibold text-gray-900">요청일</span> : {reservation.requestDate}</div>
                  </div>
                  {/* 버튼 영역 */}
                  <div className="flex gap-4 mt-2 w-full justify-center">
                    <button
                      className="flex-1 px-5 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                      onClick={() => setOpenAcceptModal(true)}
                    >
                      예약 수락
                    </button>
                    <button
                      className="flex-1 px-5 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                      onClick={() => setOpenRejectModal(true)}
                    >
                      예약 거절
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <MangerServiceCheckLogModal
        open={openModal}
        checkType={checkType}
        files={checkType === 'IN' ? checkInFiles : checkOutFiles}
        setFiles={checkType === 'IN' ? setCheckInFiles : setCheckOutFiles}
        onCheck={handleCheck}
        onClose={() => setOpenModal(false)}
        uploadedFiles={checkType === 'IN' ? checkInUploadedFiles : checkOutUploadedFiles}
        onRemoveUploadedFile={checkType === 'IN' ? handleRemoveCheckInUploadedFile : handleRemoveCheckOutUploadedFile}
        isUploading={isUploading}
      />

      <ManagerRejectModal
        open={openRejectModal}
        onClose={() => {
          setOpenRejectModal(false);
          setRejectReason("");
        }}
        onReject={handleReject}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
      />

      <ManagerAcceptModal
        open={openAcceptModal}
        onClose={() => setOpenAcceptModal(false)}
        onAccept={handleAccept}
      />

      {/* 업로드된 체크인 파일 리스트 표시 (임시) */}
      {checkInUploadedFiles.length > 0 && (
        <div className="mt-2">
          <div className="font-semibold">체크인 업로드 파일</div>
          <ul>
            {checkInUploadedFiles.map((file, idx) => (
              <li key={idx} className="text-xs text-gray-600">
                <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* 업로드된 체크아웃 파일 리스트 표시 (임시) */}
      {checkOutUploadedFiles.length > 0 && (
        <div className="mt-2">
          <div className="font-semibold">체크아웃 업로드 파일</div>
          <ul>
            {checkOutUploadedFiles.map((file, idx) => (
              <li key={idx} className="text-xs text-gray-600">
                <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {successToastMessage && (
        <SuccessToast open={!!successToastMessage} message={successToastMessage} onClose={() => setSuccessToastMessage(null)} />
      )}
      {errorToastMessage && (
        <ErrorToast open={!!errorToastMessage} message={errorToastMessage} onClose={() => setErrorToastMessage(null)} />
      )}
    </Fragment>
  )
}
