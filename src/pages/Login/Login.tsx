import React from 'react';

export default function Login() {
  const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  
  // 카카오 공식 인증 페이지 URL 생성
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">PetBody</h1>
        <p className="text-gray-500">반려동물 건강 관리의 시작</p>
      </div>

      <button
        onClick={handleLogin}
        className="w-full max-w-sm flex items-center justify-center space-x-3 bg-[#FEE500] text-[#000000] font-bold py-4 rounded-xl shadow-sm hover:bg-[#F4DC00] transition-colors"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" 
          alt="kakao" 
          className="w-6 h-6" 
        />
        <span>카카오로 1초 만에 시작하기</span>
      </button>
    </div>
  );
}