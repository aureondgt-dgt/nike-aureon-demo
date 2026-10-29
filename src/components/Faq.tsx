import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "./Reveal";
import { cn } from "@/utils/cn";

const questions = [
  { q: "Estas são fotos de tênis Nike originais?", a: "Sim. A coleção utiliza fotografias oficiais de produtos Nike. Para a direção de arte, apenas o fundo de estúdio foi removido, preservando o tênis fotografado. As imagens ficam incorporadas ao site e não dependem de links externos." },
  { q: "Como descubro o meu tamanho?", a: "Abra qualquer produto e escolha Guia de tamanhos. Informe o comprimento do pé em centímetros para receber uma sugestão. É uma referência aproximada; consulte a tabela oficial do modelo antes de uma compra real." },
  { q: "Posso comprar de verdade neste site?", a: "Este é um projeto conceito independente. Você pode escolher tamanho, salvar favoritos, montar a sacola e experimentar o checkout, mas nenhum pagamento ou pedido é realizado. Para comprar, acesse nike.com.br." },
  { q: "Como funciona a personalização By You?", a: "No estúdio demonstrativo, escolha um modelo, uma assinatura de até oito caracteres e o tamanho. A criação pode ser adicionada à sacola. A foto original é preservada e nenhuma personalização é enviada à Nike." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return <section id="faq" className="faq section-space page-gutter"><div className="wrap faq-layout"><Reveal><span className="eyebrow">Antes do próximo passo</span><h2 className="display">Tudo certo.<br />Pode ir.</h2></Reveal><Reveal delay={100}><div className="faq-list">{questions.map((item, index) => <div className={cn("faq-item", open === index && "is-active")} key={item.q}><button type="button" onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}><span>{item.q}</span><Plus size={19} /></button><div className="accordion-body"><p>{item.a}</p></div></div>)}</div></Reveal></div></section>;
}