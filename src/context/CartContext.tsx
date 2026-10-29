import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/lib/data";

export type CartLine = {
  key: string;
  productId: string;
  name: string;
  subtitle: string;
  price: number;
  size: number;
  image: string;
  qty: number;
};

export type NewCartLine = Omit<CartLine, "key" | "qty"> & { qty?: number };

type Toast = { id: number; title: string; sub?: string };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: NewCartLine) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  toast: Toast | null;
  notify: (title: string, sub?: string) => void;
  dismissToast: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "nike-bag-v2";

function catalogProduct(productId: string) {
  return products.find(
    (product) => productId === product.id || productId.startsWith(`${product.id}-`)
  );
}

function readStoredLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((line) => line && typeof line.productId === "string" && Number.isFinite(line.price) && Number.isFinite(line.qty) && line.qty > 0)
      .map((line) => ({
        ...line,
        qty: Math.min(9, Math.floor(line.qty)),
        image: catalogProduct(line.productId)?.image ?? line.image,
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStoredLines);
  const [isOpen, setOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    try {
      // Restore catalog photos on load instead of duplicating large data URLs in storage.
      const stored = lines.map((line) => ({
        ...line,
        image: catalogProduct(line.productId) ? undefined : line.image,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      /* storage may be unavailable */
    }
  }, [lines]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const notify = useCallback((title: string, sub?: string) => {
    if (timer.current) window.clearTimeout(timer.current);
    setToast({ id: Date.now(), title, sub });
    timer.current = window.setTimeout(() => setToast(null), 3600);
  }, []);

  const dismissToast = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    setToast(null);
  }, []);

  const add = useCallback(
    (line: NewCartLine) => {
      const key = `${line.productId}-${line.size}-${line.subtitle}`;
      const qty = line.qty ?? 1;
      setLines((prev) => {
        const existing = prev.find((item) => item.key === key);
        if (existing) {
          return prev.map((item) =>
            item.key === key ? { ...item, qty: Math.min(9, item.qty + qty) } : item
          );
        }
        return [...prev, { ...line, key, qty }];
      });
      notify("Adicionado à sacola", `${line.name} · ${line.subtitle} · BR ${line.size}`);
    },
    [notify]
  );

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((line) => line.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((line) => (line.key === key ? { ...line, qty: Math.min(9, Math.max(0, qty)) } : line))
        .filter((line) => line.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((total, line) => total + line.qty, 0), [lines]);
  const subtotal = useMemo(
    () => lines.reduce((total, line) => total + line.price * line.qty, 0),
    [lines]
  );

  const value = useMemo(
    () => ({
      lines,
      count,
      subtotal,
      add,
      remove,
      setQty,
      clear,
      isOpen,
      setOpen,
      toast,
      notify,
      dismissToast,
    }),
    [lines, count, subtotal, add, remove, setQty, clear, isOpen, toast, notify, dismissToast]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
