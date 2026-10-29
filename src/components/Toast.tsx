import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Toast() {
  const { toast, isOpen, setOpen, dismissToast } = useCart();
  return <div className="toast-wrap" aria-live="polite" role="status"><AnimatePresence>{toast && !isOpen && <motion.div className="toast" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><span className="toast-check"><Check size={17} /></span><div><strong>{toast.title}</strong><p>{toast.sub}</p><button type="button" onClick={() => { dismissToast(); setOpen(true); }}>Ver minha sacola <ArrowRight size={13} /></button></div><button type="button" className="toast-close" onClick={dismissToast} aria-label="Fechar notificacao"><X size={15} /></button></motion.div>}</AnimatePresence></div>;
}