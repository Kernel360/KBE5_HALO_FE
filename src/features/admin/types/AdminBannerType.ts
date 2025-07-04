// 배너 목록 조회
export interface SearchAdminBanners {
  bannerId: number; // 배너 ID
  title: string; // 배너 제목
  path: string; // 배너 경로
  startAt: string; // 게시 시작일 (ISO date string, e.g., '2025-06-10')
  endAt: string; // 게시 종료일
  views: number; // 조회수
  fileId: number; // 첨부파일 ID
  createdAt: string; // 생성일시
  createdBy: number; // 생성자 ID
  bannerStatus: "ACTIVE" | "PENDING" | "EXPIRED" | string; // 상태
}

// 배너 목록 조회
export interface AdminBannerDetail {
  bannerId: number; // 배너 ID
  title: string; // 배너 제목
  path: string; // 배너 경로
  startAt: string; // 게시 시작일 (ISO date string, e.g., '2025-06-10')
  endAt: string; // 게시 종료일
  views: number; // 조회수
  fileId: number; // 첨부파일 ID
  createdAt: string; // 생성일시
  createdBy: number; // 생성자 ID
  bannerStatus: "ACTIVE" | "PENDING" | "EXPIRED" | string; // 상태
}

// 배너 등록
export interface CreateAdminBannerRequest {
  title: string; // 배너 제목
  path: string; // 배너 경로
  startAt: string; // 게시 시작일 (ISO date string, e.g., '2025-06-10')
  endAt: string; // 게시 종료일
  fileId?: number;
  // fileUrls?: string[]; // S3에서 받은 URL 목록
}

// 배너 수정
export interface UpdateAdminBannerRequest {
  title: string; // 배너 제목
  path: string; // 배너 경로
  startAt: string; // 게시 시작일 (ISO date string, e.g., '2025-06-10')
  endAt: string; // 게시 종료일
  fileId?: number;
  fileUrls?: string[]; // S3에서 받은 URL 목록
}
