import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { products, formatBRL, type Product } from "@/lib/data";
import { Dialog } from "./Dialog";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function SearchOverlay({ open, onClose, onSelectProduct }: { open: boolean; onClose: () => void; onSelectProduct: (product: Product) => void }) {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!open) { setQuery(""); return; }
    const timer = window.setTimeout(() => ref.current?.focus(), 100);
    return () => window.clearTimeout(timer);
  }, [open]);
  const results = useMemo(() => query.trim() ? products.filter((product) => normalize(`${product.name} ${product.subtitle} ${product.categoryLabel}`).includes(normalize(query.trim()))) : products.slice(0, 4), [query]);
  return <Dialog open={open} onClose={onClose} label="Buscar produtos" className="search-surface">
    <div className="overlay-header"><span className="eyebrow">Seu próximo par está aqui</span><button type="button" className="icon-button" onClick={onClose} aria-label="Fechar busca"><X size={19} /></button></div>
    <div className="search-input"><Search size={25} strokeWidth={1.4} /><input ref={ref} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && results[0]) onSelectProduct(results[0]); }} placeholder="O que te move?" aria-label="Buscar por modelo ou categoria" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Limpar busca"><X size={18} /></button>}</div>
    <div className="search-trends"><span className="eyebrow">Em alta</span>{["Air Max", "Dunk", "Air Force", "Jordan"].map((term) => <button type="button" key={term} onClick={() => setQuery(term)}>{term}</button>)}</div>
    <p className="search-result-count eyebrow">{query ? `${results.length} resultado${results.length === 1 ? "" : "s"}` : "Uma seleção para começar"}</p>
    <div className="search-results">{results.map((product) => <button type="button" key={product.id} onClick={() => onSelectProduct(product)}><div className="search-result-photo"><img src={product.image} alt={product.name} /></div><div><h3>{product.name}</h3><p>{product.subtitle}</p><span>{formatBRL(product.price)}</span></div><ArrowUpRight size={17} /></button>)}</div>
    {!results.length && <div className="empty-state"><h3>Nenhum par por aqui. Ainda.</h3><p>Tente outro nome ou explore os clássicos.</p><button type="button" className="text-link" onClick={() => setQuery("")}>Ver a seleção</button></div>}
  </Dialog>;
}