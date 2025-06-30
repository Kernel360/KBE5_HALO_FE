// 문의사항 목록 조회
export interface SearchManagerInquiries {
  inquiryId: number;
  title: string;
  createdAt: string;
  isReplied: boolean;
}

// 문의사항 상세 조회
export interface ManagerInquiryDetail {
  inquiryId: number;
  authorId: number;
  title: string;
  content: string;
  fileId?: number | null;
  files?: File[];
  createdAt: string;
  author?: {
    userName?: string;
    phone?: string;
    email?: string;
  };

  // 답변 관련 필드
  answerId?: number | null;
  replyContent?: string;
  replyFileId?: number | null;
  replyCreatedAt?: string | null;
  replyStatus?: boolean | false;
}

// 문의사항 등록
export interface CreateManagerInquiryRequest {
  title: string;
  content: string;
  fileId?: number;
  fileUrls?: string[]; // S3에서 받은 URL 목록
}

// 문의사항 수정
export interface UpdateManagerInquiryRequest {
  title: string;
  content: string;
  fileId?: number;
  fileUrls?: string[];
}

// 매니저 답변 조회
export interface ManagerInquiryAnswer {
  answerId: number;
  inquiryId: number;
  replyContent: string;
  replyFileId?: number | null;
  replyCreatedAt: string;
}

// 매니저 답변 등록
export interface CreateManagerInquiryAnswerRequest {
  inquiryId: number;
  replyContent: string;
  replyFileId?: number;
}

// 매니저 답변 수정
export interface UpdateManagerInquiryAnswerRequest {
  answerId: number;
  replyContent: string;
  replyFileId?: number;
}