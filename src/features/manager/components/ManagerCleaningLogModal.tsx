import { FileUploadSection } from "@/shared/components/FileUploadSection";
import { Fragment } from "react";

interface CleanignLogModalProps {
  open: boolean;
  checkType: "IN" | "OUT";
  // checkId?: number | undefined;
  // fileId: number | undefined;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onCheck: (checkType: "IN" | "OUT") => void;
  onClose: () => void;
}

// export const CleanignLogModal = ({ open, checkType, checkId, fileId, files, setFiles, onCheck, onClose }: CleanignLogModalProps) => {
export const CleanignLogModal = ({ open, checkType, files, setFiles, onCheck, onClose }: CleanignLogModalProps) => {
  
  if (!open) return null;
  return (
    <Fragment>
      <div className="fixed inset-0 z-50 flex justify-center items-center  bg-[#0F172A]/50">
        <div className="w-[480px] max-h-[90vh] bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6 overflow-y-auto">
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="justify-start text-slate-800 text-xl font-bold font-['Inter'] leading-normal">
              {checkType === "IN" ? "체크인을 진행하시겠습니까?" : "체크아웃을 진행하시겠습니까?"}
            </div>
            <div className="w-6 h-6 relative overflow-hidden">
              <button onClick={onClose} className="text-slate-500 hover:text-slate-700 cursor-pointer">✕</button>
            </div>
          </div>
          <div className="self-stretch h-px bg-slate-200" />
          {/* 첨부파일 */}
          <FileUploadSection files={files} setFiles={setFiles} multiple={checkType === "IN" ? false : true} isRequired={false}/>

          {/* 기존 첨부파일명 보여주기 (선택사항) */}
          {/* {isEditMode && existingData.fileName && (
            <div className="text-slate-500 text-sm">
              기존 첨부파일: <span className="text-slate-700 font-medium">{existingData.fileName}</span>
            </div>
          )} */}
          <div className="self-stretch inline-flex justify-end items-center gap-3">
            <button
              type="submit"
              onClick={() => onCheck(checkType)}
              className="w-24 h-11 bg-indigo-600 rounded-lg flex justify-center items-center cursor-pointer"
            >
              <div className="justify-start text-white text-sm font-medium font-['Inter'] leading-none">
                {checkType === "IN" ? "체크인" : "체크아웃"}
              </div>
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};