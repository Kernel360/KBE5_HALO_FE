import React from "react";

interface SuccessToastProps {
  open: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

const SuccessToast: React.FC<SuccessToastProps> = ({
  open,
  message,
  onClose,
  duration = 2500,
}) => {
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    if (open) {
      setProgress(100);
      const start = Date.now();
      const timer = setTimeout(onClose, duration);
      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        setProgress(Math.max(0, 100 - (elapsed / duration) * 100));
      }, 30);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else {
      setProgress(100);
    }
  }, [open, duration, onClose]);

  if (!open) return null;
  return (
    <div className="fixed z-[9999] top-8 right-8 flex flex-col items-end space-y-2">
      <div className="bg-green-600 border border-green-700 text-white px-6 py-3 rounded-xl shadow-lg text-base font-semibold animate-fade-in-up min-w-[220px] text-center flex items-center gap-2 relative overflow-hidden">
        <span className="material-symbols-outlined text-green-200 text-2xl">
          check_circle
        </span>
        {message}
        <div
          className="absolute left-0 bottom-0 h-1 bg-green-300 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default SuccessToast;
