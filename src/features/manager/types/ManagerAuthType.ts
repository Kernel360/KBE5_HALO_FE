// 매니저 회원가입
export interface createManagerSignup {
  phone: string
  email: string
  password: string
  userName: string
  birthDate: string
  gender: string
  latitude: number
  longitude: number
  roadAddress: string
  detailAddress: string
  bio: string
  profileImageId: number | null
  fileId: number | null
  availableTimes: {
    dayOfWeek: string
    time: string
  }[]
  provider?: string
  providerId?: string
}

export interface ManagerSignupReqDTO {
  userSignupReqDTO: {
    phone: string
    userName: string
    email: string
    password: string
    status: string
    provider?: string
    providerId?: string
  }
  userInfoSignupReqDTO: {
    birthDate: string
    gender: string
    latitude: number
    longitude: number
    roadAddress: string
    detailAddress: string
  }
  availableTimeReqDTOList: {
    dayOfWeek: string
    time: string
  }[]
  managerReqDTO: {
    specialty: number | string
    bio: string
    fileId: number | null
    profileImageFileId: number | null
  }
}