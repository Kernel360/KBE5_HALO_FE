# HALO 프론트엔드

## 프로젝트 소개

HALO는 관리자, 매니저, 고객을 위한 통합 서비스 플랫폼의 프론트엔드 프로젝트입니다.  
각 사용자 유형별로 맞춤형 대시보드, 예약, 문의, 리뷰, 정산 등 다양한 기능을 제공합니다.  
React 기반의 SPA로, 효율적인 상태 관리와 사용자 경험을 중시합니다.

---

## 폴더 구조

```plaintext
├─ features/                  # 도메인별(관리자, 고객, 매니저) 주요 비즈니스 로직 및 화면
  │   ├─ admin/                 # 관리자 기능(계정, 예약, 정산, 문의 등)
  │   │   ├─ api/               # 관리자 관련 API 함수 모음
  │   │   ├─ components/        # 관리자 전용 UI 컴포넌트
  │   │   ├─ layouts/           # 관리자 페이지 레이아웃
  │   │   ├─ pages/             # 관리자별 라우트 단위 페이지
  │   │   ├─ store/             # 관리자 전용 상태 관리(zustand 등)
  │   │   └─ types/             # 관리자 관련 타입 정의
  │   ├─ customer/              # 고객 기능(예약, 문의, 리뷰 등)
  │   │   ├─ api/               # 고객 관련 API 함수 모음
  │   │   ├─ components/        # 고객 전용 UI 컴포넌트
  │   │   ├─ layouts/           # 고객 페이지 레이아웃
  │   │   ├─ modal/             # 고객 전용 모달 컴포넌트
  │   │   ├─ pages/             # 고객별 라우트 단위 페이지
  │   │   └─ types/             # 고객 관련 타입 정의
  │   ├─ manager/               # 매니저 기능(예약, 정산, 문의 등)
  │   │   ├─ api/               # 매니저 관련 API 함수 모음
  │   │   ├─ components/        # 매니저 전용 UI 컴포넌트
  │   │   ├─ layouts/           # 매니저 페이지 레이아웃
  │   │   ├─ pages/             # 매니저별 라우트 단위 페이지
  │   │   ├─ types/             # 매니저 관련 타입 정의
  │   │   └─ utils/             # 매니저 전용 유틸리티 함수
  │   └─ notice/                # 공지사항 관련 기능
  │       ├─ api.ts             # 공지사항 API 함수
  │       └─ AdminNotices.tsx   # 관리자 공지사항 컴포넌트
  ├─ shared/                    # 전역 공통 컴포넌트, 유틸리티, 타입 등
  │   ├─ components/            # 공통 UI 컴포넌트(버튼, 모달, 토스트 등)
  │   │   └─ ui/                # 세부 UI 컴포넌트(입력, 테이블, 뱃지 등)
  │   ├─ constants/             # 상수, 아이콘 등
  │   ├─ hooks/                 # 커스텀 훅
  │   ├─ types/                 # 공통 타입 정의
  │   └─ utils/                 # 공통 유틸리티 함수(날짜, 파일업로드 등)
  ├─ services/                  # axios 등 API 인스턴스 관리
  ├─ store/                     # 전역 상태 관리(zustand 등)
  ├─ assets/                    # 이미지, 아이콘 등 정적 리소스
  ├─ router/                    # 라우팅 설정
  ├─ types/                     # 전역 타입 정의
  ├─ main.tsx                   # 앱 엔트리 포인트
  └─ App.tsx                    # 루트 컴포넌트
```

---

## 기술 스택

- **프레임워크/라이브러리**
  - ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)
![ReactRouter](https://img.shields.io/badge/ReactRouter-Ca4245?style=flat&logo=react-router&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-1F4CC8?style=flat&logo=&logoColor=white)
![KaKaoMap](https://img.shields.io/badge/KaKaoMap-FFCD00?style=flat&logo=kakao&logoColor=white)
![GoogleApi](https://img.shields.io/badge/GoogleApi-4285F4?style=flat&logo=google&logoColor=white)

- **기타**
  - Code Style: ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=white)
  - Deployment: ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
  - Toast 알림, 모달 등 공통 UI 컴포넌트

---

## 설치 및 실행 방법

1. **프로젝트 클론**

```bash
git clone https://github.com/your-org/KBE5_HALO_FE.git
cd KBE5_HALO_FE
```

2. **의존성 설치**

- npm 사용 시:

```bash
npm install
```

- yarn 사용 시:

```bash
yarn install
```

3. **환경 변수 파일(.env) 작성**

프로젝트 루트에 `.env` 파일을 생성하고 아래와 같이 환경변수를 입력하세요:

```env
VITE_API_BASE_URL=your-api-url
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_KAKAO_MAPS_API_KEY=your-kakao-maps-api-key
```

4. **개발 서버 실행**

- npm 사용 시:

```bash
npm run dev
```

5. **접속**

브라우저에서 [http://localhost:5173](http://localhost:5173) 접속

---

## 환경 변수

- **VITE_API_BASE_URL**: 백엔드 API 서버의 기본 URL을 지정합니다. (예: https://api.example.com)
- **VITE_GOOGLE_CLIENT_ID**: Google OAuth 로그인을 위한 클라이언트 ID입니다. Google Cloud Console에서 발급받아 사용합니다.
- **VITE_KAKAO_MAPS_API_KEY**: Kakao Maps JavaScript SDK를 위한 API 키입니다. Kakao Developers에서 발급받아 사용합니다.

> 모든 환경변수는 Vite의 규칙에 따라 반드시 `VITE_` 접두사가 필요합니다.
> 실제 값은 프로젝트 루트의 `.env` 파일에 별도로 설정해 주세요.

---

## 주요 기능 (상세)

### 👤 1. 고객

**회원가입 / 로그인 / 인증**

| 구글 소셜 로그인 및 회원가입 | 내 정보(이름, 연락처, 비밀번호 등) 수정 |
|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/46bde130-3be5-4045-ab4a-92faa2a2b5de" width="400"/> | <img src="https://github.com/user-attachments/assets/6d67af3a-55e8-41ca-8fbc-6a47362ef8e8" width="400"/> |

**서비스 예약**

| 예약 신청(날짜, 시간, 요청사항 입력) | 매니저 선택 및 결제 | 예약 요청 완료 |
|:--:|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/8f1692d8-864d-4c4a-b1ea-8836110c1212" width="350"/> | <img src="https://github.com/user-attachments/assets/d19f9dc6-cffe-4215-8af3-157c39739e42" width="350"/> | <img src="https://github.com/user-attachments/assets/c5cd86ad-0d0a-461e-bca7-3c58f7f78b0d" width="350"/> |

**예약 내역 조회, 예약 상세 조회(취소)**
| 예약 내역 조회 | 예약 상세 조회 |
|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/3123aeb4-941a-455e-9db1-42c0d3172693" width="400"/> | <img src="https://github.com/user-attachments/assets/c5d7ede7-6a0f-4a86-9579-fd356465454f" width="400"/> |

**포인트/결제 관리**
| 포인트 조회 | 포인트 충전 |
|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/c1f1b2a9-b690-4e5c-9838-a79482d51f88" width="400"/> | <img src="https://github.com/user-attachments/assets/5b55b44b-7405-458c-bc82-733e48966830" width="400"/> |


**문의 관리**
| 문의 내역 | 문의 작성 | 답변 확인 |
|:--:|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/8ceb2258-899a-4b33-9f90-00c2b7f892a9" width="300"/> | <img src="https://github.com/user-attachments/assets/c2a34ed1-a976-41ce-bab7-da7baec642da" width="300"/>  | <img src="https://github.com/user-attachments/assets/2e3b8019-24d1-457e-a79e-22e4d328ddd3" width="300"/> |

**리뷰 관리**
| 리뷰 작성 | 내 리뷰 조회 |
|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/a99304b3-d2a2-41a4-8e90-038820541b18" width="400"/> | <img src="https://github.com/user-attachments/assets/149dba3a-afdc-4d1f-a0d4-1669929ef2cc" width="400"/> |

---

### 🧹 2. 매니저

**매니저 지원**
| 기본 정보 입력 | 근무 가능 조건 입력 |
|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/3746bb7a-e861-4122-b9f1-0241d9a069d2" width="400"/> | <img src="https://github.com/user-attachments/assets/8d9a192d-954b-4d5d-96ed-9b01038f314c" width="400"/> |

**대시보드**
| 서비스 제공 횟수, 평점, 정산 금액 등 통계 차트 |
|:--:|
| <img src="https://github.com/user-attachments/assets/705c0b78-7a2b-45d5-97b5-87ae96042c25" width="500"/> |

**예약 관리**

| 내 예약 목록 (진행중/완료/취소 등) | 예약 상세 (고객 정보, 서비스 일정 등) |
|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/5703065f-ebae-4444-813f-fc71db86c619" width="400"/> | <img src="https://github.com/user-attachments/assets/b5a00ac5-5aa9-44c6-a175-3f046899d102" width="400"/> |

| 체크인 처리 (사진/시간 기록) | 체크아웃 처리 (파일 업로드 등) |
|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/17dc009e-67ba-4325-a37f-3f9f137253d4" width="400"/> | <img src="https://github.com/user-attachments/assets/b3765fbe-2997-42d7-ab56-0b8434131e7a" width="400"/> |

**정산 관리**
| 월별/건별 정산 이력 조회 |
|:--:|
| <img src="https://github.com/user-attachments/assets/23032152-fc01-45ff-8331-836a7b046ffb" width="500"/> |

 **리뷰 관리**
| 받은 리뷰 목록 | 리뷰 상세 내용 |
|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/63e5c4b4-b32c-49a4-9c4f-34e1ea4a15c7" width="400"/> | <img src="https://github.com/user-attachments/assets/099e259e-5175-490c-90e1-e4fedc2c170f" width="400"/> |

**문의 관리**
| 업무 관련 문의 등록 | 문의 내역 확인 | 문의 상세 및 답변 확인 |
|:--:|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/6129d5c6-7015-4baa-b58c-1b2b457460e2" width="300"/> | <img src="https://github.com/user-attachments/assets/26099587-dd13-4618-bf05-b0eea1a3ee9b" width="300"/> | <img src="https://github.com/user-attachments/assets/dd9d1593-bea8-42f4-81d0-4bbd9d0ea507" width="300"/> |


**내 정보/계약 관리**
| 마이페이지 확인 | 프로필 수정 (사진, 연락처, 지역 등) | 계약 정보 확인 및 관리 |
|:--:|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/0b7b28e7-ce30-4506-8814-23237b9cd3b1" width="300"/> | <img src="https://github.com/user-attachments/assets/e93f8fbe-49f9-48e2-ad55-d6a9a4c68eef" width="300"/><br><img src="https://github.com/user-attachments/assets/13236eee-eaea-43f5-b517-54c95ed35495" width="300"/> | <img src="https://github.com/user-attachments/assets/62d34e38-c924-438d-8b56-a031d5ea0e95" width="300"/> |

---

### 🛠️ 3. 관리자
**대시보드**
| 실시간 통계 (가입자, 예약, 정산, 문의 등) |
|:--:|
| <img src="https://github.com/user-attachments/assets/5797c47d-4198-4f2e-931a-7fb94beccd46" width="500"/> |


**문의 관리**
| 전체 문의 목록 및 상태 필터 | 문의/리뷰 상세 확인 및 답변/삭제 |
|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/62bf73cb-eda1-4cf9-860a-4d63859f3d30" width="400"/> | <img src="https://github.com/user-attachments/assets/f1fbb790-7b71-4815-84ee-2a2c30b0e669" width="400"/> |


**예약 관리**
| 전체 예약 목록 조회 및 필터 | 예약 상세 정보 확인 |
|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/8d96eaa5-2fcd-474f-9450-7c592dda7e81" width="400"/> | <img src="https://github.com/user-attachments/assets/adfcc1a3-4bc0-476f-a581-38b376b9dbc1" width="400"/> |


**정산 관리**
| 정산 목록 조회 및 기간별 수동 정산 |
|:--:|
| <img src="https://github.com/user-attachments/assets/930b2d84-6ca5-4155-9d9d-3cf6800d814a" width="500"/> |


**매니저 관리**
| 매니저 목록 조회 및 필터 | 매니저 상세 정보 이력 확인 | 계약 상태 변경 및 이력 관리 |
|:--:|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/666b73dd-b0d7-45ea-a362-99ba6f92c26f" width="300"/> | <img src="https://github.com/user-attachments/assets/7a7fcb03-1877-4f34-8614-971791ed7f74" width="300"/><br><img src="https://github.com/user-attachments/assets/224a46c1-8962-4b76-aa86-42b0a5e11054" width="300"/>| <img src="https://github.com/user-attachments/assets/ebf1bc9c-2eff-4efb-b34e-f9d4330a589c" width="300"/><br><img src="https://github.com/user-attachments/assets/76bb275f-f5fe-45d9-b1ab-5b2d4d92059e" width="300"/><br><img src="https://github.com/user-attachments/assets/e84edb32-3eb6-49b0-aca3-1cf6dc303fe1" width="300"/> |


**고객 관리**
| 고객 목록 조회 및 필터 | 고객 상세 정보 이력 확인 |
|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/b6a8c799-bafc-4746-ac50-e5d9b8741648" width="400"/> | <img src="https://github.com/user-attachments/assets/9a06f2e6-b3e0-4e9e-a0bf-1fb728eea665" width="400"/> |


**관리자 계정 관리**
| 계정 생성 | 목록 조회 및 필터 | 정보 수정 |
|:--:|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/b8d0514f-145f-4c95-84bf-c85ea79870bc" width="300"/> | <img src="https://github.com/user-attachments/assets/d720d42f-3418-46d6-b626-d1b36af25e5e" width="300"/> |
 <img src="https://github.com/user-attachments/assets/aa3adc39-8330-4beb-9c40-36d36fa408ec" width="300"/> |

---

### 4. 공통/기타

- **지도 서비스**: Kakao Maps 기반 위치 선택, 매니저 서비스 가능 지역 시각화
- **알림/토스트/모달**: 성공, 오류, 경고 등 주요 이벤트 공통 Toast 사용
- **접근성/UX**: 키보드 네비게이션, 명확한 피드백, 로딩/에러/빈 상태 안내
- **보안**: 인증/인가, 토큰 관리, 개인정보 보호, 비정상 접근 차단

---

## 오류 발생 시 조치 방법

1. **의존성 재설치**
   - node_modules 폴더를 삭제한 뒤, 다시 설치해 보세요.
   ```bash
   rm -rf node_modules
   npm install
   ```

2. **환경 변수(.env) 확인**
   - `.env` 파일이 올바르게 작성되어 있는지, 값이 정확한지 확인하세요.
   - 환경 변수 오타, 누락, 잘못된 값이 없는지 점검하세요.

3. **캐시/빌드 파일 삭제**
   - Vite, npm 캐시를 삭제하고 다시 빌드해 보세요.
   ```bash
   npm run build
   ```

4. **개발 서버 재시작**
   - 개발 서버를 완전히 종료 후 다시 실행해 보세요.
   ```bash
   npm run dev
   ```

5. **브라우저 캐시 삭제**
   - 브라우저 캐시로 인해 최신 코드가 반영되지 않을 수 있습니다. 새로고침(Shift+F5) 또는 캐시 삭제 후 재접속해 보세요.

6. **로그/에러 메시지 확인**
   - 터미널, 브라우저 콘솔의 에러 메시지를 꼼꼼히 확인하세요.
   - 에러 메시지와 함께 발생한 상황을 기록해 두면 문제 해결에 도움이 됩니다.

7. **문제가 지속될 경우**
   - 에러 메시지, 실행 환경, 재현 방법을 정리해 이슈로 등록하거나 팀원에게 문의해 주세요.
