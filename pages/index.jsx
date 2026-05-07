import { useState, useEffect, useRef } from "react";

const PASSWORD = "MOTde0037-+";

const B = {
  navy: "#0f1e30", navyMid: "#1a2e44", navyLight: "#243d5c",
  teal: "#2a7f6f", tealBright: "#3aa08d",
  gold: "#c9a84c", offWhite: "#f7f9fb", gray: "#8899aa",
  border: "#e2e8f0", danger: "#dc4f4f", success: "#27a96c", warning: "#e09440",
  white: "#ffffff",
};

const STAGES = [
  { key: "candidature", label: "Candidature", color: "#8899aa" },
  { key: "screening", label: "Screening IA", color: B.tealBright },
  { key: "entretien", label: "Entretien", color: B.teal },
  { key: "essai", label: "Période d'Essai", color: B.gold },
  { key: "retention", label: "Rétention ✓", color: B.success },
  { key: "offre", label: "Offre 60K 💎", color: B.navy },
];

const CRITERIA = [
  { key: "diplome", label: "Diplômé(e)", w: 10, req: true },
  { key: "motorise", label: "Motorisé(e)", w: 9, req: true },
  { key: "capacite", label: "5 patients/jour", w: 9 },
  { key: "ponctualite", label: "Ponctualité", w: 9 },
  { key: "vigilance", label: "Réactivité WhatsApp", w: 8 },
  { key: "connaissances", label: "Connaissances kiné", w: 8 },
  { key: "coachabilite", label: "Coachabilité", w: 9 },
  { key: "volonte", label: "Volonté de réussir", w: 9 },
  { key: "humilite", label: "Humilité", w: 8 },
  { key: "serieux", label: "Sérieux", w: 8 },
  { key: "soft_skills", label: "Soft & Social Skills", w: 8 },
  { key: "expert_look", label: "Expert Look", w: 7 },
  { key: "physique", label: "Capacité physique", w: 7 },
  { key: "non_fumeur", label: "Non Fumeur", w: 6 },
  { key: "marie", label: "Marié(e) ★", w: 4, bonus: true },
  { key: "sportif", label: "Sportif(ve) ★", w: 4, bonus: true },
  { key: "enfants", label: "Avec enfants ★", w: 4, bonus: true },
];

const TRAINING = [
  { phase: 1, icon: "👔", title: "Image & Présentation", dur: "1 sem.", color: B.tealBright,
    modules: ["Code vestimentaire du kiné expert", "Langage corporel & posture professionnelle", "Première impression en 30 secondes", "Soins personnels & hygiène"] },
  { phase: 2, icon: "⏰", title: "Gestion du Temps", dur: "1 sem.", color: B.teal,
    modules: ["Règle des -5 minutes (arriver avant le patient)", "Planification optimale des tournées", "Gestion urgences & annulations", "Communication proactive des changements"] },
  { phase: 3, icon: "❤️", title: "Relation Patient", dur: "2 sem.", color: "#c76b6b",
    modules: ["Lien humain avant la relation professionnelle", "Energy matching & tone matching", "Écoute active & empathie clinique", "Déclencheurs psychologiques de confiance"] },
  { phase: 4, icon: "🎯", title: "Fidélisation", dur: "2 sem.", color: B.gold,
    modules: ["Technique du cadeau utile (renforcement du lien)", "Suivi WhatsApp inter-séances", "Rapport mensuel pour la famille", "Signaux d'alerte d'abandon patient"] },
  { phase: 5, icon: "🏥", title: "Excellence Clinique", dur: "3 sem.", color: "#5b8fe8",
    modules: ["Protocoles neurologie, rhumatologie, gériatrie", "Bilan initial complet à domicile", "Adaptation du protocole en temps réel", "Reporting structuré au superviseur"] },
  { phase: 6, icon: "💎", title: "L'Offre Annuelle", dur: "Validation", color: B.navy,
    modules: ["Seuil de validation: 90%+ rétention patients", "Offre annuelle: 60 000 DH/an", "Allocation: 5 séances × 6 jours/semaine", "Objectif revenu: 20 000 DH/mois garanti"] },
];

const DEMO = [
  { id: 1, name: "Mehdi Ezzahraoui", age: 34, city: "Mohammedia", stage: "offre", score: 95, diplome: "État", motorise: true, exp: 8, patients: 5, retention: 97, av: "ME", gender: "M" },
  { id: 2, name: "Youssef Benali", age: 28, city: "Casablanca", stage: "essai", score: 87, diplome: "État", motorise: true, exp: 4, patients: 3, retention: 94, av: "YB", gender: "M" },
  { id: 3, name: "Salma Ouali", age: 31, city: "Dar Bouazza", stage: "entretien", score: 82, diplome: "Privé", motorise: true, exp: 6, patients: 0, retention: null, av: "SO", gender: "F" },
  { id: 4, name: "Hajar Taouab", age: 26, city: "Bouskoura", stage: "screening", score: 71, diplome: "Privé", motorise: false, exp: 2, patients: 0, retention: null, av: "HT", gender: "F" },
  { id: 5, name: "Karim Naji", age: 29, city: "Casablanca", stage: "candidature", score: null, diplome: "État", motorise: true, exp: 3, patients: 0, retention: null, av: "KN", gender: "M" },
];

async function apiScore(data) {
  const res = await fetch("/api/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: "Tu es l'outil de scoring IA de Kiné Wellness Casablanca. Retourne UNIQUEMENT du JSON valide, aucun texte avant ou après, aucun backtick markdown.",
      messages: [{ role: "user", content: `Évalue ce kiné selon les critères Kiné Wellness. JSON requis:\n{"scores":{"diplome":0,"motorise":0,"capacite":0,"ponctualite":0,"vigilance":0,"connaissances":0,"coachabilite":0,"volonte":0,"humilite":0,"serieux":0,"soft_skills":0,"expert_look":0,"physique":0,"non_fumeur":0,"marie":0,"sportif":0,"enfants":0},"totalScore":0,"recommendation":"RECRUTER","reasoning":"...","greenFlags":["..."],"redFlags":["..."]}\nRègles: diplome=10 si diplômé,0 sinon. motorise=10 si oui,0 sinon (bloquant). marie/sportif/enfants=bonus 0-10. totalScore/100. recommendation=RECRUTER|ENTRETIEN|REJETER (REJETER si non motorisé ou non diplômé).\nCandidat: ${JSON.stringify(data)}` }],
    }),
  });
  const json = await res.json();
  return JSON.parse(json.content[0].text);
}

async function apiChat(msgs, candidate) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 450,
      system: `Tu es le responsable recrutement de Kiné Wellness, entreprise de kinésithérapie à domicile premium à Casablanca. Tu conduis un entretien structuré en français, ton chaleureux et professionnel. Une question à la fois.\nCandidat: ${candidate.name}, ${candidate.age} ans, ${candidate.city}, ${candidate.exp || 0} ans exp, diplôme: ${candidate.diplome}.\nThèmes à couvrir: motivation domicile vs cabinet, gestion patient difficile, exemple de fidélisation réussie, réaction feedback négatif, ambitions à 5 ans.\nSi premier message, présente-toi chaleureusement et pose ta première question.`,
      messages: msgs,
    }),
  });
  const json = await res.json();
  return json.content[0].text;
}

/* ── UI helpers ── */
function Avatar({ initials, size = 42 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${B.teal},${B.navyMid})`, display: "flex", alignItems: "center", justifyContent: "center", color: B.white, fontWeight: 700, fontSize: size * 0.3 }}>
      {initials}
    </div>
  );
}
function Bar({ val, color = B.teal }) {
  return (
    <div style={{ flex: 1, background: B.border, borderRadius: 4, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${(val / 10) * 100}%`, height: "100%", background: color, borderRadius: 4, transition: "width .7s ease" }} />
    </div>
  );
}
function Tag({ label, color }) {
  return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + "20", color }}>{label}</span>;
}
function Btn({ children, onClick, variant = "primary", disabled, style: ex = {} }) {
  const base = { padding: "11px 24px", borderRadius: 9, border: "none", fontWeight: 700, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, fontFamily: "inherit", transition: "all .15s", ...ex };
  const v = { primary: { background: `linear-gradient(135deg,${B.teal},${B.tealBright})`, color: B.white }, ghost: { background: B.white, color: B.gray, border: `1px solid ${B.border}` }, dark: { background: `linear-gradient(135deg,${B.navyMid},${B.teal})`, color: B.white } };
  return <button style={{ ...base, ...v[variant] }} onClick={onClick} disabled={disabled}>{children}</button>;
}
function CandidateRow({ c, onClick }) {
  const stage = STAGES.find(s => s.key === c.stage);
  const sc = c.score >= 85 ? B.success : c.score >= 70 ? B.warning : B.danger;
  return (
    <div onClick={() => onClick && onClick(c)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: B.white, borderRadius: 10, border: `1px solid ${B.border}`, marginBottom: 8, cursor: onClick ? "pointer" : "default", transition: "box-shadow .2s" }}
      onMouseEnter={e => onClick && (e.currentTarget.style.boxShadow = "0 2px 12px rgba(42,127,111,.14)")}
      onMouseLeave={e => onClick && (e.currentTarget.style.boxShadow = "none")}>
      <Avatar initials={c.av} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, color: B.navyMid, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
        <div style={{ fontSize: 12, color: B.gray, marginTop: 2 }}>{c.age} ans · {c.city} · {c.exp} ans exp.</div>
      </div>
      {c.score != null && <div style={{ textAlign: "center" }}><div style={{ fontWeight: 800, fontSize: 18, color: sc }}>{c.score}</div><div style={{ fontSize: 10, color: B.gray }}>score</div></div>}
      {c.retention != null && <div style={{ textAlign: "center" }}><div style={{ fontWeight: 800, fontSize: 16, color: B.success }}>{c.retention}%</div><div style={{ fontSize: 10, color: B.gray }}>rétention</div></div>}
      <Tag label={stage.label} color={stage.color} />
    </div>
  );
}

/* ── VIEWS ── */
function Dashboard({ cands }) {
  const avgRet = (() => { const r = cands.filter(c => c.retention); return r.length ? Math.round(r.reduce((s, c) => s + c.retention, 0) / r.length) : 0; })();
  const stats = [
    { icon: "👥", val: cands.length, label: "Candidats actifs", color: B.teal },
    { icon: "🔬", val: cands.filter(c => c.stage === "essai").length, label: "En période d'essai", color: B.gold },
    { icon: "⭐", val: `${avgRet}%`, label: "Rétention moyenne", color: B.success },
    { icon: "💎", val: cands.filter(c => c.stage === "offre").length, label: "Offres proposées", color: B.navyMid },
  ];
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: B.navyMid, margin: "0 0 4px", fontFamily: "Georgia,serif" }}>Tableau de bord</h1>
        <p style={{ color: B.gray, fontSize: 14, margin: 0 }}>Machine de recrutement IA — Kiné Wellness Casablanca</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: B.white, borderRadius: 14, padding: "18px 20px", border: `1px solid ${B.border}` }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: B.gray, marginTop: 5 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: B.white, borderRadius: 14, padding: 22, border: `1px solid ${B.border}` }}>
          <div style={{ fontWeight: 700, color: B.navyMid, marginBottom: 18, fontSize: 15 }}>Entonnoir de recrutement</div>
          {STAGES.map(st => {
            const n = cands.filter(c => c.stage === st.key).length;
            const pct = cands.length ? Math.round((n / cands.length) * 100) : 0;
            return (
              <div key={st.key} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 13, color: B.navyMid }}>{st.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: st.color }}>{n}</span>
                </div>
                <div style={{ background: B.border, borderRadius: 4, height: 7, overflow: "hidden" }}>
                  <div style={{ width: `${Math.max(pct, n > 0 ? 8 : 0)}%`, background: st.color, height: "100%", borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ background: B.white, borderRadius: 14, padding: 22, border: `1px solid ${B.border}` }}>
          <div style={{ fontWeight: 700, color: B.navyMid, marginBottom: 16, fontSize: 15 }}>Top Talents</div>
          {cands.filter(c => c.score).sort((a, b) => b.score - a.score).slice(0, 4).map(c => <CandidateRow key={c.id} c={c} />)}
        </div>
      </div>
      <div style={{ background: `linear-gradient(135deg,${B.navyMid},${B.teal})`, borderRadius: 18, padding: "28px 36px", display: "flex", alignItems: "center", gap: 28, color: B.white }}>
        <div style={{ fontSize: 52 }}>💎</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "Georgia,serif", marginBottom: 8 }}>L'Offre Annuelle Kiné Wellness</div>
          <div style={{ opacity: .85, fontSize: 13, lineHeight: 1.7 }}>Pour les kinés avec 90%+ de rétention: 5 séances × 6 jours × 200 DH = <strong>20 000 DH/mois</strong> contre un abonnement annuel de <strong>60 000 DH</strong> — retour sur investissement en 3 mois.</div>
        </div>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 38, fontWeight: 900 }}>3×</div>
          <div style={{ fontSize: 11, opacity: .75 }}>salaire moyen<br />kiné au Maroc</div>
        </div>
      </div>
    </div>
  );
}

function Pipeline({ cands, setCands }) {
  const move = (id, stage) => setCands(p => p.map(c => c.id === id ? { ...c, stage } : c));
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: B.navyMid, margin: "0 0 4px", fontFamily: "Georgia,serif" }}>Pipeline</h1>
        <p style={{ color: B.gray, fontSize: 14, margin: 0 }}>Progression des candidats dans le processus</p>
      </div>
      <div style={{ overflowX: "auto", paddingBottom: 12 }}>
        <div style={{ display: "flex", gap: 14, minWidth: 980 }}>
          {STAGES.map(st => {
            const list = cands.filter(c => c.stage === st.key);
            return (
              <div key={st.key} style={{ flex: "0 0 200px" }}>
                <div style={{ padding: "9px 14px", background: st.color, borderRadius: "9px 9px 0 0", color: B.white, fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" }}>
                  <span>{st.label}</span>
                  <span style={{ background: "rgba(255,255,255,.25)", borderRadius: 10, padding: "1px 7px" }}>{list.length}</span>
                </div>
                <div style={{ background: "#f0f4f7", minHeight: 280, padding: 9, borderRadius: "0 0 9px 9px", border: `1px solid ${B.border}`, borderTop: "none" }}>
                  {list.map(c => {
                    const sc = c.score >= 85 ? B.success : c.score >= 70 ? B.warning : B.danger;
                    return (
                      <div key={c.id} style={{ background: B.white, borderRadius: 9, padding: "11px 13px", marginBottom: 7, border: `1px solid ${B.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                          <Avatar initials={c.av} size={30} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 12, color: B.navyMid, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                            <div style={{ fontSize: 11, color: B.gray }}>{c.city}</div>
                          </div>
                          {c.score != null && <span style={{ fontWeight: 800, fontSize: 14, color: sc }}>{c.score}</span>}
                        </div>
                        {c.retention && <div style={{ fontSize: 11, color: B.success, fontWeight: 600, marginBottom: 6 }}>⭐ {c.retention}% rétention</div>}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                          {STAGES.filter(s => s.key !== st.key).map(s => (
                            <button key={s.key} onClick={() => move(c.id, s.key)} style={{ padding: "2px 6px", borderRadius: 5, border: `1px solid ${s.color}`, background: "transparent", color: s.color, fontSize: 10, cursor: "pointer", fontWeight: 600 }}>
                              → {s.label.replace(" 💎","").replace(" ✓","").replace("Période d'","")}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const EMPTY_FORM = { name:"", age:"", gender:"M", city:"Casablanca", diplome:"État", motorise:"oui", exp:"", specs:"", marie:"non", sportif:"non", enfants:"non", fumeur:"non", motivation:"", dispo:"" };

function NouveauCandidat({ onAdd }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const doScore = async () => {
    setLoading(true); setErr("");
    try { const r = await apiScore(form); setResult(r); setStep(3); }
    catch (e) { setErr("Erreur API — vérifiez votre connexion et la clé Anthropic."); }
    setLoading(false);
  };
  const doAdd = () => {
    const av = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const stMap = { RECRUTER:"screening", ENTRETIEN:"entretien", REJETER:"candidature" };
    onAdd({ id: Date.now(), name: form.name, age: +form.age, gender: form.gender, city: form.city, diplome: form.diplome, motorise: form.motorise === "oui", exp: +form.exp || 0, patients: 0, retention: null, stage: stMap[result.recommendation] || "candidature", score: result.totalScore, av, date: new Date().toISOString().slice(0, 10) });
    setStep(4);
  };
  const inp = { width: "100%", padding: "9px 13px", borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 14, color: B.navyMid, background: B.white, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const lbl = { fontSize: 13, fontWeight: 700, color: B.navyMid, display: "block", marginBottom: 5 };
  const rc = result?.recommendation;
  const rcColor = rc === "RECRUTER" ? B.success : rc === "ENTRETIEN" ? B.warning : B.danger;
  const rcLabel = { RECRUTER:"✅ RECRUTER", ENTRETIEN:"⚠️ ENTRETIEN REQUIS", REJETER:"❌ REJETER" };
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: B.navyMid, margin: "0 0 4px", fontFamily: "Georgia,serif" }}>Nouveau Candidat</h1>
        <p style={{ color: B.gray, fontSize: 14, margin: 0 }}>Formulaire + scoring IA automatisé</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
        {["Formulaire","Analyse IA","Résultat"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: step > i+1 ? B.success : step === i+1 ? B.teal : B.border, color: step >= i+1 ? B.white : B.gray, fontWeight: 700, fontSize: 13 }}>{step > i+1 ? "✓" : i+1}</div>
              <span style={{ fontSize: 13, fontWeight: step===i+1?700:400, color: step===i+1?B.navyMid:B.gray }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: step > i+1 ? B.teal : B.border, margin: "0 14px" }} />}
          </div>
        ))}
      </div>
      {step === 1 && (
        <div style={{ background: B.white, borderRadius: 14, padding: 28, border: `1px solid ${B.border}`, maxWidth: 700 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 22px" }}>
            {[["Nom complet *","name","text","Youssef Benali"],["Âge *","age","number","28"]].map(([l,k,t,ph]) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <label style={lbl}>{l}</label>
                <input style={inp} type={t} value={form[k]} onChange={e => u(k, e.target.value)} placeholder={ph} />
              </div>
            ))}
            {[
              ["Genre","gender",["M|Homme","F|Femme"]],
              ["Ville *","city",["Casablanca|Casablanca","Dar Bouazza|Dar Bouazza","Bouskoura|Bouskoura","Mohammedia|Mohammedia","Autre|Autre"]],
              ["Diplôme kiné *","diplome",["État|Diplômé(e) d'État","Privé|Diplômé(e) école privée","Non|Non diplômé(e)"]],
              ["Motorisé(e) ? *","motorise",["oui|Oui — véhicule personnel","non|Non"]],
              ["Marié(e) ?","marie",["oui|Oui","non|Non"]],
              ["Sportif(ve) ?","sportif",["oui|Oui — pratique régulière","non|Non"]],
              ["Enfants ?","enfants",["oui|Oui","non|Non"]],
              ["Fumeur(euse) ?","fumeur",["non|Non","oui|Oui"]],
            ].map(([l,k,opts]) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <label style={lbl}>{l}</label>
                <select style={inp} value={form[k]} onChange={e => u(k, e.target.value)}>
                  {opts.map(o => { const [v,tx] = o.split("|"); return <option key={v} value={v}>{tx}</option>; })}
                </select>
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Années d'expérience</label>
              <input style={inp} type="number" value={form.exp} onChange={e => u("exp", e.target.value)} placeholder="4" />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Spécialités / Pathologies</label>
              <input style={inp} value={form.specs} onChange={e => u("specs", e.target.value)} placeholder="Neurologie, rhumatologie..." />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Motivation (quelques mots)</label>
            <textarea style={{ ...inp, minHeight: 70, resize: "vertical" }} value={form.motivation} onChange={e => u("motivation", e.target.value)} placeholder="Pourquoi souhaitez-vous rejoindre Kiné Wellness ?" />
          </div>
          <Btn onClick={() => setStep(2)} disabled={!form.name || !form.age}>Passer au Scoring IA →</Btn>
        </div>
      )}
      {step === 2 && (
        <div style={{ background: B.white, borderRadius: 14, padding: 44, border: `1px solid ${B.border}`, maxWidth: 500, textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🤖</div>
          <h2 style={{ fontFamily: "Georgia,serif", color: B.navyMid, marginBottom: 10, fontSize: 20 }}>Scoring IA en cours</h2>
          <p style={{ color: B.gray, marginBottom: 28 }}>L'IA analyse le profil de <strong style={{ color: B.navyMid }}>{form.name}</strong> selon les 17 critères Kiné Wellness.</p>
          {err && <p style={{ color: B.danger, marginBottom: 14, fontSize: 14 }}>{err}</p>}
          <Btn onClick={doScore} disabled={loading} variant="dark">{loading ? "⏳ Analyse en cours..." : "🚀 Lancer le Scoring IA"}</Btn>
          <div style={{ marginTop: 14 }}>
            <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: B.gray, fontSize: 13, cursor: "pointer" }}>← Retour au formulaire</button>
          </div>
        </div>
      )}
      {step === 3 && result && (
        <div style={{ maxWidth: 700 }}>
          <div style={{ background: B.white, borderRadius: 14, padding: 28, border: `1px solid ${B.border}`, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <div>
                <h2 style={{ fontFamily: "Georgia,serif", color: B.navyMid, margin: "0 0 4px", fontSize: 19 }}>Résultat — {form.name}</h2>
                <p style={{ color: B.gray, fontSize: 12, margin: 0 }}>Scoring IA Kiné Wellness</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 46, fontWeight: 900, color: rcColor, lineHeight: 1 }}>{result.totalScore}</div>
                <div style={{ fontSize: 11, color: B.gray }}>/100</div>
              </div>
            </div>
            <div style={{ padding: "12px 18px", borderRadius: 9, marginBottom: 20, background: rcColor + "18", border: `2px solid ${rcColor}40` }}>
              <span style={{ fontWeight: 800, color: rcColor, fontSize: 18 }}>{rcLabel[rc]}</span>
            </div>
            <p style={{ color: B.navyMid, fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}><strong>Analyse IA:</strong> {result.reasoning}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
              <div style={{ background: "#f0faf5", borderRadius: 10, padding: 14 }}>
                <div style={{ fontWeight: 700, color: B.success, marginBottom: 8, fontSize: 13 }}>✅ Points forts</div>
                {result.greenFlags?.map((f, i) => <div key={i} style={{ fontSize: 13, color: B.navyMid, marginBottom: 3 }}>• {f}</div>)}
              </div>
              <div style={{ background: "#fdf0f0", borderRadius: 10, padding: 14 }}>
                <div style={{ fontWeight: 700, color: B.danger, marginBottom: 8, fontSize: 13 }}>⚠️ Points d'attention</div>
                {result.redFlags?.map((f, i) => <div key={i} style={{ fontSize: 13, color: B.navyMid, marginBottom: 3 }}>• {f}</div>)}
              </div>
            </div>
            <div style={{ fontWeight: 700, color: B.navyMid, marginBottom: 10, fontSize: 13 }}>Détail des 17 critères</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 18px" }}>
              {CRITERIA.map(c => {
                const val = result.scores?.[c.key] ?? 0;
                const col = val >= 8 ? B.success : val >= 5 ? B.warning : B.danger;
                return (
                  <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 11, color: B.gray, width: 130, flexShrink: 0 }}>{c.label}</span>
                    <Bar val={val} color={col} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: col, width: 20, textAlign: "right" }}>{val}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" onClick={() => { setStep(1); setForm(EMPTY_FORM); setResult(null); }}>← Recommencer</Btn>
            <Btn onClick={doAdd} style={{ flex: 1 }}>Ajouter au pipeline →</Btn>
          </div>
        </div>
      )}
      {step === 4 && (
        <div style={{ background: B.white, borderRadius: 14, padding: 48, textAlign: "center", maxWidth: 480, border: `1px solid ${B.border}` }}>
          <div style={{ fontSize: 60, marginBottom: 14 }}>🎉</div>
          <h2 style={{ fontFamily: "Georgia,serif", color: B.navyMid, marginBottom: 10, fontSize: 20 }}>Candidat ajouté !</h2>
          <p style={{ color: B.gray, marginBottom: 28 }}><strong style={{ color: B.navyMid }}>{form.name}</strong> ajouté(e) avec un score de <strong style={{ color: B.teal }}>{result?.totalScore}/100</strong>.</p>
          <Btn onClick={() => { setStep(1); setForm(EMPTY_FORM); setResult(null); }}>Ajouter un autre candidat</Btn>
        </div>
      )}
    </div>
  );
}

function Entretien({ cands }) {
  const [sel, setSel] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const start = async (c) => {
    setSel(c); setMsgs([]); setLoading(true);
    try { const r = await apiChat([], c); setMsgs([{ role:"assistant", content:r }]); }
    catch { setMsgs([{ role:"assistant", content:"Erreur de connexion." }]); }
    setLoading(false);
  };
  const send = async () => {
    if (!input.trim() || loading) return;
    const um = { role:"user", content:input };
    const next = [...msgs, um];
    setMsgs(next); setInput(""); setLoading(true);
    try { const r = await apiChat(next, sel); setMsgs(m => [...m, { role:"assistant", content:r }]); }
    catch { setMsgs(m => [...m, { role:"assistant", content:"Erreur — réessayez." }]); }
    setLoading(false);
  };
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [msgs]);
  const eligible = cands.filter(c => c.score);
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: B.navyMid, margin: "0 0 4px", fontFamily: "Georgia,serif" }}>Entretien IA</h1>
        <p style={{ color: B.gray, fontSize: 14, margin: 0 }}>Claude simule un entretien de recrutement structuré</p>
      </div>
      {!sel ? (
        <div>
          <p style={{ color: B.navyMid, fontWeight: 600, marginBottom: 14 }}>Sélectionnez un candidat pour démarrer l'entretien :</p>
          {eligible.map(c => <CandidateRow key={c.id} c={c} onClick={start} />)}
        </div>
      ) : (
        <div style={{ display: "flex", gap: 18, height: 560 }}>
          <div style={{ width: 230, flexShrink: 0 }}>
            <div style={{ background: B.white, borderRadius: 14, padding: 18, border: `1px solid ${B.border}`, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Avatar initials={sel.av} size={46} />
                <div>
                  <div style={{ fontWeight: 700, color: B.navyMid, fontSize: 14 }}>{sel.name}</div>
                  <div style={{ fontSize: 12, color: B.gray }}>{sel.city}</div>
                </div>
              </div>
              {[["Score IA", sel.score != null ? `${sel.score}/100` : "—"],["Diplôme",sel.diplome],["Motorisé(e)",sel.motorise?"✅ Oui":"❌ Non"],["Expérience",`${sel.exp} ans`]].map(([k,v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 7 }}>
                  <span style={{ color: B.gray }}>{k}</span>
                  <span style={{ fontWeight: 700, color: B.navyMid }}>{v}</span>
                </div>
              ))}
            </div>
            <Btn variant="ghost" onClick={() => setSel(null)} style={{ width: "100%", textAlign: "center" }}>← Changer</Btn>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: B.white, borderRadius: 14, border: `1px solid ${B.border}`, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", background: `linear-gradient(135deg,${B.navyMid},${B.teal})`, color: B.white }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>🤖 Entretien IA — Kiné Wellness</div>
              <div style={{ fontSize: 11, opacity: .75 }}>Recruteur IA alimenté par Claude</div>
            </div>
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {loading && msgs.length === 0 && <div style={{ textAlign: "center", color: B.gray, padding: 32 }}>⏳ Initialisation de l'entretien...</div>}
              {msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role==="user"?"flex-end":"flex-start" }}>
                  <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: m.role==="user"?"14px 14px 3px 14px":"14px 14px 14px 3px", background: m.role==="user"?`linear-gradient(135deg,${B.teal},${B.tealBright})`:"#f0f4f7", color: m.role==="user"?B.white:B.navyMid, fontSize: 14, lineHeight: 1.55 }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && msgs.length > 0 && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ padding: "10px 14px", borderRadius: "14px 14px 14px 3px", background: "#f0f4f7", color: B.gray, fontSize: 13 }}>⏳ En train de répondre...</div>
                </div>
              )}
            </div>
            <div style={{ padding: "10px 14px", borderTop: `1px solid ${B.border}`, display: "flex", gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && !e.shiftKey && send()} placeholder="Répondez à l'interviewer..." style={{ flex: 1, padding: "9px 13px", borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
              <Btn onClick={send} disabled={loading || !input.trim()}>Envoyer</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Programme() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: B.navyMid, margin: "0 0 4px", fontFamily: "Georgia,serif" }}>Programme de Formation</h1>
        <p style={{ color: B.gray, fontSize: 14, margin: 0 }}>Parcours de mentoring — de l'onboarding à l'Offre 60K</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginBottom: 24 }}>
        {TRAINING.map(ph => (
          <div key={ph.phase} style={{ background: ph.phase===6?`linear-gradient(135deg,${B.navyMid},${B.teal})`:B.white, borderRadius: 14, padding: 22, border: ph.phase===6?"none":`1px solid ${B.border}`, color: ph.phase===6?B.white:B.navyMid }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: ph.phase===6?"rgba(255,255,255,.18)":ph.color+"20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{ph.icon}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>Phase {ph.phase}</div>
                <div style={{ fontSize: 11, opacity: ph.phase===6?.7:1, color: ph.phase===6?undefined:B.gray }}>{ph.dur}</div>
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, fontFamily: "Georgia,serif" }}>{ph.title}</div>
            {ph.modules.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 7, marginBottom: 7, fontSize: 13, alignItems: "flex-start" }}>
                <span style={{ color: ph.phase===6?"rgba(255,255,255,.6)":ph.color, flexShrink: 0, marginTop: 1 }}>→</span>
                <span style={{ color: ph.phase===6?"rgba(255,255,255,.88)":B.navyMid, lineHeight: 1.4 }}>{m}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ background: B.offWhite, borderRadius: 14, padding: 26, border: `1px solid ${B.border}` }}>
        <h2 style={{ fontFamily: "Georgia,serif", color: B.navyMid, marginBottom: 18, fontSize: 17, fontWeight: 800 }}>💡 Le Modèle Économique</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {[
            { icon:"🔍", t:"Trouver", d:"Identifier les meilleurs kinés via le scoring IA et les 17 critères Kiné Wellness" },
            { icon:"📚", t:"Mentorer", d:"Former sur la rétention patients, la relation humaine et l'image professionnelle" },
            { icon:"🔬", t:"Tester", d:"Assigner des patients et mesurer le taux de rétention sur la durée" },
            { icon:"💎", t:"L'Offre", d:"20 000 DH/mois garanti vs abonnement 60 000 DH/an — retour en 3 mois" },
          ].map(s => (
            <div key={s.t} style={{ background: B.white, borderRadius: 12, padding: 16, textAlign: "center", border: `1px solid ${B.border}` }}>
              <div style={{ fontSize: 28, marginBottom: 7 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, color: B.navyMid, marginBottom: 5, fontSize: 14 }}>{s.t}</div>
              <div style={{ fontSize: 12, color: B.gray, lineHeight: 1.5 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── PASSWORD GATE ── */
function LoginGate({ onAuth }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);
  const check = () => {
    if (pwd === PASSWORD) { onAuth(); }
    else { setErr(true); setShake(true); setPwd(""); setTimeout(() => setShake(false), 500); }
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: B.navy, fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
      <div style={{ background: B.white, borderRadius: 20, padding: "44px 48px", width: 380, textAlign: "center", animation: shake ? "shake .4s ease" : "none" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏥</div>
        <div style={{ color: B.tealBright, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Kiné Wellness</div>
        <h1 style={{ fontFamily: "Georgia,serif", color: B.navyMid, fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Machine de Recrutement</h1>
        <p style={{ color: B.gray, fontSize: 13, marginBottom: 28 }}>Accès réservé à l'équipe Kiné Wellness</p>
        <input
          type="password" value={pwd} onChange={e => { setPwd(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === "Enter" && check()}
          placeholder="Mot de passe"
          style={{ width: "100%", padding: "12px 16px", borderRadius: 9, border: `2px solid ${err ? B.danger : B.border}`, fontSize: 15, outline: "none", fontFamily: "inherit", color: B.navyMid, marginBottom: 10, boxSizing: "border-box", textAlign: "center", letterSpacing: 2 }}
        />
        {err && <p style={{ color: B.danger, fontSize: 13, marginBottom: 10 }}>Mot de passe incorrect.</p>}
        <button onClick={check} style={{ width: "100%", padding: "13px", borderRadius: 9, border: "none", background: `linear-gradient(135deg,${B.teal},${B.tealBright})`, color: B.white, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
          Accéder →
        </button>
      </div>
    </div>
  );
}

/* ── MAIN APP ── */
export default function App() {
  const [auth, setAuth] = useState(false);
  const [view, setView] = useState("dashboard");
  const [cands, setCands] = useState(DEMO);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!auth) return <LoginGate onAuth={() => setAuth(true)} />;

  const nav = [
    { key: "dashboard", label: "Tableau de bord", icon: "📊" },
    { key: "pipeline", label: "Pipeline", icon: "🔄" },
    { key: "nouveau", label: "Nouveau Candidat", icon: "➕" },
    { key: "entretien", label: "Entretien IA", icon: "🎤" },
    { key: "programme", label: "Programme", icon: "📚" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans',system-ui,sans-serif", background: B.offWhite, overflow: "hidden" }}>
      <div style={{ width: 236, background: B.navy, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px 18px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ color: B.tealBright, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 3 }}>Kiné Wellness</div>
          <div style={{ color: B.white, fontSize: 15, fontWeight: 800, fontFamily: "Georgia,serif", lineHeight: 1.25 }}>Machine de Recrutement</div>
          <div style={{ color: "rgba(255,255,255,.35)", fontSize: 11, marginTop: 4 }}>Casablanca · v2.0 IA</div>
        </div>
        <nav style={{ flex: 1, padding: "14px 10px" }}>
          {nav.map(n => (
            <button key={n.key} onClick={() => setView(n.key)} style={{ width: "100%", textAlign: "left", padding: "11px 14px", borderRadius: 9, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, marginBottom: 3, background: view===n.key?`linear-gradient(135deg,${B.teal},${B.tealBright})`:"transparent", color: view===n.key?B.white:"rgba(255,255,255,.55)", fontSize: 14, fontWeight: view===n.key?700:400, fontFamily: "inherit", transition: "all .15s" }}>
              <span style={{ fontSize: 15 }}>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ color: "rgba(255,255,255,.35)", fontSize: 10, marginBottom: 5 }}>Pipeline actuel</div>
          <div style={{ color: B.white, fontSize: 20, fontWeight: 900 }}>{cands.length} candidats</div>
          <div style={{ color: B.tealBright, fontSize: 11, marginTop: 3 }}>
            {cands.filter(c => c.stage==="offre").length} offre(s) · {cands.filter(c => c.retention).length} rétentions validées
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
        {view === "dashboard" && <Dashboard cands={cands} />}
        {view === "pipeline" && <Pipeline cands={cands} setCands={setCands} />}
        {view === "nouveau" && <NouveauCandidat onAdd={c => setCands(p => [c, ...p])} />}
        {view === "entretien" && <Entretien cands={cands} />}
        {view === "programme" && <Programme />}
      </div>
    </div>
  );
}
