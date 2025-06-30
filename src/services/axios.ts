import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { reissueToken } from '@/shared/utils/reissueToken';
import { logout } from '@/shared/utils/logout';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Vite 프록시 적용 전제
  withCredentials: true,                      // 필요 시 쿠키 전송 허용
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 헤더 추가 인터셉터
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 토큰 재발급 인터셉터
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // 로그인 요청이면 재발급 로직 건너뜀
    if (originalRequest.url.includes('/auth/login')) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry // 중복 방지
    ) {
      originalRequest._retry = true;

      try {
        const accessToken = await reissueToken();

        // 상태 업데이트
        const store = useAuthStore.getState();
        store.setTokens(accessToken, store.role!);

        // 헤더 갱신 후 재요청
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        // 재발급 실패 → 로그아웃
        const { clearTokens, role } = useAuthStore.getState();
        clearTokens();
        await logout();

        // 역할에 따라 로그인 페이지 분기
        switch (role) {
          case "CUSTOMER":
            window.location.href = "/auth/login";
            break;
          case "MANAGER":
            window.location.href = "/managers/auth/login";
            break;
          case "ADMIN":
            window.location.href = "/admin/auth/login";
            break;
          default:
            window.location.href = "/";
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;