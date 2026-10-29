import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CreditCard, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/data";
import { Dialog } from "./Dialog";
import { Swoosh } from "./Logo";
import { cn } from "@/utils/cn";

export function CartDrawer() {
  const { lines, count, subtotal, remove, setQty, clear, isOpen, setOpen } = useCart();
  const [step, setStep] = useState<"bag" | "checkout" | "done">("bag");
  const [busy, setBusy] = useState(false);
  const [payment, setPayment] = useState("pix");
  const [cep, setCep] = useState("");
  const [order, setOrder] = useState({ id: "", total: 0 });
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const close = () => { window.clearTimeout(timer.current); setBusy(false); setStep("bag"); setOpen(false); };
  const shipping = subtotal >= 999 || !subtotal ? 0 : 39;
  const total = subtotal + shipping;
  const checkout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setOrder({ id: `DEMO-${String(Date.now()).slice(-7)}`, total });
    timer.current = window.setTimeout(() => { setBusy(false); setStep("done"); clear(); }, 1100);
  };
  return <Dialog open={isOpen} onClose={close} label="Sua sacola" drawer className="cart-surface">
    <div className="overlay-header cart-header"><div><Swoosh className="cart-logo" /><span>{step === "checkout" ? "Último passo" : "Sua sacola"}<sup>{count ? ` (${count})` : ""}</sup></span></div><button type="button" className="icon-button" onClick={close} aria-label="Fechar sacola"><X size={20} /></button></div>
    {step === "done" ? <div className="cart-done"><span className="done-check"><Check size={26} /></span><span className="eyebrow">Demonstração concluída</span><h2 className="display">Bom próximo<br />movimento.</h2><p>Você percorreu toda a experiência. Nenhuma cobrança foi feita e nenhum pedido foi enviado.</p><div className="order-reference"><span>{order.id}</span><strong>{formatBRL(order.total)}</strong></div><button type="button" className="action action--dark" onClick={close}>Continuar explorando <ArrowRight size={17} /></button></div>
    : step === "checkout" ? <div className="checkout-scroll"><button type="button" className="text-link checkout-back" onClick={() => setStep("bag")}><ArrowLeft size={15} /> Voltar à sacola</button><h2 className="display">O próximo<br />passo é seu.</h2><p className="checkout-intro">Experimente o checkout. Os dados ficam apenas nesta tela e não são enviados.</p><form onSubmit={checkout} className="checkout-form"><label className="field-label">Nome<input name="name" autoComplete="name" placeholder="Como podemos te chamar?" minLength={2} required /></label><label className="field-label">E-mail<input name="email" type="email" autoComplete="email" placeholder="voce@email.com" required /></label><label className="field-label">CEP<input name="cep" inputMode="numeric" autoComplete="postal-code" value={cep} onChange={(event) => setCep(event.target.value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2"))} placeholder="00000-000" pattern="[0-9]{5}-[0-9]{3}" required /></label><fieldset className="payment-options"><legend className="field-label">Pagamento simulado</legend><button type="button" className={cn(payment === "pix" && "is-active")} onClick={() => setPayment("pix")} aria-pressed={payment === "pix"}><span className="pix-symbol" /> Pix {payment === "pix" && <Check size={14} />}</button><button type="button" className={cn(payment === "card" && "is-active")} onClick={() => setPayment("card")} aria-pressed={payment === "card"}><CreditCard size={17} /> Cartão {payment === "card" && <Check size={14} />}</button></fieldset><p className="demo-note">Não informe dados bancários. Nenhuma transação será realizada.</p><div className="checkout-total"><span>Total demonstrativo</span><strong>{formatBRL(total)}</strong></div><label className="terms-checkbox"><input type="checkbox" required /><span>Entendo que este é um pedido de demonstração.</span></label><button type="submit" disabled={busy} className="action action--dark w-full">{busy ? "Preparando seu movimento..." : "Confirmar simulação"}{!busy && <ArrowRight size={17} />}</button></form></div>
    : !lines.length ? <div className="cart-empty"><ShoppingBag size={34} strokeWidth={1} /><h2 className="display">Todo movimento<br />tem um começo.</h2><p>O seu próximo par ainda está esperando por você.</p><a href="#colecao" onClick={close} className="action action--dark">Encontre o seu <ArrowRight size={17} /></a></div>
    : <>
      <div className="cart-shipping"><p>{shipping ? <>Faltam <strong>{formatBRL(999 - subtotal)}</strong> para frete grátis.</> : <>Seu pedido ganhou <strong>frete grátis.</strong></>}</p><div><span style={{ width: `${Math.min(100, subtotal / 999 * 100)}%` }} /></div></div>
      <div className="cart-lines">{lines.map((line) => <div className="cart-line" key={line.key}><div className="cart-line-photo"><img src={line.image} alt={`${line.name}, ${line.subtitle}`} /></div><div className="cart-line-content"><div className="cart-line-heading"><h3>{line.name}</h3><button type="button" onClick={() => remove(line.key)} aria-label={`Remover ${line.name} da sacola`}><Trash2 size={14} /></button></div><p>{line.subtitle}</p><span className="cart-size">BR {line.size}</span><div className="cart-line-bottom"><div className="quantity"><button type="button" onClick={() => setQty(line.key, line.qty - 1)} aria-label="Diminuir quantidade"><Minus size={13} /></button><span>{line.qty}</span><button type="button" onClick={() => setQty(line.key, line.qty + 1)} aria-label="Aumentar quantidade" disabled={line.qty >= 9}><Plus size={13} /></button></div><strong>{formatBRL(line.price * line.qty)}</strong></div></div></div>)}</div>
      <div className="cart-summary"><div><span>Subtotal</span><span>{formatBRL(subtotal)}</span></div><div><span>Entrega simulada</span><span>{shipping ? formatBRL(shipping) : "Grátis"}</span></div><div className="cart-total"><span>Total</span><strong>{formatBRL(total)}</strong></div><button type="button" onClick={() => setStep("checkout")} className="action action--dark w-full">Finalizar compra <ArrowRight size={18} /></button><p className="demo-note">Experiência demonstrativa. Nenhum pagamento real.</p></div>
    </>}
  </Dialog>;
}