import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "./Reveal";

export function Membership() {
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setError("Digite um e-mail válido para continuar."); return; }
    try { localStorage.setItem("nike-interest-v1", email.trim()); } catch { /* storage unavailable */ }
    setSaved(true); setError("");
  };
  return (
    <section id="membros" className="membership section-space page-gutter">
      <div className="wrap membership-layout">
        <Reveal><span className="eyebrow">O próximo capítulo tem você</span><h2 className="display">Entre no<br />movimento.</h2><p>Novas ideias. Novos ícones. A mesma vontade de ir além.</p></Reveal>
        <Reveal className="membership-form-wrap" delay={100}>
          {saved ? <div className="member-success" role="status"><Check size={29} /><h3>Você faz parte do próximo passo.</h3><p>Seu interesse foi salvo neste navegador. Este é um projeto conceito: nenhum e-mail foi enviado.</p><button type="button" className="text-link" onClick={() => { setSaved(false); setEmail(""); }}>Cadastrar outro e-mail <ArrowRight size={16} /></button></div>
          : <form onSubmit={submit} className="member-form"><label htmlFor="member-email">Qual é o seu e-mail?</label><div className="member-email"><input id="member-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} autoComplete="email" placeholder="voce@email.com" required aria-invalid={Boolean(error)} /><button type="submit" aria-label="Entrar no movimento"><ArrowRight size={24} /></button></div>{error && <p className="form-error" role="alert">{error}</p>}<label className="terms-checkbox"><input type="checkbox" required /><span>Concordo em salvar meu interesse neste navegador.</span></label><p className="demo-note">Sem spam. Sem envio de dados. Uma demonstração de experiência Nike.</p></form>}
        </Reveal>
      </div>
    </section>
  );
}