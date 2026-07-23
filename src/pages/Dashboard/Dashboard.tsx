// src/pages/Dashboard/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Flame, Bone, Activity, PlusCircle } from 'lucide-react';
import { api } from '../../api/axios';
import type { DashboardResponse, ObservationRequest, ObservationType } from '../../types/pet';

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 대시보드 데이터 불러오기
  const fetchDashboard = async () => {
    try {
      const response = await api.get<DashboardResponse>('/pets/1/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('대시보드 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // 건강 데이터 간편 기록하기
  const handleAddObservation = async (type: ObservationType, value: number, unit: string) => {
    const requestData: ObservationRequest = { type, value, unit };
    
    try {
      await api.post('/pets/1/observations', requestData);
      // 기록 성공 후 대시보드 데이터 새로고침
      fetchDashboard();
      alert('기록이 완료되었습니다! 🎉');
    } catch (error) {
      console.error('기록 실패:', error);
      alert('기록에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">로딩 중...</div>;
  }

  if (!data) {
    return <div className="flex h-screen items-center justify-center">데이터를 불러올 수 없습니다.</div>;
  }

  // 칼로리 진행률 계산 (최대 100%)
  const caloriePercent = Math.min((data.todayConsumedKcal / data.dailyTargetKcal) * 100, 100);
  const isOverKcal = data.todayConsumedKcal > data.dailyTargetKcal;

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50 pb-24">
      <div className="mt-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">오늘의 건강 일기 🐾</h1>
        <p className="text-gray-500">목표 체중까지 화이팅!</p>
      </div>

      {/* 1. 칼로리 요약 카드 */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">오늘 섭취한 칼로리</p>
            <div className="flex items-baseline space-x-1">
              <span className={`text-3xl font-extrabold ${isOverKcal ? 'text-red-500' : 'text-primary'}`}>
                {data.todayConsumedKcal}
              </span>
              <span className="text-gray-500">/ {data.dailyTargetKcal} kcal</span>
            </div>
          </div>
          <Flame className={`w-8 h-8 ${isOverKcal ? 'text-red-500' : 'text-primary'}`} />
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${isOverKcal ? 'bg-red-500' : 'bg-primary'}`}
            style={{ width: `${caloriePercent}%` }}
          ></div>
        </div>
        {isOverKcal && <p className="text-xs text-red-500 font-medium">목표 칼로리를 초과했어요! 산책이 필요해요.</p>}
      </div>

      {/* 2. 산책 및 체중 요약 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center">
          <Bone className="w-8 h-8 text-secondary mb-2" />
          <p className="text-sm text-gray-500">오늘 산책</p>
          <p className="text-xl font-bold text-gray-900">{data.todayWalkMinutes} <span className="text-sm font-normal">분</span></p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center">
          <Activity className="w-8 h-8 text-blue-500 mb-2" />
          <p className="text-sm text-gray-500">최근 체중</p>
          <p className="text-xl font-bold text-gray-900">{data.currentWeight} <span className="text-sm font-normal">kg</span></p>
        </div>
      </div>

      {/* 3. 빠른 기록 버튼들 */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">빠른 기록</h2>
      <div className="space-y-3">
        <button 
          onClick={() => handleAddObservation('DIET', 100, 'kcal')}
          className="w-full flex items-center justify-between p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-orange-200 p-2 rounded-lg"><Flame className="w-5 h-5 text-orange-600" /></div>
            <span className="font-semibold text-gray-800">간식/사료 먹었어요</span>
          </div>
          <div className="flex items-center text-orange-600 font-bold">
            +100 kcal <PlusCircle className="w-5 h-5 ml-2" />
          </div>
        </button>

        <button 
          onClick={() => handleAddObservation('WALK', 30, 'min')}
          className="w-full flex items-center justify-between p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-200 p-2 rounded-lg"><Bone className="w-5 h-5 text-yellow-700" /></div>
            <span className="font-semibold text-gray-800">산책 다녀왔어요</span>
          </div>
          <div className="flex items-center text-yellow-700 font-bold">
            +30 분 <PlusCircle className="w-5 h-5 ml-2" />
          </div>
        </button>
      </div>
    </div>
  );
}