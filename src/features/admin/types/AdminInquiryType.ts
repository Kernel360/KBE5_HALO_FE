// 문의사항 검색 요청
export interface SearchInquiriesRequest {
  fromCreatedAt?: string; 
  toCreatedAt?: string; 
  replyStatus?: boolean; 
  titleKeyword?: string; 
  contentKeyword?: string;
  page?: number;
  size?: number;
  authorType?: authorType | string;  // 관리자 문의사항에서만 사용
  userName?: string;                 // 관리자 문의사항에서만 사용
  categories?: string[];             // 문의 카테고리 목록 (복수 선택 가능)
}

// 작성자 타입
export interface authorType {
    code: string;
    label: string;
}

// 문의사항 목록 조회
export interface InquirySummary {
    inquiryId: number;
    categoryName: string;
    title: string;
    createdAt: string;
    userName: string;       // 관리자 문의사항에서만 사용
    authorType: string; // 관리자 문의사항에서만 사용
    isReplied: boolean;
  }

// 문의사항 상세 조회
export interface InquiryDetail {
    inquiryId: number;
    categoryName: string;
    title: string;
    content: string;
    authorId : number;        // 관리자 문의사항에서만 사용
    authorName: string;       // 관리자 문의사항에서만 사용
    authorType: string;       // 관리자 문의사항에서만 사용
    email: string;            // 관리자 문의사항에서만 사용
    phone: string;            // 관리자 문의사항에서만 사용
    createdAt: string;
    replyDetail?: replyDetail;
    fileId?: number | null;
  }

// 문의사항 답변 조회
export interface replyDetail {
  replyId: number;
  userName: string; // 관리자 문의사항에서만 사용
  content: string;
  createdAt: string;
  fileId?: number | null;
}

// 문의사항 답변 등록
export interface CreateReplyRequest {
  inquiryId: number;
  content: string;
  fileId?: number | null; // 파일 첨부 ID (선택적)
}