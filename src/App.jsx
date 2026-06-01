import { useState, useEffect, useRef, useCallback } from "react";

const STRETCHES_MAIN = [
  { id:1, title:"Respiración + desbloqueo", dur:"1 min", secs:60, steps:["Inhala 4 seg por nariz, exhala 6 seg. Repite 5-6 veces.","Mueve hombros hacia atrás suavemente.","Cuello de lado a lado, mandíbula relajada."], desc:"De pie o en el borde de la cama. Sal del modo sueño sin estrés.", flex:false },
  { id:2, title:"Movilidad de cuello", dur:"1 min", secs:60, steps:["Mira a derecha e izquierda, 5 reps por lado.","Oreja hacia hombro, 5 reps por lado.","Barbilla al pecho y vuelves. 5 reps."], desc:"Lento, sin círculos bruscos. Libera tensión, no fuerzas.", flex:false },
  { id:3, title:"Hombros y espalda alta", dur:"1 min", secs:60, steps:["10 círculos de hombros hacia atrás.","10 círculos de hombros hacia delante.","Abre brazos en cruz y junta escápulas 10 veces."], desc:"Clave si trabajas muchas horas con ordenador.", flex:false },
  { id:4, title:"Gato-vaca", dur:"1 min", secs:60, steps:["A cuatro patas en el suelo.","Redondea espalda hacia arriba (gato).","Hunde espalda y abre el pecho (vaca). Alterna 60 seg."], desc:"Despierta la columna. Quita rigidez lumbar y dorsal.", flex:false },
  { id:5, title:"Postura del niño + alcance lateral", dur:"1 min", secs:60, steps:["Desde cuatro patas, culo a talones, brazos al frente. 30 seg.","Camina manos a la derecha 15 seg.","Luego a la izquierda 15 seg."], desc:"Estira espalda, dorsales y lumbar.", flex:false },
  { id:6, title:"Apertura de cadera", dur:"1 min", secs:60, steps:["Zancada baja: pierna delantera, rodilla trasera en suelo.","Cadera hacia delante suavemente.","30 seg por cada lado."], desc:"Abre flexores de cadera, muy cargados por estar sentado.", flex:false },
  { id:7, title:"Isquios suaves", dur:"1 min", secs:60, steps:["De pie, pies al ancho de caderas.","Rodillas ligeramente dobladas, baja torso 30-40 seg.","Sube lento, vértebra a vértebra."], desc:"No busques tensión máxima. Rodillas dobladas siempre.", flex:false },
  { id:8, title:"Rotaciones de columna", dur:"1 min", secs:60, steps:["Tumbado boca arriba, brazos en cruz, rodillas dobladas.","Deja caer rodillas a un lado, luego al otro.","5 reps lentas por lado."], desc:"Muy bueno para lumbar y espalda media.", flex:false },
  { id:9, title:"Activación final", dur:"1 min", secs:60, steps:["10 sentadillas suaves.","10 elevaciones de talones.","10 seg sacudiendo brazos y piernas.","3 respiraciones profundas."], desc:"Evita quedarte demasiado relajado. Le dices al cuerpo: empezamos.", flex:false },
];

const STRETCHES_FLEX = [
  { id:10, title:"Isquios con toalla", dur:"90 seg", secs:90, steps:["Tumbado boca arriba, lleva rodilla al pecho con las manos.","Extiende la pierna hacia el techo lo que puedas.","Mantén 45 seg por pierna. Sin forzar, deja que ceda."], desc:"La forma más efectiva de ganar longitud en isquios. El secreto es la relajación, no la fuerza.", flex:true },
  { id:11, title:"Flexión de tronco sentado", dur:"90 seg", secs:90, steps:["Siéntate en el suelo, piernas estiradas juntas.","Espira y avanza el torso hacia las piernas sin doblar rodillas.","Mantén 60 seg. Cada exhalación intenta avanzar 1 mm más."], desc:"Ejercicio clave para tocarte los pies. Con el tiempo irás llegando más lejos.", flex:true },
  { id:12, title:"Estiramiento de gemelos en pared", dur:"1 min", secs:60, steps:["De pie frente a la pared, una pierna retrasada.","Talón trasero pegado al suelo, rodilla recta.","Inclínate hacia la pared. 30 seg por pierna."], desc:"La cadena posterior llega hasta los pies. Gemelos rígidos limitan mucho la flexibilidad.", flex:true },
  { id:13, title:"Perro boca abajo con talones pulsantes", dur:"1 min", secs:60, steps:["Desde cuatro patas, levanta caderas formando una V invertida.","Alterna: baja un talón al suelo mientras el otro se eleva.","20 pulsaciones lentas. Después mantén 30 seg estático."], desc:"Combina cadena posterior completa: isquios, gemelos y fascia plantar.", flex:true },
];

const STRETCHES_QUICK = [
  { ...STRETCHES_MAIN[0], dur:"30 seg", secs:30 },
  { ...STRETCHES_MAIN[1], title:"Cuello y hombros", dur:"1 min", secs:60 },
  { ...STRETCHES_MAIN[3], dur:"1 min", secs:60 },
  { ...STRETCHES_MAIN[4], dur:"1 min", secs:60 },
  { ...STRETCHES_MAIN[5], dur:"1 min", secs:60 },
  { ...STRETCHES_MAIN[8], dur:"30 seg", secs:30 },
  { ...STRETCHES_FLEX[1], dur:"1 min", secs:60 },
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
function getDOY() { const n = new Date(), s = new Date(n.getFullYear(),0,0); return Math.floor((n-s)/86400000); }
function fmtDate(d) { return d.toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"}); }

export default function App() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [tab, setTab] = useState("hoy");
  const [mode, setMode] = useState("completa");
  const [expanded, setExpanded] = useState(null);
  const [completedToday, setCompletedToday] = useState(() => gs("comp_"+todayStr, []));
  const [doneDays, setDoneDays] = useState(() => gs("done_days", []));
  const [flexHistory, setFlexHistory] = useState(() => gs("flex_history", []));
  const [selectedFlex, setSelectedFlex] = useState(null);

  // Timer state
  const [activeIdx, setActiveIdx] = useState(null);
  const [timerSecs, setTimerSecs] = useState(0);
  const [timerTotal, setTimerTotal] = useState(0);
  const [timerState, setTimerState] = useState("idle"); // idle | running | paused | done | finished
  const intervalRef = useRef(null);
  const secsRef = useRef(0);

  const currentStretches = mode === "rapida" ? STRETCHES_QUICK : [...STRETCHES_MAIN, ...STRETCHES_FLEX];
  const pct = Math.round((completedToday.length / currentStretches.length) * 100);
  const allDone = completedToday.length === currentStretches.length;

  function clearTimer() {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }

  function startStretch(idx) {
    clearTimer();
    const s = currentStretches[idx];
    const secs = s.secs || 60;
    secsRef.current = secs;
    setActiveIdx(idx);
    setTimerSecs(secs);
    setTimerTotal(secs);
    setTimerState("running");
    intervalRef.current = setInterval(() => {
      secsRef.current -= 1;
      setTimerSecs(secsRef.current);
      if (secsRef.current <= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        // Mark current as done
        const sid = currentStretches[idx].id;
        setCompletedToday(prev => {
          const next = prev.includes(sid) ? prev : [...prev, sid];
          ss("comp_"+todayStr, next);
          return next;
        });
        // Check if last
        if (idx + 1 >= currentStretches.length) {
          setTimerState("finished");
        } else {
          setTimerState("done");
        }
      }
    }, 1000);
  }

  function pauseResume() {
    if (timerState === "running") {
      clearTimer();
      setTimerState("paused");
    } else if (timerState === "paused") {
      setTimerState("running");
      intervalRef.current = setInterval(() => {
        secsRef.current -= 1;
        setTimerSecs(secsRef.current);
        if (secsRef.current <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          const sid = currentStretches[activeIdx].id;
          setCompletedToday(prev => {
            const next = prev.includes(sid) ? prev : [...prev, sid];
            ss("comp_"+todayStr, next);
            return next;
          });
          if (activeIdx + 1 >= currentStretches.length) {
            setTimerState("finished");
          } else {
            setTimerState("done");
          }
        }
      }, 1000);
    }
  }

  function goNext() {
    if (activeIdx !== null && activeIdx + 1 < currentStretches.length) {
      startStretch(activeIdx + 1);
    }
  }

  function restartCurrent() {
    if (activeIdx !== null) startStretch(activeIdx);
  }

  function selectStretch(idx) {
    startStretch(idx);
    setTab("timer");
  }

  useEffect(() => () => clearTimer(), []);

  // When all done, save day
  useEffect(() => {
    if (completedToday.length === currentStretches.length && !doneDays.includes(todayStr)) {
      const nd = [...doneDays, todayStr];
      setDoneDays(nd);
      ss("done_days", nd);
    }
  }, [completedToday]);

  function markDone(id, e) {
    e.stopPropagation();
    const next = completedToday.includes(id) ? completedToday.filter(x=>x!==id) : [...completedToday, id];
    setCompletedToday(next);
    ss("comp_"+todayStr, next);
  }

  function toggleExpand(id) { setExpanded(p => p===id ? null : id); }

  function saveFlexLevel() {
    if (selectedFlex === null) return;
    const entry = { date: todayStr, level: selectedFlex, label: FLEX_LEVELS[selectedFlex].label };
    let next = [entry, ...flexHistory.filter(x=>x.date!==todayStr)].sort((a,b)=>b.date.localeCompare(a.date));
    setFlexHistory(next); ss("flex_history", next);
  }

  function getStreak() {
    let streak = 0, check = new Date(today);
    for (let i=0;i<365;i++) {
      const ds = check.toISOString().split("T")[0];
      if (doneDays.includes(ds)) { streak++; check.setDate(check.getDate()-1); } else break;
    }
    return streak;
  }

  const streak = getStreak();
  const timerFmt = Math.floor(timerSecs/60)+":"+String(timerSecs%60).padStart(2,"0");
  const timerFill = timerTotal > 0 ? Math.round((timerSecs/timerTotal)*100) : 0;
  const activeStretch = activeIdx !== null ? currentStretches[activeIdx] : null;

  const S = {
    app: { maxWidth:420, margin:"0 auto", padding:"1rem 0.75rem 3rem", fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
    h1: { fontSize:22, fontWeight:500, color:"#1a1a1a", margin:0 },
    sub: { fontSize:13, color:"#888", marginTop:4 },
    tabs: { display:"flex", gap:4, background:"#ece9e2", borderRadius:8, padding:3, marginBottom:"1.25rem" },
    tab: (a) => ({ flex:1, textAlign:"center", padding:"7px 0", fontSize:12, borderRadius:6, cursor:"pointer", color:a?"#1a1a1a":"#888", border:a?"0.5px solid #d0cdc4":"none", background:a?"#fff":"transparent", fontWeight:a?500:400 }),
    card: { background:"#fff", border:"0.5px solid #e0ddd6", borderRadius:12, padding:"0.875rem 1rem", marginBottom:"0.75rem" },
    modeBtn: (a) => ({ flex:1, padding:"6px 8px", borderRadius:20, border:a?"0.5px solid #9FE1CB":"0.5px solid #e0ddd6", background:a?"#E1F5EE":"transparent", fontSize:12, cursor:"pointer", color:a?"#0F6E56":"#888", textAlign:"center" }),
    progBar: { width:"100%", height:6, background:"#ece9e2", borderRadius:3, overflow:"hidden" },
    progFill: (p) => ({ height:"100%", background:"#1D9E75", borderRadius:3, width:p+"%", transition:"width 0.3s" }),
    sTag: { display:"flex", alignItems:"center", gap:8, margin:"1rem 0 0.5rem" },
    tagLine: { flex:1, height:"0.5px", background:"#e0ddd6" },
    tagBadge: (f) => ({ fontSize:11, padding:"2px 8px", borderRadius:20, fontWeight:500, background:f?"#FAEEDA":"#E1F5EE", color:f?"#854F0B":"#0F6E56" }),
    item: (f, done) => ({ background:"#fff", border:"0.5px solid #e0ddd6", borderLeft:f?"2px solid #FAC775":"0.5px solid #e0ddd6", borderRadius:f?"0 12px 12px 0":12, overflow:"hidden", cursor:"pointer", opacity:done?0.6:1, marginBottom:6 }),
    num: (f, done) => ({ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:500, flexShrink:0, background:done?(f?"#FAEEDA":"#E1F5EE"):"#f5f5f0", border:done?(f?"0.5px solid #FAC775":"0.5px solid #9FE1CB"):"0.5px solid #e0ddd6", color:done?(f?"#854F0B":"#0F6E56"):"#888" }),
    markBtn: (f, done) => ({ width:"100%", padding:8, borderRadius:8, fontSize:13, cursor:"pointer", marginTop:"0.5rem", border:done?"0.5px solid #e0ddd6":(f?"0.5px solid #FAC775":"0.5px solid #9FE1CB"), background:done?"#f5f5f0":(f?"#FAEEDA":"#E1F5EE"), color:done?"#aaa":(f?"#854F0B":"#0F6E56") }),
    startBtn: (f) => ({ padding:"5px 10px", borderRadius:20, border:f?"0.5px solid #FAC775":"0.5px solid #9FE1CB", background:f?"#FAEEDA":"#E1F5EE", fontSize:12, cursor:"pointer", color:f?"#854F0B":"#0F6E56", marginLeft:8, whiteSpace:"nowrap" }),
    timerCard: { background:"#fff", border:"0.5px solid #e0ddd6", borderRadius:12, padding:"1.25rem", marginBottom:"0.75rem" },
    btnGreen: { flex:2, padding:12, borderRadius:8, border:"none", background:"#1D9E75", color:"white", fontSize:15, fontWeight:500, cursor:"pointer" },
    btnOrange: { flex:2, padding:12, borderRadius:8, border:"none", background:"#BA7517", color:"white", fontSize:15, fontWeight:500, cursor:"pointer" },
    btnGray: { flex:1, padding:12, borderRadius:8, border:"0.5px solid #e0ddd6", background:"transparent", color:"#888", fontSize:13, cursor:"pointer" },
    flexOpt: (s) => ({ padding:"5px 10px", borderRadius:20, border:s?"0.5px solid #FAC775":"0.5px solid #e0ddd6", background:s?"#FAEEDA":"transparent", fontSize:12, cursor:"pointer", color:s?"#854F0B":"#888" }),
    sTitle: { fontSize:12, color:"#bbb", textTransform:"uppercase", letterSpacing:"0.05em", margin:"1rem 0 0.5rem" },
  };

  function renderItem(s, idx) {
    const done = completedToday.includes(s.id);
    const exp = expanded === s.id;
    return (
      <div key={s.id} style={S.item(s.flex, done)} onClick={() => toggleExpand(s.id)}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0.75rem 1rem" }}>
          <div style={S.num(s.flex, done)}>{done ? "✓" : s.id}</div>
          <div style={{ flex:1, fontSize:14, fontWeight:500, color:"#1a1a1a" }}>{s.title}</div>
          <button style={S.startBtn(s.flex)} onClick={(e) => { e.stopPropagation(); selectStretch(idx); }}>▶ Iniciar</button>
          <div style={{ fontSize:12, color:"#aaa" }}>{s.dur}</div>
        </div>
        {exp && (
          <div style={{ padding:"0 1rem 0.875rem 2.75rem" }}>
            <p style={{ fontSize:13, color:"#666", lineHeight:1.6 }}>{s.desc}</p>
            <ul style={{ marginTop:"0.5rem", listStyle:"none" }}>
              {s.steps.map((st,i) => (
                <li key={i} style={{ fontSize:13, color:"#666", padding:"2px 0 2px 14px", position:"relative", lineHeight:1.5 }}>
                  <span style={{ position:"absolute", left:0, color:s.flex?"#BA7517":"#1D9E75", fontWeight:700 }}>·</span>{st}
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

  const mainItems = currentStretches.map((s,i) => ({s,i})).filter(({s}) => !s.flex);
  const flexItems = currentStretches.map((s,i) => ({s,i})).filter(({s}) => s.flex);

  return (
    <div style={S.app}>
      <div style={{ textAlign:"center", padding:"1.25rem 0 1rem" }}>
        <h1 style={S.h1}>Buenos días</h1>
        <p style={S.sub}>{fmtDate(today)}</p>
      </div>

      <div style={S.tabs}>
        {["hoy","timer","flexibilidad","progreso"].map(t => (
          <button key={t} style={S.tab(tab===t)} onClick={() => setTab(t)}>
            {t === "hoy" ? "Hoy" : t === "timer" ? "Timer" : t === "flexibilidad" ? "Flex." : "Progreso"}
          </button>
        ))}
      </div>

      {/* TAB HOY */}
      {tab === "hoy" && (
        <>
          <div style={{ display:"flex", gap:6, marginBottom:"0.75rem" }}>
            <button style={S.modeBtn(mode==="completa")} onClick={() => setMode("completa")}>Completa · 13 min</button>
            <button style={S.modeBtn(mode==="rapida")} onClick={() => setMode("rapida")}>Rápida · 5 min</button>
          </div>
          <div style={{ ...S.card, marginBottom:"0.75rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:13, color:"#888" }}>Progreso de hoy</span>
              <span style={{ fontSize:13, fontWeight:500, color:"#1D9E75" }}>{pct}%</span>
            </div>
            <div style={S.progBar}><div style={S.progFill(pct)} /></div>
          </div>
          {allDone && (
            <div style={{ background:"#1D9E75", borderRadius:12, padding:"1.25rem", textAlign:"center", color:"white", marginBottom:"0.75rem" }}>
              <h2 style={{ fontSize:18, fontWeight:500, marginBottom:4 }}>¡Rutina completada!</h2>
              <p style={{ fontSize:13, opacity:0.85 }}>Excelente inicio de día. Tu cuerpo te lo agradecerá.</p>
            </div>
          )}
          {mode === "completa" ? (
            <>
              <div style={S.sTag}><div style={S.tagLine}/><span style={S.tagBadge(false)}>Rutina matutina</span><div style={S.tagLine}/></div>
              {mainItems.map(({s,i}) => renderItem(s,i))}
              <div style={S.sTag}><div style={S.tagLine}/><span style={S.tagBadge(true)}>Objetivo: tocarme los pies</span><div style={S.tagLine}/></div>
              {flexItems.map(({s,i}) => renderItem(s,i))}
            </>
          ) : (
            <>
              <div style={S.sTag}><div style={S.tagLine}/><span style={S.tagBadge(false)}>Versión rápida</span><div style={S.tagLine}/></div>
              {currentStretches.map((s,i) => renderItem(s,i))}
            </>
          )}
          <p style={{ fontSize:13, color:"#aaa", textAlign:"center", fontStyle:"italic", padding:"0.5rem 0" }}>
            {MOTIVATIONS[getDOY() % MOTIVATIONS.length]}
          </p>
        </>
      )}

      {/* TAB TIMER */}
      {tab === "timer" && (
        <>
          {/* Timer principal */}
          <div style={S.timerCard}>
            {activeStretch ? (
              <>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:12, padding:"2px 8px", borderRadius:20, background:activeStretch.flex?"#FAEEDA":"#E1F5EE", color:activeStretch.flex?"#854F0B":"#0F6E56", fontSize:11 }}>
                    {activeIdx+1} / {currentStretches.length}
                  </span>
                  <span style={{ fontSize:13, fontWeight:500, color:"#1a1a1a" }}>{activeStretch.title}</span>
                </div>
                <p style={{ fontSize:12, color:"#888", marginBottom:"1rem", lineHeight:1.5 }}>{activeStretch.desc}</p>
              </>
            ) : (
              <p style={{ fontSize:13, color:"#aaa", marginBottom:"1rem" }}>Selecciona un estiramiento abajo para empezar</p>
            )}

            {/* Display tiempo */}
            <div style={{ textAlign:"center", margin:"0.5rem 0 1rem" }}>
              {timerState === "finished" ? (
                <div>
                  <div style={{ fontSize:42, fontWeight:500, color:"#1D9E75" }}>¡Listo!</div>
                  <p style={{ fontSize:13, color:"#888", marginTop:4 }}>Rutina completada 🎉</p>
                </div>
              ) : (
                <>
                  <div style={{ fontSize:56, fontWeight:500, color: timerSecs <= 5 && timerState==="running" ? "#E24B4A" : "#1a1a1a", fontVariantNumeric:"tabular-nums", lineHeight:1, transition:"color 0.3s" }}>
                    {timerState === "idle" ? (activeStretch ? (Math.floor(activeStretch.secs/60)+":"+String(activeStretch.secs%60).padStart(2,"0")) : "—") : timerFmt}
                  </div>
                  <div style={{ fontSize:12, color:"#aaa", marginTop:4 }}>
                    {timerState==="idle"?"listo para empezar":timerState==="running"?"en curso...":timerState==="paused"?"en pausa":"¡completado!"}
                  </div>
                </>
              )}
            </div>

            {/* Barra de progreso */}
            {timerState !== "idle" && timerState !== "finished" && (
              <div style={{ width:"100%", height:4, background:"#f0ede6", borderRadius:2, marginBottom:"1rem", overflow:"hidden" }}>
                <div style={{ height:"100%", background:activeStretch?.flex?"#BA7517":"#1D9E75", borderRadius:2, width:timerFill+"%", transition:"width 0.9s linear" }} />
              </div>
            )}

            {/* Botones */}
            {timerState === "finished" ? (
              <button style={{ ...S.btnGreen, flex:"none", width:"100%" }} onClick={() => { setActiveIdx(null); setTimerState("idle"); }}>
                Volver al inicio
              </button>
            ) : timerState === "done" ? (
              <div style={{ display:"flex", gap:8 }}>
                <button style={S.btnGreen} onClick={goNext}>Siguiente →</button>
                <button style={S.btnGray} onClick={restartCurrent}>Repetir</button>
              </div>
            ) : (
              <div style={{ display:"flex", gap:8 }}>
                <button
                  style={activeStretch?.flex ? S.btnOrange : S.btnGreen}
                  onClick={activeStretch ? pauseResume : undefined}
                  disabled={!activeStretch}
                >
                  {timerState==="running" ? "⏸ Pausar" : timerState==="paused" ? "▶ Continuar" : "▶ Iniciar"}
                </button>
                <button style={S.btnGray} onClick={restartCurrent} disabled={!activeStretch}>↺</button>
              </div>
            )}
          </div>

          {/* Lista de estiramientos */}
          <p style={S.sTitle}>Estiramientos</p>
          {currentStretches.map((s,i) => {
            const done = completedToday.includes(s.id);
            const isActive = activeIdx === i;
            return (
              <div key={s.id} onClick={() => selectStretch(i)} style={{ ...S.item(s.flex, done), border: isActive ? (s.flex?"1.5px solid #BA7517":"1.5px solid #1D9E75") : (s.flex?"0.5px solid #e0ddd6":"0.5px solid #e0ddd6"), borderLeft:s.flex?"2px solid #FAC775":"0.5px solid #e0ddd6" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0.75rem 1rem" }}>
                  <div style={S.num(s.flex, done)}>{done?"✓":s.id}</div>
                  <div style={{ flex:1, fontSize:14, fontWeight:500, color:"#1a1a1a" }}>{s.title}</div>
                  {isActive && <span style={{ fontSize:11, color:s.flex?"#854F0B":"#0F6E56", fontWeight:500 }}>▶ activo</span>}
                  <div style={{ fontSize:12, color:"#aaa" }}>{s.dur}</div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* TAB FLEXIBILIDAD */}
      {tab === "flexibilidad" && (
        <>
          <div style={S.card}>
            <p style={{ fontSize:14, fontWeight:500, color:"#1a1a1a", marginBottom:"0.75rem" }}>¿Hasta dónde llegas hoy?</p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:"1rem" }}>
              {FLEX_LEVELS.map((l,i) => (
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
                    {["Rodillas","Media tibia","Tobillos","Pies"].map(l => <span key={l} style={{ fontSize:10, color:"#aaa" }}>{l}</span>)}
                  </div>
                </div>
                <div style={{ textAlign:"center", margin:"0.75rem 0 0.5rem" }}>
                  <strong style={{ fontSize:20, fontWeight:500, color:"#BA7517" }}>{FLEX_LEVELS[selectedFlex].label}</strong>
                  <p style={{ fontSize:12, color:"#888", marginTop:2 }}>{FLEX_LEVELS[selectedFlex].tip}</p>
                </div>
              </>
            )}
            <button style={{ ...S.btnGreen, flex:"none", width:"100%", marginTop:"0.5rem", padding:10 }} onClick={saveFlexLevel}>Guardar medición</button>
          </div>
          <p style={S.sTitle}>Historial de progreso</p>
          <div style={S.card}>
            {flexHistory.length === 0 ? (
              <p style={{ fontSize:13, color:"#aaa", textAlign:"center", padding:"1rem 0" }}>Sin registros todavía</p>
            ) : flexHistory.slice(0,8).map((e,i) => {
              const prev = flexHistory[i+1];
              const improved = prev && e.level > prev.level;
              const d = new Date(e.date).toLocaleDateString("es-ES",{day:"numeric",month:"short"});
              return (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:i<Math.min(flexHistory.length,8)-1?"0.5px solid #e0ddd6":"none" }}>
                  <span style={{ fontSize:12, color:"#888" }}>{d}</span>
                  {improved && <span style={{ fontSize:11, color:"#1D9E75" }}>↑ mejora</span>}
                  <span style={{ fontSize:12, fontWeight:500, color:"#854F0B" }}>{e.label}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* TAB PROGRESO */}
      {tab === "progreso" && (
        <>
          <div style={{ background:"#E1F5EE", border:"0.5px solid #9FE1CB", borderRadius:12, padding:"0.875rem 1rem", display:"flex", alignItems:"center", gap:12, marginBottom:"0.75rem" }}>
            <div style={{ fontSize:32, fontWeight:500, color:"#0F6E56", lineHeight:1 }}>{streak}</div>
            <div>
              <p style={{ fontSize:14, fontWeight:500, color:"#0F6E56" }}>días seguidos</p>
              <p style={{ fontSize:12, color:"#0F6E56", marginTop:2, opacity:0.8 }}>{streak===0?"Empieza hoy tu racha":streak===1?"¡Primer día completado!":"¡Sigue así!"}</p>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:8, marginBottom:"0.75rem" }}>
            {[
              [doneDays.length, "sesiones totales"],
              [doneDays.filter(d=>new Date(d)>=new Date(today).setDate(today.getDate()-today.getDay()) && new Date(d)).length, "esta semana"],
              [doneDays.filter(d=>new Date(d)>=new Date(today.getFullYear(),today.getMonth(),1)).length, "este mes"]
            ].map(([v,l]) => (
              <div key={l} style={{ background:"#f5f5f0", borderRadius:8, padding:"0.75rem", textAlign:"center" }}>
                <div style={{ fontSize:18, fontWeight:500, color:"#1a1a1a" }}>{v}</div>
                <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
          <p style={S.sTitle}>Este mes</p>
          <div style={S.card}>
            {(() => {
              const y=today.getFullYear(), mo=today.getMonth();
              const fd=new Date(y,mo,1).getDay(), dim=new Date(y,mo+1,0).getDate();
              const off=fd===0?6:fd-1;
              const cells=[];
              for(let i=0;i<off;i++) cells.push(<div key={"e"+i}/>);
              for(let d=1;d<=dim;d++){
                const ds=`${y}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                const isT=ds===todayStr, isDone=doneDays.includes(ds);
                cells.push(<div key={d} style={{ aspectRatio:1, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, background:isDone?"#1D9E75":isT?"#E1F5EE":"transparent", color:isDone?"white":isT?"#0F6E56":"#aaa", border:isT&&!isDone?"0.5px solid #9FE1CB":"none", fontWeight:isT?500:400 }}>{d}</div>);
              }
              return <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>{cells}</div>;
            })()}
          </div>
        </>
      )}
    </div>
  );
}
