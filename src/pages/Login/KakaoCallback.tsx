import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { api } from '../../api/axios';

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 현재 URL에서 'code' 파라미터 추출
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      // 2. 백엔드로 인가 코드 전송
      api.post('/auth/kakao', { code })
        .then((response) => {
          // 3. 백엔드에서 준 JWT Access Token을 로컬 스토리지에 저장
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          // 4. 로그인 성공 후 메인(홈) 화면으로 이동
          navigate('/', { replace: true });
        })
        .catch((error) => {
          console.error('카카오 로그인 실패:', error);
          alert('로그인 처리 중 오류가 발생했습니다.');
          navigate('/login', { replace: true });
        });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <h2 className="text-lg font-bold text-gray-800">카카오 로그인 중입니다...</h2>
    </div>
  );
}