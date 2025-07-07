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
  uploadedFiles: { name: string; url: string; size?: number }[];
  onRemoveUploadedFile?: (idx: number) => void;
}

// export const CleanignLogModal = ({ open, checkType, checkId, fileId, files, setFiles, onCheck, onClose }: CleanignLogModalProps) => {
export const CleanignLogModal = ({
  open,
  checkType,
  files,
  setFiles,
  onCheck,
  onClose,
  uploadedFiles,
  onRemoveUploadedFile,
}: CleanignLogModalProps) => {
  if (!open) return null;
  return (
    <Fragment>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50">
        <div className="flex max-h-[90vh] w-[30rem] flex-col gap-6 overflow-y-auto rounded-2xl bg-white p-[2rem] shadow-xl">
          <div className="inline-flex items-center justify-between self-stretch">
            <div className="justify-start font-['Inter'] text-xl leading-normal font-bold text-slate-800">
              {checkType === "IN"
                ? "체크인을 진행하시겠습니까?"
                : "체크아웃을 진행하시겠습니까?"}
            </div>
            <div className="relative h-6 w-6 overflow-hidden">
              <button
                onClick={onClose}
                className="cursor-pointer text-slate-500 hover:text-slate-700">
                ✕
              </button>
            </div>
          </div>
          <div className="h-px self-stretch bg-slate-200" />
          {/* 첨부파일 */}
          <FileUploadSection
            files={files}
            setFiles={setFiles}
            multiple={checkType === "IN" ? false : true}
            isRequired={false}
            uploadedFiles={uploadedFiles}
            onRemoveUploadedFile={onRemoveUploadedFile}
          />
          <div className="inline-flex items-center justify-end gap-3 self-stretch">
            <button
              type="submit"
              onClick={() => onCheck(checkType)}
              className="flex h-11 w-24 cursor-pointer items-center justify-center rounded-lg bg-indigo-600"
            >
              <div className="justify-start font-['Inter'] text-sm leading-none font-medium text-white">
                {checkType === "IN" ? "체크인" : "체크아웃"}
              </div>
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
