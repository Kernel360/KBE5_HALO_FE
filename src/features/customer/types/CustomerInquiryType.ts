// 문의사항 카테고리
export interface CustomerInquiryCategory {
    categoryId: number;
    categoryName: string;
  }

// 문의사항 목록 조회
export interface SearchCustomerInquiries {
    inquiryId: number;
    categoryId: number;
    categoryName: string;
    title: string;
    createdAt: string;
    isReplied: boolean;
  }


// 문의사항 상세 조회
export interface CustomerInquiryDetail {
    inquiryId: number;
    authorId: number;
    categoryId: number;
    categoryName: string;
    title: string;
    content: string;
    createdAt: string;
    reply?: CustomerInquiryReply;
    fileId?: number | null;
    files?: File[];
  }

  // 문의사항 답변
  export interface CustomerInquiryReply {
    content: string;
    createdAt: string;
  }


// 문의사항 등록
export interface CreateCustomerInquiryRequest {
  categoryId: number;
  title: string;
  content: string;
  fileId?: number;
  fileUrls?: string[]; // S3에서 받은 URL 목록
}

// 문의사항 수정
export interface UpdateCustomerInquiryRequest {
  categoryId: number;
  title: string;
  content: string;
  fileId?: number;
  fileUrls?: string[];
}