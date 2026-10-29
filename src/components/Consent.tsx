import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function Consent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem("nike-consent-v1")) return;
      const timer = window.setTimeout(() => setVisible(true), 10000);
      return () => window.clearTimeout(timer);
    } catch { /* storage unavailable */ }
  }, []);
  const dismiss = () => { try { localStorage.setItem("nike-consent-v1", "essential"); } catch { /* private browsing */ } setVisible(false); };
  return <AnimatePresence>{visible && <motion.div className="consent" role="region" aria-label="Sobre seus dados" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><div><strong>Seu movimento fica com você.</strong><p>Salvamos sacola e favoritos só neste navegador. Sem rastreamento.</p><button type="button" className="text-link" onClick={dismiss}>Entendi</button></div><button type="button" onClick={dismiss} aria-label="Fechar aviso de privacidade"><X size={16} /></button></motion.div>}</AnimatePresence>;
}