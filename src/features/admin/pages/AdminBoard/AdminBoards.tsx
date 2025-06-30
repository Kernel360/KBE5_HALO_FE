import { useState, useEffect } from "react";
import { Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";

import api from '@/services/axios';


export const AdminBoards = () => {
  const [activeTab, setActiveTab] = useState<"notice" | "event">("notice");
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [editId, setEditId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const [searchState, setSearchState] = useState({
    title: '',
    content: '',
    startDate: '',
    endDate: '',
    status: '',
  });

  const boardData = activeTab === "notice" ? notices : events;
  const pageSize = 5;
  const pageCount = Math.ceil(boardData.length / pageSize);
  const pagedData = boardData.slice(page * pageSize, (page + 1) * pageSize);

  const statusOptions = ["게시중", "임시저장"];

  const handleCreate = () => {
    if (activeTab === "notice") {
      navigate("/boards/notices/new");
    } else {
      navigate("/boards/events/new");
    }
  };

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setEditRow({ ...item });
  };

  const handleEditChange = (field: string, value: string) => {
    setEditRow((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = () => {
    if (!editRow) return;
    if (activeTab === "notice") {
      // Implement edit save logic for notice
    } else {
      // Implement edit save logic for event
    }
    setEditId(null);
    setEditRow(null);
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditRow(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      if (activeTab === "notice") {
        await api.delete(`/admin/notices/${id}`);
        setNotices((prev) => prev.filter((n) => n.id !== id));
      } else {
        await api.delete(`/admin/events/${id}`);

        setEvents((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (e) {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleSearchChange = (field: string, value: string) => {
    setSearchState(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setPage(0);
  };

  const handleReset = () => {
    setSearchState({ title: '', content: '', startDate: '', endDate: '', status: '' });
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'notice') {
          const res = await api.get('/admin/notices', {
            params: {
              type: 'NOTICE',

              title: searchState.title,
              content: searchState.content,
              startDate: searchState.startDate,
              endDate: searchState.endDate,
              status: searchState.status,
              page: page + 1,
              size: 10,
            },
          });
          const mapped = (res.data.items || []).map((item: any) => ({
            id: item.noticeId,
            title: item.title,
            status: item.noticeType === 'NOTICE' ? '게시중' : '임시저장',
            date: item.createdAt,
            deleted: item.isDeleted,
            views: item.views,
            author: item.createdBy,
          }));
          setNotices(mapped);
        } else {
          const res = await api.get('/admin/events', {
            params: {
              type: 'EVENT',

              title: searchState.title,
              content: searchState.content,
              startDate: searchState.startDate,
              endDate: searchState.endDate,
              status: searchState.status,
              page: page + 1,
              size: 10,
            },
          });
          const mapped = (res.data.items || []).map((item: any) => ({
            id: item.noticeId,
            title: item.title,
            status: item.noticeType === 'EVENT' ? '게시중' : '임시저장',
            date: item.createdAt,
            deleted: item.isDeleted,
            views: item.views,
            author: item.createdBy,
          }));
          setEvents(mapped);
        }
      } catch (e: any) {
        console.error('목록을 불러오지 못했습니다.', e);

      }
    };
    fetchData();
  }, [activeTab, searchState, page]);

  return (
    <Fragment>
      <div className="w-full self-stretch inline-flex flex-col justify-start items-start">
        {/* 상단 헤더 */}
        <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
          <div className="text-gray-900 text-xl font-bold font-['Inter'] leading-normal">공지사항 및 이벤트 관리</div>
          <button
            onClick={handleCreate}
            className="h-10 px-4 bg-indigo-600 rounded-md flex justify-center items-center gap-2 hover:bg-indigo-700 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-white">add</span>
            <span className="text-white text-sm font-semibold font-['Inter'] leading-none">새 글 작성</span>
          </button>
        </div>

        <div className="self-stretch flex-1 p-6 flex flex-col justify-start items-start gap-6">
          {/* 탭 */}
          <div className="self-stretch border-b border-gray-200 inline-flex">
            <div
              className={`w-40 h-10 px-4 flex justify-center items-center cursor-pointer ${
                activeTab === "notice" ? "border-b-2 border-indigo-600" : ""
              }`}
              onClick={() => setActiveTab("notice")}
            >
              <div className={`text-sm font-['Inter'] leading-none ${
                activeTab === "notice" ? "text-indigo-600 font-semibold" : "text-gray-500 font-medium"
              }`}>공지사항</div>
            </div>
            <div
              className={`w-40 h-10 px-4 flex justify-center items-center cursor-pointer ${
                activeTab === "event" ? "border-b-2 border-indigo-600" : ""
              }`}
              onClick={() => setActiveTab("event")}
            >
              <div className={`text-sm font-['Inter'] leading-none ${
                activeTab === "event" ? "text-indigo-600 font-semibold" : "text-gray-500 font-medium"
              }`}>이벤트</div>
            </div>
          </div>

          {/* 검색 */}
          <form onSubmit={e => { e.preventDefault(); handleSearch(); }} className="self-stretch p-6 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-slate-800 text-lg font-semibold">검색 조건</div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch flex justify-start items-start gap-4">
                <div className="flex-1 flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch text-slate-700 text-sm font-medium">제목</div>
                  <input
                    className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200"
                    placeholder="제목 입력"
                    value={searchState.title}
                    onChange={e => handleSearchChange('title', e.target.value)}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch text-slate-700 text-sm font-medium">내용</div>
                  <input
                    className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200"
                    placeholder="내용 입력"
                    value={searchState.content}
                    onChange={e => handleSearchChange('content', e.target.value)}
                  />
                </div>
              </div>
              <div className="self-stretch flex justify-start items-start gap-4">
                <div className="flex-1 flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch text-slate-700 text-sm font-medium">등록일</div>
                  <div className="self-stretch flex justify-start items-center gap-2">
                    <input
                      type="date"
                      className="flex-1 h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200"
                      placeholder="시작일"
                      value={searchState.startDate}
                      onChange={e => handleSearchChange('startDate', e.target.value)}
                    />
                    <div className="text-slate-500 text-sm">~</div>
                    <input
                      type="date"
                      className="flex-1 h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200"
                      placeholder="종료일"
                      value={searchState.endDate}
                      onChange={e => handleSearchChange('endDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch text-slate-700 text-sm font-medium">상태</div>
                  <select
                    className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200"
                    value={searchState.status}
                    onChange={e => handleSearchChange('status', e.target.value)}
                  >
                    <option value="">전체</option>
                    {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
              <div className="self-stretch flex justify-end items-center gap-2">
                <button type="button" className="w-28 h-12 bg-slate-100 rounded-lg flex justify-center items-center hover:bg-slate-200 transition-colors text-slate-500 text-sm font-medium" onClick={handleReset}>초기화</button>
                <button type="submit" className="w-28 h-12 bg-indigo-600 rounded-lg flex justify-center items-center hover:bg-indigo-700 transition-colors text-white text-sm font-medium">검색</button>
              </div>
            </div>
          </form>

          {/* 목록 */}
          <div className="self-stretch bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start">
            <div className="self-stretch h-12 px-6 bg-gray-50 border-b border-gray-200 inline-flex justify-start items-center space-x-4">
              <div className="w-[10%] flex justify-center items-center text-gray-700 text-sm font-semibold font-['Inter']">ID</div>
              <div className="w-[40%] flex justify-center items-center text-gray-700 text-sm font-semibold font-['Inter']">제목</div>
              <div className="w-[10%] flex justify-center items-center text-gray-700 text-sm font-semibold font-['Inter']">상태</div>
              <div className="w-[20%] flex justify-center items-center text-gray-700 text-sm font-semibold font-['Inter']">등록일</div>
              <div className="w-[20%] flex justify-center items-center text-gray-700 text-sm font-semibold font-['Inter']">관리</div>
            </div>

            {pagedData.map((item) => (
              <div key={item.id} className="self-stretch h-16 px-6 border-b border-gray-200 inline-flex justify-start items-center space-x-4">
                <div className="w-[10%] flex justify-center items-center text-gray-500 text-sm font-normal font-['Inter']">{item.id}</div>
                {editId === item.id ? (
                  <>
                    {/* 제목 */}
                    <div className="w-[40%] flex justify-center items-center">
                      <input
                        type="text"
                        className="h-8 px-2 rounded border border-gray-200 text-sm w-full"
                        value={editRow?.title || ''}
                        onChange={e => handleEditChange('title', e.target.value)}
                      />
                    </div>
                    {/* 상태 */}
                    <div className="w-[10%] flex justify-center items-center">
                      <select
                        className="h-8 px-2 rounded border border-gray-200 text-sm"
                        value={editRow?.status || ''}
                        onChange={e => handleEditChange('status', e.target.value)}
                      >
                        {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    {/* 등록일 */}
                    <div className="w-[20%] flex justify-center items-center">
                      <input
                        type="date"
                        className="h-8 px-2 rounded border border-gray-200 text-sm"
                        value={editRow?.date || ''}
                        onChange={e => handleEditChange('date', e.target.value)}
                      />
                    </div>
                    {/* 관리: 저장/취소 */}
                    <div className="w-[20%] flex justify-center items-center gap-2">
                      <button className="px-2 py-1 rounded border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-50 cursor-pointer" onClick={handleEditSave}>저장</button>
                      <button className="px-2 py-1 rounded border border-gray-400 text-gray-500 text-sm font-medium hover:bg-gray-50 cursor-pointer" onClick={handleEditCancel}>취소</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[40%] flex justify-center items-center text-gray-900 text-sm font-medium font-['Inter']">{item.title}</div>
                    <div className="w-[10%] flex justify-center items-center">
                      <div className={`px-2 py-0.5 rounded-xl flex justify-center items-center text-xs font-medium font-['Inter'] leading-none ${
                        item.status === "게시중" ? "bg-emerald-50 text-emerald-500" : "bg-amber-100 text-amber-600"
                      }`}>
                        {item.status}
                      </div>
                    </div>
                    <div className="w-[20%] flex justify-center items-center text-gray-500 text-sm font-normal font-['Inter']">{item.date}</div>
                    <div className="w-[20%] flex justify-center items-center gap-2">
                      <button className="px-2 py-1 rounded border border-yellow-500 text-yellow-500 text-sm font-medium hover:bg-yellow-50 cursor-pointer" onClick={() => handleEdit(item)}>수정</button>
                      <button className="px-2 py-1 rounded border border-red-500 text-red-500 text-sm font-medium hover:bg-red-50 cursor-pointer" onClick={() => handleDelete(item.id)}>삭제</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* 동적 페이지네이션 (예약 관리와 동일) */}
          <div className="self-stretch py-4 flex justify-center items-center gap-1">
            <button
              className="w-9 h-9 rounded-md flex justify-center items-center bg-white outline outline-1 outline-gray-200 text-gray-500 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              &lt;
            </button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                className={`w-9 h-9 rounded-md flex justify-center items-center ${page === i ? "bg-indigo-600 text-white" : "bg-white outline outline-1 outline-gray-200 text-gray-500"}`}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="w-9 h-9 rounded-md flex justify-center items-center bg-white outline outline-1 outline-gray-200 text-gray-500 disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page === pageCount - 1 || pageCount === 0}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};