import { BrushCleaning, AirVent, Box, Baby } from 'lucide-react';

// serviceCategoryId에 따른 아이콘 컴포넌트 매핑
export const serviceCategoryIcons: { [key: number]: React.ElementType } = {
  1: BrushCleaning,       // 가사 청소
  2: AirVent,    // 에어컨 청소
  3: Box,        // 이사/입주 청소
  4: Baby,       // 아이돌보미
  // ... 필요한 카테고리 ID와 Lucide 아이콘 컴포넌트를 추가
};

export const DefaultServiceIcon = BrushCleaning; // 기본 아이콘 (카테고리 ID가 없거나 매핑되지 않을 때)