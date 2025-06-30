import { useState, useEffect } from "react";

import { Fragment } from "react/jsx-runtime";
import api from '@/services/axios';

type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  count: number;
  gender: string;
  birthDate: string;
  roadAddress: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  point: number;
  createdAt: string;
  updatedAt: string;
};

export const AdminCustomers = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'reported'>('all');
  const [nameKeyword, setNameKeyword] = useState('');
  const [phoneKeyword, setPhoneKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Spring API에서 고객 목록 불러오기
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/admin/customers', {

          params: {
            tab: activeTab,
            name: nameKeyword,
            phone: phoneKeyword,
            page: page + 1,
            size: 10,
            sort: sortOrder,
          },
        });
        const mapped = (res.data.items || []).map((item: any) => ({
          id: item.customerId,
          name: item.userName,
          phone: item.phone,
          email: item.email,
          status: item.accountStatus === 'REPORTED' ? '신고됨' : '활성',
          count: item.count,
          gender: item.gender,
          birthDate: item.birthDate,
          roadAddress: item.roadAddress,
          detailAddress: item.detailAddress,
          latitude: item.latitude,
          longitude: item.longitude,
          point: item.point,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));
        setCustomers(mapped);
      } catch (e: any) {
        console.error('고객 목록을 불러오지 못했습니다.', e);

      }
    };
    fetchCustomers();
  }, [activeTab, nameKeyword, phoneKeyword, page, sortOrder]);

  // 삭제
  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await api.delete(`admin/customers/${id}`);

      setCustomers((prev: any) => prev.filter((c: any) => c.id !== id));
    } catch (e) {
      alert('삭제에 실패했습니다.');
    }
  };

  const reportedCount = customers.filter(c => c.status === '신고됨').length;

  // 상세 조회
  const handleDetail = async (id: string) => {
    try {
      const res = await api.get(`/admin/customers/${id}`);

      setSelectedCustomer({
        id: res.data.customerId,
        name: res.data.userName,
        phone: res.data.phone,
        email: res.data.email,
        status: res.data.accountStatus === 'REPORTED' ? '신고됨' : '활성',
        count: res.data.count,
        gender: res.data.gender,
        birthDate: res.data.birthDate,
        roadAddress: res.data.roadAddress,
        detailAddress: res.data.detailAddress,
        latitude: res.data.latitude,
        longitude: res.data.longitude,
        point: res.data.point,
        createdAt: res.data.createdAt,
        updatedAt: res.data.updatedAt,
      });
      setShowDetail(true);
    } catch (e) {
      alert('상세 정보를 불러오지 못했습니다.');
    }
  };

  // 수정 모드 진입
  const handleEdit = async (id: string) => {
    try {
      const res = await api.get(`/admin/customers/${id}`);

      setEditCustomer({
        id: res.data.customerId,
        name: res.data.userName,
        phone: res.data.phone,
        email: res.data.email,
        status: res.data.accountStatus === 'REPORTED' ? '신고됨' : '활성',
        count: res.data.count,
        gender: res.data.gender,
        birthDate: res.data.birthDate,
        roadAddress: res.data.roadAddress,
        detailAddress: res.data.detailAddress,
        latitude: res.data.latitude,
        longitude: res.data.longitude,
        point: res.data.point,
        createdAt: res.data.createdAt,
        updatedAt: res.data.updatedAt,
      });
      setShowEdit(true);
    } catch (e) {
      alert('수정 정보를 불러오지 못했습니다.');
    }
  };

  // 수정 저장
  const handleEditSave = async () => {
    if (!editCustomer) return;
    try {
      await api.put(`/admin/customers/${editCustomer.id}`, {

        userName: editCustomer.name,
        phone: editCustomer.phone,
        email: editCustomer.email,
        gender: editCustomer.gender,
        birthDate: editCustomer.birthDate,
        roadAddress: editCustomer.roadAddress,
        detailAddress: editCustomer.detailAddress,
        latitude: editCustomer.latitude,
        longitude: editCustomer.longitude,
        point: editCustomer.point,
        accountStatus: editCustomer.status === '신고됨' ? 'REPORTED' : 'ACTIVE',
      });
      setShowEdit(false);
      setEditCustomer(null);
      setPage(0); // 목록 새로고침
    } catch (e) {
      alert('수정에 실패했습니다.');
    }
  };

  return (
    <Fragment>
      <div className="w-full self-stretch inline-flex flex-col justify-start items-start">
        <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
          <div className="justify-start text-gray-900 text-xl font-bold font-['Inter'] leading-normal">고객 정보 관리</div>
        </div>
        <div className="self-stretch flex-1 p-6 flex flex-col justify-start items-start gap-6">
          {/* 통계 카드 */}
          <div className="self-stretch inline-flex justify-start items-start gap-4">
            {/* 카드 1: 총 고객 수 */}
            <div className="flex-1 h-24 p-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-center gap-2">
              <div className="text-gray-500 text-sm font-medium">총 고객 수</div>
              <div className="text-gray-900 text-2xl font-bold">{customers.length}</div>
              <div className="text-emerald-500 text-xs font-medium">▲12% 증가</div>
            </div>
            {/* 카드 2: 이번주 신규 고객 수 */}
            <div className="flex-1 h-24 p-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-center gap-2">
              <div className="text-gray-500 text-sm font-medium">이번주 신규 고객 수</div>
              <div className="text-emerald-500 text-2xl font-bold">24</div>
              <div className="text-emerald-500 text-xs font-medium">▲12% 증가</div>
            </div>
            {/* 카드 3: 신고된 고객 수 */}
            <div className="flex-1 h-24 p-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-center gap-2">
              <div className="text-gray-500 text-sm font-medium">신고된 고객 수</div>
              <div className="text-red-500 text-2xl font-bold">{reportedCount}</div>
              <div className="text-red-500 text-xs font-medium">▼</div>
            </div>
          </div>

          {/* 탭 필터 */}
          <div className="w-full border-b border-gray-200 mb-2 flex">
            {[
              { key: 'all', label: '전체 고객' },
              { key: 'active', label: '활성된 고객' },
              { key: 'reported', label: '신고된 고객' },
            ].map((tab) => (
              <div
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`w-40 h-10 px-4 flex justify-center items-center cursor-pointer ${activeTab === tab.key ? 'border-b-2 border-indigo-600' : ''}`}
              >
                <span className={`text-sm ${activeTab === tab.key ? 'text-indigo-600 font-semibold' : 'text-gray-500 font-medium'}`}>{tab.label}</span>
              </div>
            ))}
          </div>

          {/* 검색 폼 */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full p-6 bg-white rounded-xl shadow flex flex-col gap-4"
          >
            <div className="text-slate-800 text-lg font-semibold">검색 조건</div>
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-medium">이름</label>
                <div className="h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-slate-200 flex items-center">
                  <input
                    type="text"
                    placeholder="이름 입력"
                    value={nameKeyword}
                    onChange={(e) => setNameKeyword(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-medium">연락처</label>
                <div className="h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-slate-200 flex items-center">
                  <input
                    type="text"
                    placeholder="연락처 입력"
                    value={phoneKeyword}
                    onChange={(e) => setPhoneKeyword(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="w-28 h-12 bg-slate-100 rounded-lg text-slate-500 text-sm font-medium hover:bg-slate-200 cursor-pointer"
              >
                초기화
              </button>
              <button
                type="submit"
                className="w-28 h-12 bg-indigo-600 rounded-lg text-white text-sm font-medium hover:bg-indigo-700 cursor-pointer"
              >
                검색
              </button>
            </div>
          </form>

          {/* 목록 테이블 */}
          <div className="self-stretch bg-white rounded-lg shadow flex flex-col">
            <div className="h-12 px-6 bg-gray-50 border-b border-gray-200 flex items-center text-gray-700 text-sm font-semibold space-x-4">
              <div className="w-[15%] flex justify-center">고객명</div>
              <div className="w-[20%] flex justify-center">연락처</div>
              <div className="w-[20%] flex justify-center">이메일</div>
              <div className="w-[15%] flex justify-center">상태</div>
              <div className="w-[10%] flex justify-center cursor-pointer select-none" onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}>
                예약 건수
                <span className="ml-1">{sortOrder === 'desc' ? '▼' : '▲'}</span>
              </div>
              <div className="w-[20%] flex justify-center">관리</div>
            </div>
            {customers.map((c: any, idx: number) => (
              <div key={c.id || idx} className="h-16 px-6 border-b border-gray-200 flex items-center text-sm text-center space-x-4">
                <div className="w-[15%] flex justify-center items-center text-gray-900 font-medium">{c.name}</div>
                <div className="w-[20%] flex justify-center items-center text-gray-500">{c.phone}</div>
                <div className="w-[20%] flex justify-center items-center text-gray-500">{c.email}</div>
                <div className="w-[15%] flex justify-center items-center">
                  <div className={`px-2 py-0.5 rounded-xl text-xs font-medium flex justify-center items-center ${c.status === '신고됨' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>{c.status}</div>
                </div>
                <div className="w-[10%] flex justify-center items-center text-gray-900 font-medium">{c.count}</div>
                <div className="w-[20%] flex justify-center items-center gap-2">
                  <button className="px-2 py-1 rounded border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-50 cursor-pointer" onClick={() => handleDetail(c.id)}>
                    상세
                  </button>
                  <button className="px-2 py-1 rounded border border-yellow-500 text-yellow-500 text-sm font-medium hover:bg-yellow-50 cursor-pointer" onClick={() => handleEdit(c.id)}>
                    수정
                  </button>
                  <button className="px-2 py-1 rounded border border-red-500 text-red-500 text-sm font-medium hover:bg-red-50 cursor-pointer" onClick={() => handleDelete(c.id)}>
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 - 공지/이벤트, 예약 관리와 동일하게 */}
          <div className="self-stretch py-4 flex justify-center items-center gap-1">
            <button
              className="w-9 h-9 rounded-md flex justify-center items-center bg-white outline outline-1 outline-gray-200 text-gray-500 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              &lt;
            </button>
            {Array.from({ length: 5 }, (_, i) => (
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
              onClick={() => setPage((p) => Math.min(4, p + 1))}
              disabled={page === 4}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {showDetail && selectedCustomer && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[500px]">
            <div className="text-lg font-bold mb-4">고객 상세 정보</div>
            <div>이름: {selectedCustomer.name}</div>
            <div>연락처: {selectedCustomer.phone}</div>
            <div>이메일: {selectedCustomer.email}</div>
            <div>성별: {selectedCustomer.gender}</div>
            <div>생년월일: {selectedCustomer.birthDate}</div>
            <div>주소: {selectedCustomer.roadAddress} {selectedCustomer.detailAddress}</div>
            <div>위도/경도: {selectedCustomer.latitude}, {selectedCustomer.longitude}</div>
            <div>포인트: {selectedCustomer.point}</div>
            <div>상태: {selectedCustomer.status}</div>
            <div>등록일: {selectedCustomer.createdAt}</div>
            <div>수정일: {selectedCustomer.updatedAt}</div>
            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => setShowDetail(false)}>닫기</button>
          </div>
        </div>
      )}
      {showEdit && editCustomer && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[500px]">
            <div className="text-lg font-bold mb-4">고객 정보 수정</div>
            <div className="flex flex-col gap-2">
              <input className="border p-2 rounded" value={editCustomer.name} onChange={e => setEditCustomer({ ...editCustomer, name: e.target.value })} placeholder="이름" />
              <input className="border p-2 rounded" value={editCustomer.phone} onChange={e => setEditCustomer({ ...editCustomer, phone: e.target.value })} placeholder="연락처" />
              <input className="border p-2 rounded" value={editCustomer.email} onChange={e => setEditCustomer({ ...editCustomer, email: e.target.value })} placeholder="이메일" />
              <input className="border p-2 rounded" value={editCustomer.gender} onChange={e => setEditCustomer({ ...editCustomer, gender: e.target.value })} placeholder="성별" />
              <input className="border p-2 rounded" value={editCustomer.birthDate} onChange={e => setEditCustomer({ ...editCustomer, birthDate: e.target.value })} placeholder="생년월일" />
              <input className="border p-2 rounded" value={editCustomer.roadAddress} onChange={e => setEditCustomer({ ...editCustomer, roadAddress: e.target.value })} placeholder="도로명 주소" />
              <input className="border p-2 rounded" value={editCustomer.detailAddress} onChange={e => setEditCustomer({ ...editCustomer, detailAddress: e.target.value })} placeholder="상세 주소" />
              <input className="border p-2 rounded" value={editCustomer.latitude} onChange={e => setEditCustomer({ ...editCustomer, latitude: Number(e.target.value) })} placeholder="위도" />
              <input className="border p-2 rounded" value={editCustomer.longitude} onChange={e => setEditCustomer({ ...editCustomer, longitude: Number(e.target.value) })} placeholder="경도" />
              <input className="border p-2 rounded" value={editCustomer.point} onChange={e => setEditCustomer({ ...editCustomer, point: Number(e.target.value) })} placeholder="포인트" />
              <select className="border p-2 rounded" value={editCustomer.status} onChange={e => setEditCustomer({ ...editCustomer, status: e.target.value })}>
                <option value="활성">활성</option>
                <option value="신고됨">신고됨</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={handleEditSave}>저장</button>
              <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded" onClick={() => setShowEdit(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};