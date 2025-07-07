// CustomerProfileCard.tsx
import React from 'react';
import { useUserStore } from '@/store/useUserStore';

export const CustomerProfileCard: React.FC = () => {
  const { userName } = useUserStore();

  return (
    <div className="w-full p-6 sm:p-8 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)] outline outline-1 outline-offset-[-1px] outline-zinc-100 mb-6">
      {/* 가운데 정렬 및 상하 간격 추가 */}
      <div className="mb-4 text-center space-y-2 sm:space-y-3">
        <h3 className="text-zinc-800 text-xl sm:text-3xl font-bold">
          환영합니다, {userName}님!
        </h3>
      </div>
    </div>
  );
};