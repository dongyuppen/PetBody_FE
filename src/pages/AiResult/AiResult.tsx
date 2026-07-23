// src/pages/AiResult/AiResult.tsx
import { useState } from 'react';
import { Loader2, Share2, RotateCcw, Activity } from 'lucide-react';
import { api } from '../../api/axios';
import type { AiPersonaRequest, AiBmiResponse } from '../../types/pet';

type Step = 'INPUT' | 'LOADING' | 'RESULT';

export default function AiResult() {
  const [step, setStep] = useState<Step>('INPUT');
  const [result, setResult] = useState<AiBmiResponse | null>(null);
  
  // 폼 입력 상태 관리
  const [formData, setFormData] = useState<AiPersonaRequest>({
    currentWeight: 0,
    standardWeight: 0,
    breedName: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'breedName' ? value : Number(value),
    }));
  };

  const handleAnalyze = async () => {
    if (!formData.breedName || formData.currentWeight <= 0 || formData.standardWeight <= 0) {
      alert('모든 정보를 올바르게 입력해주세요.');
      return;
    }

    try {
      setStep('LOADING');
      // 테스트를 위해 더미 데이터로 생성한 petId 1번을 고정으로 사용합니다.
      const response = await api.post<AiBmiResponse>('/pets/1/ai-persona', formData);
      setResult(response.data);
      setStep('RESULT');
    } catch (error) {
      console.error('AI 분석 실패:', error);
      alert('AI 이미지 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setStep('INPUT');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'PetBody AI 진단 결과',
        text: `우리 강아지는 사람으로 치면 BMI ${result?.humanBmi} 의 ${result?.levelDescription} 상태래요!`,
        url: window.location.href,
      });
    } else {
      alert('공유하기 기능이 지원되지 않는 브라우저입니다.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-white">
      {/* 1. 입력 화면 */}
      {step === 'INPUT' && (
        <div className="flex flex-col flex-grow animate-fade-in">
          <div className="mt-10 mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">PetBody AI Check</h1>
            <p className="text-gray-500">내 반려동물은 사람으로 치면 어떤 모습일까요?</p>
          </div>

          <div className="space-y-6 flex-grow">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">견종/묘종</label>
              <input
                type="text"
                name="breedName"
                placeholder="예: 말티즈, 푸들, 코리안 숏헤어"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">현재 체중 (kg)</label>
                <input
                  type="number"
                  name="currentWeight"
                  placeholder="예: 4.5"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">표준 체중 (kg)</label>
                <input
                  type="number"
                  name="standardWeight"
                  placeholder="예: 3.0"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-orange-600 transition-colors mt-8"
          >
            AI 분석 시작하기
          </button>
        </div>
      )}

      {/* 2. 로딩 화면 */}
      {step === 'LOADING' && (
        <div className="flex flex-col items-center justify-center flex-grow space-y-6">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-gray-800">AI가 변환 중입니다...</h2>
            <p className="text-gray-500 text-sm">
              정밀한 이미지 생성을 위해<br />최대 10초 정도 소요될 수 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* 3. 결과 화면 */}
      {step === 'RESULT' && result && (
        <div className="flex flex-col flex-grow animate-fade-in pb-8">
          <h2 className="text-2xl font-bold text-center mt-6 mb-6">분석 완료! 🎉</h2>
          
          <div className="bg-gray-50 rounded-3xl p-4 shadow-sm border border-gray-100">
            {/* AI 생성 이미지 */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 bg-gray-200">
              <img 
                src={result.imageUrl} 
                alt="AI Generated Persona" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* 결과 텍스트 */}
            <div className="text-center space-y-2 mb-4">
              <div className="inline-flex items-center justify-center space-x-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full font-semibold text-sm">
                <Activity className="w-4 h-4" />
                <span>사람 BMI 환산 : {result.humanBmi}</span>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 pt-2">
                {result.levelDescription}
              </h3>
            </div>
          </div>

          <div className="flex space-x-3 mt-8 mt-auto">
            <button
              onClick={() => setStep('INPUT')}
              className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>다시하기</span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center space-x-2 bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-orange-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>SNS 자랑하기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}