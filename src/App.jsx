import { useState, useEffect, useRef } from "react";

const STRETCHES_MAIN = [
  { id:1, title:"Respiración + desbloqueo", dur:"1 min", steps:["Inhala 4 seg por nariz, exhala 6 seg. Repite 5-6 veces.","Mueve hombros hacia atrás suavemente.","Cuello de lado a lado, mandíbula relajada."], desc:"De pie o en el borde de la cama. Sal del modo sueño sin estrés.", flex:false },
  { id:2, title:"Movilidad de cuello", dur:"1 min", steps:["Mira a derecha e izquierda, 5 reps por lado.","Oreja hacia hombro, 5 reps por lado.","Barbilla al pecho y vuelves. 5 reps."], desc:"Lento, sin círculos bruscos. Libera tensión, no fuerzas.", flex:false },
  { id:3, title:"Hombros y espalda alta", dur:"1 min", steps:["10 círculos de hombros hacia atrás.","10 círculos de hombros hacia delante.","Abre brazos en cruz y junta escápulas 10 veces."], desc:"Clave si trabajas muchas horas con ordenador.", flex:false },
  { id:4, title:"Gato-vaca", dur:"1 min", steps:["A cuatro patas en el suelo.","Redondea espalda hacia arriba (gato).","Hunde espalda y abre el pecho (vaca). Alterna 60 seg."], desc:"Despierta la columna. Quita rigidez lumbar y dorsal.", flex:false },
  { id:5, title:"Postura del niño + alcance lateral", dur:"1 min", steps:["Desde cuatro patas, culo a talones, brazos al frente. 30 seg.","Camina manos a la derecha 15 seg.","Luego a la izquierda 15 seg."], desc:"Estira espalda, dorsales y lumbar.", flex:false },
  { id:6, title:"Apertura de cadera", dur:"1 min", steps:["Zancada baja: pierna delantera, rodilla trasera en suelo.","Cadera hacia delante suavemente.","30 seg por cada lado."], desc:"Abre flexores de cadera, muy cargados por estar sentado.", flex:false },
  { id:7, title:"Isquios suaves", dur:"1 min", steps:["De pie, pies al ancho de caderas.","Rodillas ligeramente dobladas, baja torso 30-40 seg.","Sube lento, vértebra a vértebra."], desc:"No busques tensión máxima. Rodillas dobladas siempre.", flex:false },
  { id:8, title:"Rotaciones de columna", dur:"1 min", steps:["Tumbado boca arriba, brazos en cruz, rodillas dobladas.","Deja caer rodillas a un lado, luego al otro.","5 reps lentas por lado."], desc:"Muy bueno para lumbar y espalda media.", flex:false },
  { id:9, title:"Activación final", dur:"1 min", steps:["10 sentadillas suaves.","10 elevaciones de talones.","10 seg sacudiendo brazos y piernas.","3 respiraciones profundas."], desc:"Evita quedarte demasiado relajado. Le dices al cuerpo: empezamos.", flex:false },
];

const STRETCHES_FLEX = [
  { id:10, title:"Isquios con toalla", dur:"90 seg", steps:["Tumbado boca arriba, lleva rodilla al pecho con las manos.","Extiende la pierna hacia el techo lo que puedas.","Mantén 45 seg por pierna. Sin forzar, deja que ceda."], desc:"La forma más efectiva de ganar longitud en isquios. El secreto es la relajación, no la fuerza.", flex:true },
  { id:11, title:"Flexión de tronco sentado", dur:"90 seg", steps:["Siéntate en el suelo, piernas estiradas juntas.","Espira y avanza el torso hacia las piernas sin doblar rodillas.","Mantén 60 seg. Cada exhalación intenta avanzar 1 mm más."], desc:"Ejercicio clave para tocarte los pies. Con el tiempo irás llegando más lejos.", flex:true },
  { id:12, title:"Estiramiento de gemelos en pared", dur:"1 min", steps:["De pie frente a la pared, una pierna retrasada.","Talón trasero pegado al suelo, rodilla recta.","Inclínate hacia la pared. 30 seg por pierna."], desc:"La cadena posterior llega hasta los pies. Gemelos rígidos limitan mucho la flexibilidad.", flex:true },
  { id:13, title:"Perro boca abajo con talones pulsantes", dur:"1 min", steps:["Desde cuatro patas, levanta caderas formando una V invertida.","Alterna: baja un talón al suelo mientras el otro se eleva.","20 pulsaciones lentas. Después mantén 30 seg estático."], desc:"Combina cadena posterior completa: isquios, gemelos y fascia plantar.", flex:true },
];

const STRETCHES_QUICK = [
  { ...STRETCHES_MAIN[0], dur:"30 seg" },
  { ...STRETCHES_MAIN[1], title:"Cuello y hombros", dur:"1 min" },
  { ...STRETCHES_MAIN[3], dur:"1 min" },
  { ...STRETCHES_MAIN[4], dur:"1 min" },
  { ...STRETCHES_MAIN[5], dur:"1 min" },
  { ...STRETCHES_MAIN[8], dur:"30 seg" },
  { ...STRETCHES_FLEX[1], dur:"1 min" },
];

const FLEX_LEVELS = [
  { label:"Rodillas", pct:0, tip:"Punto de partida habitual. Con constancia superarás esto en pocas semanas." },
  { label:"Media tibia", pct:33, tip:"Buen progreso. Los isquios están cediendo." },
  { label:"Tobillos", pct:66, tip:"Ya casi. La meta está muy cerca." },
  { label:"Pies", pct:100, tip:"¡Objetivo conseguido! Ahora a mantenerlo." },
];

const MOTIVATIONS = [
  "La constancia transforma el cuerpo.",
  "Un cuerpo flexible, una mente libre.",
  "Cada mañana es una nueva oportunidad.",
  "Pequeños hábitos, grandes cambios.",
  "Tu futuro yo te lo agradecerá.",
  "La flexibilidad no es un don, es una práctica.",
  "Empieza bien el día y el resto fluye.",
];

function gs(k, d) { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : d; } catch { return d; } }
function ss(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

function getDOY() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

function fmtDate(d) {
  return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
}

export default function App() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [tab, setTab] = useState("hoy");
  const [mode, setMode] = useState("completa");
  const [expanded, setExpanded] = useState(null);
  const [completedToday, setCompletedToday] = useState(() => gs("comp_" + todayStr, []));
  const [doneDays, setDoneDays] = useState(() => gs("done_days", []));
  const [flexHistory, setFlexHistory] = useState(() => gs("flex_history", []));
  const [selectedFlex, setSelectedFlex] = useState(null);

  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerTotal, setTimerTotal] = useState(60);
  const [selectedTimerStretch, setSelectedTimerStretch] = useState(null);
  const timerRef = useRef(null);

  const currentStretches = mode === "rapida" ? STRETCHES_QUICK : [...STRETCHES_MAIN, ...STRETCHES_FLEX];

  const pct = Math.round((completedToday.length / currentStretches.length) * 100);
  const allDone = completedToday.length === currentStretches.length;

  function markDone(id, e) {
    e.stopPropagation();
    let next;
    if (completedToday.includes(id)) {
      next = completedToday.filter(x => x !== id);
    } else {
      next = [...completedToday, id];
    }
    setCompletedToday(next);
    ss("comp_" + todayStr, next);
    if (!doneDays.includes(todayStr) && next.length === currentStretches.length) {
      const nd = [...doneDays, todayStr];
      setDoneDays(nd);
      ss("done_days", nd);
    }
  }

  function toggleStretch(id) {
    setExpanded(prev => prev === id ? null : id);
  }

  function saveFlexLevel() {
    if (selectedFlex === null) return;
    const entry = { date: todayStr, level: selectedFlex, label: FLEX_LEVELS[selectedFlex].label };
    let next = flexHistory.filter(x => x.date !== todayStr);
    next = [entry, ...next].sort((a, b) => b.date.localeCompare(a.date));
    setFlexHistory(next);
    ss("flex_history", next);
  }

  function selectTimerStretch(s) {
    if (timerRunning) return;
    const secs = s.dur.includes("90") ? 90 : s.dur.includes("30") ? 30 : 60;
    setSelectedTimerStretch(s);
    setTimerSeconds(secs);
    setTimerTotal(secs);
  }

  function toggleTimer() {
    if (!selectedTimerStretch) return;
    if (timerRunning) {
      clearInterval(timerRef.current);
      setTimerRunning(false);
    } else {
      setTimerRunning(true);
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }

  function resetTimer() {
    clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimerSeconds(timerTotal);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  function getStreak() {
    if (!doneDays.length) return 0;
    let streak = 0;
    const check = new Date(today);
    for (let i = 0; i < 365; i++) {
      const ds = check.toISOString().split("T")[0];
      if (doneDays.includes(ds)) { streak++; check.setDate(check.getDate() - 1); }
      else break;
    }
    return streak;
  }

  const streak = getStreak();
  const timerFmt = Math.floor(timerSeconds / 60) + ":" + String(timerSeconds % 60).padStart(2, "0");
  const timerFill = Math.round((timerSeconds / timerTotal) * 100);

  const S = {
    app: { maxWidth: 420, margin: "0 auto", padding: "1rem 0.75rem 3rem", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
    header: { textAlign: "center", padding: "1.25rem 0 1rem" },
    h1: { fontSize: 22, fontWeight: 500, color: "#1a1a1a", margin: 0 },
    sub: { fontSize: 13, color: "#888", marginTop: 4 },
    tabs: { display: "flex", gap: 4, background: "#ece9e2", borderRadius: 8, padding: 3, marginBottom: "1.25rem" },
    tab: (active) => ({ flex: 1, textAlign: "center", padding: "7px 0", fontSize: 12, borderRadius: 6, cursor: "pointer", color: active ? "#1a1a1a" : "#888", border: active ? "0.5px solid #d0cdc4" : "none", background: active ? "#fff" : "transparent", fontWeight: active ? 500 : 400, transition: "all 0.15s" }),
    card: { background: "#fff", border: "0.5px solid #e0ddd6", borderRadius: 12, padding: "0.875rem 1rem", marginBottom: "0.75rem" },
    modeRow: { display: "flex", gap: 6, marginBottom: "0.75rem" },
    modeBtn: (active) => ({ flex: 1, padding: "6px 8px", borderRadius: 20, border: active ? "0.5px solid #9FE1CB" : "0.5px solid #e0ddd6", background: active ? "#E1F5EE" : "transparent", fontSize: 12, cursor: "pointer", color: active ? "#0F6E56" : "#888", textAlign: "center", transition: "all 0.15s" }),
    progBar: { width: "100%", height: 6, background: "#ece9e2", borderRadius: 3, overflow: "hidden" },
    progFill: (pct) => ({ height: "100%", background: "#1D9E75", borderRadius: 3, width: pct + "%", transition: "width 0.3s" }),
    sectionTag: { display: "flex", alignItems: "center", gap: 8, margin: "1rem 0 0.5rem" },
    tagLine: { flex: 1, height: "0.5px", background: "#e0ddd6" },
    tagBadge: (flex) => ({ fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 500, background: flex ? "#FAEEDA" : "#E1F5EE", color: flex ? "#854F0B" : "#0F6E56" }),
    stretchItem: (isFlx, isDone, isExp) => ({ background: "#fff", border: isFlx ? "0.5px solid #e0ddd6" : "0.5px solid #e0ddd6", borderLeft: isFlx ? "2px solid #FAC775" : "0.5px solid #e0ddd6", borderRadius: isFlx ? "0 12px 12px 0" : 12, overflow: "hidden", cursor: "pointer", opacity: isDone ? 0.6 : 1, marginBottom: 6, transition: "border-color 0.15s" }),
    stretchHeader: { display: "flex", alignItems: "center", gap: 10, padding: "0.75rem 1rem" },
    stretchNum: (isFlx, isDone) => ({ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, flexShrink: 0, background: isDone ? (isFlx ? "#FAEEDA" : "#E1F5EE") : "#f5f5f0", border: isDone ? (isFlx ? "0.5px solid #FAC775" : "0.5px solid #9FE1CB") : "0.5px solid #e0ddd6", color: isDone ? (isFlx ? "#854F0B" : "#0F6E56") : "#888" }),
    stretchTitle: { flex: 1, fontSize: 14, fontWeight: 500, color: "#1a1a1a" },
    stretchDur: { fontSize: 12, color: "#aaa" },
    stretchBody: { padding: "0 1rem 0.875rem 2.75rem" },
    stretchDesc: { fontSize: 13, color: "#666", lineHeight: 1.6 },
    markBtn: (isFlx, isDone) => ({ width: "100%", padding: 8, borderRadius: 8, fontSize: 13, cursor: "pointer", marginTop: "0.5rem", border: isDone ? "0.5px solid #e0ddd6" : (isFlx ? "0.5px solid #FAC775" : "0.5px solid #9FE1CB"), background: isDone ? "#f5f5f0" : (isFlx ? "#FAEEDA" : "#E1F5EE"), color: isDone ? "#aaa" : (isFlx ? "#854F0B" : "#0F6E56") }),
    completeBanner: { background: "#1D9E75", borderRadius: 12, padding: "1.25rem", textAlign: "center", color: "white", marginBottom: "0.75rem" },
    motivation: { fontSize: 13, color: "#aaa", textAlign: "center", fontStyle: "italic", padding: "0.5rem 0" },
    streakCard: { background: "#E1F5EE", border: "0.5px solid #9FE1CB", borderRadius: 12, padding: "0.875rem 1rem", display: "flex", alignItems: "center", gap: 12, marginBottom: "0.75rem" },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8, marginBottom: "0.75rem" },
    statBox: { background: "#f5f5f0", borderRadius: 8, padding: "0.75rem", textAlign: "center" },
    timerSection: { background: "#fff", border: "0.5px solid #e0ddd6", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "0.75rem" },
    btnMain: { flex: 2, padding: 10, borderRadius: 8, border: "none", background: "#1D9E75", color: "white", fontSize: 14, fontWeight: 500, cursor: "pointer" },
    btnSec: { flex: 1, padding: 10, borderRadius: 8, border: "0.5px solid #e0ddd6", background: "transparent", color: "#888", fontSize: 13, cursor: "pointer" },
    flexOpt: (selected) => ({ padding: "5px 10px", borderRadius: 20, border: selected ? "0.5px solid #FAC775" : "0.5px solid #e0ddd6", background: selected ? "#FAEEDA" : "transparent", fontSize: 12, cursor: "pointer", color: selected ? "#854F0B" : "#888", transition: "all 0.15s" }),
    sectionTitle: { fontSize: 12, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.05em", margin: "1rem 0 0.5rem" },
  };

  function renderItem(s) {
    const done = completedToday.includes(s.id);
    const exp = expanded === s.id;
    return (
      <div key={s.id} style={S.stretchItem(s.flex, done, exp)} onClick={() => toggleStretch(s.id)}>
        <div style={S.stretchHeader}>
          <div style={S.stretchNum(s.flex, done)}>
            {done ? "✓" : s.id}
          </div>
          <div style={S.stretchTitle}>{s.title}</div>
          <div style={S.stretchDur}>{s.dur}</div>
        </div>
        {exp && (
          <div style={S.stretchBody}>
            <p style={S.stretchDesc}>{s.desc}</p>
            <ul style={{ marginTop: "0.5rem", listStyle: "none" }}>
              {s.steps.map((st, i) => (
                <li key={i} style={{ fontSize: 13, color: "#666", padding: "2px 0 2px 14px", position: "relative", lineHeight: 1.5 }}>
                  <span style={{ position: "absolute", left: 0, color: s.flex ? "#BA7517" : "#1D9E75", fontWeight: 700 }}>·</span>
                  {st}
                </li>
              ))}
            </ul>
            <button style={S.markBtn(s.flex, done)} onClick={(e) => markDone(s.id, e)}>
              {done ? "✓ Completado" : "Marcar como hecho"}
            </button>
          </div>
        )}
      </div>
    );
  }

  const mainItems = currentStretches.filter(s => !s.flex);
  const flexItems = currentStretches.filter(s => s.flex);

  return (
    <div style={S.app}>
      <div style={S.header}>
        <h1 style={S.h1}>Buenos días</h1>
        <p style={S.sub}>{fmtDate(today)}</p>
      </div>

      <div style={S.tabs}>
        {["hoy","timer","flexibilidad","progreso"].map(t => (
          <button key={t} style={S.tab(tab===t)} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
        ))}
      </div>

      {tab === "hoy" && (
        <>
          <div style={S.modeRow}>
            <button style={S.modeBtn(mode==="completa")} onClick={() => setMode("completa")}>Completa · 13 min</button>
            <button style={S.modeBtn(mode==="rapida")} onClick={() => setMode("rapida")}>Rápida · 5 min</button>
          </div>
          <div style={{ ...S.card, marginBottom: "0.75rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{ fontSize:13, color:"#888" }}>Progreso de hoy</span>
              <span style={{ fontSize:13, fontWeight:500, color:"#1D9E75" }}>{pct}%</span>
            </div>
            <div style={S.progBar}><div style={S.progFill(pct)} /></div>
          </div>
          {allDone && (
            <div style={S.completeBanner}>
              <h2 style={{ fontSize:18, fontWeight:500, marginBottom:4 }}>¡Rutina completada!</h2>
              <p style={{ fontSize:13, opacity:0.85 }}>Excelente inicio de día. Tu cuerpo te lo agradecerá.</p>
            </div>
          )}
          {mode === "completa" ? (
            <>
              {mainItems.length > 0 && (
                <>
                  <div style={S.sectionTag}><div style={S.tagLine}/><span style={S.tagBadge(false)}>Rutina matutina</span><div style={S.tagLine}/></div>
                  {mainItems.map(s => renderItem(s))}
                </>
              )}
              {flexItems.length > 0 && (
                <>
                  <div style={S.sectionTag}><div style={S.tagLine}/><span style={S.tagBadge(true)}>Objetivo: tocarme los pies</span><div style={S.tagLine}/></div>
                  {flexItems.map(s => renderItem(s))}
                </>
              )}
            </>
          ) : (
            <>
              <div style={S.sectionTag}><div style={S.tagLine}/><span style={S.tagBadge(false)}>Versión rápida</span><div style={S.tagLine}/></div>
              {currentStretches.map(s => renderItem(s))}
            </>
          )}
          <p style={S.motivation}>{MOTIVATIONS[getDOY() % MOTIVATIONS.length]}</p>
        </>
      )}

      {tab === "timer" && (
        <>
          <div style={S.timerSection}>
            <div style={{ fontSize:13, fontWeight:500, color:"#1a1a1a", marginBottom:2 }}>
              {selectedTimerStretch ? selectedTimerStretch.title : "Selecciona un estiramiento"}
            </div>
            <div style={{ textAlign:"center", margin:"0.5rem 0 1rem" }}>
              <div style={{ fontSize:52, fontWeight:500, color:"#1a1a1a", fontVariantNumeric:"tabular-nums", lineHeight:1 }}>{timerFmt}</div>
              <div style={{ fontSize:13, color:"#888", marginTop:4 }}>{timerRunning ? "en curso..." : timerSeconds === timerTotal ? "listo para empezar" : timerSeconds === 0 ? "¡Listo!" : "en pausa"}</div>
            </div>
            <div style={{ width:"100%", height:4, background:"#f0ede6", borderRadius:2, marginBottom:"1rem", overflow:"hidden" }}>
              <div style={{ height:"100%", background: selectedTimerStretch?.flex ? "#BA7517" : "#1D9E75", borderRadius:2, width:timerFill+"%", transition:"width 0.9s linear" }} />
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button style={S.btnMain} onClick={toggleTimer} disabled={!selectedTimerStretch}>
                {timerRunning ? "Pausar" : timerSeconds < timerTotal && timerSeconds > 0 ? "Continuar" : "Iniciar"}
              </button>
              <button style={S.btnSec} onClick={resetTimer}>Reiniciar</button>
            </div>
          </div>
          <p style={S.sectionTitle}>Estiramientos</p>
          {currentStretches.map(s => {
            const sel = selectedTimerStretch?.id === s.id;
            return (
              <div key={s.id} style={{ ...S.stretchItem(s.flex, false, false), border: sel ? (s.flex ? "0.5px solid #FAC775" : "0.5px solid #9FE1CB") : "0.5px solid #e0ddd6", borderLeft: s.flex ? "2px solid #FAC775" : sel ? "0.5px solid #9FE1CB" : "0.5px solid #e0ddd6" }} onClick={() => selectTimerStretch(s)}>
                <div style={S.stretchHeader}>
                  <div style={S.stretchNum(s.flex, false)}>{s.id}</div>
                  <div style={S.stretchTitle}>{s.title}</div>
                  <div style={S.stretchDur}>{s.dur}</div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {tab === "flexibilidad" && (
        <>
          <div style={S.card}>
            <p style={{ fontSize:14, fontWeight:500, color:"#1a1a1a", marginBottom:"0.75rem" }}>¿Hasta dónde llegas hoy?</p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:"1rem" }}>
              {FLEX_LEVELS.map((l, i) => (
                <button key={i} style={S.flexOpt(selectedFlex===i)} onClick={() => setSelectedFlex(i)}>{l.label}</button>
              ))}
            </div>
            {selectedFlex !== null && (
              <>
                <div style={{ position:"relative", margin:"0.75rem 0" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:11, color:"#aaa" }}>menos flexible</span>
                    <span style={{ fontSize:11, color:"#aaa" }}>más flexible</span>
                  </div>
                  <div style={{ width:"100%", height:8, background:"#f0ede6", borderRadius:4, position:"relative" }}>
                    <div style={{ height:"100%", borderRadius:4, background:"#BA7517", width:FLEX_LEVELS[selectedFlex].pct+"%", transition:"width 0.4s" }} />
                    <div style={{ position:"absolute", top:-4, left:FLEX_LEVELS[selectedFlex].pct+"%", width:16, height:16, borderRadius:"50%", background:"#BA7517", border:"2px solid #fff", transform:"translateX(-50%)", transition:"left 0.4s" }} />
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                    {["Rodillas","Media tibia","Tobillos","Pies"].map(l => (
                      <span key={l} style={{ fontSize:10, color:"#aaa" }}>{l}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign:"center", margin:"0.75rem 0 0.5rem" }}>
                  <strong style={{ fontSize:20, fontWeight:500, color:"#BA7517" }}>{FLEX_LEVELS[selectedFlex].label}</strong>
                  <p style={{ fontSize:12, color:"#888", marginTop:2 }}>{FLEX_LEVELS[selectedFlex].tip}</p>
                </div>
              </>
            )}
            <button style={{ ...S.btnMain, flex:"none", width:"100%", marginTop:"0.5rem" }} onClick={saveFlexLevel}>Guardar medición</button>
          </div>
          <p style={S.sectionTitle}>Historial de progreso</p>
          <div style={S.card}>
            {flexHistory.length === 0 ? (
              <p style={{ fontSize:13, color:"#aaa", textAlign:"center", padding:"1rem 0" }}>Sin registros todavía</p>
            ) : flexHistory.slice(0, 8).map((e, i) => {
              const prev = flexHistory[i + 1];
              const improved = prev && e.level > prev.level;
              const d = new Date(e.date).toLocaleDateString("es-ES", { day:"numeric", month:"short" });
              return (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom: i < Math.min(flexHistory.length,8)-1 ? "0.5px solid #e0ddd6" : "none" }}>
                  <span style={{ fontSize:12, color:"#888" }}>{d}</span>
                  {improved && <span style={{ fontSize:11, color:"#1D9E75" }}>↑ mejora</span>}
                  <span style={{ fontSize:12, fontWeight:500, color:"#854F0B" }}>{e.label}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "progreso" && (
        <>
          <div style={S.streakCard}>
            <div style={{ fontSize:32, fontWeight:500, color:"#0F6E56", lineHeight:1 }}>{streak}</div>
            <div>
              <p style={{ fontSize:14, fontWeight:500, color:"#0F6E56" }}>días seguidos</p>
              <p style={{ fontSize:12, color:"#0F6E56", marginTop:2, opacity:0.8 }}>
                {streak === 0 ? "Empieza hoy tu racha" : streak === 1 ? "¡Primer día completado!" : "¡Sigue así!"}
              </p>
            </div>
          </div>
          <div style={S.statsRow}>
            <div style={S.statBox}><div style={{ fontSize:18, fontWeight:500, color:"#1a1a1a" }}>{doneDays.length}</div><div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>sesiones totales</div></div>
            <div style={S.statBox}><div style={{ fontSize:18, fontWeight:500, color:"#1a1a1a" }}>{(() => { const ws = new Date(today); ws.setDate(today.getDate()-today.getDay()); return doneDays.filter(d=>new Date(d)>=ws).length; })()}</div><div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>esta semana</div></div>
            <div style={S.statBox}><div style={{ fontSize:18, fontWeight:500, color:"#1a1a1a" }}>{doneDays.filter(d=>new Date(d)>=new Date(today.getFullYear(),today.getMonth(),1)).length}</div><div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>este mes</div></div>
          </div>
          <p style={S.sectionTitle}>Este mes</p>
          <div style={S.card}>
            {(() => {
              const y = today.getFullYear(), mo = today.getMonth();
              const fd = new Date(y,mo,1).getDay(), dim = new Date(y,mo+1,0).getDate();
              const off = fd === 0 ? 6 : fd - 1;
              const cells = [];
              for (let i = 0; i < off; i++) cells.push(<div key={"e"+i} />);
              for (let d = 1; d <= dim; d++) {
                const ds = `${y}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                const isT = ds === todayStr, isDone = doneDays.includes(ds);
                cells.push(
                  <div key={d} style={{ aspectRatio:1, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, background: isDone?"#1D9E75": isT?"#E1F5EE":"transparent", color: isDone?"white": isT?"#0F6E56":"#aaa", border: isT&&!isDone?"0.5px solid #9FE1CB":"none", fontWeight: isT?500:400 }}>{d}</div>
                );
              }
              return <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>{cells}</div>;
            })()}
          </div>
        </>
      )}
    </div>
  );
}
