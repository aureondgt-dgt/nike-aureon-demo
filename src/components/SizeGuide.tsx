import { useMemo, useState } from "react";
import { ArrowRight, Ruler, X } from "lucide-react";
import { sizeChart } from "@/lib/data";
import { Dialog } from "./Dialog";
import { cn } from "@/utils/cn";

export function SizeGuide({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect?: (size: number) => void }) {
  const [length, setLength] = useState("");
  const result = useMemo(() => {
    const value = Number(length.replace(",", "."));
    return value >= 23 && value <= 30 ? sizeChart.find((row) => row.cm >= value) : undefined;
  }, [length]);
  return <Dialog open={open} onClose={onClose} label="Guia de tamanhos" className="size-guide-surface">
    <button type="button" onClick={onClose} className="overlay-close icon-button" aria-label="Fechar guia"><X size={19} /></button>
    <span className="eyebrow guide-eyebrow"><Ruler size={16} /> O ajuste faz a diferença</span>
    <h2 className="display">Encontre seu número.</h2>
    <p className="guide-intro">Meça do calcanhar ao dedo mais longo. Informe o comprimento do pé em centímetros.</p>
    <label htmlFor="foot-length" className="field-label">Comprimento do pé (cm)</label>
    <div className="guide-calculator"><input id="foot-length" value={length} onChange={(event) => setLength(event.target.value)} inputMode="decimal" placeholder="Ex.: 26,5" /><span aria-live="polite">{result ? `BR ${result.br}` : "--"}</span></div>
    <div className="size-table"><div className="size-table-head"><span>Brasil</span><span>Comprimento</span></div>{sizeChart.map((row) => <button type="button" key={row.br} onClick={() => { setLength(String(row.cm)); onSelect?.(row.br); }} className={cn(result?.br === row.br && "is-active")}><span>BR {row.br}</span><span>{row.cm.toFixed(1).replace(".", ",")} cm</span>{result?.br === row.br && <ArrowRight size={14} />}</button>)}</div>
    <p className="demo-note">Referência aproximada desta demonstração. Para comprar, confira a tabela do modelo na loja oficial Nike.</p>
  </Dialog>;
}