// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AiResult from './pages/AiResult/AiResult';

function App() {
  return (
    <BrowserRouter>
      {/* 모바일 앱 환경을 가정한 레이아웃 래퍼 */}
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 shadow-xl relative overflow-x-hidden">
        <Routes>
          {/* 기본 경로는 일단 AI 결과 페이지로 리다이렉트 (추후 홈으로 변경 가능) */}
          <Route path="/" element={<Navigate to="/ai-hook" replace />} />
          <Route path="/ai-hook" element={<AiResult />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;