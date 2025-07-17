import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchAdminReservationById } from '@/features/admin/api/adminReservation'
import type { AdminReservationDetailData } from '@/features/admin/types/AdminReservationType'
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader'
import { Button } from '@/shared/components/ui/Button'
import Loading from '@/shared/components/ui/Loading'
import Toast from '@/shared/components/ui/toast/Toast'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import SuccessToast from '@/shared/components/ui/toast/SuccessToast'
import Card from '@/shared/components/ui/Card'
import { AddressMapCardForCustomer } from '@/features/manager/components/AddressMapCard'
import DetailField from '@/shared/components/ui/DetailField'
import {
  RESERVATION_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS
} from '@/features/admin/types/AdminReservationType'
import Badge from '@/shared/components/ui/Badge'

function getReservationStatusBadge(status?: string) {
  const option = RESERVATION_STATUS_OPTIONS.find(opt => opt.value === status)
  let color:
    | 'gray'
    | 'yellow'
    | 'blue'
    | 'indigo'
    | 'green'
    | 'red'
    | 'default' = 'gray'
  switch (status) {
    case 'PENDING':
      color = 'yellow'
      break
    case 'CONFIRMED':
      color = 'blue'
      break
    case 'IN_PROGRESS':
      color = 'indigo'
      break
    case 'COMPLETED':
      color = 'green'
      break
    case 'CANCELLED':
      color = 'red'
      break
    default:
      color = 'gray'
  }
  return <Badge color={color}>{option?.label || status || '-'}</Badge>
}
function getPaymentStatusBadge(status?: string) {
  const option = PAYMENT_STATUS_OPTIONS.find(opt => opt.value === status)
  let color:
    | 'gray'
    | 'yellow'
    | 'blue'
    | 'indigo'
    | 'green'
    | 'red'
    | 'default' = 'gray'
  switch (status) {
    case 'SUCCESS':
      color = 'green'
      break
    case 'COMPLETED':
      color = 'green'
      break
    case 'FAILED':
      color = 'red'
      break
    case 'CANCELED':
      color = 'yellow'
      break
    case 'REFUNDED':
      color = 'blue'
      break
    case 'PENDING':
      color = 'gray'
      break
    default:
      color = 'gray'
  }
  return <Badge color={color}>{option?.label || status || '-'}</Badge>
}

// 예약 정보 카드
const ReservationInfoCard = ({
  reservation
}: {
  reservation: AdminReservationDetailData
}) => (
  <Card className="border border-slate-200 bg-white p-8 shadow-md">
    <div className="mb-6 text-xl font-bold text-slate-800">예약 정보</div>
    <div className="flex flex-col gap-4">
      <DetailField
        label="서비스명"
        value={reservation.serviceName}
      />
      <DetailField
        label="예약 ID"
        value={reservation.reservationId}
      />
      <DetailField
        label="예약일"
        value={reservation.requestDate}
      />
      <DetailField
        label="예약 상태"
        value={getReservationStatusBadge(reservation.reservationStatus)}
      />
      <DetailField
        label="결제 상태"
        value={getPaymentStatusBadge(reservation.paymentStatus)}
      />
      <DetailField
        label="결제 일시"
        value={reservation.paidAt}
      />
    </div>
  </Card>
)

// 고객 정보 카드
const CustomerInfoCard = ({
  reservation
}: {
  reservation: AdminReservationDetailData
}) => (
  <Card className="border border-slate-200 bg-white p-8 shadow-md">
    <div className="mb-6 text-xl font-bold text-slate-800">고객 정보</div>
    <div className="flex flex-col gap-4">
      <DetailField
        label="고객명"
        value={reservation.customerName}
      />
      <DetailField
        label="연락처"
        value={reservation.customerPhone}
      />
    </div>
  </Card>
)

// 매니저 정보 카드
const ManagerInfoCard = ({
  reservation
}: {
  reservation: AdminReservationDetailData
}) => (
  <Card className="border border-slate-200 bg-white p-8 shadow-md">
    <div className="mb-6 text-xl font-bold text-slate-800">매니저 정보</div>
    <div className="flex flex-col gap-4">
      <DetailField
        label="매니저명"
        value={reservation.managerName}
      />
      <DetailField
        label="연락처"
        value={reservation.managerPhone}
      />
    </div>
  </Card>
)

// 주소/지도 카드
const AddressMapCardCard = ({
  reservation
}: {
  reservation: AdminReservationDetailData
}) => (
  <Card className="border border-slate-200 bg-white p-8 shadow-md">
    <div className="mb-6 text-xl font-bold text-slate-800">주소 및 서비스 지역</div>
    <AddressMapCardForCustomer
      reservation={{
        roadAddress: reservation.roadAddress,
        detailAddress: reservation.detailAddress
      }}
    />
  </Card>
)

// 메모 카드
const MemoCard = ({ memo }: { memo?: string }) => (
  <Card className="border border-slate-200 bg-white p-8 shadow-md">
    <div className="mb-2 text-xl font-bold text-slate-800">예약 메모</div>
    <div className="rounded bg-gray-50 p-4 text-base whitespace-pre-line text-slate-700">
      {memo}
    </div>
  </Card>
)

export const AdminReservationDetail = () => {
  const { reservationId } = useParams<{ reservationId: string }>()
  const navigate = useNavigate()

  const [reservation, setReservation] = useState<AdminReservationDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null)
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!reservationId) {
      setErrorToastMsg('예약 ID가 없습니다.')
      return
    }

    const fetchReservation = async () => {
      try {
        setLoading(true)
        const data = await fetchAdminReservationById(reservationId)
        setReservation({
          ...(data as unknown as AdminReservationDetailData)
        })
      } catch (e) {
        let errorMsg = '예약 정보를 불러오지 못했습니다.'
        if (e instanceof Error) {
          errorMsg = e.message
        } else if (
          typeof e === 'object' &&
          e &&
          'response' in e &&
          typeof (e as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
        ) {
          errorMsg = (e as { response: { data: { message: string } } }).response.data.message
        }
        setErrorToastMsg(errorMsg)
      } finally {
        setLoading(false)
      }
    }
    fetchReservation()
  }, [reservationId])

  if (loading) {
    return (
      <div className="h-screen w-full">
        <Loading
          message="예약 정보를 불러오는 중..."
          size="lg"
          className="h-full"
        />
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-lg text-red-500">
          예약 정보를 찾을 수 없습니다.
        </div>
      </div>
    )
  }

  return (
    <>
      <SuccessToast
        open={!!successToastMsg}
        message={successToastMsg || ''}
        onClose={() => setSuccessToastMsg(null)}
      />
      <ErrorToast
        open={!!errorToastMsg}
        message={errorToastMsg || ''}
        onClose={() => setErrorToastMsg(null)}
      />
      <Toast
        open={!!toastMsg}
        message={toastMsg || ''}
        onClose={() => setToastMsg(null)}
      />
      <div className="flex min-h-screen w-full flex-col bg-slate-50">
        <AdminPageHeader
          title="예약 상세 정보"
          actions={
            <Button
              className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
              onClick={() => navigate('/admin/reservations')}
            >
              ← 목록으로
            </Button>
          }
        />
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-10">
          <ReservationInfoCard reservation={reservation} />
          {reservation.memo && <MemoCard memo={reservation.memo} />}
          <CustomerInfoCard reservation={reservation} />
          <ManagerInfoCard reservation={reservation} />
          <AddressMapCardCard reservation={reservation} />
        </div>
      </div>
    </>
  )
};
