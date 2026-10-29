import { useEffect, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/utils/cn";

let locks = 0;
let previousOverflow = "";

export function Dialog({ open, onClose, label, children, className, drawer = false }: {
  open: boolean; onClose: () => void; label: string; children: ReactNode; className?: string; drawer?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!open || !element) return;
    if (locks++ === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    element.showModal();
    return () => {
      element.close();
      if (--locks === 0) document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog ref={ref} aria-label={label} className={cn("site-dialog", drawer && "site-dialog--drawer")}
      onCancel={(event) => { event.preventDefault(); close.current(); }}
      onClick={(event) => { if (event.target === event.currentTarget) close.current(); }}>
      {open && <motion.div className={cn("dialog-surface", className)}
        initial={reduced ? false : drawer ? { x: 100, opacity: 0 } : { y: 24, opacity: 0, scale: 0.985 }}
        animate={{ x: 0, y: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </motion.div>}
    </dialog>
  );
}