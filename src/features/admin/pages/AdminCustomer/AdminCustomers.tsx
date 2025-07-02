import { useState, useEffect } from "react";

import { Fragment } from "react/jsx-runtime";
import api from '@/services/axios';
import { AdminSearchForm } from "../../components/AdminSearchForm";
import { AdminPageHeader } from "../../components/AdminPageHeader";
import { AdminTable } from "../../components/AdminTable";
import type { AdminTableColumn } from "../../components/AdminTable";
import { StatusBadge } from "../../components/StatusBadge";
import { AdminPagination } from "../../components/AdminPagination";
import { AdminTabs } from "../../components/AdminTabs";
import { TableSection } from '../../components/TableSection';

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
  const [emailKeyword, setEmailKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Spring API에서 고객 목록 불러오기
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/admin/customers', {
          params: {
            tab: activeTab,
            name: nameKeyword,
            phone: phoneKeyword,
            email: emailKeyword,
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
        setTotalPages(res.data.totalPages || 1);
      } catch (e: any) {
        console.error('고객 목록을 불러오지 못했습니다.', e);
      }
    };
    fetchCustomers();
  }, [activeTab, nameKeyword, phoneKeyword, emailKeyword, page, sortOrder]);

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

  // 테이블 컬럼 정의
  const columns: AdminTableColumn<Customer>[] = [
    { key: "name", header: "고객명", className: "w-[15%] text-center" },
    { key: "phone", header: "연락처", className: "w-[20%] text-center" },
    { key: "email", header: "이메일", className: "w-[20%] text-center" },
    {
      key: "status",
      header: (
        <div className="flex items-center justify-center gap-2">
          <span>상태</span>
          <select
            className="text-xs border rounded px-1 py-0.5"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">전체</option>
            <option value="ACTIVE">활성</option>
            <option value="REPORTED">신고</option>
          </select>
        </div>
      ),
      className: "w-[15%] text-center",
      render: (row) => <StatusBadge status={row.status === '신고됨' ? 'REPORTED' : 'ACTIVE'} />,
    },
    {
      key: "count",
      header: (
        <div className="flex justify-center items-center cursor-pointer select-none" onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}>
          예약 건수
          <span className="ml-1">{sortOrder === 'desc' ? '▼' : '▲'}</span>
        </div>
      ),
      className: "w-[10%] text-center",
    },
    {
      key: "actions",
      header: "관리",
      className: "w-[20%] text-center",
      render: (row) => (
        <div className="flex justify-center items-center gap-2">
          <button className="px-2 py-1 rounded border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-50 cursor-pointer" onClick={() => handleDetail(row.id)}>
            상세
          </button>
          <button className="px-2 py-1 rounded border border-yellow-500 text-yellow-500 text-sm font-medium hover:bg-yellow-50 cursor-pointer" onClick={() => handleEdit(row.id)}>
            수정
          </button>
          <button className="px-2 py-1 rounded border border-red-500 text-red-500 text-sm font-medium hover:bg-red-50 cursor-pointer" onClick={() => handleDelete(row.id)}>
            삭제
          </button>
        </div>
      ),
    },
  ];

  const filteredCustomers =
    statusFilter === "ALL"
      ? customers
      : customers.filter(c =>
          (statusFilter === "REPORTED" && c.status === "신고됨") ||
          (statusFilter === "ACTIVE" && c.status !== "신고됨")
        );

  return (
    <Fragment>
      <div className="w-full self-stretch inline-flex flex-col justify-start items-start">
        <AdminPageHeader title="고객 정보 관리" />
        <div className="self-stretch flex-1 p-6 flex flex-col justify-start items-start gap-6">
          {/* 탭 + 검색 폼: 한 줄에 배치 */}
          <div className="w-full flex flex-row items-center justify-between mb-2 gap-2">
            <div className="flex-1 min-w-0">
              <AdminTabs
                tabs={[
                  { key: 'all', label: '전체 고객' },
                  { key: 'reported', label: '신고 고객' },
                ]}
                activeKey={activeTab}
                onTabChange={key => setActiveTab(key as typeof activeTab)}
                className="w-fit min-w-0"
              />
            </div>
            <div className="flex-shrink-0">
              <AdminSearchForm
                fields={[
                  { type: "select", name: "type", options: [
                    { value: "name", label: "이름" },
                    { value: "phone", label: "연락처" },
                    { value: "email", label: "이메일" }
                  ]},
                  { type: "text", name: "keyword", placeholder: "검색어 입력" }
                ]}
                initialValues={{ type: "name", keyword: "" }}
                onSearch={({ type, keyword }) => {
                  setNameKeyword(type === "name" ? keyword : "");
                  setPhoneKeyword(type === "phone" ? keyword : "");
                  setEmailKeyword(type === "email" ? keyword : "");
                  setPage(0);
                }}
              />
            </div>
          </div>

          {/* 목록 테이블 + 페이지네이션을 하나의 영역(Card)으로 묶음 */}
          <TableSection title="고객 정보" total={filteredCustomers.length}>
            <AdminTable
              columns={columns}
              data={filteredCustomers}
              rowKey={row => row.id}
              emptyMessage={"조회된 고객이 없습니다."}
            />
            <div className="w-full flex justify-center py-4">
              <AdminPagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          </TableSection>
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