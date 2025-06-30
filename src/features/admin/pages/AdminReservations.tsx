import { useState, useEffect } from 'react';

import api from '@/services/axios';

const serviceOptions = ['청소', '이사', '소독'];
const statusOptions = ['예정', '진행중', '완료'];

const AdminReservations = () => {
  type Reservation = {
    id: string;
    date: string;
    time: string; // '09:00-11:00' 형태
    customer: string;
    address: string;
    service: string;
    status: string;
  };
  const [search, setSearch] = useState({
    customer: '',
    address: '',
    startDate: '',
    endDate: '',
    status: '',
  });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<(Reservation & { startTime?: string; endTime?: string }) | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 5;
  const pageCount = Math.ceil(reservations.length / pageSize);

  // Spring API에서 예약 목록 불러오기
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get('/admin/reservations', {
          params: {
            customer: search.customer,
            address: search.address,
            startDate: search.startDate,
            endDate: search.endDate,
            status: search.status,
            page: page + 1,
            size: 10,
          },
        });
        setReservations(res.data.items || []);
      } catch (e: any) {
        alert('예약 목록을 불러오지 못했습니다.');

      }
    };
    fetchReservations();
  }, [search, page]);

  const handleReset = () => {
    setSearch({ customer: '', address: '', startDate: '', endDate: '', status: '' });
  };

  const handleSearch = () => {
    // Implement search logic
  };

  const handleEdit = (item: Reservation) => {
    // time: '09:00-11:00' 분리
    let startTime = '', endTime = '';
    if (item.time && item.time.includes('-')) {
      [startTime, endTime] = item.time.split('-');
    }
    setEditId(item.id);
    setEditRow({ ...item, startTime, endTime });
  };

  const handleEditChange = (field: keyof (Reservation & { startTime?: string; endTime?: string }), value: string) => {
    if (!editRow) return;
    setEditRow((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleEditSave = () => {
    if (!editRow) return;
    // time 필드 합치기
    const newTime = (editRow.startTime || '') + '-' + (editRow.endTime || '');
    const { startTime, endTime, ...rest } = editRow;
    setReservations((prev) => prev.map((item) => item.id === editId ? { ...rest, time: newTime } : item));
    setEditId(null);
    setEditRow(null);
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditRow(null);
  };

  // 삭제
  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/admin/reservations/${id}`);

      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div className="w-full self-stretch inline-flex flex-col justify-start items-start">
      <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
        <div className="text-gray-900 text-xl font-bold font-['Inter'] leading-normal">예약 관리</div>
        {/* 필요시 신규 예약 버튼 등 추가 가능 */}
      </div>
      <div className="self-stretch p-6 flex flex-col justify-start items-start gap-6">
        {/* 검색 조건 카드 */}
        <div className="self-stretch p-6 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-4">
          <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">검색 조건</div>
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch flex justify-start items-start gap-4">
              <div className="flex-1 flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">고객명</div>
                <input
                  className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200"
                  placeholder="고객명 입력"
                  value={search.customer}
                  onChange={e => setSearch(s => ({ ...s, customer: e.target.value }))}
                />
              </div>
              <div className="flex-1 flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">주소</div>
                <input
                  className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200"
                  placeholder="주소 입력"
                  value={search.address}
                  onChange={e => setSearch(s => ({ ...s, address: e.target.value }))}
                />
              </div>
            </div>
            <div className="self-stretch flex justify-start items-start gap-4">
              <div className="flex-1 flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">예약 날짜</div>
                <div className="self-stretch flex justify-start items-center gap-2">
                  <input
                    type="date"
                    className="flex-1 h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200"
                    placeholder="시작일"
                    value={search.startDate}
                    onChange={e => setSearch(s => ({ ...s, startDate: e.target.value }))}
                  />
                  <div className="justify-start text-slate-500 text-sm font-normal font-['Inter'] leading-none">~</div>
                  <input
                    type="date"
                    className="flex-1 h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200"
                    placeholder="종료일"
                    value={search.endDate}
                    onChange={e => setSearch(s => ({ ...s, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">예약 상태</div>
                <select
                  className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200"
                  value={search.status}
                  onChange={e => setSearch(s => ({ ...s, status: e.target.value }))}
                >
                  <option value="">전체</option>
                  <option value="예정">예정</option>
                  <option value="진행중">진행중</option>
                  <option value="완료">완료</option>
                </select>
              </div>
            </div>
            <div className="self-stretch flex justify-end items-center gap-2">
              <button
                className="w-28 h-12 bg-slate-100 rounded-lg flex justify-center items-center hover:bg-slate-200 transition-colors"
                onClick={handleReset}
              >
                <div className="justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">초기화</div>
              </button>
              <button
                className="w-28 h-12 bg-indigo-600 rounded-lg flex justify-center items-center hover:bg-indigo-700 transition-colors"
                onClick={handleSearch}
              >
                <div className="justify-start text-white text-sm font-medium font-['Inter'] leading-none">검색</div>
              </button>
            </div>
          </div>
        </div>
        {/* 예약 내역 리스트 (공지/이벤트와 동일한 스타일) */}
        <div className="self-stretch bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start">
          <div className="self-stretch h-12 px-6 bg-gray-50 border-b border-gray-200 inline-flex justify-start items-center space-x-4">
            <div className="w-[10%] flex justify-center items-center text-gray-700 text-sm font-semibold font-['Inter']">예약번호</div>
            <div className="w-[20%] flex justify-center items-center text-gray-700 text-sm font-semibold font-['Inter']">예약일시</div>
            <div className="w-[15%] flex justify-center items-center text-gray-700 text-sm font-semibold font-['Inter']">고객명</div>
            <div className="w-[25%] flex justify-center items-center text-gray-700 text-sm font-semibold font-['Inter']">주소</div>
            <div className="w-[10%] flex justify-center items-center text-gray-700 text-sm font-semibold font-['Inter']">서비스</div>
            <div className="w-[10%] flex justify-center items-center text-gray-700 text-sm font-semibold font-['Inter']">상태</div>
            <div className="w-[10%] flex justify-center items-center text-gray-700 text-sm font-semibold font-['Inter']">관리</div>
          </div>
          {reservations.slice(page * pageSize, (page + 1) * pageSize).map((item) => (
            <div key={item.id} className="self-stretch h-16 px-6 border-b border-gray-200 inline-flex justify-start items-center space-x-4">
              <div className="w-[10%] flex justify-center items-center text-gray-500 text-sm font-normal font-['Inter']">{item.id}</div>
              {editId === item.id ? (
                <>
                  {/* 예약일시: date, time picker */}
                  <div className="w-[20%] flex flex-col justify-center items-center gap-1">
                    <input
                      type="date"
                      className="h-8 px-2 rounded border border-gray-200 text-sm"
                      value={editRow?.date || ''}
                      onChange={e => handleEditChange('date', e.target.value)}
                    />
                    <div className="flex gap-1 items-center mt-1">
                      <input
                        type="time"
                        className="h-8 px-2 rounded border border-gray-200 text-xs"
                        value={editRow?.startTime || ''}
                        onChange={e => handleEditChange('startTime', e.target.value)}
                      />
                      <span className="text-gray-400 text-xs">~</span>
                      <input
                        type="time"
                        className="h-8 px-2 rounded border border-gray-200 text-xs"
                        value={editRow?.endTime || ''}
                        onChange={e => handleEditChange('endTime', e.target.value)}
                      />
                    </div>
                  </div>
                  {/* 고객명 */}
                  <div className="w-[15%] flex justify-center items-center">
                    <input
                      type="text"
                      className="h-8 px-2 rounded border border-gray-200 text-sm"
                      value={editRow?.customer || ''}
                      onChange={e => handleEditChange('customer', e.target.value)}
                    />
                  </div>
                  {/* 주소 */}
                  <div className="w-[25%] flex justify-center items-center">
                    <input
                      type="text"
                      className="h-8 px-2 rounded border border-gray-200 text-sm"
                      value={editRow?.address || ''}
                      onChange={e => handleEditChange('address', e.target.value)}
                    />
                  </div>
                  {/* 서비스 */}
                  <div className="w-[10%] flex justify-center items-center">
                    <select
                      className="h-8 px-2 rounded border border-gray-200 text-sm"
                      value={editRow?.service || ''}
                      onChange={e => handleEditChange('service', e.target.value)}
                    >
                      {serviceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
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
                  {/* 관리: 저장/취소 */}
                  <div className="w-[10%] flex justify-center items-center gap-2">
                    <button className="px-2 py-1 rounded border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-50 cursor-pointer" onClick={handleEditSave}>저장</button>
                    <button className="px-2 py-1 rounded border border-gray-400 text-gray-500 text-sm font-medium hover:bg-gray-50 cursor-pointer" onClick={handleEditCancel}>취소</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-[20%] flex flex-col justify-center items-center text-gray-900 text-sm font-medium font-['Inter']">
                    <div>{item.date}</div>
                    <div className="text-slate-500 text-xs">{item.time}</div>
                  </div>
                  <div className="w-[15%] flex justify-center items-center text-gray-900 text-sm font-medium font-['Inter']">{item.customer}</div>
                  <div className="w-[25%] flex justify-center items-center text-gray-900 text-sm font-medium font-['Inter']">{item.address}</div>
                  <div className="w-[10%] flex justify-center items-center text-gray-900 text-sm font-medium font-['Inter']">{item.service}</div>
                  <div className="w-[10%] flex justify-center items-center">
                    <div className={`px-2 py-0.5 rounded-xl flex justify-center items-center text-xs font-medium font-['Inter'] leading-none ${item.status === '완료' ? 'bg-emerald-50 text-emerald-500' : item.status === '진행중' ? 'bg-amber-100 text-amber-600' : 'bg-sky-100 text-sky-600'}`}>{item.status}</div>
                  </div>
                  <div className="w-[10%] flex justify-center items-center gap-2">
                    <button className="px-2 py-1 rounded border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-50 cursor-pointer">상세</button>
                    <button className="px-2 py-1 rounded border border-yellow-500 text-yellow-500 text-sm font-medium hover:bg-yellow-50 cursor-pointer" onClick={() => handleEdit(item)}>수정</button>
                    <button className="px-2 py-1 rounded border border-red-500 text-red-500 text-sm font-medium hover:bg-red-50 cursor-pointer" onClick={() => handleDelete(item.id)}>삭제</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        {/* 동적 페이지네이션 */}
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
  );
};

export default AdminReservations; 