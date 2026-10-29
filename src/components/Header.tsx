import { useEffect, useState } from "react";
import { ArrowUpRight, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { motion } from "framer-motion";
import { Swoosh } from "./Logo";
import { SearchOverlay } from "./SearchOverlay";
import { Dialog } from "./Dialog";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/lib/data";
import { cn } from "@/utils/cn";

const links = [{ href: "#colecao", label: "A coleção" }, { href: "#tecnologia", label: "Nike Air" }, { href: "#by-you", label: "Nike By You" }, { href: "#cultura", label: "Nosso movimento" }];

export function Header({ onSelectProduct, onFavorites }: { onSelectProduct: (product: Product) => void; onFavorites: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, setOpen } = useCart();
  const { ids } = useWishlist();
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 35);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <>
      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className={cn("site-header", scrolled && "is-scrolled")}>
        <a className="header-brand" href="#topo" aria-label="Nike, inicio"><Swoosh /></a>
        <nav aria-label="Navegacao principal" className="desktop-nav">{links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}</nav>
        <div className="header-actions">
          <button type="button" className="header-icon" onClick={() => setSearchOpen(true)} aria-label="Buscar produtos"><Search size={20} strokeWidth={1.6} /></button>
          <button type="button" className="header-icon header-favorites" onClick={onFavorites} aria-label={`Ver ${ids.length} favoritos`}><Heart size={20} strokeWidth={1.6} />{ids.length > 0 && <span className="tiny-count">{ids.length}</span>}</button>
          <button type="button" className="header-bag" onClick={() => setOpen(true)} aria-label={`Abrir sacola com ${count} itens`}><ShoppingBag size={19} strokeWidth={1.6} /><span className="bag-label">Sacola</span><span className="bag-count">{count}</span></button>
          <button type="button" className="header-icon mobile-menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu size={22} strokeWidth={1.6} /></button>
        </div>
      </motion.header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onSelectProduct={(product) => { setSearchOpen(false); onSelectProduct(product); }} />
      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} label="Menu principal" drawer className="menu-surface">
        <div className="overlay-header"><Swoosh className="w-16" /><button type="button" className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X size={20} /></button></div>
        <nav className="mobile-nav" aria-label="Menu mobile">
          {links.map((link, index) => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}><span className="eyebrow">0{index + 1}</span><span className="display">{link.label}</span><ArrowUpRight size={22} /></a>)}
          <button type="button" onClick={() => { setMenuOpen(false); onFavorites(); }}><Heart size={20} /><span>Meus favoritos ({ids.length})</span></button>
        </nav>
        <div className="menu-bottom"><p>O próximo passo é seu.</p><a href="#membros" className="action action--dark" onClick={() => setMenuOpen(false)}>Entre no movimento <ArrowUpRight size={17} /></a><span className="eyebrow">Brasil / Português</span></div>
      </Dialog>
    </>
  );
}