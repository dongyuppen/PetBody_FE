// src/types/pet.ts

export type Species = 'DOG' | 'CAT';
export type BmiLevel = 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE' | 'SEVERELY_OBESE';
export type ObservationType = 'WEIGHT' | 'DIET' | 'WALK';

// [Hook] AI 분석 요청 및 응답 타입
export interface AiPersonaRequest {
  currentWeight: number;
  standardWeight: number;
  breedName: string;
}

export interface AiBmiResponse {
  humanBmi: number;
  bmiLevel: BmiLevel;
  levelDescription: string;
  imageUrl: string;
}

// [Core] 건강 데이터 기록 및 대시보드 타입
export interface ObservationRequest {
  type: ObservationType;
  value: number;
  unit: string;
}

export interface DashboardResponse {
  dailyTargetKcal: number;
  todayConsumedKcal: number;
  todayWalkMinutes: number;
  currentWeight: number;
}