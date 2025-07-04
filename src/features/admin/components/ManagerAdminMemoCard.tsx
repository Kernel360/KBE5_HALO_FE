import Card from "@/shared/components/ui/Card";
import React, { type RefObject } from "react";

interface ManagerAdminMemoCardProps {
  adminMemo: string;
  setAdminMemo: (v: string) => void;
  memoRef: RefObject<HTMLTextAreaElement | null>;
}

const ManagerAdminMemoCard: React.FC<ManagerAdminMemoCardProps> = ({
  adminMemo,
  setAdminMemo,
  memoRef,
}) => (
  <Card className="w-full p-6">
    <div className="text-lg font-semibold text-slate-800 mb-2">관리자 메모</div>
    <textarea
      ref={memoRef}
      className="w-full min-h-[60px] border border-slate-200 rounded p-2 text-sm"
      placeholder="관리자만 볼 수 있는 메모를 입력하세요."
      value={adminMemo}
      onChange={(e) => setAdminMemo(e.target.value)}
    />
  </Card>
);

export default ManagerAdminMemoCard;
