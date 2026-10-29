import { useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, MoveHorizontal } from "lucide-react";
import { featured, products, type Product } from "@/lib/data";

export function Hero({ onBuy }: { onBuy: (product: Product) => void }) {
  const [active, setActive] = useState(0);
  const section = useRef<HTMLElement>(null);
  const start = useRef<number | null>(null);
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 90, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 90, damping: 20 });
  const x = useSpring(0, { stiffness: 75, damping: 22 });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 150]);
  const model = featured[active];
  const product = products.find((item) => item.id === model.productId)!;
  const change = (direction: number) => setActive((current) => (current + direction + featured.length) % featured.length);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || (event.pointerType === "touch" && start.current === null)) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateX.set(-py * 12); rotateY.set(px * 24); x.set(px * 35);
  };
  const reset = () => { rotateX.set(0); rotateY.set(0); x.set(0); };

  return (
    <section id="lancamentos" ref={section} className="hero">
      <motion.h1 className="hero-wordmark" initial={reduced ? false : { opacity: 0, y: 65 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}>NIKE</motion.h1>
      <div className="hero-ground" aria-hidden="true" />
      <div className="hero-media" onPointerMove={move} onPointerLeave={reset}
        onPointerDown={(event) => { start.current = event.clientX; if (event.pointerType === "touch") event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerUp={(event) => { if (start.current !== null && Math.abs(event.clientX - start.current) > 100) change(event.clientX > start.current ? -1 : 1); start.current = null; reset(); }}
        onPointerCancel={() => { start.current = null; reset(); }}
        onKeyDown={(event) => { if (event.key === "ArrowRight") change(1); if (event.key === "ArrowLeft") change(-1); }}
        tabIndex={0} role="group" aria-label="Perspectiva interativa do tenis. Mova o cursor ou use as setas para trocar o modelo.">
        <motion.div className="hero-parallax" style={{ y }}>
          <motion.div className="hero-perspective" style={{ rotateX, rotateY, x }}>
            <AnimatePresence mode="wait">
              <motion.img key={model.id} src={product.image} alt={`${product.name}, ${product.subtitle}`} draggable={false} fetchPriority="high" className="hero-shoe"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 35, rotate: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, rotate: -17, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -20, rotate: -22, scale: 1.03 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} />
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
      <motion.div className="hero-copy" initial={reduced ? false : { opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }}>
        <h2 className="display">O seu próximo<br />movimento.</h2>
        <p>Clássicos de sempre. Energia de agora.</p>
        <div className="hero-actions">
          <a href="#colecao" className="action action--dark">Explorar coleção <ArrowRight size={17} /></a>
          <button type="button" className="text-link" onClick={() => onBuy(product)}>Ver este tênis</button>
        </div>
      </motion.div>
      <div className="hero-controls">
        <div className="hero-current" aria-live="polite"><span className="eyebrow">O ícone da vez</span><span>{model.name}</span></div>
        <span className="hero-counter">0{active + 1}<span> / 0{featured.length}</span></span>
        <button type="button" onClick={() => change(-1)} aria-label="Modelo anterior" className="icon-button"><ArrowLeft size={18} /></button>
        <button type="button" onClick={() => change(1)} aria-label="Proximo modelo" className="icon-button"><ArrowRight size={18} /></button>
      </div>
      <div className="hero-explore" aria-hidden="true"><MoveHorizontal size={13} /><span>Explore a perspectiva</span></div>
      <a href="#colecao" className="hero-scroll" aria-label="Rolar para a colecao"><ArrowDown size={17} /></a>
    </section>
  );
}