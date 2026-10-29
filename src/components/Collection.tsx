import { forwardRef, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, SlidersHorizontal } from "lucide-react";
import { Reveal } from "./Reveal";
import { categories, formatBRL, products, type CategoryId, type Product } from "@/lib/data";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/utils/cn";

export type CollectionFilter = CategoryId | "todos" | "favoritos";

export function Collection({ onSelectProduct, filter, setFilter }: {
  onSelectProduct: (product: Product) => void; filter: CollectionFilter; setFilter: (filter: CollectionFilter) => void;
}) {
  const [sort, setSort] = useState("destaques");
  const { ids } = useWishlist();
  const filtered = useMemo(() => {
    const list = products.filter((product) => filter === "todos" || (filter === "favoritos" ? ids.includes(product.id) : product.category === filter));
    return sort === "menor" ? [...list].sort((a, b) => a.price - b.price) : sort === "maior" ? [...list].sort((a, b) => b.price - a.price) : list;
  }, [filter, sort, ids]);

  return (
    <section id="colecao" className="collection section-space page-gutter">
      <div className="wrap">
        <div className="section-heading">
          <Reveal><span className="eyebrow">A seleção Nike</span><h2 className="display">Seu estilo.<br />Sem limites.</h2></Reveal>
          <Reveal delay={100}><p>Ícones que atravessam gerações.<br />Encontre o par que conta a sua história.</p></Reveal>
        </div>
        <div className="collection-toolbar">
          <div className="filter-tabs" role="group" aria-label="Filtrar colecao">
            {[...categories, { id: "favoritos" as const, label: "Favoritos", count: ids.length }].map((item) => <button key={item.id} type="button" className={cn("filter-tab", filter === item.id && "is-active")} onClick={() => setFilter(item.id)} aria-pressed={filter === item.id}>{item.label}<sup>{String(item.count).padStart(2, "0")}</sup></button>)}
          </div>
          <label className="sort-control"><SlidersHorizontal size={15} /><span className="sr-only">Ordenar produtos</span><select id="sort" value={sort} onChange={(event) => setSort(event.target.value)}><option value="destaques">Em destaque</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option></select></label>
        </div>
        <div className="product-grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((product, index) => <ProductCard key={product.id} product={product} index={index} onOpen={() => onSelectProduct(product)} />)}
          </AnimatePresence>
        </div>
        {!filtered.length && <div className="empty-state"><Heart size={30} strokeWidth={1} /><h3>Seus próximos favoritos moram aqui.</h3><p>Toque no coração de um produto para guardá-lo para depois.</p><button type="button" className="text-link" onClick={() => setFilter("todos")}>Explorar todos os modelos <ArrowRight size={16} /></button></div>}
        <div className="collection-foot"><span>{String(filtered.length).padStart(2, "0")} modelos selecionados</span><a href="#by-you" className="text-link">Ou faça do seu jeito <ArrowRight size={15} /></a></div>
      </div>
    </section>
  );
}

const ProductCard = forwardRef<HTMLElement, { product: Product; index: number; onOpen: () => void }>(function ProductCard({ product, index, onOpen }, ref) {
  const { ids, toggle } = useWishlist();
  const favorite = ids.includes(product.id);
  const reduced = useReducedMotion();
  return (
    <motion.article ref={ref} layout className="product-item" initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18, delay: 0 } }} transition={{ duration: 0.4, delay: Math.min(index, 5) * 0.045 }}>
      <div className="product-media">
        <button type="button" className="product-photo-button" onClick={onOpen} aria-label={`Ver ${product.name} ${product.subtitle} em detalhes`}><img src={product.image} alt={`${product.name}, ${product.subtitle}`} loading="lazy" draggable={false} /></button>
        {product.badge && <span className="product-note">{product.badge}</span>}
        <button type="button" className={cn("product-heart", favorite && "is-saved")} onClick={() => toggle(product.id)} aria-pressed={favorite} aria-label={`${favorite ? "Remover" : "Salvar"} ${product.name} ${favorite ? "dos" : "nos"} favoritos`}><Heart size={19} strokeWidth={1.5} fill={favorite ? "currentColor" : "none"} /></button>
        <button type="button" onClick={onOpen} className="product-quick">Escolher tamanho <ArrowRight size={16} /></button>
      </div>
      <div className="product-info"><div><h3><button type="button" onClick={onOpen}>{product.name}</button></h3><p>{product.subtitle}</p></div><div className="product-price"><span>{formatBRL(product.price)}</span>{product.oldPrice && <del>{formatBRL(product.oldPrice)}</del>}</div></div>
    </motion.article>
  );
});