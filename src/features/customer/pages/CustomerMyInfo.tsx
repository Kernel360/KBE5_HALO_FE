import React, { useEffect, useState } from 'react'
import type {
  CustomerDetailInfoType,
  UserInfoUpdateInfoType
} from '../types/CustomerInfoType'
import { getCustomerInfo, updateCustomerInfo } from '../api/customerAuth'
import { User, MapPin, Gift, PenLine, Save } from 'lucide-react'
import { PointChargingModal } from '@/features/customer/modal/PointChargingModal'
import SuccessToast from '@/shared/components/ui/toast/SuccessToast'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import AddressSearch from '@/shared/components/AddressSearch'

const genderDisplayMap = {
  MALE: '남',
  FEMALE: '여'
} as const

export const CustomerMyInfo: React.FC = () => {
  const [info, setInfo] = useState<CustomerDetailInfoType | null>(null)
  const [isChargingModalOpen, setIsChargingModalOpen] = useState(false)
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null)
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null)
  const [address, setAddress] = useState({
    roadAddress: '',
    detailAddress: '',
    latitude: 0,
    longitude: 0
  })
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({
    email: '',
    roadAddress: '',
    detailAddress: '',
    latitude: 0,
    longitude: 0
  })
  const [addressLoading, setAddressLoading] = useState(false)

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const res = await getCustomerInfo()
        setInfo({
          ...res.body,
          gender:
            genderDisplayMap[res.body.gender as keyof typeof genderDisplayMap],
          point: res.body.point
        })
        setAddress({
          roadAddress: res.body.roadAddress,
          detailAddress: res.body.detailAddress,
          latitude: res.body.latitude,
          longitude: res.body.longitude
        })
        setEditForm({
          email: res.body.email,
          roadAddress: res.body.roadAddress,
          detailAddress: res.body.detailAddress,
          latitude: res.body.latitude,
          longitude: res.body.longitude
        })
      } catch {
        setErrorToastMsg('회원 정보를 불러오지 못했습니다.')
      }
    }
    fetchCustomerInfo()
  }, [])

  const handleChargingSuccess = (chargedAmount: number) => {
    // 충전 성공 후 포인트 정보 새로고침
    const fetchUpdatedInfo = async () => {
      try {
        const res = await getCustomerInfo()
        setInfo({
          ...res.body,
          gender:
            genderDisplayMap[res.body.gender as keyof typeof genderDisplayMap],
          point: res.body.point
        })

        // 성공 토스트 표시
        setSuccessToastMsg(
          `${chargedAmount.toLocaleString()}P가 충전되었습니다.`
        )
      } catch (error) {
        setErrorToastMsg(
          (error as Error).message ||
            '충전 후 회원 정보 새로고침에 실패했습니다.'
        )
      }
    }
    fetchUpdatedInfo()
  }

  // 회원정보+주소 저장
  const handleSaveEdit = async () => {
    setAddressLoading(true)
    try {
      const payload: UserInfoUpdateInfoType = {
        userUpdateReqDTO: {
          email: editForm.email
        },
        userInfoUpdateReqDTO: {
          roadAddress: editForm.roadAddress,
          detailAddress: editForm.detailAddress,
          latitude: editForm.latitude,
          longitude: editForm.longitude
        }
      }
      await updateCustomerInfo(payload)
      setInfo(prev => (prev ? { ...prev, ...editForm } : prev))
      setAddress({
        roadAddress: editForm.roadAddress,
        detailAddress: editForm.detailAddress,
        latitude: editForm.latitude,
        longitude: editForm.longitude
      })
      setEditMode(false)
      setSuccessToastMsg('회원정보가 성공적으로 수정되었습니다.')
    } catch (error) {
      setErrorToastMsg(
        (error as Error).message || '회원정보 수정에 실패했습니다.'
      )
    } finally {
      setAddressLoading(false)
    }
  }

  if (!info) return <div>로딩 중...</div>

  return (
    <main className="w-full bg-white py-6">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-800">회원 정보</h2>
          {editMode ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={addressLoading}
                className="flex min-w-[80px] items-center justify-center gap-1 rounded-lg bg-indigo-600 px-4 py-1.5 hover:bg-indigo-700 disabled:opacity-50">
                <Save
                  size={16}
                  className="text-white"
                />
                <span className="text-sm font-semibold text-white">저장</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false)
                  setEditForm({
                    email: info.email,
                    roadAddress: info.roadAddress,
                    detailAddress: info.detailAddress,
                    latitude: info.latitude,
                    longitude: info.longitude
                  })
                }}
                className="flex min-w-[64px] items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100">
                취소
              </button>
            </div>
          ) : (
            <button
              className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-[#4f39f6] px-3 text-sm font-semibold text-[#4f39f6] hover:bg-indigo-50"
              onClick={() => setEditMode(true)}>
              <PenLine size={16} />
              수정
            </button>
          )}
        </div>

        {/* 기본 정보 */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-zinc-800">기본 정보</h3>
          </div>
          <div className="space-y-6">
            {/* 첫 번째 줄: 이름, 생년월일, 성별 */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  이름 (한글)
                </label>
                <input
                  name="userName"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 disabled:bg-gray-100"
                  value={info.userName}
                  disabled
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  생년월일
                </label>
                <input
                  type="date"
                  name="birthDate"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 disabled:bg-gray-100"
                  value={info.birthDate}
                  disabled
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  성별
                </label>
                <input
                  name="gender"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 disabled:bg-gray-100"
                  value={info.gender}
                  disabled
                />
              </div>
            </div>

            {/* 두 번째 줄: 연락처, 이메일 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  연락처
                </label>
                <input
                  name="phone"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 disabled:bg-gray-100"
                  value={info.phone}
                  disabled
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  이메일
                </label>
                {editMode ? (
                  <input
                    name="email"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    value={editForm.email}
                    onChange={e =>
                      setEditForm(f => ({ ...f, email: e.target.value }))
                    }
                  />
                ) : (
                  <input
                    name="email"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 disabled:bg-gray-100"
                    value={info.email}
                    disabled
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 포인트 섹션 */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-zinc-800">내 포인트</h3>
            </div>
            <div className="flex flex-col items-end gap-1">
              {!editMode && (
                <button
                  onClick={() => setIsChargingModalOpen(true)}
                  className="mb-1 flex h-7 cursor-pointer items-center justify-center gap-1 rounded border border-[#4f39f6] px-2 py-0.5 text-xs font-semibold text-[#4f39f6] hover:bg-indigo-50">
                  충전
                </button>
              )}
              <div className="text-xl font-bold text-gray-900">
                {info.point.toLocaleString()} P
              </div>
            </div>
          </div>
        </div>

        {/* 주소 정보 */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-zinc-800">주소 정보</h3>
          </div>
          <div className="space-y-4">
            {editMode ? (
              <div>
                <AddressSearch
                  roadAddress={editForm.roadAddress}
                  detailAddress={editForm.detailAddress}
                  setRoadAddress={val =>
                    setEditForm(f => ({ ...f, roadAddress: val }))
                  }
                  setDetailAddress={val =>
                    setEditForm(f => ({ ...f, detailAddress: val }))
                  }
                  onCoordinatesChange={(lat, lng) =>
                    setEditForm(f => ({ ...f, latitude: lat, longitude: lng }))
                  }
                  onAddressChange={(roadAddress, detailAddress, lat, lng) => {
                    setEditForm(f => ({
                      ...f,
                      roadAddress,
                      detailAddress,
                      latitude: lat,
                      longitude: lng
                    }))
                  }}
                />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    도로명 주소
                  </label>
                  <input
                    name="roadAddress"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 disabled:bg-gray-100"
                    value={address.roadAddress}
                    disabled
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    상세 주소
                  </label>
                  <input
                    name="detailAddress"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 disabled:bg-gray-100"
                    value={address.detailAddress}
                    disabled
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 포인트 충전 모달 */}
      {info && (
        <PointChargingModal
          isOpen={isChargingModalOpen}
          onClose={() => setIsChargingModalOpen(false)}
          currentPoints={info.point}
          onSuccess={handleChargingSuccess}
        />
      )}

      {/* 성공 토스트 */}
      <SuccessToast
        open={!!successToastMsg}
        message={successToastMsg || ''}
        onClose={() => setSuccessToastMsg(null)}
      />
      {/* 에러 토스트 */}
      <ErrorToast
        open={!!errorToastMsg}
        message={errorToastMsg || ''}
        onClose={() => setErrorToastMsg(null)}
      />
    </main>
  )
}
