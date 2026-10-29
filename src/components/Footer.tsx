import { useState } from "react";
import { ArrowUpRight, Globe, X } from "lucide-react";
import { Swoosh } from "./Logo";
import { Dialog } from "./Dialog";

export function Footer() {
  const [info, setInfo] = useState<"privacy" | "project" | null>(null);
  return (
    <footer className="footer page-gutter">
      <div className="wrap">
        <div className="footer-top"><div className="footer-brand"><a href="#topo" aria-label="Nike, voltar ao inicio"><Swoosh /></a><p>Se você tem um corpo,<br />você é um atleta.</p></div><div><span className="eyebrow">Encontre seu movimento</span><a href="#colecao">A coleção</a><a href="#tecnologia">Nike Air</a><a href="#by-you">Nike By You</a></div><div><span className="eyebrow">Continue explorando</span><a href="#cultura">Nosso movimento</a><a href="#faq">Perguntas frequentes</a><a href="https://www.nike.com.br" target="_blank" rel="noopener noreferrer">Nike oficial <ArrowUpRight size={12} /></a></div><div><span className="eyebrow">Acompanhe a Nike</span><a href="https://www.instagram.com/nike" target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={12} /></a><a href="https://www.youtube.com/nike" target="_blank" rel="noopener noreferrer">YouTube <ArrowUpRight size={12} /></a><span className="footer-location"><Globe size={13} /> Brasil / Português</span></div></div>
        <p className="footer-statement display" aria-hidden="true">JUST DO IT.</p>
        <div className="footer-bottom"><span>2026 / Projeto conceito independente. Não oficial.</span><div><button type="button" onClick={() => setInfo("privacy")}>Privacidade</button><button type="button" onClick={() => setInfo("project")}>Sobre o projeto</button><a href="#topo">Voltar ao topo <ArrowUpRight size={12} /></a></div></div>
      </div>
      <Dialog open={Boolean(info)} onClose={() => setInfo(null)} label={info === "privacy" ? "Privacidade" : "Sobre o projeto"} className="info-surface"><button type="button" className="icon-button overlay-close" onClick={() => setInfo(null)} aria-label="Fechar informacoes"><X size={19} /></button><span className="eyebrow">Transparência em primeiro lugar</span><h2 className="display">{info === "privacy" ? "Seus dados.\nSuas regras." : "Feito para\ninspirar."}</h2>{info === "privacy" ? <><p>Este site salva apenas a sacola, os favoritos, o aceite deste aviso e o e-mail informado no armazenamento local do seu navegador.</p><p>Não utilizamos rastreadores nem enviamos seus dados a um servidor. Os campos do checkout são apenas demonstrativos e não são armazenados.</p><p>Você pode apagar essas informações nas configurações de dados do seu navegador.</p></> : <><p>Esta é uma experiência de design independente, sem vínculo com a Nike. Marcas, nomes e fotografias de produto pertencem aos respectivos titulares.</p><p>Os preços, a disponibilidade, o estúdio de personalização e o checkout são demonstrações. Nenhum pagamento ou pedido real é processado.</p><a className="text-link" href="https://www.nike.com.br" target="_blank" rel="noopener noreferrer">Visitar a Nike oficial <ArrowUpRight size={15} /></a></>}</Dialog>
    </footer>
  );
}