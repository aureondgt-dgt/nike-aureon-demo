import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Heart, Minus, Plus, X } from "lucide-react";
import { formatBRL, sizes, type Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Dialog } from "./Dialog";
import { SizeGuide } from "./SizeGuide";
import { cn } from "@/utils/cn";

export function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [size, setSize] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [guide, setGuide] = useState(false);
  const [image, setImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [cep, setCep] = useState("");
  const [delivery, setDelivery] = useState(false);
  const { add, setOpen } = useCart();
  const { ids, toggle } = useWishlist();
  useEffect(() => { setSize(null); setError(false); setGuide(false); setImage(0); setZoom(false); setDelivery(false); setCep(""); }, [product?.id]);
  const addToBag = () => {
    if (!product) return;
    if (!size) { setError(true); return; }
    add({ productId: product.id, name: product.name, subtitle: product.subtitle, price: product.price, size, image: product.image });
    onClose(); setOpen(true);
  };
  return (
    <>
      <Dialog open={Boolean(product)} onClose={onClose} label={`Detalhes de ${product?.name ?? "produto"}`} className="pdp-surface">
        {product && <>
          <button type="button" className="overlay-close icon-button" onClick={onClose} aria-label="Fechar detalhes"><X size={20} /></button>
          <div className="pdp-visual">
            <button type="button" className={cn("pdp-photo", zoom && "is-zoomed")} aria-label={zoom ? "Diminuir foto" : "Ampliar foto"} onClick={() => setZoom(!zoom)}>
              <AnimatePresence mode="wait"><motion.img key={`${product.id}-${image}`} src={product.gallery[image] ?? product.image} alt={`${product.name}, ${product.subtitle}`} initial={{ opacity: 0 }} animate={{ opacity: 1, scale: zoom ? 1.65 : 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} /></AnimatePresence>
            </button>
            <span className="photo-zoom-label">{zoom ? <Minus size={13} /> : <Plus size={13} />} Toque para {zoom ? "reduzir" : "ampliar"}</span>
            <div className="pdp-thumbs">{product.gallery.map((src, index) => <button type="button" key={index} className={cn(image === index && "is-active")} onClick={() => { setImage(index); setZoom(false); }} aria-label={index === 0 ? "Ver produto" : "Ver foto original"} aria-pressed={image === index}><img src={src} alt="" /><span>{index === 0 ? "Produto" : "Original"}</span></button>)}</div>
          </div>
          <div className="pdp-info">
            <span className="eyebrow">Nike / {product.categoryLabel}</span>
            <div className="pdp-title"><h2 className="display">{product.name}</h2><button type="button" className="icon-button" aria-label={ids.includes(product.id) ? "Remover dos favoritos" : "Salvar nos favoritos"} aria-pressed={ids.includes(product.id)} onClick={() => toggle(product.id)}><Heart size={20} fill={ids.includes(product.id) ? "currentColor" : "none"} /></button></div>
            <p className="pdp-color">{product.subtitle}</p>
            <div className="pdp-price"><strong>{formatBRL(product.price)}</strong>{product.oldPrice && <del>{formatBRL(product.oldPrice)}</del>}</div>
            <p className="installments">Até 12x de {formatBRL(product.price / 12)} sem juros</p>
            <div className="pdp-size-label"><span>Selecione seu tamanho (BR)</span><button type="button" className="text-link" onClick={() => setGuide(true)}>Guia de tamanhos</button></div>
            <div className="size-grid">{sizes.map((value) => <button type="button" key={value} onClick={() => { setSize(value); setError(false); }} className={cn(size === value && "is-active")} aria-pressed={size === value}>{value}</button>)}</div>
            {error && <p className="form-error" role="alert">Escolha o tamanho do seu próximo par.</p>}
            <button type="button" className="action action--dark pdp-add" onClick={addToBag}>Adicionar à sacola <ArrowRight size={18} /></button>
            <p className="pdp-reassurance"><Check size={14} /> Preços ilustrativos. Sem cobrança nesta demonstração.</p>
            <div className="pdp-accordions">
              <details open><summary>Um clássico por um motivo <ChevronDown size={16} /></summary><p>{product.description}</p></details>
              <details><summary>Simular entrega <ChevronDown size={16} /></summary><form className="cep-form" onSubmit={(event) => { event.preventDefault(); if (cep.replace(/\D/g, "").length === 8) setDelivery(true); }}><label className="sr-only" htmlFor="product-cep">Seu CEP</label><input id="product-cep" value={cep} onChange={(event) => { setCep(event.target.value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2")); setDelivery(false); }} placeholder="Seu CEP" inputMode="numeric" pattern="[0-9]{5}-[0-9]{3}" required /><button type="submit" aria-label="Calcular entrega"><ArrowRight size={17} /></button></form>{delivery && <p>Simulação: 5 a 8 dias úteis. {product.price >= 999 ? "Frete grátis." : "Frete de R$ 39,00."}</p>}</details>
              <details><summary>Sobre esta experiência <ChevronDown size={16} /></summary><p>Projeto independente e não oficial. Fotografias de produtos Nike originais. Estoque, preços e pedidos são demonstrativos.</p></details>
            </div>
          </div>
        </>}
      </Dialog>
      <SizeGuide open={guide && Boolean(product)} onClose={() => setGuide(false)} onSelect={(value) => { setSize(value); setError(false); setGuide(false); }} />
    </>
  );
}