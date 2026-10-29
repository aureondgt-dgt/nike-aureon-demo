import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import images from "@/assets/nike-images.json";
import { Reveal } from "./Reveal";

export function Campaign({ onExplore }: { onExplore: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -45, reduced ? 0 : 45]);
  return (
    <section id="cultura" ref={ref} className="campaign">
      <motion.img src={images.campaign} alt="Tenis Nike em movimento nas ruas da cidade" loading="lazy" className="campaign-photo" style={{ y }} />
      <div className="campaign-shade" />
      <span className="campaign-eyebrow eyebrow">Nike / O movimento é de todos</span>
      <Reveal className="campaign-copy"><h2 className="display">Não espere<br />o momento.<br /><span>Faça o seu.</span></h2><p>Da sua rua para onde você quiser.</p><button type="button" className="action action--volt" onClick={onExplore}>Encontre seu movimento <ArrowUpRight size={18} /></button></Reveal>
    </section>
  );
}