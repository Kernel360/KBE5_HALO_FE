export type Notice = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  status?: string;
  // 필요한 필드 추가 가능
};

export type NoticeSearchParams = {
  type?: string;
  title?: string;
  author?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  status?: string;
};

export type NoticeStatus = '게시중' | '임시저장';
export type NoticeType = 'notice' | 'event'; 

