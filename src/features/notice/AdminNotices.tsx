import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Notice, NoticeSearchParams, NoticeStatus, NoticeType } from '../../types/notice';
import { fetchNotices, fetchEvents } from './api';

function AdminNotices() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NoticeType>('notice');
  const [searchParams, setSearchParams] = useState<NoticeSearchParams>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [notices, setNotices] = useState<Notice[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  // API 연동: 탭/검색/페이지 변경 시 호출
  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = {
      ...searchParams,
      page: currentPage,
      size: itemsPerPage,
    };
    const fetchData = async () => {
      try {
        const data = activeTab === 'notice'
          ? await fetchNotices(params)
          : await fetchEvents(params);
        setNotices(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (e: any) {
        setError('데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, searchParams, currentPage]);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    // searchParams는 이미 상태로 관리 중이므로 useEffect에서 자동 호출
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({});
    setCurrentPage(1);
  }, []);

  const handleTabChange = (type: NoticeType) => {
    setActiveTab(type);
    setSearchParams({});
    setCurrentPage(1);
  };

  const handleEdit = (id: string) => {
    navigate(`/admins/notices/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    // TODO: 삭제 API 연동 필요
    alert(`/admins/notices/${id}/edit`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pagedNotices = notices;

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    // 이전 페이지 버튼
    pages.push(
      <button
        key="prev"
        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white hover:bg-indigo-50 text-gray-500'}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
    );
    // 페이지 번호 버튼들
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`w-9 h-9 flex items-center justify-center rounded-md mx-0.5 transition-colors ${currentPage === i ? 'bg-indigo-600 text-white font-bold' : 'bg-white text-gray-500 hover:bg-indigo-50'}`}
          onClick={() => handlePageChange(i)}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }
    // 다음 페이지 버튼
    pages.push(
      <button
        key="next"
        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${currentPage === totalPages ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white hover:bg-indigo-50 text-gray-500'}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
    );
    return <div className="flex flex-row gap-1">{pages}</div>;
  };

  return (
    <div className="flex-1 h-screen bg-[#f6f8fa] flex flex-col items-start">
      <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 flex justify-between items-center">
        <div className="text-gray-900 text-xl font-bold font-['Inter'] leading-normal">
          공지사항 및 이벤트 관리
        </div>
        <button
          className="h-10 px-5 bg-indigo-600 rounded-md flex items-center gap-2 shadow hover:bg-indigo-700 transition-colors"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path d="M10 4v12M4 10h12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-white text-sm font-semibold">새 글 작성</span>
        </button>
      </div>
      <div className="self-stretch flex-1 p-6 flex flex-col justify-start items-start gap-6">
        <div className="self-stretch border-b border-gray-200 bg-gray-50 flex">
          <button
            className={`w-40 h-12 flex flex-col items-center justify-end ${activeTab === 'notice' ? 'text-indigo-600 font-bold' : 'text-gray-500 font-medium'}`}
            onClick={() => handleTabChange('notice')}
          >
            <span>공지사항</span>
            <span className={`block h-1 w-full mt-2 ${activeTab === 'notice' ? 'bg-indigo-600' : 'bg-transparent'}`}></span>
          </button>
          <button
            className={`w-40 h-12 flex flex-col items-center justify-end ${activeTab === 'event' ? 'text-indigo-600 font-bold' : 'text-gray-500 font-medium'}`}
            onClick={() => handleTabChange('event')}
          >
            <span>이벤트</span>
            <span className={`block h-1 w-full mt-2 ${activeTab === 'event' ? 'bg-indigo-600' : 'bg-transparent'}`}></span>
          </button>
        </div>

        <div className="w-full p-6 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-4">
          <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">
            검색 조건
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch flex justify-start items-start gap-4">
              <div className="flex-1 flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">제목</div>
                <input
                  type="text"
                  className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200"
                  placeholder="제목 입력"
                  value={searchParams.title || ''}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, title: e.target.value })
                  }
                />
              </div>
              <div className="flex-1 flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">작성자</div>
                <input
                  type="text"
                  className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200"
                  placeholder="작성자 입력"
                  value={searchParams.author || ''}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, author: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="self-stretch flex justify-start items-start gap-4">
              <div className="flex-1 flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">게시 날짜</div>
                <div className="self-stretch flex justify-start items-center gap-2">
                  <input
                    type="date"
                    className="flex-1 h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200"
                    placeholder="시작일"
                    value={searchParams.startDate || ''}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, startDate: e.target.value })
                    }
                  />
                  <div className="justify-start text-slate-500 text-sm font-normal font-['Inter'] leading-none">~</div>
                  <input
                    type="date"
                    className="flex-1 h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200"
                    placeholder="종료일"
                    value={searchParams.endDate || ''}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">상태</div>
                <select
                  className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200"
                  value={searchParams.status || ''}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      status: e.target.value as NoticeStatus || undefined,
                    })
                  }
                >
                  <option value="">전체</option>
                  <option value="게시중">게시중</option>
                  <option value="임시저장">임시저장</option>
                </select>
              </div>
            </div>
            <div className="self-stretch flex justify-end items-center gap-2">
              <button
                className="w-28 h-12 bg-slate-100 rounded-lg flex justify-center items-center hover:bg-slate-200 transition-colors"
                onClick={handleReset}
              >
                <div className="justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">
                  초기화
                </div>
              </button>
              <button
                className="w-28 h-12 bg-indigo-600 rounded-lg flex justify-center items-center hover:bg-indigo-700 transition-colors"
                onClick={handleSearch}
              >
                <div className="justify-start text-white text-sm font-medium font-['Inter'] leading-none">
                  검색
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="self-stretch bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start">
          <div className="self-stretch h-12 px-6 bg-gray-50 border-b border-gray-200 inline-flex justify-start items-center gap-4">
            <div className="w-20 flex justify-start items-center">
              <div className="justify-start text-gray-700 text-sm font-semibold font-['Inter'] leading-none">
                ID
              </div>
            </div>
            <div className="w-80 flex justify-start items-center">
              <div className="justify-start text-gray-700 text-sm font-semibold font-['Inter'] leading-none">
                제목
              </div>
            </div>
            <div className="w-28 flex justify-start items-center">
              <div className="justify-start text-gray-700 text-sm font-semibold font-['Inter'] leading-none">
                상태
              </div>
            </div>
            <div className="w-28 flex justify-start items-center">
              <div className="justify-start text-gray-700 text-sm font-semibold font-['Inter'] leading-none">
                작성자
              </div>
            </div>
            <div className="w-40 flex justify-start items-center">
              <div className="justify-start text-gray-700 text-sm font-semibold font-['Inter'] leading-none">
                등록일
              </div>
            </div>
            <div className="flex-1 flex justify-end items-center">
              <div className="justify-start text-gray-700 text-sm font-semibold font-['Inter'] leading-none">
                관리
              </div>
            </div>
          </div>

          {pagedNotices.map((notice) => (
            <div
              key={notice.id}
              className="self-stretch h-16 px-6 border-b border-gray-200 inline-flex justify-start items-center gap-4"
            >
              <div className="w-20 flex justify-start items-center">
                <div className="justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-none">
                  {notice.id}
                </div>
              </div>
              <div className="w-80 flex justify-start items-center">
                <div className="justify-start text-gray-900 text-sm font-medium font-['Inter'] leading-none">
                  {notice.title}
                </div>
              </div>
              <div className="w-28 flex justify-start items-center">
                <div
                  className={`px-2 py-0.5 rounded-xl flex justify-center items-center ${
                    notice.status === '게시중'
                      ? 'bg-emerald-50 text-emerald-500'
                      : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  <div className="text-xs font-medium font-['Inter'] leading-none">
                    {notice.status}
                  </div>
                </div>
              </div>
              <div className="w-28 flex justify-start items-center">
                <div className="justify-start text-gray-900 text-sm font-medium font-['Inter'] leading-none">
                  {notice.author}
                </div>
              </div>
              <div className="w-40 flex justify-start items-center">
                <div className="justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-none">
                  {notice.createdAt}
                </div>
              </div>
              <div className="flex-1 flex justify-end items-center gap-2">
                <button
                  className="px-2 py-1 bg-black/0 rounded outline outline-1 outline-offset-[-1px] outline-indigo-600 flex justify-center items-center hover:bg-indigo-50 transition-colors"
                  onClick={() => handleEdit(notice.id)}
                >
                  <div className="justify-start text-indigo-600 text-sm font-medium font-['Inter'] leading-none">
                    수정
                  </div>
                </button>
                <button
                  className="px-2 py-1 bg-black/0 rounded outline outline-1 outline-offset-[-1px] outline-red-500 flex justify-center items-center hover:bg-red-50 transition-colors"
                  onClick={() => handleDelete(notice.id)}
                >
                  <div className="justify-start text-red-500 text-sm font-medium font-['Inter'] leading-none">
                    삭제
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="self-stretch py-4 inline-flex justify-center items-center gap-1">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}

export default AdminNotices; 