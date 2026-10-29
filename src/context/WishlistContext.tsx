import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products } from "@/lib/data";

const KEY = "nike-favorites-v1";
const WishlistContext = createContext<{ ids: string[]; toggle: (id: string) => void } | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      return Array.isArray(saved) ? saved.filter((id) => products.some((product) => product.id === id)) : [];
    } catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* private browsing */ }
  }, [ids]);
  const value = useMemo(() => ({ ids, toggle: (id: string) => setIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]) }), [ids]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error("WishlistProvider is required");
  return value;
}