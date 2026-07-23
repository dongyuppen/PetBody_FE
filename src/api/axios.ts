// src/api/axios.ts
import axios from 'axios';

// 환경 변수가 있으면 사용하고, 없으면 로컬 백엔드 주소 사용
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // 백엔드의 CORS 설정(allowCredentials: true)과 맞춤
  withCredentials: true, 
});

// 향후 토큰 기반 인증(JWT)이 추가될 경우를 대비한 인터셉터 뼈대
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('accessToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);