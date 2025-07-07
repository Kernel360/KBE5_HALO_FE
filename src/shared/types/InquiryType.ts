// 문의사항 카테고리
export interface InquiryCategory {
    code: string;
    label: string;
  }

// 문의사항 검색 요청
export interface SearchInquiriesRequest {
  fromCreatedAt?: string; 
  toCreatedAt?: string; 
  replyStatus?: boolean; 
  titleKeyword?: string; 
  contentKeyword?: string;
  page?: number;
  size?: number;
}

// 문의사항 목록 조회
export interface InquirySummary {
    inquiryId: number;
    categoryName: string;
    title: string;
    createdAt: string;
    isReplied: boolean;
  }

// 문의사항 상세 조회
export interface InquiryDetail {
    inquiryId: number;
    categoryName: string;
    title: string;
    content: string;
    createdAt: string;
    reply?: InquiryReply;
    fileId?: number | null;
  }

// 문의사항 답변
export interface InquiryReply {
  content: string;
  createdAt: string;
  fileId?: number | null;
}

// 문의사항 등록
export interface CreateInquiryRequest {
  title: string;
  content: string;
  fileId?: number;
  filePaths?: string[]; // S3에서 받은 URL 목록
  category: string;
}

// 문의사항 수정
export interface UpdateInquiryRequest {
  title: string;
  content: string;
  fileId?: number;
  filePaths?: string[]; // S3에서 받은 URL 목록
  category: string;
}