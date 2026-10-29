import { useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { featured, formatBRL, products, sizes } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { Reveal } from "./Reveal";
import { cn } from "@/utils/cn";

export function Customizer() {
  const [model, setModel] = useState(0);
  const [name, setName] = useState("");
  const [size, setSize] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const { add, setOpen } = useCart();
  const reduced = useReducedMotion();
  const selected = featured[model];
  const product = products.find((item) => item.id === selected.productId)!;
  const total = product.price + (name.trim() ? 80 : 0);
  const addCustom = () => {
    if (!size) { setError(true); return; }
    add({ productId: `${product.id}-byyou`, name: `${product.name} By You`, subtitle: `${product.subtitle}${name.trim() ? ` / ${name.trim()}` : ""}`, price: total, size, image: product.image });
    setOpen(true);
  };
  return (
    <section id="by-you" className="customizer section-space page-gutter">
      <div className="wrap">
        <Reveal><span className="eyebrow">Nike By You / Estúdio conceitual</span><h2 className="display custom-heading">Não é só um tênis.<br /><span>É a sua assinatura.</span></h2></Reveal>
        <div className="custom-layout">
          <div className="custom-preview">
            <div className="custom-backdrop-word" aria-hidden="true">YOU.</div>
            <AnimatePresence mode="wait"><motion.img key={product.id} src={product.image} alt={`${product.name}, modelo para personalizacao`} initial={reduced ? false : { opacity: 0, y: 20, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: -9 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.45 }} /></AnimatePresence>
            <div className="custom-signature"><span className="eyebrow">Sua assinatura</span><p className="display">{name.trim() || "SEU NOME"}<span>®</span></p></div>
          </div>
          <Reveal className="custom-controls" delay={100}>
            <div className="custom-control-heading"><span className="eyebrow">Do seu jeito. Do começo ao fim.</span><button type="button" className="reset-button" onClick={() => { setModel(0); setName(""); setSize(null); setError(false); }} aria-label="Reiniciar personalizacao"><RotateCcw size={14} /> Reiniciar</button></div>
            <div className="custom-step"><p className="step-title"><span>01</span> Escolha seu ícone</p><div className="model-options">{featured.map((item, index) => <button type="button" key={item.id} onClick={() => setModel(index)} aria-pressed={model === index} className={cn(model === index && "is-active")} aria-label={`Personalizar ${item.name}`}><img src={item.image} alt="" /><span>{item.name}</span></button>)}</div></div>
            <div className="custom-step"><label className="step-title" htmlFor="engraving"><span>02</span> Deixe sua marca</label><div className="engraving-input"><input id="engraving" value={name} onChange={(event) => setName(event.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, 8))} maxLength={8} placeholder="Seu nome ou sua palavra" autoComplete="off" /><span>{name.length}/8</span></div><p className="control-hint">Até 8 letras ou números. Gravação simulada: + R$ 80,00.</p></div>
            <div className="custom-step"><p className="step-title"><span>03</span> Encontre seu tamanho</p><div className="size-grid">{sizes.map((value) => <button type="button" key={value} onClick={() => { setSize(value); setError(false); }} aria-pressed={size === value} className={cn(size === value && "is-active")}>{value}</button>)}</div>{error && <p className="form-error" role="alert">Selecione um tamanho para continuar.</p>}</div>
            <div className="custom-total"><div><span className="eyebrow">Feito para você</span><strong>{formatBRL(total)}</strong></div><Check size={18} /></div>
            <button type="button" className="action action--dark w-full" onClick={addCustom}>Adicionar minha criação <ArrowRight size={18} /></button>
            <p className="demo-note">Personalização demonstrativa. A prévia preserva a foto original; nenhuma encomenda é enviada à Nike.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}