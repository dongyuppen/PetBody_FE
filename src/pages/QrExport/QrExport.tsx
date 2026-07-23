// src/pages/QrExport/QrExport.tsx
import { useState, useEffect } from 'react';
import { Stethoscope, AlertCircle, ShieldCheck } from 'lucide-react';
import QRCode from 'react-qr-code';
import { api } from '../../api/axios';

// 백엔드의 MedicalExportResponse 규격에 맞춘 타입 정의
interface ObservationRecord {
  type: string;
  value: number;
  unit: string;
  measuredAt: string;
}

interface MedicalExportResponse {
  patient: {
    name: string;
    species: 'DOG' | 'CAT';
    isNeutered: boolean;
    currentWeight: number;
  };
  recentObservations: ObservationRecord[];
  generatedAt: string;
}

export default function QrExport() {
  const [data, setData] = useState<MedicalExportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExportData = async () => {
      try {
        const response = await api.get<MedicalExportResponse>('/pets/1/export');
        setData(response.data);
      } catch (error) {
        console.error('QR 데이터 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExportData();
  }, []);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">데이터를 불러오는 중...</div>;
  }

  if (!data) {
    return <div className="flex h-screen items-center justify-center">의료 데이터를 찾을 수 없습니다.</div>;
  }

  // QR 코드에 담을 데이터를 JSON 문자열로 변환 (FHIR 표준 컨셉)
  // 실제 상용 서비스에서는 보안을 위해 데이터를 암호화하거나, 의사용 웹뷰 URL 링크를 담는 것이 좋습니다.
  const qrPayload = JSON.stringify(data);

  return (
    <div className="flex flex-col min-h-screen p-6 bg-orange-50/50 pb-24 animate-fade-in">
      <div className="mt-8 mb-6 text-center flex flex-col items-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-full text-white mb-4 shadow-lg shadow-orange-200">
          <Stethoscope className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">스마트 동물병원 연동</h1>
        <p className="text-gray-500 text-sm">
          진료 시 원장님께 아래 QR 코드를 보여주세요.
        </p>
      </div>

      {/* QR 코드 카드 영역 */}
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col items-center mb-6">
        
        {/* QR 렌더링 */}
        <div className="bg-white p-3 rounded-2xl shadow-inner border border-gray-100 mb-6">
          <QRCode
            value={qrPayload}
            size={180}
            level="M"
            className="mx-auto"
          />
        </div>
        
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          {data.patient.name} <span className="text-lg font-medium text-gray-500">환자 리포트</span>
        </h2>
        
        <div className="flex items-center space-x-2 text-gray-600 text-sm font-medium mb-6">
          <span>{data.patient.species === 'DOG' ? '강아지' : '고양이'}</span>
          <span>·</span>
          <span>{data.patient.isNeutered ? '중성화 완료' : '중성화 안됨'}</span>
          <span>·</span>
          <span>{data.patient.currentWeight}kg</span>
        </div>

        {/* 안내 메시지 */}
        <div className="w-full bg-blue-50 text-blue-700 p-4 rounded-xl flex items-start space-x-3 text-sm">
          <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            최근 3개월간의 <b>식단, 산책, 체중 변화 기록</b>이 안전하게 암호화되어 포함되어 있습니다.
          </p>
        </div>
      </div>
      
      {/* 데이터 상세 내역 요약 (보호자용) */}
      <div className="px-2">
        <h3 className="text-sm font-bold text-gray-500 mb-3 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          전송되는 데이터 요약 ({data.recentObservations.length}건)
        </h3>
        <ul className="text-sm text-gray-400 space-y-1">
          {data.recentObservations.slice(0, 3).map((obs, idx) => (
            <li key={idx}>
              • {new Date(obs.measuredAt).toLocaleDateString()} - 
              {obs.type === 'DIET' ? ' 식단 ' : obs.type === 'WALK' ? ' 산책 ' : ' 체중 '} 
              ({obs.value}{obs.unit})
            </li>
          ))}
          {data.recentObservations.length > 3 && <li>• 외 {data.recentObservations.length - 3}건의 기록</li>}
        </ul>
      </div>
    </div>
  );
}