# HALO 프론트엔드

## 프로젝트 소개

HALO는 관리자, 매니저, 고객을 위한 통합 서비스 플랫폼의 프론트엔드 프로젝트입니다.  
각 사용자 유형별로 맞춤형 대시보드, 예약, 문의, 리뷰, 정산 등 다양한 기능을 제공합니다.  
React 기반의 SPA로, 효율적인 상태 관리와 사용자 경험을 중시합니다.

---

## 폴더 구조

```plaintext
src/
  ├─ features/           # 도메인별(관리자, 고객, 매니저) 기능 모듈
  │   ├─ admin/          # 관리자 기능
  │   ├─ customer/       # 고객 기능
  │   └─ manager/        # 매니저 기능
  ├─ shared/             # 공통 컴포넌트, 유틸리티, 타입 등
  ├─ services/           # API 통신(axios 등)
  ├─ store/              # 전역 상태 관리(zustand 등)
  ├─ assets/             # 이미지, 아이콘 등 정적 리소스
  ├─ router/             # 라우팅 설정
  ├─ types/              # 전역 타입 정의
  └─ main.tsx, App.tsx   # 엔트리 포인트
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

## Vercel 배포 방법

1. **Vercel 계정 생성 및 로그인**
   - [https://vercel.com/](https://vercel.com/)에서 계정을 생성하고 로그인합니다.

2. **GitHub(또는 GitLab, Bitbucket) 저장소와 연동**
   - Vercel 대시보드에서 'New Project'를 클릭하고, 해당 저장소(KBE5_HALO_FE)를 선택합니다.

3. **환경 변수 등록**
   - Vercel 프로젝트의 'Settings > Environment Variables'에서 아래 환경변수를 등록합니다:
     - `VITE_API_BASE_URL`
     - `VITE_GOOGLE_CLIENT_ID`
     - `VITE_KAKAO_MAPS_API_KEY`

4. **빌드 및 배포 설정**
   - 빌드 명령어: `npm run build` 또는 `yarn build`
   - 출력 디렉토리: `dist`
   - 프레임워크: 'Other' 또는 'Vite' 선택

5. **자동 배포**
   - main, dev 등 지정 브랜치에 push 시 자동으로 빌드 및 배포가 진행됩니다.

6. **수동 배포(로컬에서)**
   - Vercel CLI 설치: `npm i -g vercel`
   - 빌드: `npm run build` 또는 `yarn build`
   - 배포: `vercel --prod`

7. **배포 완료 후**
   - Vercel에서 제공하는 도메인(예: `https://your-project.vercel.app`) 또는 커스텀 도메인으로 접속하여 서비스 확인

> Vercel 환경 변수는 배포 환경(Production, Preview, Development)별로 각각 등록할 수 있습니다.
> 자세한 내용은 [Vercel 공식 문서](https://vercel.com/docs) 참고

---

## 환경 변수

- **VITE_API_BASE_URL**: 백엔드 API 서버의 기본 URL을 지정합니다. (예: https://api.example.com)
- **VITE_GOOGLE_CLIENT_ID**: Google OAuth 로그인을 위한 클라이언트 ID입니다. Google Cloud Console에서 발급받아 사용합니다.
- **VITE_KAKAO_MAPS_API_KEY**: Kakao Maps JavaScript SDK를 위한 API 키입니다. Kakao Developers에서 발급받아 사용합니다.

> 모든 환경변수는 Vite의 규칙에 따라 반드시 `VITE_` 접두사가 필요합니다.
> 실제 값은 프로젝트 루트의 `.env` 파일에 별도로 설정해 주세요.

---

## 주요 기능 (상세)

### 1. 고객(Customer)

- **회원가입/로그인/인증**
  - 카카오/구글 소셜 로그인 및 회원가입  
    <div align="center">
      <img src="https://github.com/user-attachments/assets/46bde130-3be5-4045-ab4a-92faa2a2b5de" width="600" style="margin-bottom: 16px;" /><br />
    </div>
  - 내 정보(이름, 연락처, 비밀번호 등) 수정  
    <div align="center">
      <img src="https://github.com/user-attachments/assets/6d67af3a-55e8-41ca-8fbc-6a47362ef8e8" width="600" style="margin-bottom: 16px;" /><br />
    </div>

- **서비스 예약**
  - 서비스 유형/매니저 선택, 예약 신청(날짜, 시간, 요청사항 입력)  
    <div align="center">
      <img src="https://github.com/user-attachments/assets/8f1692d8-864d-4c4a-b1ea-8836110c1212" width="600" style="margin-bottom: 16px;" /><br />
      <img src="https://github.com/user-attachments/assets/d19f9dc6-cffe-4215-8af3-157c39739e42" width="600" style="margin-bottom: 16px;" /><br />
      <img src="https://github.com/user-attachments/assets/c5cd86ad-0d0a-461e-bca7-3c58f7f78b0d" width="600" style="margin-bottom: 16px;" /><br />
    </div>
  - 예약 내역(진행중/완료/취소 등) 조회, 예약 취소  
    <div align="center">
      <img src="https://github.com/user-attachments/assets/35e16517-07e4-431c-a73b-baf2ad87860f" width="600" style="margin-bottom: 16px;" /><br />
      <img src="https://github.com/user-attachments/assets/c5d7ede7-6a0f-4a86-9579-fd356465454f" width="600" style="margin-bottom: 16px;" /><br />
    </div>

- **포인트/결제 관리**
  - 포인트 충전  
    <div align="center">
      <img src="https://github.com/user-attachments/assets/5b55b44b-7405-458c-bc82-733e48966830" width="600" style="margin-bottom: 16px;" /><br />
    </div>

- **문의/리뷰**
  - 매니저/서비스 관련 문의 작성, 답변 확인  
    <div align="center">
      <img src="https://github.com/user-attachments/assets/c2a34ed1-a976-41ce-bab7-da7baec642da" width="600" style="margin-bottom: 16px;" /><br />
      <img src="https://github.com/user-attachments/assets/a04ca479-adca-4aed-b431-352819b2e8b0" width="600" style="margin-bottom: 16px;" /><br />
      <img src="https://github.com/user-attachments/assets/2e3b8019-24d1-457e-a79e-22e4d328ddd3" width="600" style="margin-bottom: 16px;" /><br />
    </div>
  - 서비스 이용 후 리뷰 작성, 내 리뷰 관리(수정)  
    <div align="center">
      <img src="https://github.com/user-attachments/assets/a99304b3-d2a2-41a4-8e90-038820541b18" width="600" style="margin-bottom: 16px;" /><br />
    </div>

---

### 2. 매니저(Manager)

- **내 정보/계약 관리**
  - 프로필(사진, 연락처, 자기소개, 서비스 지역/시간) 수정
  - 계약 정보(계약 상태, 시작/종료일, 해지 요청 등) 확인 및 관리
- **예약 관리**
  - 내 예약 목록(진행중/완료/취소/노쇼 등) 달력/리스트 뷰
  - 예약 상세(고객 정보, 서비스 일정, 요청사항 등) 확인
  - 체크인/체크아웃 처리(사진/파일 업로드, 시간 기록)
  - 예약 상태 변경, 예약 관련 알림 확인
- **정산 관리**
  - 월별/건별 정산 내역, 지급 상태(대기/완료/반려) 확인
  - 정산 요청, 지급 내역 및 이력 확인
- **문의/리뷰 관리**
  - 고객 문의 내역 확인, 답변 작성
  - 받은 리뷰 목록, 평점, 상세 내용 확인
  - 부적절한 리뷰 신고
- **활동 통계**
  - 서비스 제공 횟수, 평점, 정산 금액 등 통계 차트

---

### 3. 관리자(Admin)

- **대시보드**
  - 실시간 통계(신규 가입자, 예약, 정산, 문의 등) 차트/그래프
  - 최근 활동 내역, 주요 알림, 시스템 현황 요약
- **회원(고객/매니저) 관리**
  - 전체 회원 목록 조회, 검색(이름/연락처/상태 등), 가입일/상태별 필터링
  - 회원 상세 정보(기본정보, 예약/정산/문의/리뷰 이력) 확인
  - 신규 매니저 등록, 회원 정보 수정, 계정 비활성화/삭제
  - 매니저 계약 상태(대기/승인/거절/해지) 변경 및 이력 관리
  - 회원별 문의/리뷰/예약/정산 내역 바로가기
- **예약 관리**
  - 전체 예약 목록 조회, 기간/상태별 검색 및 필터
  - 예약 상세 정보(고객, 매니저, 서비스, 일정, 상태, 결제 등) 확인
  - 예약 상태(진행중/완료/취소/노쇼/환불 등) 변경 및 사유 입력
  - 예약 관련 이슈(노쇼, 환불, 변경 요청 등) 처리 및 이력 관리
- **정산 관리**
  - 매니저별 정산 요청 목록, 상태(대기/승인/지급완료/반려) 관리
  - 정산 상세 내역(예약 건별 금액, 수수료, 지급액 등) 확인
  - 정산 요청 승인/반려, 지급 처리 및 이력 관리
- **문의/리뷰 관리**
  - 전체 문의/리뷰 목록, 상태(답변대기/완료, 신고 등) 필터
  - 문의/리뷰 상세 확인, 답변 작성, 신고/삭제 처리

---

### 4. 공통/기타

- **지도 서비스**: Kakao Maps 기반 위치 선택, 매니저 서비스 가능 지역 시각화
- **알림/토스트/모달**: 성공, 오류, 경고 등 주요 이벤트 실시간 알림
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
