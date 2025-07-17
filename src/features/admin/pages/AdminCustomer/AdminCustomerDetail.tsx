import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchAdminCustomerById,
  deleteAdminCustomer,
  fetchAdminCustomerReviews
} from '../../api/adminCustomer'
import { searchAdminInquiries } from '@/features/admin/api/adminInquiry'
import Loading from '@/shared/components/ui/Loading'
import SuccessToast from '@/shared/components/ui/toast/SuccessToast'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import ConfirmModal from '@/shared/components/ui/modal/ConfirmModal'
import RecentInquiriesCard from '@/features/admin/components/RecentInquiriesCard'
import RecentReviewsCard from '@/features/admin/components/RecentReviewsCard'
import DetailSection from '@/shared/components/ui/DetailSection'
import DetailField from '@/shared/components/ui/DetailField'
import { Button } from '@/shared/components/ui/Button'

// CustomerAddressMap: Kakao map with a single pinpoint (no radius)
const CustomerAddressMap: React.FC<{
  address: string
  detailAddress: string
  latitude: number
  longitude: number
}> = ({ address, detailAddress, latitude, longitude }) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const initializeMap = () => {
      if (!mapContainer.current) {
        setHasError(true)
        setIsLoading(false)
        return
      }
      if (!window.kakao || !window.kakao.maps) {
        setHasError(true)
        setIsLoading(false)
        return
      }
      try {
        const maps = (window.kakao as typeof window.kakao).maps
        const mapOption = {
          center: new maps.LatLng(latitude, longitude),
          level: 4
        }
        const map = new maps.Map(mapContainer.current, mapOption)
        const coords = new maps.LatLng(latitude, longitude)
        map.setCenter(coords)
        const marker = new maps.Marker({ map, position: coords })
        const infoWindow = new maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <div style="font-weight: bold; margin-bottom: 5px;">고객 위치</div>
              <div style="font-size: 12px; color: #666;">
                ${address}<br/>
                ${detailAddress}
              </div>
            </div>
          `
        })
        infoWindow.open(map, marker)
        setIsLoading(false)
      } catch {
        setHasError(true)
        setIsLoading(false)
      }
    }
    if (window.kakao && window.kakao.maps) {
      (window.kakao as typeof window.kakao).maps.load(() => {
        initializeMap()
      })
    } else {
      const timer = setTimeout(() => {
        if (window.kakao && window.kakao.maps) {
          (window.kakao as typeof window.kakao).maps.load(() => {
            initializeMap()
          })
        } else {
          setHasError(true)
          setIsLoading(false)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [address, detailAddress, latitude, longitude])

  return (
    <div className="mb-4 w-full">
      <div className="mb-3 flex items-center gap-2">
        <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <span className="text-sm font-medium text-slate-600">고객 위치 지도</span>
      </div>
      <div className="relative h-64 w-full rounded-lg border border-gray-200 bg-gray-100">
        <div ref={mapContainer} className="h-full w-full rounded-lg" />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100">
            <Loading message="지도를 불러오는 중..." size="md" />
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100">
            <div className="p-6 text-center">
              <svg className="mx-auto mb-3 h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <div className="mb-2 text-sm text-gray-600">지도를 불러올 수 없습니다</div>
              <div className="mb-3 text-xs text-gray-500">카카오 맵 API 키를 확인해주세요</div>
              <div className="rounded border bg-white p-2 text-xs text-gray-700">
                <div className="mb-1 font-medium">주소 정보:</div>
                <div>{address}</div>
                <div>{detailAddress}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
          <span>고객 위치</span>
        </div>
      </div>
    </div>
  )
}

// CustomerSummaryCard: shows name, phone, email, status
const CustomerSummaryCard: React.FC<{ customer: Record<string, unknown> }> = ({ customer }) => (
  <div className="flex w-full max-w-2xl flex-col gap-2 rounded-xl bg-white p-8 shadow border border-gray-200">
    <div className="mb-2 flex items-center gap-4">
      <div className="text-2xl font-bold text-slate-800">{customer.name as string}</div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${customer.status === '활성' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{customer.status as string}</span>
    </div>
    <div className="flex flex-col gap-1 text-base text-slate-700">
      <div><span className="mr-2 font-medium text-slate-500">연락처:</span>{customer.phone as string}</div>
      <div><span className="mr-2 font-medium text-slate-500">이메일:</span>{customer.email as string}</div>
    </div>
  </div>
)

// CustomerBasicInfoCard: shows name, phone, email, gender, birthDate, point
const CustomerBasicInfoCard: React.FC<{ customer: Record<string, unknown> }> = ({ customer }) => (
  <div className="w-full rounded-xl border border-gray-200 bg-white p-8 shadow">
    <DetailSection title="기본 정보">
      <DetailField label="이름" value={customer.name as string} />
      <DetailField label="연락처" value={customer.phone as string} />
      <DetailField label="이메일" value={customer.email as string} />
      <DetailField label="성별" value={
        customer.gender === 'MALE'
          ? '남성'
          : customer.gender === 'FEMALE'
            ? '여성'
            : (customer.gender as string)
      } />
      <DetailField label="생년월일" value={customer.birthDate as string} />
      <DetailField label="포인트" value={
        typeof customer.point === 'number'
          ? customer.point.toLocaleString()
          : ''
      } />
    </DetailSection>
  </div>
)

// CustomerAddressCard: shows map, roadAddress, detailAddress
const CustomerAddressCard: React.FC<{ customer: Record<string, unknown> }> = ({ customer }) => (
  <div className="w-full rounded-xl border border-gray-200 bg-white p-8 shadow">
    <DetailSection title="주소 정보">
      <CustomerAddressMap
        address={customer.roadAddress as string}
        detailAddress={customer.detailAddress as string}
        latitude={typeof customer.latitude === 'number' ? customer.latitude : 0}
        longitude={typeof customer.longitude === 'number' ? customer.longitude : 0}
      />
      <DetailField label="도로명 주소" value={customer.roadAddress as string} />
      <DetailField label="상세 주소" value={customer.detailAddress as string} />
    </DetailSection>
  </div>
)

// CustomerAccountInfoCard: shows createdAt, updatedAt
const CustomerAccountInfoCard: React.FC<{ customer: Record<string, unknown> }> = ({ customer }) => (
  <div className="w-full rounded-xl border border-gray-200 bg-white p-8 shadow">
    <DetailSection title="계정 정보">
      <DetailField label="등록일" value={
        customer.createdAt
          ? new Date(customer.createdAt as string).toLocaleString()
          : ''
      } />
      <DetailField label="최근 수정일" value={
        customer.updatedAt
          ? new Date(customer.updatedAt as string).toLocaleString()
          : ''
      } />
    </DetailSection>
  </div>
)

export const AdminCustomerDetail = () => {
  const { customerId } = useParams<{ customerId: string }>()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null)
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null)

  // Recent inquiries & reviews
  const [recentInquiries, setRecentInquiries] = useState<Array<{ content: string; date?: string; full?: string; inquiryId: string }>>([])
  const [inquiriesLoading, setInquiriesLoading] = useState<boolean>(false)
  const [inquiriesError, setInquiriesError] = useState<string | null>(null)
  const [recentReviews, setRecentReviews] = useState<any[]>([])
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false)
  const [reviewsError, setReviewsError] = useState<string | null>(null)
  const [selectedReview, setSelectedReview] = useState<any>(null)

  // Notes (dummy for now)
  const [notes] = useState<unknown[]>([])

  useEffect(() => {
    if (!customerId) {
      setErrorToastMsg('고객 ID가 없습니다.')
      setLoading(false)
      return
    }
    const fetchCustomer = async () => {
      try {
        setLoading(true)
        const data = await fetchAdminCustomerById(customerId)
        setCustomer({
          id: data.customerId,
          name: data.userName,
          phone: data.phone,
          email: data.email,
          status:
            data.accountStatus === 'ACTIVE'
              ? '활성'
              : data.accountStatus === 'DELETED'
                ? '비활성'
                : data.accountStatus === 'REPORTED'
                  ? '신고됨'
                  : '활성',
          count: data.count,
          gender: data.gender,
          birthDate: data.birthDate,
          roadAddress: data.roadAddress,
          detailAddress: data.detailAddress,
          latitude: data.latitude,
          longitude: data.longitude,
          point: data.point,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        })
      } catch (e) {
        setErrorToastMsg(
          (e as any)?.response?.data?.message ||
          (e as any)?.message ||
          '고객 정보를 불러오지 못했습니다.'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchCustomer()
  }, [customerId])

  // Fetch recent inquiries for this customer
  useEffect(() => {
    if (!customerId) return
    setInquiriesLoading(true)
    setInquiriesError(null)
    searchAdminInquiries({
      authorType: 'CUSTOMER',
      authorId: customerId,
      size: 3,
      page: 0
    })
      .then(data => {
        setRecentInquiries(
          (data.content || []).map((i: any) => ({
            content: i.title?.length > 20 ? i.title.slice(0, 20) + '...' : i.title,
            date: i.createdAt?.slice(0, 10),
            full: i.title,
            inquiryId: i.inquiryId
          }))
        )
      })
      .catch(err => {
        setInquiriesError(err.message || '문의 내역을 불러오지 못했습니다.')
      })
      .finally(() => setInquiriesLoading(false))
  }, [customerId])

  // Fetch recent reviews for this customer
  useEffect(() => {
    if (!customerId) return
    setReviewsLoading(true)
    setReviewsError(null)
    fetchAdminCustomerReviews(customerId, 3, 0)
      .then(arr => {
        setRecentReviews(
          arr.map((r: any) => ({
            content: r.content,
            date: r.createdAt?.slice(0, 10),
            full: r.content,
            rating: r.rating,
            author: r.authorName,
            createdAt: r.createdAt
          }))
        )
      })
      .catch(err => {
        setReviewsError(err.message || '리뷰를 불러오지 못했습니다.')
      })
      .finally(() => setReviewsLoading(false))
  }, [customerId])

  // Delete
  const handleDeleteConfirm = () => setShowDeleteConfirm(true)
  const handleDelete = async () => {
    if (!customerId) return
    try {
      await deleteAdminCustomer(customerId)
      setSuccessToastMsg('고객이 성공적으로 삭제되었습니다.')
      setTimeout(() => {
        navigate('/admin/customers')
      }, 1000)
    } catch (e) {
      setErrorToastMsg(
        (e as any)?.response?.data?.message ||
        (e as any)?.message ||
        '삭제에 실패했습니다.'
      )
    } finally {
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loading message="고객 정보를 불러오는 중..." size="lg" />
      </div>
    )
  }
  if (!customer) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-lg text-red-500">고객 정보를 찾을 수 없습니다.</div>
      </div>
    )
  }

  // Prepare profile object for CustomerProfileCard
  // Remove the unused 'profile' variable

  return (
    <div className="flex w-full flex-col">
      <div className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="text-xl font-bold text-gray-900">고객 상세 정보</div>
        <div className="flex gap-2">
          <Button className="rounded border border-gray-300 px-4 py-2" onClick={() => navigate('/admin/customers')}>
            ← 목록으로
          </Button>
          <Button className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700" onClick={handleDeleteConfirm}>
            삭제
          </Button>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-8">
        {/* 고객 요약 정보 카드 (단순 버전) */}
        <CustomerSummaryCard customer={customer} />
        {/* <CustomerProfileCard profile={profile} /> */}
        {/* 중단 2단 그리드: 최근 문의, 최근 리뷰 */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <RecentInquiriesCard
            inquiriesLoading={inquiriesLoading}
            inquiriesError={inquiriesError}
            recentInquiries={recentInquiries}
          />
          <RecentReviewsCard
            reviewsLoading={reviewsLoading}
            reviewsError={reviewsError}
            recentReviews={recentReviews}
            reviews={recentReviews}
            selectedReview={selectedReview}
            setSelectedReview={setSelectedReview}
          />
        </div>
        {/* 상세 정보 */}
        <CustomerBasicInfoCard customer={customer} />
        <CustomerAddressCard customer={customer} />
        <CustomerAccountInfoCard customer={customer} />
        {/* 메모/노트 섹션 (관리자 메모) */}
      </div>
      <SuccessToast open={!!successToastMsg} message={successToastMsg || ''} onClose={() => setSuccessToastMsg(null)} />
      <ErrorToast open={!!errorToastMsg} message={errorToastMsg || ''} onClose={() => setErrorToastMsg(null)} />
      <ConfirmModal
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        message={`정말로 ${customer.name}님의 정보를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        cancelLabel="취소"
      />
    </div>
  )
}
