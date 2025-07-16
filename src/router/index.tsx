import { createBrowserRouter } from 'react-router-dom'

// 수요자
import { CustomerLogin } from '@/features/customer/pages/CustomerLogin'
import { CustomerLayout } from '@/features/customer/layouts/CustomerLayout'
import { CustomerMain } from '@/features/customer/pages/CustomerMain'
import { CustomerSignup } from '@/features/customer/pages/CustomerSignup'
import { CustomerMyReservationDetail } from '@/features/customer/pages/reservation/CustomerMyReservationDetail'
import { CustomerMyReservationPage } from '@/features/customer/pages/reservation/CustomerMyReservationPage'
import { ReservationStepOne } from '@/features/customer/pages/reservation/ReservationStepOne'
import ReservationRouteGuard from '@/features/customer/pages/reservation/ReservationRouteGuard'
import ReservationStepFinalGuard from '@/features/customer/pages/reservation/ReservationStepFinalGuard'
import { CustomerInquiryPage } from '@/features/customer/pages/customerInquiry/CustomerInquiryPage'
import { CustomerInquiryForm } from '@/features/customer/pages/customerInquiry/CustomerInquiryForm'
import { CustomerInquiryDetail } from '@/features/customer/pages/customerInquiry/CustomerInquiryDetail'
import { CustomerReviewsPage } from '@/features/customer/pages/customerReview/CustomerReviewsPage'
import { CustomerMyInfo } from '@/features/customer/pages/CustomerMyInfo'

// 매니저
import { ManagerLayout } from '@/features/manager/layouts/ManagerLayout'
import { ManagerMain } from '@/features/manager/pages/ManagerMain'
import { ManagerSignup } from '@/features/manager/pages/ManagerSignup'
import { ManagerLogin } from '@/features/manager/pages/ManagerLogin'
import { ManagerMy } from '@/features/manager/pages/ManagerMy/ManagerMy'
import { ManagerContractCancel } from '@/features/manager/pages/ManagerMy/ManagerContractCancel'
import { ManagerMyForm } from '@/features/manager/pages/ManagerMy/ManagerMyForm'
import { ManagerReservations } from '@/features/manager/pages/ManagerReservation/ManagerReservations'
import { ManagerReservationDetail } from '@/features/manager/pages/ManagerReservation/ManagerReservationDetail'
import { ManagerInquiries } from '@/features/manager/pages/ManagerInquiry/ManagerInquiries'
import { ManagerInquiryDetail } from '@/features/manager/pages/ManagerInquiry/ManagerInquiryDetail'
import { ManagerInquiryForm } from '@/features/manager/pages/ManagerInquiry/ManagerInquiryForm'
import { ManagerReviews } from '@/features/manager/pages/ManagerReview/ManagerReviews'
import { ManagerPayments } from '@/features/manager/pages/ManagerPayment/ManagerPayments'

// 관리자
import { AdminLogin } from '@/features/admin/pages/AdminLogin'
import { AdminLayout } from '@/features/admin/layouts/AdminLayout'
import { AdminMain } from '@/features/admin/pages/AdminMain'
import { AdminAccounts } from '@/features/admin/pages/AdminAccount/AdminAccounts'
import { AdminAccountForm } from '@/features/admin/pages/AdminAccount/AdminAccountForm'
import { AdminManagers } from '@/features/admin/pages/AdminManager/AdminManagers'
import { AdminManagerDetail } from '@/features/admin/pages/AdminManager/AdminManagerDetail'
import { AdminCustomers } from '@/features/admin/pages/AdminCustomer/AdminCustomers'
import { AdminCustomerDetail } from '@/features/admin/pages/AdminCustomer/AdminCustomerDetail'
import { AdminReservations } from '@/features/admin/pages/AdminReservation/AdminReservations'
import { AdminReservationDetail } from '@/features/admin/pages/AdminReservation/AdminReservationDetail'
import { AdminBoards } from '@/features/admin/pages/AdminBoard/AdminBoards'
import { AdminBanners } from '@/features/admin/pages/AdminBanner/AdminBanners'
import { AdminBannerDetail } from '@/features/admin/pages/AdminBanner/AdminBannerDetail'
import { AdminBannerForm } from '@/features/admin/pages/AdminBanner/AdminBanneerForm'
import { AdminInquiries } from '@/features/admin/pages/AdminInquiry/AdminInquiries'
import { AdminInquiryDetail } from '@/features/admin/pages/AdminInquiry/AdminInquiryDetail'
import { AdminSettlements } from '@/features/admin/pages/AdminSettlement/AdminSettlements'

// 공통
import { GuardLayout } from '@/shared/components/GuardLayout'
import CustomerNotFound from '@/features/customer/pages/CustomerNotFound'
import ManagerNotFound from '@/features/manager/pages/ManagerNotFound'
import AdminNotFound from '@/features/admin/pages/AdminNotFound'

export const router = createBrowserRouter([
  /** 수요자 로그인 (가드 제외) */

  { path: '/auth/login', element: <CustomerLogin /> },

  /** 매니저 로그인/회원가입 */
  {
    path: '/managers/auth',
    children: [
      { path: 'login', element: <ManagerLogin /> },
      { path: 'signup', element: <ManagerSignup /> }
    ]
  },

  /** 관리자 로그인 */
  {
    path: '/admin/auth/login',
    children: [{ index: true, element: <AdminLogin /> }]
  },

  /** 공통 가드 레이아웃 내부 라우팅 *******************************************/
  {
    path: '/',
    element: <GuardLayout />,
    children: [
      /** 수요자 페이지 */
      {
        path: '/',
        element: <CustomerLayout />,
        children: [
          // 메인
          { index: true, element: <CustomerMain /> },
          // 수요자 회원가입
          { path: 'auth/signup', element: <CustomerSignup /> },
          {
            // 예약 요청
            path: 'reservations',
            children: [
              { path: 'new', element: <ReservationStepOne /> },
              {
                path: ':reservationId/step-2',
                element: <ReservationRouteGuard />
              },
              {
                path: ':reservationId/final',
                element: <ReservationStepFinalGuard />
              }
            ]
          },
          {
            path: 'my',
            children: [
              // 수요자 정보
              { index: true, element: <CustomerMyInfo /> },
              {
                // 문의 내역
                path: 'inquiries',
                children: [
                  { index: true, element: <CustomerInquiryPage /> },
                  { path: ':inquiryId', element: <CustomerInquiryDetail /> },
                  { path: ':inquiryId/edit', element: <CustomerInquiryForm /> },
                  { path: 'new', element: <CustomerInquiryForm /> }
                ]
              },
              {
                // 예약 내역
                path: 'reservations',
                children: [
                  { index: true, element: <CustomerMyReservationPage /> },
                  {
                    path: ':reservationId',
                    element: <CustomerMyReservationDetail />
                  }
                ]
              },
              {
                // 리뷰 내역
                path: 'reviews',
                children: [{ index: true, element: <CustomerReviewsPage /> }]
              }
            ]
          }
        ]
      },

      /** 매니저 페이지 (사이드바 있음) */
      {
        path: '/managers',
        element: <ManagerLayout />,
        children: [
          { index: true, element: <ManagerMain /> },
          {
            path: 'my',
            children: [
              { index: true, element: <ManagerMy /> },
              { path: 'edit', element: <ManagerMyForm /> },
              { path: 'contract-cancel', element: <ManagerContractCancel /> }
            ]
          },
          {
            path: 'reservations',
            children: [
              { index: true, element: <ManagerReservations /> },
              { path: ':reservationId', element: <ManagerReservationDetail /> }
            ]
          },
          { path: 'reviews', element: <ManagerReviews /> },
          {
            path: 'inquiries',
            children: [
              { index: true, element: <ManagerInquiries /> },
              { path: ':inquiryId', element: <ManagerInquiryDetail /> },
              { path: 'new', element: <ManagerInquiryForm /> },
              { path: ':inquiryId/edit', element: <ManagerInquiryForm /> }
            ]
          },
          { path: 'payments', element: <ManagerPayments /> }
        ]
      },

      /** 관리자 페이지 (사이드바 있음) */
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          // 메인페이지 (= 대시보드)
          { index: true, element: <AdminMain /> },
          // 관리자 계정 목록
          {
            path: 'accounts',
            children: [
              // 목록
              { index: true, element: <AdminAccounts /> },

              // 등록
              { path: 'new', element: <AdminAccountForm /> },
              // 수정
              { path: ':adminId/edit', element: <AdminAccountForm /> }
            ]
          },
          // 고객 정보 목록
          {
            path: 'customers',
            children: [
              // 목록
              { index: true, element: <AdminCustomers /> },
              // 상세
              { path: ':customerId', element: <AdminCustomerDetail /> }
            ]
          },
          // 매니저 정보 목록
          {
            path: 'managers',
            children: [
              // 목록
              { index: true, element: <AdminManagers /> },
              // 상세
              { path: ':managerId', element: <AdminManagerDetail /> }
              // 수정
              // { path: ':managerId/edit', element: <AdminManagerForm /> },
            ]
          },
          // 예약 관리 목록
          {
            path: 'reservations',
            children: [
              // 목록
              { index: true, element: <AdminReservations /> },
              // 상세
              { path: ':reservationId', element: <AdminReservationDetail /> }
            ]
          },
          // // 문의 내역 목록
          {
            path: 'inquiries',
            children: [
              // 목록
              { index: true, element: <AdminInquiries /> },

              // 상세
              {
                path: ':inquiryId',
                element: <AdminInquiryDetail />
              }
            ]
          },
          // // 정산 관리 목록
          {
            path: 'settlements',
            children: [
              // 목록
              { index: true, element: <AdminSettlements /> }
            ]
          },
          // // 공지/이벤트 목록
          {
            path: 'boards',
            children: [
              // 목록
              { index: true, element: <AdminBoards /> }
              // { path: 'notices',
              //   children: [
              //     // 등록
              //     { path: 'new', element: <AdminNoticeForm /> },
              //     // 수정
              //     { path: ':noticeId/edit', element: <AdminNoticeForm /> },
              //   ]
              // },
              // { path: 'events',
              //   children: [
              //     // 등록
              //     { path: 'new', element: <AdminEventForm /> },
              //     // 수정
              //     { path: ':eventId/edit', element: <AdminEventForm /> },
              //   ]
              // },
            ]
          },
          // 배너 관리 목록
          {
            path: 'banners',
            children: [
              // 목록
              { index: true, element: <AdminBanners /> },
              // 상세
              { path: ':bannerId', element: <AdminBannerDetail /> },
              // 등록
              { path: 'new', element: <AdminBannerForm /> },
              // 수정
              { path: ':bannerId/edit', element: <AdminBannerForm /> }
            ]
          }
        ]
      }
    ]
  },

  /** ❗️사이드바 없는 NotFound 페이지들 (최상단 분기) ***************/
  {
    path: '/managers/*',
    element: <ManagerNotFound />
  },
  {
    path: '/admin/*',
    element: <AdminNotFound />
  },
  {
    path: '*',
    element: <CustomerNotFound />
  }
])
