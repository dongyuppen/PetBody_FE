// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, QrCode } from 'lucide-react';
import AiResult from './pages/AiResult/AiResult';
import Dashboard from './pages/Dashboard/Dashboard';
import QrExport from './pages/QrExport/QrExport';
import Login from './pages/Login/Login';
import KakaoCallback from './pages/Login/KakaoCallback';

// 모바일 하단 네비게이션 컴포넌트
function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', name: '홈', icon: Home },
    { path: '/ai-hook', name: 'AI 진단', icon: Sparkles },
    // 추후 구현할 QR 내보내기 페이지 라우팅용
    { path: '/export', name: 'QR 진료', icon: QrCode },
  ];

  return (
    <div className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 px-2 z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex flex-col items-center space-y-1 w-20 transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-bold">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* max-w-md로 PC에서도 모바일 크기로 보이게 설정 */}
      <div className="max-w-md mx-auto h-screen bg-gray-50 shadow-xl relative overflow-hidden flex flex-col">
        
        {/* 메인 화면 영역 (스크롤 가능) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-hook" element={<AiResult />} />
            {<Route path="/export" element={<QrExport />} />}
            {/* 로그인 관련 라우트 */}
            <Route path="/login" element={<Login />} />
            <Route path="/oauth/callback/kakao" element={<KakaoCallback />} />
          </Routes>
        </div>

        {/* 하단 네비게이션 바 */}
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;