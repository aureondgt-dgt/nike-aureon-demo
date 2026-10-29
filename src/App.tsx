import { useState } from "react";
import { MotionConfig } from "framer-motion";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Collection, type CollectionFilter } from "@/components/Collection";
import { AirLab } from "@/components/AirLab";
import { Campaign } from "@/components/Campaign";
import { Customizer } from "@/components/Customizer";
import { Faq } from "@/components/Faq";
import { Membership } from "@/components/Membership";
import { Footer } from "@/components/Footer";
import { QuickView } from "@/components/QuickView";
import { CartDrawer } from "@/components/CartDrawer";
import { Toast } from "@/components/Toast";
import { Consent } from "@/components/Consent";
import { ScrollProgress } from "@/components/Chrome";
import type { Product } from "@/lib/data";

function Site() {
  const [product, setProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<CollectionFilter>("todos");
  const explore = (next: CollectionFilter) => {
    setFilter(next);
    document.getElementById("colecao")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div id="topo" className="site-shell">
      <a className="skip-link" href="#colecao">Pular para a coleção</a>
      <ScrollProgress />
      <Header onSelectProduct={setProduct} onFavorites={() => explore("favoritos")} />
      <main>
        <Hero onBuy={setProduct} />
        <Collection onSelectProduct={setProduct} filter={filter} setFilter={setFilter} />
        <AirLab onBuy={setProduct} />
        <Campaign onExplore={() => explore("corrida")} />
        <Customizer />
        <Faq />
        <Membership />
      </main>
      <Footer />
      <QuickView product={product} onClose={() => setProduct(null)} />
      <CartDrawer />
      <Toast />
      <Consent />
    </div>
  );
}

export default function App() {
  return <MotionConfig reducedMotion="user"><CartProvider><WishlistProvider><Site /></WishlistProvider></CartProvider></MotionConfig>;
}