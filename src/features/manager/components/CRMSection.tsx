import { CustomerProfileCard, CustomerNotesSection, CustomerQuickActions } from "@/shared/components";

export function CRMSection({
  customerProfile,
  customerNotes,
  handleAddCustomerNote,
  handleDeleteCustomerNote,
  handleSendMessage,
  handleProposeBooking,
  handleUpdateGrade,
}: any) {
  if (!customerProfile) return null;
  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">고객 프로필</h3>
        <CustomerProfileCard
          profile={customerProfile}
          onViewHistory={() => {
            alert("고객 히스토리 기능은 추후 구현 예정입니다.");
          }}
          onAddNote={() => {
            alert("고객 메모 추가 기능은 추후 구현 예정입니다.");
          }}
        />
      </div>
      <div className="mb-6">
        <CustomerNotesSection
          notes={customerNotes}
          onAddNote={handleAddCustomerNote}
          onDeleteNote={handleDeleteCustomerNote}
        />
      </div>
      <div className="mb-6">
        <CustomerQuickActions
          customerName={customerProfile.customerName}
          customerPhone={customerProfile.customerPhone}
          onSendMessage={handleSendMessage}
          onProposeBooking={handleProposeBooking}
          onUpdateGrade={handleUpdateGrade}
          onCallCustomer={() => {
            alert(`${customerProfile.customerPhone}로 전화를 겁니다.`);
          }}
        />
      </div>
    </>
  );
} 