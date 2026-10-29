import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { products, specs, type Product } from "@/lib/data";
import { Reveal } from "./Reveal";
import { cn } from "@/utils/cn";

export function AirLab({ onBuy }: { onBuy: (product: Product) => void }) {
  const [active, setActive] = useState(1);
  const product = products.find((item) => item.id === "air-max-97")!;
  const reduced = useReducedMotion();
  return (
    <section id="tecnologia" className="air-section section-space page-gutter">
      <div className="air-word" aria-hidden="true">AIR</div>
      <div className="wrap air-layout">
        <Reveal className="air-visual">
          <div className="air-orbit" aria-hidden="true" />
          <motion.img src={product.image} alt="Nike Air Max 97 preto, com unidade Air de ponta a ponta" className="air-shoe" animate={reduced ? undefined : { y: [0, -12, 0], rotate: [-9, -11, -9] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
          {specs.map((spec, index) => <button key={spec.id} type="button" className={cn("air-hotspot", active === index && "is-active")} style={{ left: `${spec.position.x}%`, top: `${spec.position.y}%` }} onClick={() => setActive(index)} aria-label={`Explorar ${spec.title}`} aria-pressed={active === index}><Plus size={15} /></button>)}
          <span className="air-photo-caption eyebrow">Air Max 97 / Desde 1997</span>
        </Reveal>
        <Reveal className="air-copy" delay={120}>
          <span className="eyebrow accent">A sensação é inconfundível</span>
          <h2 className="display">Menos impacto.<br />Mais <em>Air.</em></h2>
          <p className="air-intro">Não é só o que você vê.<br />É o que você sente em cada passo.</p>
          <div className="air-details">{specs.map((spec, index) => <div key={spec.id} className={cn("air-detail", active === index && "is-active")}><button type="button" onClick={() => setActive(index)} aria-expanded={active === index}><span className="eyebrow">{spec.index}</span><span>{spec.title}</span><Plus size={17} /></button><div className="accordion-body"><p>{spec.description}</p></div></div>)}</div>
          <button type="button" onClick={() => onBuy(product)} className="text-link accent">Conheça o Air Max 97 <ArrowUpRight size={18} /></button>
        </Reveal>
      </div>
    </section>
  );
}