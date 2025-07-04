import { useRef } from "react";

interface FileUploadSectionProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  title?: string;
  errors?: string;
  multiple?: boolean;
  isRequired?: boolean;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_FILE_COUNT = 5;

export const FileUploadSection = ({
  files,
  setFiles,
  title,
  errors,
  multiple = true,
  isRequired = true,
}: FileUploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(`'${file.name}' 파일은 ${MAX_FILE_SIZE_MB}MB를 초과합니다.`);
        return false;
      }
      return true;
    });

    const totalFiles = multiple
      ? files.length + validFiles.length
      : validFiles.length;
    if (totalFiles > MAX_FILE_COUNT) {
      alert(`파일은 최대 ${MAX_FILE_COUNT}개까지 첨부할 수 있습니다.`);
      e.target.value = "";
      return;
    }

    setFiles((prev) => (multiple ? [...prev, ...validFiles] : validFiles));
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileURL = (file: File) => URL.createObjectURL(file);

  return (
    <div className="self-stretch flex flex-col gap-2 cuser-pointer">
      <label className="text-slate-700 text-sm font-medium font-['Inter'] leading-none">
        {title ? title : "첨부파일"}
        {isRequired && <span> *</span>}
      </label>
      <div className="self-stretch p-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col gap-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <ul className="flex flex-col gap-2 w-full">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <div className="flex items-center gap-2 truncate grow">
                <span className="material-symbols-outlined text-slate-500 text-base">
                  description
                </span>
                <a
                  href={getFileURL(file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate max-w-[260px] text-blue-600 hover:underline"
                >
                  {file.name}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-600 transition text-sm"
                  title="삭제"
                >
                  <span className="material-symbols-outlined text-sm align-text-bottom">
                    close_small
                  </span>
                </button>
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleFileButtonClick}
          className="self-stretch h-12 px-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-indigo-600 inline-flex justify-center items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#4f39f6]">add</span>
          <span className="text-indigo-600 text-sm font-medium font-['Inter'] leading-none">
            파일 추가하기
          </span>
        </button>

        <div className="text-slate-500 text-xs font-normal font-['Inter'] leading-none">
          JPG, PNG, PDF 파일 (각 최대 {MAX_FILE_SIZE_MB}MB
          {multiple ? `, 최대 ${MAX_FILE_COUNT}개` : ""})
        </div>
      </div>
      {errors && files.length === 0 && (
        <p className="text-red-500 text-xs">{errors}</p>
      )}
    </div>
  );
};
