import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalDropdownProps {
  anchorRef: React.RefObject<Element>;
  open: boolean;
  children: React.ReactNode;
}

export function PortalDropdown({
  anchorRef,
  open,
  children,
}: PortalDropdownProps) {
  const [coords, setCoords] = useState({ left: 0, top: 0, width: 0 });

  useEffect(() => {
    if (open && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({
        left: rect.left + window.scrollX,
        top: rect.bottom + window.scrollY,
        width: rect.width,
      });
    }
  }, [open, anchorRef]);

  if (!open) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        left: coords.left,
        top: coords.top,
        minWidth: coords.width,
        zIndex: 9999,
      }}
    >
      {children}
    </div>,
    document.body,
  );
} 