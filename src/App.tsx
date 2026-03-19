import { useState, useRef } from "react";

// ─── CONSTANTES ──────────────────────────────────────────────────────────────
const CUOTA_MENSUAL = 5000;
const CAJA_CHICA    = 10000;
const TOTAL_ANUAL   = CAJA_CHICA + CUOTA_MENSUAL * 10;
const CUOTA_ORDER   = ["cuota_mar","cuota_abr","cuota_may","cuota_jun","cuota_jul","cuota_ago","cuota_sep","cuota_oct","cuota_nov","cuota_dic"];
const CUOTA_MES     = {cuota_mar:2,cuota_abr:3,cuota_may:4,cuota_jun:5,cuota_jul:6,cuota_ago:7,cuota_sep:8,cuota_oct:9,cuota_nov:10,cuota_dic:11};
const MESES_ES      = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const CATEGORIAS    = ["Celebraciones","Materiales","Eventos","Premios","Otros"];

const TIPOS = [
  {id:"caja_chica",label:"Caja chica (una vez) - $10.000",monto:10000,nota:"Caja chica"},
  {id:"cuota_mar", label:"Cuota marzo - $5.000",          monto:5000, nota:"Cuota marzo"},
  {id:"cuota_abr", label:"Cuota abril - $5.000",          monto:5000, nota:"Cuota abril"},
  {id:"cuota_may", label:"Cuota mayo - $5.000",           monto:5000, nota:"Cuota mayo"},
  {id:"cuota_jun", label:"Cuota junio - $5.000",          monto:5000, nota:"Cuota junio"},
  {id:"cuota_jul", label:"Cuota julio - $5.000",          monto:5000, nota:"Cuota julio"},
  {id:"cuota_ago", label:"Cuota agosto - $5.000",         monto:5000, nota:"Cuota agosto"},
  {id:"cuota_sep", label:"Cuota septiembre - $5.000",     monto:5000, nota:"Cuota septiembre"},
  {id:"cuota_oct", label:"Cuota octubre - $5.000",        monto:5000, nota:"Cuota octubre"},
  {id:"cuota_nov", label:"Cuota noviembre - $5.000",      monto:5000, nota:"Cuota noviembre"},
  {id:"cuota_dic", label:"Cuota diciembre - $5.000",      monto:5000, nota:"Cuota diciembre"},
  {id:"otro",      label:"Otro (monto libre)",             monto:"",  nota:""},
];

// ─── CURSOS DEMO (estado inicial) ─────────────────────────────────────────────
// Cada curso tiene: id, nombre, codigoCurso, adminPw, alumnos, aportes, gastos,
//                   claves, notifs, reservas, deudas
const CURSO_DEMO = {
  id: "ciap4b",
  nombre: "Tesoreria 4to Basico",
  codigoCurso: "CIAP2026",
  adminPw: "tesorero2026",
  alumnos: [
    {id:1,  nombre:"Acevedo Mesina Maximo Alejandro",      apoderado:""},
    {id:2,  nombre:"Aguilar Manzo Blanca Antonia",          apoderado:""},
    {id:3,  nombre:"Aguirre Quinones Alfonso Mariano",      apoderado:""},
    {id:4,  nombre:"Alvarado Munoz Julieta Esperanza",      apoderado:""},
    {id:5,  nombre:"Aranda Vasquez Valentina Paz",          apoderado:""},
    {id:6,  nombre:"Araneda Jorquera Dante Eloy",           apoderado:""},
    {id:7,  nombre:"Arenas Mora Emilia Antonia",            apoderado:""},
    {id:8,  nombre:"Barrera Arce Josefa Antonia",           apoderado:""},
    {id:9,  nombre:"Bravo Valderrama Santiago Nicolas",     apoderado:""},
    {id:10, nombre:"Campos Berrera Mateo Ignacio",          apoderado:""},
    {id:11, nombre:"Candia Vidal Militza Constanza",        apoderado:""},
    {id:12, nombre:"Carrasco Zuniga Emilio Javier",         apoderado:""},
    {id:13, nombre:"Castro Gonzalez Matilde Lucia",         apoderado:""},
    {id:14, nombre:"Cortes Opazo Joaquin Alonso",           apoderado:""},
    {id:15, nombre:"Espinoza Balduzzi Josefina Andrea",     apoderado:""},
    {id:16, nombre:"Fuentes Gutierrez Cristobal Ignacio",   apoderado:""},
    {id:17, nombre:"Gomez Urriola Europa Valentina",        apoderado:""},
    {id:18, nombre:"Gonzalez Serrano Macarena del Rosario", apoderado:""},
    {id:19, nombre:"Herrera Vinet Fernanda Andrea",         apoderado:""},
    {id:20, nombre:"Huaiquivil Araya Agustina Amparo",      apoderado:""},
    {id:21, nombre:"Jara Vinet Javiera Ignacia",            apoderado:""},
    {id:22, nombre:"Navarro Aviles Gaspar Alonso",          apoderado:""},
    {id:23, nombre:"Rivas Millares Benjamin Ignacio",       apoderado:""},
    {id:24, nombre:"Rodriguez Hernandez Mateo Alonso",      apoderado:""},
    {id:25, nombre:"Sartori San Martin Amelia Trinidad",    apoderado:""},
    {id:26, nombre:"Sartori San Martin Pedro Ignacio",      apoderado:""},
    {id:27, nombre:"Silva Zambrano Rafaella Victoria",      apoderado:""},
    {id:28, nombre:"Tapia Rodriguez Mateo Mauricio",        apoderado:""},
    {id:29, nombre:"Velasquez Diaz Isidora Josefina",       apoderado:""},
    {id:30, nombre:"Vergara Molina Esperanza Antonia",      apoderado:""},
  ],
  aportes:  [],
  gastos:   [],
  claves:   {},
  notifs:   [],
  reservas: [],
  deudas:   [],
};

// ─── UTILIDADES ──────────────────────────────────────────────────────────────
const pesos   = (n) => "$" + Number(n).toLocaleString("es-CL");
const fFecha  = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("es-CL", {day:"numeric",month:"short",year:"numeric"}) : "";
const fDT     = (iso) => iso ? new Date(iso).toLocaleDateString("es-CL", {day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}) : "";
const limpiar = (s) => (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const hoy     = () => new Date().toISOString().split("T")[0];
const genId   = () => Date.now() + Math.random();

// ─── LOGICA FINANCIERA ────────────────────────────────────────────────────────
function estaLiberada(tipoId, now) {
  if (!CUOTA_MES[tipoId]) return true;
  return now.getMonth() >= CUOTA_MES[tipoId];
}
function calcLiberado(sid, aportes, reservas, now) {
  const deA = aportes.filter(a=>a.sid===sid).reduce((s,a)=>s+(estaLiberada(a.tipoId,now)?a.monto:0),0);
  const r = reservas.find(r=>r.sid===sid);
  if (!r) return deA;
  let lib = CAJA_CHICA;
  for (const m of Object.values(CUOTA_MES)) { if (now.getMonth()>=m) lib+=CUOTA_MENSUAL; }
  return deA + Math.min(lib, TOTAL_ANUAL);
}
function calcAnticipo(sid, aportes, reservas, now) {
  const deA = aportes.filter(a=>a.sid===sid).reduce((s,a)=>s+(!estaLiberada(a.tipoId,now)?a.monto:0),0);
  const r = reservas.find(r=>r.sid===sid);
  if (!r) return deA;
  return deA + Math.max(0, TOTAL_ANUAL - calcLiberado(sid,[],reservas,now));
}
function calcPagadoBruto(sid, aportes, reservas) {
  return aportes.filter(a=>a.sid===sid).reduce((s,a)=>s+a.monto,0) + (reservas.some(r=>r.sid===sid)?TOTAL_ANUAL:0);
}
function cuotasPagas(sid, aportes, reservas) {
  const s = new Set(aportes.filter(a=>a.sid===sid).map(a=>a.tipoId));
  if (reservas.some(r=>r.sid===sid)) { CUOTA_ORDER.forEach(c=>s.add(c)); s.add("caja_chica"); }
  return s;
}
function proxCuota(sid, aportes, reservas) {
  const p = cuotasPagas(sid,aportes,reservas);
  return CUOTA_ORDER.find(c=>!p.has(c))||null;
}
function razonBloqueo(tipoId, sid, aportes, reservas) {
  if (!CUOTA_ORDER.includes(tipoId)) return null;
  const p = cuotasPagas(sid,aportes,reservas);
  if (p.has(tipoId)) return "Esta cuota ya fue registrada.";
  const pr = proxCuota(sid,aportes,reservas);
  if (!pr) return "Este alumno ya tiene todas las cuotas pagadas.";
  if (tipoId!==pr) { const idx=CUOTA_ORDER.indexOf(tipoId); const prev=idx>0?TIPOS.find(t=>t.id===CUOTA_ORDER[idx-1]):null; return "Primero debe pagarse "+(prev?prev.nota:"la cuota anterior")+"."; }
  return null;
}

// ─── ESTILOS ─────────────────────────────────────────────────────────────────
const C = {gold:"#d4af64",green:"#6fcf97",red:"#eb5757",blue:"#7eb8f7",yellow:"#f2c94c",bg:"#0f1117",card:"#1a1f2e",muted:"rgba(232,226,213,.4)",text:"#e8e2d5"};
const S = {
  app:  {minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',sans-serif"},
  hdr:  {background:"linear-gradient(135deg,#1a1f2e,#141820)",borderBottom:"1px solid rgba(212,175,100,.2)",padding:"0 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,position:"sticky",top:0,zIndex:100,gap:"1rem"},
  main: {padding:"1.5rem",maxWidth:960,margin:"0 auto"},
  card: {background:C.card,border:"1px solid rgba(255,255,255,.07)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1rem"},
  grid: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(165px,1fr))",gap:"1rem",marginBottom:"1.5rem"},
  inp:  {width:"100%",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,padding:".6rem .85rem",color:C.text,fontFamily:"inherit",fontSize:".88rem",outline:"none"},
  lbl:  {display:"block",fontSize:".72rem",color:C.muted,marginBottom:".35rem",textTransform:"uppercase",letterSpacing:".06em"},
  fgrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:".85rem",marginBottom:".85rem"},
  tbl:  {width:"100%",borderCollapse:"collapse"},
  th:   {textAlign:"left",padding:".6rem 1rem",fontSize:".7rem",textTransform:"uppercase",letterSpacing:".07em",color:"rgba(212,175,100,.7)",background:"rgba(212,175,100,.07)",fontWeight:500},
  td:   {padding:".75rem 1rem",fontSize:".86rem",borderTop:"1px solid rgba(255,255,255,.04)",color:C.text},
  div:  {height:1,background:"rgba(255,255,255,.07)",margin:"1rem 0"},
  row:  {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".5rem",fontSize:".88rem"},
  sec:  {fontFamily:"Georgia,serif",fontSize:"1.1rem",color:C.text,marginBottom:"1rem",display:"flex",alignItems:"center",justifyContent:"space-between"},
};

// ─── COMPONENTES BASE ─────────────────────────────────────────────────────────
function Btn({onClick,children,color="gold",full=false,sm=false,disabled=false}) {
  const bg={gold:{background:C.gold,color:"#0f1117",border:"none"},ghost:{background:"transparent",color:"rgba(232,226,213,.7)",border:"1px solid rgba(255,255,255,.12)"},green:{background:"rgba(111,207,151,.12)",color:C.green,border:"1px solid rgba(111,207,151,.3)"},red:{background:"rgba(235,87,87,.15)",color:C.red,border:"1px solid rgba(235,87,87,.3)"},yellow:{background:"rgba(242,201,76,.15)",color:C.yellow,border:"1px solid rgba(242,201,76,.3)"},solidg:{background:C.green,color:"#0f1117",border:"none"}};
  return <button onClick={disabled?undefined:onClick} style={{...bg[color],padding:sm?"3px 10px":".6rem 1.2rem",borderRadius:8,cursor:disabled?"not-allowed":"pointer",fontSize:sm?".75rem":".86rem",fontFamily:"inherit",fontWeight:600,display:"inline-flex",alignItems:"center",gap:".4rem",width:full?"100%":undefined,justifyContent:full?"center":undefined,opacity:disabled?.4:1,transition:"all .2s"}}>{children}</button>;
}
function Campo({label,children}) { return <div><label style={S.lbl}>{label}</label>{children}</div>; }
function StatCard({label,value,sub,color="gold"}) {
  const vc={gold:C.gold,green:C.green,red:C.red,blue:C.blue,yellow:C.yellow}[color];
  return <div style={{...S.card,marginBottom:0,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,"+vc+",transparent)"}}/><div style={{fontSize:".72rem",color:C.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:".4rem"}}>{label}</div><div style={{fontFamily:"Georgia,serif",fontSize:"1.8rem",color:vc,lineHeight:1,marginBottom:".25rem"}}>{value}</div>{sub&&<div style={{fontSize:".75rem",color:C.muted}}>{sub}</div>}</div>;
}
function ProgBar({pct,color="gold"}) {
  return <div style={{background:"rgba(255,255,255,.06)",borderRadius:99,height:6,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,width:Math.min(100,pct)+"%",background:color==="blue"?C.blue:C.gold,transition:"width .5s"}}/></div>;
}
function Badge({type,children}) {
  const st={paid:{background:"rgba(111,207,151,.12)",color:C.green,border:"1px solid rgba(111,207,151,.25)"},pending:{background:"rgba(235,87,87,.1)",color:C.red,border:"1px solid rgba(235,87,87,.2)"},waiting:{background:"rgba(242,201,76,.12)",color:C.yellow,border:"1px solid rgba(242,201,76,.25)"},annual:{background:"rgba(126,184,247,.12)",color:C.blue,border:"1px solid rgba(126,184,247,.25)"},anticipo:{background:"rgba(126,184,247,.1)",color:C.blue,border:"1px solid rgba(126,184,247,.2)"}};
  return <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 9px",borderRadius:20,fontSize:".7rem",fontWeight:600,...st[type]}}>{children}</span>;
}
function NavTabs({tabs,active,onChange}) {
  return <div style={{display:"flex",gap:".2rem",background:C.card,borderBottom:"1px solid rgba(255,255,255,.06)",padding:"0 1.5rem",overflowX:"auto"}}>{tabs.map(t=><button key={t.id} onClick={()=>onChange(t.id)} style={{padding:".65rem 1rem",border:"none",background:"transparent",color:active===t.id?C.gold:"rgba(232,226,213,.5)",cursor:"pointer",fontFamily:"inherit",fontSize:".82rem",borderBottom:active===t.id?"2px solid "+C.gold:"2px solid transparent",whiteSpace:"nowrap",transition:"all .2s"}}>{t.label}</button>)}</div>;
}
function PillTabs({tabs,active,onChange}) {
  return <div style={{display:"flex",gap:".4rem",background:C.card,borderBottom:"1px solid rgba(255,255,255,.06)",padding:".6rem 1.5rem",overflowX:"auto"}}>{tabs.map(t=><button key={t.id} onClick={()=>onChange(t.id)} style={{padding:".3rem .85rem",borderRadius:20,border:active===t.id?"1px solid rgba(212,175,100,.4)":"1px solid rgba(255,255,255,.1)",background:active===t.id?"rgba(212,175,100,.12)":"transparent",color:active===t.id?C.gold:"rgba(232,226,213,.5)",cursor:"pointer",fontFamily:"inherit",fontSize:".8rem",transition:"all .2s",whiteSpace:"nowrap"}}>{t.label}</button>)}</div>;
}
function Alerta({msg,ok=false}) {
  if (!msg) return null;
  return <div style={{background:ok?"rgba(111,207,151,.1)":"rgba(235,87,87,.1)",border:"1px solid "+(ok?"rgba(111,207,151,.25)":"rgba(235,87,87,.25)"),color:ok?C.green:C.red,padding:".6rem .9rem",borderRadius:8,fontSize:".82rem",marginBottom:".75rem"}}>{msg}</div>;
}
function CajaResumen({liberado,anticipo,gasto}) {
  const saldo=liberado-gasto;
  return <div style={{background:"linear-gradient(135deg,#1a1f2e,#141c2a)",border:"1px solid rgba(212,175,100,.15)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.5rem"}}><div style={{fontFamily:"Georgia,serif",fontSize:"1rem",color:C.text,marginBottom:"1rem"}}>Estado financiero</div><div style={S.row}><span style={{color:C.muted}}>Total liberado en caja</span><span style={{color:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(liberado)}</span></div>{anticipo>0&&<div style={S.row}><span style={{color:C.muted}}>En anticipo / reserva</span><span style={{color:C.blue,fontVariantNumeric:"tabular-nums"}}>{pesos(anticipo)}</span></div>}<div style={S.row}><span style={{color:C.muted}}>Total gastos</span><span style={{color:C.red,fontVariantNumeric:"tabular-nums"}}>- {pesos(gasto)}</span></div><div style={S.div}/><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:600}}>Saldo disponible</span><span style={{fontFamily:"Georgia,serif",fontSize:"1.4rem",color:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(saldo)}</span></div></div>;
}
function DonutChart({pagas,pendientes,total}) {
  const r=68,cx=100,cy=100,circ=2*Math.PI*r;
  const pp=total>0?pagas/total:0,pd=total>0?pendientes/total:0;
  const pDash=pp*circ,pendDash=pd*circ,gap=2,pOff=circ*.25,pendOff=pOff-pDash-gap;
  return <svg viewBox="0 0 200 200" style={{width:"100%",maxWidth:200}}><circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={22}/>{pendientes>0&&<circle cx={cx} cy={cy} r={r} fill="none" stroke={C.red} strokeWidth={22} strokeLinecap="round" strokeDasharray={(Math.max(0,pendDash-gap))+" "+(circ-pendDash+gap)} strokeDashoffset={pendOff}/>}{pagas>0&&<circle cx={cx} cy={cy} r={r} fill="none" stroke={C.green} strokeWidth={22} strokeLinecap="round" strokeDasharray={(Math.max(0,pDash-gap))+" "+(circ-pDash+gap)} strokeDashoffset={pOff}/>}<text x={cx} y={cy-8} textAnchor="middle" fill={C.text} fontSize="26" fontFamily="Georgia,serif" fontWeight="600">{total>0?Math.round(pp*100):0}%</text><text x={cx} y={cy+14} textAnchor="middle" fill={C.muted} fontSize="11" fontFamily="sans-serif">al dia</text></svg>;
}

// ─── PANTALLA 1: CODIGO DEL CURSO ─────────────────────────────────────────────
function PantallaCodigo({cursos, onAcceder, onCrearCurso}) {
  const [codigo, setCodigo] = useState("");
  const [err, setErr] = useState("");

  const intentar = () => {
    const c = codigo.trim().toUpperCase();
    if (!c) { setErr("Ingresa un codigo."); return; }
    const curso = cursos.find(x => x.codigoCurso === c);
    if (!curso) { setErr("Codigo incorrecto. Verifica con el tesorero de tu curso."); return; }
    onAcceder(curso);
  };

  return (
    <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
      <div style={{...S.card,maxWidth:420,width:"100%",textAlign:"center"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:"2rem",color:C.gold,marginBottom:".3rem"}}>Tesoreria Escolar</div>
        <div style={{color:C.muted,fontSize:".85rem",marginBottom:"2rem"}}>Ingresa el codigo de tu curso para continuar</div>

        <Campo label="Codigo del curso">
          <input
            style={{...S.inp,textTransform:"uppercase",letterSpacing:".2em",fontSize:"1.2rem",textAlign:"center"}}
            value={codigo}
            onChange={e=>{setCodigo(e.target.value.toUpperCase());setErr("");}}
            onKeyDown={e=>e.key==="Enter"&&intentar()}
            placeholder="Ej: CIAP2026"
            autoFocus
          />
        </Campo>
        {err && <div style={{color:C.red,fontSize:".8rem",marginTop:".4rem",marginBottom:".4rem"}}>{err}</div>}
        <div style={{marginTop:"1rem",marginBottom:"1.5rem"}}>
          <Btn full onClick={intentar}>Acceder al curso</Btn>
        </div>

        <div style={S.div}/>
        <div style={{fontSize:".82rem",color:C.muted,marginBottom:".75rem"}}>
          ¿Eres tesorero y quieres crear un curso nuevo?
        </div>
        <Btn full color="ghost" onClick={onCrearCurso}>Crear nuevo curso</Btn>
      </div>
    </div>
  );
}

// ─── PANTALLA 2: CREAR CURSO ──────────────────────────────────────────────────
function PantallaCrearCurso({cursos, onCursoCreado, onVolver}) {
  const [form, setForm] = useState({nombre:"", codigo:"", adminPw:"", adminPw2:""});
  const [err, setErr] = useState("");

  const crear = () => {
    if (!form.nombre.trim()) { setErr("Ingresa el nombre del curso."); return; }
    const c = form.codigo.trim().toUpperCase();
    if (c.length < 4) { setErr("El codigo debe tener al menos 4 caracteres."); return; }
    if (cursos.some(x=>x.codigoCurso===c)) { setErr("Ese codigo ya existe. Elige uno diferente."); return; }
    if (form.adminPw.length < 4) { setErr("La contrasena debe tener al menos 4 caracteres."); return; }
    if (form.adminPw !== form.adminPw2) { setErr("Las contraseñas no coinciden."); return; }
    const nuevo = {
      id: genId().toString(),
      nombre: form.nombre.trim(),
      codigoCurso: c,
      adminPw: form.adminPw,
      alumnos:[], aportes:[], gastos:[], claves:{}, notifs:[], reservas:[], deudas:[],
    };
    onCursoCreado(nuevo);
  };

  return (
    <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
      <div style={{...S.card,maxWidth:420,width:"100%"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:"1.4rem",color:C.gold,marginBottom:".3rem",textAlign:"center"}}>Crear nuevo curso</div>
        <div style={{color:C.muted,fontSize:".85rem",marginBottom:"1.5rem",textAlign:"center"}}>Este codigo sera el acceso para todos los miembros del curso</div>

        <div style={{display:"flex",flexDirection:"column",gap:".85rem",marginBottom:"1rem"}}>
          <Campo label="Nombre del curso">
            <input style={S.inp} type="text" value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))} placeholder="Ej: Tesoreria 4to Basico A"/>
          </Campo>
          <Campo label="Codigo del curso (para que ingresen todos)">
            <input style={{...S.inp,textTransform:"uppercase",letterSpacing:".15em",textAlign:"center"}} value={form.codigo} onChange={e=>setForm(f=>({...f,codigo:e.target.value.toUpperCase()}))} placeholder="Ej: CIAP2026"/>
          </Campo>
          <Campo label="Contrasena de administrador">
            <input style={S.inp} type="password" value={form.adminPw} onChange={e=>setForm(f=>({...f,adminPw:e.target.value}))} placeholder="Mínimo 4 caracteres"/>
          </Campo>
          <Campo label="Confirmar contrasena">
            <input style={S.inp} type="password" value={form.adminPw2} onChange={e=>setForm(f=>({...f,adminPw2:e.target.value}))} placeholder="Repite la contrasena"/>
          </Campo>
        </div>

        <Alerta msg={err}/>
        <div style={{display:"flex",flexDirection:"column",gap:".6rem"}}>
          <Btn full onClick={crear}>Crear curso</Btn>
          <Btn full color="ghost" onClick={onVolver}>Volver</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── PANTALLA 3: ROL (admin o apoderado) ──────────────────────────────────────
function PantallaRol({curso, onElegirRol, onVolver}) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const tryAdmin = () => {
    if (pw === curso.adminPw) onElegirRol("admin");
    else setErr(true);
  };

  return (
    <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
      <div style={{...S.card,maxWidth:400,width:"100%",textAlign:"center"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:"1.4rem",color:C.gold,marginBottom:".2rem"}}>{curso.nombre}</div>
        <div style={{background:"rgba(212,175,100,.1)",border:"1px solid rgba(212,175,100,.25)",color:C.gold,display:"inline-block",padding:"2px 12px",borderRadius:20,fontSize:".75rem",fontWeight:700,letterSpacing:".15em",marginBottom:"1.5rem"}}>{curso.codigoCurso}</div>

        <div style={{display:"flex",flexDirection:"column",gap:".75rem",marginBottom:"1.25rem"}}>
          <Btn full onClick={()=>onElegirRol("apoderado")}>Soy apoderado</Btn>
          <Btn full color="ghost" onClick={()=>onElegirRol("publico")}>Ver resumen del curso</Btn>
        </div>

        <div style={S.div}/>
        <div style={{fontSize:".8rem",color:C.muted,marginBottom:".65rem"}}>Acceso administrador</div>
        <Campo label="Contrasena de administrador">
          <input style={S.inp} type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false);}} onKeyDown={e=>e.key==="Enter"&&tryAdmin()} placeholder="Contrasena del tesorero"/>
        </Campo>
        {err && <div style={{color:C.red,fontSize:".8rem",marginTop:".4rem"}}>Contrasena incorrecta.</div>}
        <div style={{marginTop:".85rem",marginBottom:"1.25rem"}}>
          <Btn full onClick={tryAdmin}>Ingresar como administrador</Btn>
        </div>

        <Btn full color="ghost" onClick={onVolver}>Cambiar codigo de curso</Btn>
      </div>
    </div>
  );
}

// ─── LOGIN APODERADO ──────────────────────────────────────────────────────────
function LoginApoderado({curso, setCurso, onLogin, onVolver}) {
  const [busca, setBusca] = useState("");
  const [sel, setSel] = useState(null);
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const esNuevo = sel && !curso.claves[sel.id];
  const filtrados = busca.length>1 ? curso.alumnos.filter(a=>limpiar(a.nombre).includes(limpiar(busca))).slice(0,8) : [];

  const elegir = (a) => { setSel(a); setBusca(a.nombre); setErr(""); setPw(""); setPw2(""); };

  const ingresar = () => {
    if (esNuevo) {
      if (pw.length<4) { setErr("Mínimo 4 caracteres."); return; }
      if (pw!==pw2)    { setErr("Las contraseñas no coinciden."); return; }
      setCurso(c=>({...c, claves:{...c.claves, [sel.id]:pw}}));
      onLogin(sel);
    } else {
      if (curso.claves[sel.id]===pw) onLogin(sel);
      else setErr("Contrasena incorrecta.");
    }
  };

  return (
    <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
      <div style={{...S.card,maxWidth:400,width:"100%"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:"1.3rem",color:C.gold,marginBottom:".25rem",textAlign:"center"}}>Portal Apoderado</div>
        <div style={{color:C.muted,fontSize:".85rem",marginBottom:"1.5rem",textAlign:"center"}}>{curso.nombre}</div>

        {!sel ? (
          <div>
            <div style={{fontSize:".82rem",color:C.muted,marginBottom:".65rem"}}>Busca el nombre de tu hijo o hija:</div>
            <div style={{position:"relative",marginBottom:".5rem"}}>
              <input style={{...S.inp,paddingLeft:"2.3rem"}} autoFocus placeholder="Escribe el nombre del alumno..." value={busca} onChange={e=>{setBusca(e.target.value);setSel(null);}}/>
              <span style={{position:"absolute",left:".85rem",top:"50%",transform:"translateY(-50%)",color:C.muted}}>&#128269;</span>
            </div>
            {filtrados.length>0 && (
              <div style={{background:"#1e2535",border:"1px solid rgba(212,175,100,.2)",borderRadius:10,maxHeight:200,overflowY:"auto"}}>
                {filtrados.map(a=><div key={a.id} onClick={()=>elegir(a)} style={{padding:".65rem 1rem",cursor:"pointer",fontSize:".88rem",borderBottom:"1px solid rgba(255,255,255,.04)"}}>{a.nombre}</div>)}
              </div>
            )}
            {busca.length>1&&filtrados.length===0&&<div style={{fontSize:".8rem",color:"rgba(232,226,213,.35)",marginTop:".4rem"}}>Sin resultados.</div>}
          </div>
        ) : (
          <div>
            <div style={{background:"rgba(126,184,247,.08)",border:"1px solid rgba(126,184,247,.2)",borderRadius:10,padding:".7rem 1rem",marginBottom:"1rem"}}>
              <div style={{fontSize:".68rem",color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:".2rem"}}>Alumno/a seleccionado</div>
              <div style={{color:C.blue,fontWeight:500}}>{sel.nombre}</div>
            </div>
            {esNuevo && <div style={{fontSize:".8rem",color:C.muted,marginBottom:".85rem"}}>Primera vez que ingresas. Crea tu contraseña:</div>}
            <div style={{display:"flex",flexDirection:"column",gap:".65rem",marginBottom:".65rem"}}>
              <Campo label={esNuevo?"Nueva contraseña":"Tu contrasena"}>
                <input style={S.inp} type="password" placeholder="Mínimo 4 caracteres" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>!esNuevo&&e.key==="Enter"&&ingresar()} autoFocus/>
              </Campo>
              {esNuevo && (
                <Campo label="Confirmar contrasena">
                  <input style={S.inp} type="password" value={pw2} onChange={e=>{setPw2(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&ingresar()}/>
                </Campo>
              )}
            </div>
            {err && <div style={{color:C.red,fontSize:".8rem",marginBottom:".5rem"}}>{err}</div>}
            <div style={{display:"flex",flexDirection:"column",gap:".6rem"}}>
              <Btn full onClick={ingresar}>{esNuevo?"Crear cuenta e ingresar":"Ingresar"}</Btn>
              <Btn full color="ghost" onClick={()=>{setSel(null);setBusca("");setErr("");}}>Cambiar alumno</Btn>
            </div>
          </div>
        )}

        <div style={{marginTop:"1.25rem"}}>
          <Btn full color="ghost" onClick={onVolver}>Volver</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── VISTA PUBLICA ────────────────────────────────────────────────────────────
function VistaPublica({curso, onVolver}) {
  const now = new Date();
  const {alumnos,aportes,gastos,reservas} = curso;
  const totalLib  = alumnos.reduce((s,a)=>s+calcLiberado(a.id,aportes,reservas,now),0);
  const totalGasto = gastos.reduce((s,g)=>s+g.monto,0);
  const saldo     = totalLib-totalGasto;
  const pagIds    = new Set([...aportes.map(a=>a.sid),...reservas.map(r=>r.sid)]);
  const nPag      = pagIds.size;
  const nPend     = alumnos.length-nPag;
  const pct       = Math.round(totalLib/(alumnos.length*CUOTA_MENSUAL||1)*100);

  return (
    <div style={S.app}>
      <div style={S.hdr}>
        <div style={{fontFamily:"Georgia,serif",color:C.gold,fontSize:"1rem"}}>{curso.nombre}</div>
        <Btn onClick={onVolver} color="ghost" sm>Volver</Btn>
      </div>
      <div style={S.main}>
        <div style={S.grid}>
          <StatCard label="Alumnos"     value={alumnos.length} sub="en el curso"/>
          <StatCard label="Han pagado"  value={nPag}           sub="familias"          color="green"/>
          <StatCard label="Pendientes"  value={nPend}          sub="sin aporte"        color="red"/>
          <StatCard label="Recaudado"   value={pesos(totalLib)} sub={pct+"% de la meta"} color="blue"/>
          <StatCard label="Saldo"       value={pesos(saldo)}   sub="en caja"           color="green"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1.5rem"}}>
          <div style={{...S.card,marginBottom:0,display:"flex",flexDirection:"column",alignItems:"center",padding:"1.5rem"}}>
            <div style={{fontSize:".72rem",color:C.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:"1rem",textAlign:"center"}}>Participacion</div>
            <DonutChart pagas={nPag} pendientes={nPend} total={alumnos.length}/>
            <div style={{display:"flex",gap:"1rem",marginTop:"1rem",fontSize:".76rem"}}>
              <span style={{display:"flex",alignItems:"center",gap:".4rem"}}><span style={{width:9,height:9,borderRadius:"50%",background:C.green,display:"inline-block"}}/><span style={{color:C.green}}>{nPag} al dia</span></span>
              <span style={{display:"flex",alignItems:"center",gap:".4rem"}}><span style={{width:9,height:9,borderRadius:"50%",background:C.red,display:"inline-block"}}/><span style={{color:C.red}}>{nPend} pendientes</span></span>
            </div>
          </div>
          <div style={{...S.card,marginBottom:0,display:"flex",flexDirection:"column",justifyContent:"center",gap:".75rem"}}>
            <div style={{fontSize:".72rem",color:C.muted,textTransform:"uppercase",letterSpacing:".08em"}}>Resumen de caja</div>
            <div style={S.row}><span style={{color:C.muted}}>Aportes liberados</span><span style={{color:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(totalLib)}</span></div>
            <div style={S.row}><span style={{color:C.muted}}>Gastos</span><span style={{color:C.red,fontVariantNumeric:"tabular-nums"}}>- {pesos(totalGasto)}</span></div>
            <div style={S.div}/>
            <div style={S.row}><span style={{fontWeight:600}}>Saldo</span><span style={{fontFamily:"Georgia,serif",fontSize:"1.3rem",color:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(saldo)}</span></div>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".72rem",color:C.muted,marginBottom:".4rem"}}><span>Avance</span><span>{pct}%</span></div>
              <ProgBar pct={pct}/>
            </div>
          </div>
        </div>
        <div style={S.sec}>Detalle de gastos</div>
        <div style={{...S.card,padding:0,overflow:"hidden"}}>
          {gastos.length===0?<div style={{padding:"3rem",textAlign:"center",color:C.muted}}>Sin gastos aun.</div>:(
            <table style={S.tbl}><thead><tr><th style={S.th}>Fecha</th><th style={S.th}>Descripcion</th><th style={S.th}>Categoria</th><th style={S.th}>Monto</th></tr></thead>
            <tbody>{[...gastos].reverse().map(g=><tr key={g.id}><td style={{...S.td,color:C.muted}}>{fFecha(g.fecha)}</td><td style={S.td}>{g.descripcion}</td><td style={S.td}><span style={{background:"rgba(212,175,100,.1)",border:"1px solid rgba(212,175,100,.2)",color:C.gold,padding:"2px 7px",borderRadius:4,fontSize:".7rem"}}>{g.categoria}</span></td><td style={{...S.td,color:C.red,fontVariantNumeric:"tabular-nums"}}>- {pesos(g.monto)}</td></tr>)}</tbody></table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PANEL NOTIFICACIONES ─────────────────────────────────────────────────────
function PanelNotifs({notifs,alumnos,onConfirmar,onRechazar,onCerrar}) {
  const pend = notifs.filter(n=>n.estado==="pendiente");
  return (
    <div>
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",zIndex:199}} onClick={onCerrar}/>
      <div style={{position:"fixed",top:60,right:0,width:340,maxHeight:"calc(100vh - 60px)",background:C.card,borderLeft:"1px solid rgba(212,175,100,.2)",overflowY:"auto",zIndex:200,boxShadow:"-8px 0 32px rgba(0,0,0,.4)"}}>
        <div style={{padding:"1rem 1.25rem",borderBottom:"1px solid rgba(255,255,255,.07)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"Georgia,serif",color:C.text}}>Avisos de pago</span>
          <Btn onClick={onCerrar} color="red" sm>x</Btn>
        </div>
        {pend.length===0?<div style={{padding:"2rem",textAlign:"center",color:C.muted,fontSize:".85rem"}}>Sin avisos pendientes</div>:pend.map(n=>{
          const al=alumnos.find(a=>a.id===n.sid);
          return <div key={n.id} style={{padding:"1rem 1.25rem",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
            <div style={{fontWeight:500,marginBottom:".2rem"}}>{al?.nombre||"Alumno"}</div>
            <div style={{fontSize:".76rem",color:C.muted,marginBottom:".65rem",lineHeight:1.5}}>Avisa que pago: <strong style={{color:C.yellow}}>{n.nota}</strong><br/>Monto: <strong style={{color:C.green}}>{pesos(n.monto)}</strong><br/><span style={{fontSize:".7rem"}}>{fDT(n.creadoEn)}</span>{n.mensaje&&<><br/><em>"{n.mensaje}"</em></>}</div>
            <div style={{display:"flex",gap:".5rem"}}><Btn onClick={()=>onConfirmar(n)} color="solidg" sm>Confirmar</Btn><Btn onClick={()=>onRechazar(n)} color="red" sm>Rechazar</Btn></div>
          </div>;
        })}
      </div>
    </div>
  );
}

// ─── PORTAL APODERADO ─────────────────────────────────────────────────────────
function PortalApoderado({alumno, curso, setCurso, onSalir}) {
  const [tab, setTab] = useState("aportes");
  const [showForm, setShowForm] = useState(false);
  const [nf, setNf] = useState({tipoId:"",monto:"",mensaje:""});
  const [nErr, setNErr] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [showCambiarPw, setShowCambiarPw] = useState(false);
  const [pwf, setPwf] = useState({actual:"",nueva:"",confirma:""});
  const [pwMsg, setPwMsg] = useState("");
  const now = new Date();
  const sid = alumno.id;
  const {alumnos,aportes,gastos,reservas,deudas,notifs} = curso;

  const misAportes   = aportes.filter(a=>a.sid===sid);
  const tieneReserva = reservas.some(r=>r.sid===sid);
  const liberado     = calcLiberado(sid,aportes,reservas,now);
  const anticipo     = calcAnticipo(sid,aportes,reservas,now);
  const pagadoBruto  = calcPagadoBruto(sid,aportes,reservas);
  const pendiente    = Math.max(0,TOTAL_ANUAL-pagadoBruto);
  const tieneNP      = notifs.some(n=>n.sid===sid&&n.estado==="pendiente");
  const misDeudas    = deudas.filter(d=>d.sid===sid&&!d.pagado);
  const totalDeuda   = misDeudas.reduce((s,d)=>s+d.monto,0);
  const mostrarAnt   = tieneReserva||anticipo>0;
  const hoyDia       = now.getDate();
  const ultimoDia    = new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
  const recordatorio = hoyDia>=ultimoDia-4&&pendiente>0&&!mostrarAnt;
  const diasRest     = ultimoDia-hoyDia;
  const totalLib     = alumnos.reduce((s,a)=>s+calcLiberado(a.id,aportes,reservas,now),0);
  const totalGasto   = gastos.reduce((s,g)=>s+g.monto,0);
  const saldo        = totalLib-totalGasto;
  const pagIds       = new Set([...aportes.map(a=>a.sid),...reservas.map(r=>r.sid)]);

  const enviarNotif = () => {
    if (!nf.tipoId||!nf.monto) return;
    const razon=razonBloqueo(nf.tipoId,sid,aportes,reservas);
    if (razon) { setNErr(razon); return; }
    setNErr("");
    const tipo=TIPOS.find(t=>t.id===nf.tipoId);
    setCurso(c=>({...c,notifs:[...c.notifs,{id:genId(),sid,nota:tipo?.nota||"",monto:Number(nf.monto),mensaje:nf.mensaje,creadoEn:new Date().toISOString(),estado:"pendiente"}]}));
    setEnviado(true); setShowForm(false); setNf({tipoId:"",monto:"",mensaje:""});
  };

  const tabs=[{id:"aportes",label:"Mis aportes"},{id:"resumen",label:"Resumen del curso"},{id:"cuenta",label:"Mi cuenta"}];

  return (
    <div style={S.app}>
      <div style={S.hdr}>
        <div style={{fontFamily:"Georgia,serif",color:C.gold,fontSize:"1rem"}}>{curso.nombre}</div>
        <Btn onClick={onSalir} color="ghost" sm>Salir</Btn>
      </div>
      <PillTabs tabs={tabs} active={tab} onChange={setTab}/>
      <div style={S.main}>
        <div style={{background:"linear-gradient(135deg,#1a1f2e,#141c2a)",border:"1px solid rgba(126,184,247,.15)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.25rem"}}>
          <div style={{fontSize:".8rem",color:C.muted}}>Alumno/a</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.35rem",color:C.blue}}>{alumno.nombre}</div>
          {alumno.apoderado&&<div style={{fontSize:".82rem",color:C.muted,marginTop:".2rem"}}>Apoderado: {alumno.apoderado}</div>}
        </div>

        {tab==="aportes"&&(
          <div>
            {mostrarAnt&&(
              <div style={{background:"linear-gradient(135deg,rgba(126,184,247,.1),rgba(126,184,247,.05))",border:"1px solid rgba(126,184,247,.25)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.25rem"}}>
                <div style={{fontFamily:"Georgia,serif",color:C.blue,marginBottom:".4rem"}}>{tieneReserva?"Pago anual registrado":"Cuotas anticipadas"}</div>
                <div style={{fontSize:".82rem",color:"rgba(232,226,213,.55)",marginBottom:".85rem"}}>{tieneReserva?"Pagaste el ano completo. Las cuotas se liberan mes a mes.":"Pagaste cuotas por adelantado. Se liberan cuando llegue su mes."}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:".75rem",textAlign:"center"}}>
                  <div><div style={{fontSize:".65rem",color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:".2rem"}}>Total pagado</div><div style={{fontFamily:"Georgia,serif",color:C.blue}}>{pesos(pagadoBruto)}</div></div>
                  <div><div style={{fontSize:".65rem",color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:".2rem"}}>Liberado hoy</div><div style={{fontFamily:"Georgia,serif",color:C.green}}>{pesos(liberado)}</div></div>
                  <div><div style={{fontSize:".65rem",color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:".2rem"}}>En anticipo</div><div style={{fontFamily:"Georgia,serif",color:C.muted}}>{pesos(anticipo)}</div></div>
                </div>
              </div>
            )}
            {totalDeuda>0&&(
              <div style={{background:"rgba(235,87,87,.08)",border:"1px solid rgba(235,87,87,.25)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.25rem"}}>
                <div style={{fontFamily:"Georgia,serif",color:C.red,marginBottom:".4rem"}}>Deuda de anos anteriores</div>
                <div style={{fontSize:".82rem",color:"rgba(232,226,213,.55)",marginBottom:".75rem"}}>Tienes pagos pendientes de años anteriores. Contacta al tesorero.</div>
                <table style={S.tbl}><thead><tr><th style={{...S.th,padding:".4rem .5rem"}}>Ano</th><th style={{...S.th,padding:".4rem .5rem"}}>Descripcion</th><th style={{...S.th,padding:".4rem .5rem"}}>Monto</th></tr></thead>
                <tbody>{misDeudas.map(d=><tr key={d.id}><td style={{...S.td,padding:".5rem",color:C.muted}}>{d.anio}</td><td style={{...S.td,padding:".5rem"}}>{d.descripcion}</td><td style={{...S.td,padding:".5rem",color:C.red,fontVariantNumeric:"tabular-nums"}}>- {pesos(d.monto)}</td></tr>)}<tr><td style={{...S.td,padding:".5rem",fontWeight:600}} colSpan={2}>Total</td><td style={{...S.td,padding:".5rem",color:C.red,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>- {pesos(totalDeuda)}</td></tr></tbody></table>
              </div>
            )}
            {recordatorio&&(
              <div style={{background:"rgba(242,201,76,.1)",border:"1px solid rgba(242,201,76,.3)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.25rem"}}>
                <div style={{fontFamily:"Georgia,serif",color:C.yellow,marginBottom:".2rem"}}>Recordatorio - {MESES_ES[now.getMonth()]}</div>
                <div style={{fontSize:".82rem",color:"rgba(232,226,213,.6)"}}>{diasRest===0?"Hoy es el ultimo dia del mes!":"Quedan "+diasRest+" "+(diasRest===1?"dia":"dias")+" para el cierre."} No olvides pagar tu cuota de {pesos(CUOTA_MENSUAL)}.</div>
              </div>
            )}
            {enviado||tieneNP?<Alerta msg="Tu aviso fue enviado al tesorero. Se registrara una vez verificado." ok={true}/>:(
              <div style={{background:"rgba(111,207,151,.07)",border:"1px solid rgba(111,207,151,.22)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.25rem"}}>
                <div style={{fontFamily:"Georgia,serif",color:C.green,marginBottom:".4rem"}}>¿Ya pagaste? Avísale al tesorero</div>
                <div style={{fontSize:".82rem",color:"rgba(232,226,213,.55)",marginBottom:".85rem"}}>Si ya realizaste tu pago, notifícalo para que el tesorero lo verifique.</div>
                {!showForm?<Btn onClick={()=>setShowForm(true)} color="green" full>Avisar que pagué</Btn>:(
                  <div>
                    <div style={S.fgrid}>
                      <Campo label="Que pagaste?">
                        <select style={S.inp} value={nf.tipoId} onChange={e=>{const t=TIPOS.find(x=>x.id===e.target.value);setNf(f=>({...f,tipoId:e.target.value,monto:t?.monto||""}));setNErr("");}}>
                          <option value="">Seleccionar...</option>
                          {TIPOS.filter(t=>t.id!=="otro").map(t=>{const b=CUOTA_ORDER.includes(t.id)&&razonBloqueo(t.id,sid,aportes,reservas)!==null;const y=cuotasPagas(sid,aportes,reservas).has(t.id);return <option key={t.id} value={t.id} disabled={b||y}>{y?"(pagado) ":b?"(no disp) ":""}{t.label}</option>;})}
                        </select>
                      </Campo>
                      <Campo label="Monto">
                        <div style={{...S.inp, background:"rgba(255,255,255,.03)", color:nf.monto?C.gold:C.muted, fontWeight:nf.monto?600:"normal", cursor:"default"}}>
                          {nf.monto ? "$"+Number(nf.monto).toLocaleString("es-CL") : "Selecciona un tipo de aporte"}
                        </div>
                      </Campo>
                    </div>
                    <div style={{marginBottom:".75rem"}}><Campo label="Mensaje opcional"><input style={S.inp} type="text" value={nf.mensaje} onChange={e=>setNf(f=>({...f,mensaje:e.target.value}))} placeholder="Ej: Transferi a las 10am"/></Campo></div>
                    <Alerta msg={nErr}/>
                    {(()=>{const p=proxCuota(sid,aportes,reservas);const t=TIPOS.find(x=>x.id===p);return p?<div style={{fontSize:".76rem",color:C.muted,marginBottom:".65rem"}}>Próxima cuota: <strong style={{color:C.gold}}>{t?.nota}</strong></div>:null;})()}
                    <div style={{display:"flex",gap:".5rem"}}><Btn onClick={enviarNotif} color="green" disabled={!nf.tipoId||!nf.monto} full>Enviar aviso</Btn><Btn onClick={()=>setShowForm(false)} color="ghost">Cancelar</Btn></div>
                  </div>
                )}
              </div>
            )}
            {/* Pendientes por pagar */}
            {(()=>{
              const pagas = cuotasPagas(sid,aportes,reservas);
              const items = [];
              if (!pagas.has("caja_chica") && !tieneReserva) items.push({id:"caja_chica",label:"Caja chica",monto:CAJA_CHICA});
              CUOTA_ORDER.forEach(c=>{ if (!pagas.has(c) && !tieneReserva) { const t=TIPOS.find(x=>x.id===c); if(t) items.push({id:c,label:t.nota,monto:CUOTA_MENSUAL}); } });
              if (items.length===0 && !tieneReserva) return (
                <div style={{background:"rgba(111,207,151,.08)",border:"1px solid rgba(111,207,151,.2)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.25rem",textAlign:"center"}}>
                  <div style={{fontFamily:"Georgia,serif",color:C.green,fontSize:"1.1rem",marginBottom:".25rem"}}>¡Todo al día!</div>
                  <div style={{fontSize:".82rem",color:C.muted}}>No tienes pagos pendientes este año.</div>
                </div>
              );
              if (tieneReserva) return null;
              return (
                <div style={{...S.card,marginBottom:"1.25rem"}}>
                  <div style={{fontFamily:"Georgia,serif",color:C.text,marginBottom:"1rem"}}>Pagos pendientes este año</div>
                  <table style={S.tbl}>
                    <thead><tr><th style={S.th}>Concepto</th><th style={S.th}>Monto</th></tr></thead>
                    <tbody>
                      {items.map(it=>(
                        <tr key={it.id}>
                          <td style={S.td}>{it.label}</td>
                          <td style={{...S.td,color:C.red,fontVariantNumeric:"tabular-nums"}}>{pesos(it.monto)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td style={{...S.td,fontWeight:600}}>Total pendiente</td>
                        <td style={{...S.td,color:C.red,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{pesos(items.reduce((s,it)=>s+it.monto,0))}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })()}
            <div style={S.sec}>Historial</div>
            <div style={{...S.card,padding:0,overflow:"hidden"}}>
              {misAportes.length===0&&!tieneReserva?<div style={{padding:"3rem",textAlign:"center",color:C.muted}}>Aún no hay aportes.</div>:(
                <table style={S.tbl}><thead><tr><th style={S.th}>Fecha</th><th style={S.th}>Descripcion</th><th style={S.th}>Monto</th></tr></thead>
                <tbody>
                  {tieneReserva&&(()=>{
                    const r=reservas.find(x=>x.sid===sid);
                    if(!r) return null;
                    const mesActual=now.getMonth();
                    const rows=[];
                    // Caja chica: siempre incluida
                    rows.push(<tr key="r_cc"><td style={{...S.td,color:C.muted}}>{fFecha(r.fecha)}</td><td style={S.td}>Caja chica <Badge type="anticipo">pago anual</Badge></td><td style={{...S.td,color:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(CAJA_CHICA)}</td></tr>);
                    // Cuotas liberadas (mes ya pasó o es el actual)
                    CUOTA_ORDER.forEach(c=>{
                      const m=CUOTA_MES[c];
                      const t=TIPOS.find(x=>x.id===c);
                      if(m<=mesActual) rows.push(<tr key={"r_"+c}><td style={{...S.td,color:C.muted}}>{fFecha(r.fecha)}</td><td style={S.td}>{t?.nota||c} <Badge type="paid">liberado</Badge></td><td style={{...S.td,color:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(CUOTA_MENSUAL)}</td></tr>);
                      else rows.push(<tr key={"r_"+c}><td style={{...S.td,color:C.muted}}>{fFecha(r.fecha)}</td><td style={S.td}>{t?.nota||c} <Badge type="anticipo">anticipado</Badge></td><td style={{...S.td,color:C.blue,fontVariantNumeric:"tabular-nums"}}>{pesos(CUOTA_MENSUAL)}</td></tr>);
                    });
                    return rows;
                  })()}
                  {[...misAportes].reverse().map(a=><tr key={a.id}><td style={{...S.td,color:C.muted}}>{fFecha(a.fecha)}</td><td style={S.td}>{a.nota}{a.anticipo&&<span style={{marginLeft:".4rem"}}><Badge type="anticipo">anticipo</Badge></span>}</td><td style={{...S.td,color:a.anticipo?C.blue:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(a.monto)}</td></tr>)}
                  <tr><td style={{...S.td,fontWeight:600}} colSpan={2}>Total pagado</td><td style={{...S.td,color:C.green,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{pesos(pagadoBruto)}</td></tr>
                </tbody></table>
              )}
            </div>
          </div>
        )}



        {tab==="resumen"&&(
          <div>
            <div style={S.grid}>
              <StatCard label="Alumnos"    value={alumnos.length}         sub="en el curso"/>
              <StatCard label="Han pagado" value={pagIds.size}            sub={"de "+alumnos.length} color="green"/>
              <StatCard label="Pendientes" value={alumnos.length-pagIds.size} sub="sin aporte"      color="red"/>
              <StatCard label="Recaudado"  value={pesos(totalLib)}        sub="liberado en caja"    color="blue"/>
            </div>
            <CajaResumen liberado={totalLib} anticipo={alumnos.reduce((s,a)=>s+calcAnticipo(a.id,aportes,reservas,now),0)} gasto={totalGasto}/>
            <div style={S.sec}>Detalle de gastos</div>
            <div style={{...S.card,padding:0,overflow:"hidden"}}>
              {gastos.length===0
                ? <div style={{padding:"2rem",textAlign:"center",color:C.muted}}>Sin gastos registrados aún.</div>
                : <table style={S.tbl}>
                    <thead><tr><th style={S.th}>Fecha</th><th style={S.th}>Descripción</th><th style={S.th}>Categoría</th><th style={S.th}>Monto</th></tr></thead>
                    <tbody>{[...gastos].reverse().map(g=>(
                      <tr key={g.id}>
                        <td style={{...S.td,color:C.muted}}>{fFecha(g.fecha)}</td>
                        <td style={S.td}>{g.descripcion}</td>
                        <td style={S.td}><span style={{background:"rgba(212,175,100,.1)",border:"1px solid rgba(212,175,100,.2)",color:C.gold,padding:"2px 7px",borderRadius:4,fontSize:".7rem"}}>{g.categoria}</span></td>
                        <td style={{...S.td,color:C.red,fontVariantNumeric:"tabular-nums"}}>- {pesos(g.monto)}</td>
                      </tr>
                    ))}</tbody>
                  </table>
              }
            </div>
          </div>
        )}

        {tab==="cuenta"&&(
          <div>
            <div style={S.card}>
              <div style={S.sec}>Cambiar mi contraseña</div>
              {!showCambiarPw?(
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:C.muted,fontSize:".85rem"}}>Contraseña: •••••••</span>
                  <Btn onClick={()=>{setShowCambiarPw(true);setPwf({actual:"",nueva:"",confirma:""});setPwMsg("");}} color="ghost" sm>Cambiar</Btn>
                </div>
              ):(
                <div>
                  <div style={S.fgrid}>
                    <Campo label="Contraseña actual"><input style={S.inp} type="password" value={pwf.actual} onChange={e=>setPwf(f=>({...f,actual:e.target.value}))} placeholder="Tu contraseña actual"/></Campo>
                    <Campo label="Nueva contraseña"><input style={S.inp} type="password" value={pwf.nueva} onChange={e=>setPwf(f=>({...f,nueva:e.target.value}))} placeholder="Mínimo 4 caracteres"/></Campo>
                    <Campo label="Confirmar nueva"><input style={S.inp} type="password" value={pwf.confirma} onChange={e=>setPwf(f=>({...f,confirma:e.target.value}))}/></Campo>
                  </div>
                  {pwMsg&&<div style={{color:pwMsg.startsWith("OK")?C.green:C.red,fontSize:".82rem",marginBottom:".65rem"}}>{pwMsg}</div>}
                  <div style={{display:"flex",gap:".65rem"}}>
                    <Btn color="gold" onClick={()=>{
                      if (curso.claves[alumno.id]!==pwf.actual) { setPwMsg("Contraseña actual incorrecta."); return; }
                      if (pwf.nueva.length<4) { setPwMsg("Mínimo 4 caracteres."); return; }
                      if (pwf.nueva!==pwf.confirma) { setPwMsg("Las contraseñas no coinciden."); return; }
                      setCurso(c=>({...c,claves:{...c.claves,[alumno.id]:pwf.nueva}}));
                      setShowCambiarPw(false); setPwMsg("OK - Contraseña actualizada.");
                    }}>Guardar</Btn>
                    <Btn color="ghost" onClick={()=>{setShowCambiarPw(false);setPwMsg("");}}>Cancelar</Btn>
                  </div>
                </div>
              )}
              {pwMsg&&!showCambiarPw&&<div style={{color:C.green,fontSize:".82rem",marginTop:".5rem"}}>{pwMsg}</div>}
            </div>
            <div style={S.card}>
              <div style={S.sec}>Mi informacion</div>
              <div style={S.row}><span style={{color:C.muted}}>Alumno/a</span><span style={{color:C.blue,fontWeight:500}}>{alumno.nombre}</span></div>
              {alumno.apoderado&&<div style={S.row}><span style={{color:C.muted}}>Apoderado</span><span>{alumno.apoderado}</span></div>}
              <div style={S.row}><span style={{color:C.muted}}>Curso</span><span>{curso.nombre}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function Admin({curso, setCurso, onSalir}) {
  const [tab, setTab] = useState("dashboard");
  const [showNotifs, setShowNotifs] = useState(false);
  const now = new Date();
  const fileRef = useRef(null);
  const [importMsg, setImportMsg] = useState("");

  // Forms
  const [af, setAf] = useState({sid:"",tipoId:"",monto:"",fecha:hoy(),nota:""});
  const [afErr, setAfErr] = useState("");
  const [gf, setGf] = useState({descripcion:"",monto:"",fecha:hoy(),categoria:"Celebraciones"});
  const [sof, setSof] = useState({nombre:"",apoderado:""});
  const [df, setDf] = useState({sid:"",anio:"2024",monto:"",descripcion:"Cuotas impagas"});
  // Ajustes
  const [editNombre, setEditNombre] = useState(false);
  const [tmpNombre, setTmpNombre] = useState(curso.nombre);
  const [editCodigo, setEditCodigo] = useState(false);
  const [tmpCodigo, setTmpCodigo] = useState(curso.codigoCurso);
  const [copiado, setCopiado] = useState(false);
  const [editAdminPw, setEditAdminPw] = useState(false);
  const [adminPwf, setAdminPwf] = useState({actual:"",nueva:"",confirma:""});
  const [adminPwMsg, setAdminPwMsg] = useState("");

  const {alumnos,aportes,gastos,reservas,deudas,notifs} = curso;
  const totalLib   = alumnos.reduce((s,a)=>s+calcLiberado(a.id,aportes,reservas,now),0);
  const totalAnt   = alumnos.reduce((s,a)=>s+calcAnticipo(a.id,aportes,reservas,now),0);
  const totalGasto = gastos.reduce((s,g)=>s+g.monto,0);
  const saldo      = totalLib-totalGasto;
  const pagIds     = new Set([...aportes.map(a=>a.sid),...reservas.map(r=>r.sid)]);
  const notifsPend = notifs.filter(n=>n.estado==="pendiente");
  const sid        = Number(af.sid);

  // CSV/Excel import
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result;
        const lines = text.split(/\r?\n/).filter(l=>l.trim());
        const nuevos = [];
        let skipped = 0;
        lines.forEach((line, i) => {
          // Try comma and semicolon separators
          const parts = line.includes(";") ? line.split(";") : line.split(",");
          const nombre = parts[0]?.replace(/^["']|["']$/g,"").trim();
          const apoderado = parts[1]?.replace(/^["']|["']$/g,"").trim()||"";
          if (!nombre || nombre.toLowerCase()==="nombre" || nombre.toLowerCase()==="alumno") { skipped++; return; }
          if (alumnos.some(a=>a.nombre.toLowerCase()===nombre.toLowerCase())) { skipped++; return; }
          nuevos.push({id:genId(), nombre, apoderado});
        });
        if (nuevos.length > 0) {
          setCurso(c=>({...c, alumnos:[...c.alumnos, ...nuevos]}));
          setImportMsg("OK - " + nuevos.length + " alumno(s) importados." + (skipped>0?" ("+skipped+" omitidos por duplicados o encabezado)":""));
        } else {
          setImportMsg("No se importaron alumnos. Verifica el formato del archivo.");
        }
      } catch(err) {
        setImportMsg("Error al leer el archivo. Asegurate que sea CSV con columnas: Nombre, Apoderado");
      }
    };
    reader.readAsText(file, "UTF-8");
    e.target.value = "";
  };

  const addAporte = () => {
    if (!af.sid||!af.monto) return;
    const s=Number(af.sid);
    if (reservas.some(r=>r.sid===s)) { setAfErr("Este alumno tiene reserva anual - cuotas ya cubiertas."); return; }
    const razon=razonBloqueo(af.tipoId,s,aportes,reservas);
    if (razon) { setAfErr(razon); return; }
    setAfErr("");
    const esAnt=!!CUOTA_MES[af.tipoId]&&!estaLiberada(af.tipoId,now);
    setCurso(c=>({...c,aportes:[...c.aportes,{id:genId(),...af,monto:Number(af.monto),sid:s,anticipo:esAnt}]}));
    setAf(f=>({...f,sid:"",tipoId:"",monto:"",nota:""}));
  };

  const confirmarNotif = (n) => {
    const esAnt=!!CUOTA_MES[n.tipoId]&&!estaLiberada(n.tipoId,now);
    setCurso(c=>({...c,
      aportes:[...c.aportes,{id:genId(),sid:n.sid,monto:n.monto,fecha:hoy(),nota:n.nota+" (verificado)",tipoId:"",anticipo:esAnt}],
      notifs:c.notifs.map(x=>x.id===n.id?{...x,estado:"confirmado"}:x)
    }));
    setShowNotifs(false);
  };
  const rechazarNotif = (n) => setCurso(c=>({...c,notifs:c.notifs.map(x=>x.id===n.id?{...x,estado:"rechazado"}:x)}));

  const exportCSV = (rows, filename) => {
    const csv=rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(",")).join("\n");
    const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);
  };

  const tabs=[
    {id:"dashboard",label:"Dashboard"},
    {id:"aportes",  label:"Aportes"},
    {id:"gastos",   label:"Gastos"},
    {id:"alumnos",  label:"Alumnos"},
    {id:"reservas", label:"Pagos anticipados"},
    {id:"deudas",   label:"Deudas hist."},
    {id:"reportes", label:"Reportes"},
    {id:"ajustes",  label:"Ajustes"},
  ];

  return (
    <div style={S.app}>
      <div style={S.hdr}>
        <div style={{fontFamily:"Georgia,serif",color:C.gold,fontSize:"1rem"}}>{curso.nombre} <span style={{background:C.gold,color:"#0f1117",fontSize:".6rem",padding:"2px 7px",borderRadius:20,fontWeight:700,letterSpacing:".08em",marginLeft:".4rem"}}>ADMIN</span></div>
        <div style={{display:"flex",gap:".65rem",alignItems:"center",flexShrink:0}}>
          <button onClick={()=>setShowNotifs(v=>!v)} style={{position:"relative",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:C.text,width:34,height:34,borderRadius:10,cursor:"pointer",fontSize:".82rem",display:"flex",alignItems:"center",justifyContent:"center"}}>
            [!]{notifsPend.length>0&&<span style={{position:"absolute",top:-3,right:-3,background:C.red,color:"#fff",fontSize:".55rem",fontWeight:700,width:15,height:15,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid "+C.bg}}>{notifsPend.length}</span>}
          </button>
          <Btn onClick={onSalir} color="ghost" sm>Salir</Btn>
        </div>
      </div>

      {showNotifs&&<PanelNotifs notifs={notifs} alumnos={alumnos} onConfirmar={confirmarNotif} onRechazar={rechazarNotif} onCerrar={()=>setShowNotifs(false)}/>}
      <NavTabs tabs={tabs} active={tab} onChange={setTab}/>
      <div style={S.main}>

        {tab==="dashboard"&&(
          <div>
            {notifsPend.length>0&&<div onClick={()=>setShowNotifs(true)} style={{background:"rgba(242,201,76,.1)",border:"1px solid rgba(242,201,76,.3)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.25rem",cursor:"pointer"}}><div style={{fontFamily:"Georgia,serif",color:C.yellow,marginBottom:".2rem"}}>{notifsPend.length} aviso{notifsPend.length>1?"s":""} pendiente{notifsPend.length>1?"s":""}</div><div style={{fontSize:".82rem",color:"rgba(232,226,213,.6)"}}>Haz clic para revisar.</div></div>}
            <div style={S.grid}>
              <StatCard label="Alumnos"    value={alumnos.length}  sub="en el curso"/>
              <StatCard label="Han pagado" value={pagIds.size}     sub={"de "+alumnos.length} color="green"/>
              <StatCard label="Pendientes" value={alumnos.length-pagIds.size} sub="sin aporte" color="red"/>
              {notifsPend.length>0&&<StatCard label="Por verificar" value={notifsPend.length} sub="avisos" color="yellow"/>}
              {totalAnt>0&&<StatCard label="En anticipo" value={pesos(totalAnt)} sub="se libera por mes" color="blue"/>}
              <StatCard label="Liberado"   value={pesos(totalLib)} sub={Math.round(totalLib/(alumnos.length*CUOTA_MENSUAL||1)*100)+"%"} color="blue"/>
              <StatCard label="Saldo"      value={pesos(saldo)}    sub="disponible" color="green"/>
            </div>
            <CajaResumen liberado={totalLib} anticipo={totalAnt} gasto={totalGasto}/>
            <div style={S.sec}>Estado de aportes</div>
            <div style={{...S.card,padding:0,overflow:"hidden"}}>
              <table style={S.tbl}><thead><tr><th style={S.th}>Alumno</th><th style={S.th}>Apoderado</th><th style={S.th}>Estado</th><th style={S.th}>Liberado</th></tr></thead>
              <tbody>{alumnos.map(a=>{
                const lib=calcLiberado(a.id,aportes,reservas,now);
                const ant=calcAnticipo(a.id,aportes,reservas,now);
                const hasR=reservas.some(r=>r.sid===a.id);
                const hasP=notifs.some(n=>n.sid===a.id&&n.estado==="pendiente");
                return <tr key={a.id}><td style={S.td}>{a.nombre}</td><td style={{...S.td,color:C.muted}}>{a.apoderado||"-"}</td><td style={S.td}>{hasR?<Badge type="annual">Pago anual</Badge>:hasP?<Badge type="waiting">Aviso pago</Badge>:lib>0?<Badge type="paid">Al dia</Badge>:<Badge type="pending">Pendiente</Badge>}</td><td style={{...S.td,color:lib>0?C.green:C.muted,fontVariantNumeric:"tabular-nums"}}>{lib>0?pesos(lib)+(ant>0?" + "+pesos(ant)+" ant.":""):"-"}</td></tr>;
              })}</tbody></table>
            </div>
          </div>
        )}

        {tab==="aportes"&&(
          <div>
            <div style={S.card}>
              <div style={S.sec}>Registrar aporte</div>
              <div style={S.fgrid}>
                <Campo label="Alumno"><select style={S.inp} value={af.sid} onChange={e=>{setAf(f=>({...f,sid:e.target.value}));setAfErr("");}}><option value="">Seleccionar...</option>{alumnos.map(a=><option key={a.id} value={a.id}>{a.nombre}</option>)}</select></Campo>
                <Campo label="Tipo"><select style={S.inp} value={af.tipoId} onChange={e=>{const t=TIPOS.find(x=>x.id===e.target.value);setAf(f=>({...f,tipoId:e.target.value,monto:t?.monto||"",nota:t?.nota||""}));setAfErr("");}}><option value="">Seleccionar...</option>{TIPOS.map(t=>{const b=sid>0&&CUOTA_ORDER.includes(t.id)&&razonBloqueo(t.id,sid,aportes,reservas)!==null;const y=sid>0&&cuotasPagas(sid,aportes,reservas).has(t.id);return <option key={t.id} value={t.id} disabled={b}>{y?"(pagado) ":b?"(bloq) ":""}{t.label}</option>;})}</select></Campo>
                <Campo label="Monto ($)"><input style={S.inp} type="number" value={af.monto} onChange={e=>setAf(f=>({...f,monto:e.target.value}))} placeholder="Automatico"/></Campo>
                <Campo label="Fecha"><input style={S.inp} type="date" value={af.fecha} onChange={e=>setAf(f=>({...f,fecha:e.target.value}))}/></Campo>
              </div>
              <Alerta msg={afErr}/>
              {sid>0&&(()=>{const p=proxCuota(sid,aportes,reservas);const t=TIPOS.find(x=>x.id===p);return p?<div style={{fontSize:".76rem",color:C.muted,marginBottom:".65rem"}}>Próxima cuota: <strong style={{color:C.gold}}>{t?.nota}</strong></div>:null;})()}
              <Btn onClick={addAporte}>Registrar aporte</Btn>
            </div>
            <div style={S.sec}>Historial <span style={{fontSize:".85rem",color:C.muted,fontWeight:400}}>{aportes.length} registros</span></div>
            <div style={{...S.card,padding:0,overflow:"hidden"}}>
              {aportes.length===0?<div style={{padding:"3rem",textAlign:"center",color:C.muted}}>Sin aportes.</div>:(
                <table style={S.tbl}><thead><tr><th style={S.th}>Fecha</th><th style={S.th}>Alumno</th><th style={S.th}>Descripcion</th><th style={S.th}>Monto</th><th style={S.th}></th></tr></thead>
                <tbody>{[...aportes].reverse().map(a=>{const al=alumnos.find(x=>x.id===a.sid);return <tr key={a.id}><td style={{...S.td,color:C.muted}}>{fFecha(a.fecha)}</td><td style={S.td}>{al?.nombre||"-"}</td><td style={{...S.td,color:C.muted}}>{a.nota}{a.anticipo&&<span style={{marginLeft:".4rem"}}><Badge type="anticipo">anticipo</Badge></span>}</td><td style={{...S.td,color:a.anticipo?C.blue:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(a.monto)}</td><td style={S.td}><Btn onClick={()=>setCurso(c=>({...c,aportes:c.aportes.filter(x=>x.id!==a.id)}))} color="red" sm>x</Btn></td></tr>;})}
                </tbody></table>
              )}
            </div>
          </div>
        )}

        {tab==="gastos"&&(
          <div>
            <div style={S.card}>
              <div style={S.sec}>Registrar gasto</div>
              <div style={S.fgrid}>
                <Campo label="Descripcion"><input style={S.inp} type="text" value={gf.descripcion} onChange={e=>setGf(f=>({...f,descripcion:e.target.value}))} placeholder="Ej: Decoracion"/></Campo>
                <Campo label="Monto ($)"><input style={S.inp} type="number" value={gf.monto} onChange={e=>setGf(f=>({...f,monto:e.target.value}))} placeholder="0"/></Campo>
                <Campo label="Fecha"><input style={S.inp} type="date" value={gf.fecha} onChange={e=>setGf(f=>({...f,fecha:e.target.value}))}/></Campo>
                <Campo label="Categoria"><select style={S.inp} value={gf.categoria} onChange={e=>setGf(f=>({...f,categoria:e.target.value}))}>{CATEGORIAS.map(c=><option key={c}>{c}</option>)}</select></Campo>
              </div>
              <Btn onClick={()=>{if(!gf.descripcion||!gf.monto)return;setCurso(c=>({...c,gastos:[...c.gastos,{id:genId(),...gf,monto:Number(gf.monto)}]}));setGf(f=>({...f,descripcion:"",monto:""}));}}>Registrar gasto</Btn>
            </div>
            <div style={S.sec}>Historial <span style={{fontSize:".85rem",color:C.muted,fontWeight:400}}>{gastos.length} registros - {pesos(totalGasto)}</span></div>
            <div style={{...S.card,padding:0,overflow:"hidden"}}>
              {gastos.length===0?<div style={{padding:"3rem",textAlign:"center",color:C.muted}}>Sin gastos.</div>:(
                <table style={S.tbl}><thead><tr><th style={S.th}>Fecha</th><th style={S.th}>Descripcion</th><th style={S.th}>Categoria</th><th style={S.th}>Monto</th><th style={S.th}></th></tr></thead>
                <tbody>{[...gastos].reverse().map(g=><tr key={g.id}><td style={{...S.td,color:C.muted}}>{fFecha(g.fecha)}</td><td style={S.td}>{g.descripcion}</td><td style={S.td}><span style={{background:"rgba(212,175,100,.1)",border:"1px solid rgba(212,175,100,.2)",color:C.gold,padding:"2px 7px",borderRadius:4,fontSize:".7rem"}}>{g.categoria}</span></td><td style={{...S.td,color:C.red,fontVariantNumeric:"tabular-nums"}}>- {pesos(g.monto)}</td><td style={S.td}><Btn onClick={()=>setCurso(c=>({...c,gastos:c.gastos.filter(x=>x.id!==g.id)}))} color="red" sm>x</Btn></td></tr>)}</tbody></table>
              )}
            </div>
          </div>
        )}

        {tab==="alumnos"&&(
          <div>
            <div style={S.card}>
              <div style={S.sec}>Agregar alumno</div>
              <div style={S.fgrid}>
                <Campo label="Nombre"><input style={S.inp} type="text" value={sof.nombre} onChange={e=>setSof(f=>({...f,nombre:e.target.value}))} placeholder="Nombre Apellido"/></Campo>
                <Campo label="Apoderado"><input style={S.inp} type="text" value={sof.apoderado} onChange={e=>setSof(f=>({...f,apoderado:e.target.value}))} placeholder="Nombre Apoderado"/></Campo>
              </div>
              <div style={{display:"flex",gap:".65rem",alignItems:"center"}}>
                <Btn onClick={()=>{if(!sof.nombre)return;setCurso(c=>({...c,alumnos:[...c.alumnos,{id:genId(),...sof}]}));setSof({nombre:"",apoderado:""});}}>Agregar alumno</Btn>
              </div>
            </div>

            <div style={S.card}>
              <div style={S.sec}>Importar desde CSV / Excel</div>
              <div style={{fontSize:".82rem",color:C.muted,marginBottom:"1rem",lineHeight:1.6}}>
                Sube un archivo CSV o Excel exportado como CSV con dos columnas: <strong style={{color:C.gold}}>Nombre</strong> y <strong style={{color:C.gold}}>Apoderado</strong> (apoderado es opcional). Se omiten duplicados automaticamente.
              </div>
              <div style={{background:"rgba(212,175,100,.05)",border:"2px dashed rgba(212,175,100,.25)",borderRadius:10,padding:"1.5rem",textAlign:"center",marginBottom:"1rem"}}>
                <div style={{color:C.muted,fontSize:".85rem",marginBottom:".85rem"}}>Formato esperado:<br/><span style={{fontFamily:"monospace",color:C.gold,fontSize:".8rem"}}>Nombre Alumno, Nombre Apoderado</span></div>
                <input ref={fileRef} type="file" accept=".csv,.txt" style={{display:"none"}} onChange={handleImport}/>
                <Btn onClick={()=>fileRef.current?.click()}>Seleccionar archivo CSV</Btn>
              </div>
              {importMsg&&<Alerta msg={importMsg} ok={importMsg.startsWith("OK")}/>}
            </div>

            <div style={S.sec}>Lista <span style={{fontSize:".85rem",color:C.muted,fontWeight:400}}>{alumnos.length} alumnos</span></div>
            <div style={{...S.card,padding:0,overflow:"hidden",overflowX:"auto"}}>
              <table style={S.tbl}><thead><tr><th style={S.th}>#</th><th style={S.th}>Alumno</th><th style={S.th}>Apoderado</th><th style={S.th}>Estado</th><th style={S.th}>Liberado</th><th style={S.th}></th></tr></thead>
              <tbody>{alumnos.map((a,i)=>{
                const lib=calcLiberado(a.id,aportes,reservas,now);
                const hasR=reservas.some(r=>r.sid===a.id);
                return <tr key={a.id}><td style={{...S.td,color:C.muted}}>{i+1}</td><td style={S.td}>{a.nombre}</td><td style={{...S.td,color:C.muted}}>{a.apoderado||"-"}</td><td style={S.td}>{hasR?<Badge type="annual">Anual</Badge>:lib>0?<Badge type="paid">Al dia</Badge>:<Badge type="pending">Pendiente</Badge>}</td><td style={{...S.td,color:lib>0?C.green:C.muted,fontVariantNumeric:"tabular-nums"}}>{lib>0?pesos(lib):"-"}</td><td style={S.td}><Btn onClick={()=>setCurso(c=>({...c,alumnos:c.alumnos.filter(x=>x.id!==a.id)}))} color="red" sm>x</Btn></td></tr>;
              })}</tbody></table>
            </div>
          </div>
        )}

        {tab==="reservas"&&(
          <div>
            <div style={{background:"rgba(212,175,100,.06)",border:"1px solid rgba(212,175,100,.15)",borderRadius:10,padding:".85rem 1rem",fontSize:".83rem",color:"rgba(232,226,213,.55)",lineHeight:1.6,marginBottom:"1.5rem"}}>Pagos anticipados y anuales. El saldo solo incluye lo liberado hasta el mes actual.</div>
            <div style={S.grid}>
              <StatCard label="Pagos anuales" value={reservas.length} sub="alumnos" color="blue"/>
              <StatCard label="Liberado" value={pesos(reservas.reduce((s,r)=>s+calcLiberado(r.sid,[],reservas,now),0))} sub="en caja" color="green"/>
              <StatCard label="En reserva" value={pesos(reservas.reduce((s,r)=>s+calcAnticipo(r.sid,[],reservas,now),0))} sub="pendiente"/>
            </div>
            <div style={{...S.card,padding:0,overflow:"hidden"}}>
              {reservas.length===0?<div style={{padding:"3rem",textAlign:"center",color:C.muted}}>Sin pagos anuales.</div>:(
                <table style={S.tbl}><thead><tr><th style={S.th}>Alumno</th><th style={S.th}>Fecha</th><th style={S.th}>Total</th><th style={S.th}>Liberado</th><th style={S.th}>Reserva</th><th style={S.th}></th></tr></thead>
                <tbody>{reservas.map(r=>{const al=alumnos.find(a=>a.id===r.sid);const lib=calcLiberado(r.sid,[],reservas,now);const ant=calcAnticipo(r.sid,[],reservas,now);return <tr key={r.id}><td style={S.td}>{al?.nombre||"-"}</td><td style={{...S.td,color:C.muted}}>{fFecha(r.fecha)}</td><td style={{...S.td,color:C.blue,fontVariantNumeric:"tabular-nums"}}>{pesos(TOTAL_ANUAL)}</td><td style={{...S.td,color:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(lib)}</td><td style={{...S.td,color:C.muted,fontVariantNumeric:"tabular-nums"}}>{pesos(ant)}</td><td style={S.td}><Btn onClick={()=>setCurso(c=>({...c,reservas:c.reservas.filter(x=>x.id!==r.id)}))} color="red" sm>x</Btn></td></tr>;})}
                </tbody></table>
              )}
            </div>
          </div>
        )}

        {tab==="deudas"&&(
          <div>
            <div style={{background:"rgba(235,87,87,.06)",border:"1px solid rgba(235,87,87,.18)",borderRadius:10,padding:".85rem 1rem",fontSize:".83rem",color:"rgba(232,226,213,.55)",lineHeight:1.6,marginBottom:"1.5rem"}}>Deudas de anos anteriores. Aparecen en el portal del apoderado.</div>
            <div style={S.card}>
              <div style={S.sec}>Registrar deuda</div>
              <div style={S.fgrid}>
                <Campo label="Alumno"><select style={S.inp} value={df.sid} onChange={e=>setDf(f=>({...f,sid:e.target.value}))}><option value="">Seleccionar...</option>{alumnos.map(a=><option key={a.id} value={a.id}>{a.nombre}</option>)}</select></Campo>
                <Campo label="Ano"><select style={S.inp} value={df.anio} onChange={e=>setDf(f=>({...f,anio:e.target.value}))}>{["2021","2022","2023","2024","2025"].map(y=><option key={y}>{y}</option>)}</select></Campo>
                <Campo label="Monto ($)"><input style={S.inp} type="number" value={df.monto} onChange={e=>setDf(f=>({...f,monto:e.target.value}))} placeholder="0"/></Campo>
                <Campo label="Descripcion"><input style={S.inp} type="text" value={df.descripcion} onChange={e=>setDf(f=>({...f,descripcion:e.target.value}))} placeholder="Ej: Cuotas impagas"/></Campo>
              </div>
              <Btn onClick={()=>{if(!df.sid||!df.monto)return;setCurso(c=>({...c,deudas:[...c.deudas,{id:genId(),sid:Number(df.sid),anio:df.anio,monto:Number(df.monto),descripcion:df.descripcion,pagado:false}]}));setDf(f=>({...f,sid:"",monto:""}));}}>Registrar deuda</Btn>
            </div>
            <div style={S.sec}>Registro <span style={{fontSize:".85rem",color:C.muted,fontWeight:400}}>{deudas.filter(d=>!d.pagado).length} pendientes</span></div>
            <div style={{...S.card,padding:0,overflow:"hidden"}}>
              {deudas.length===0?<div style={{padding:"3rem",textAlign:"center",color:C.muted}}>Sin deudas.</div>:(
                <table style={S.tbl}><thead><tr><th style={S.th}>Alumno</th><th style={S.th}>Ano</th><th style={S.th}>Descripcion</th><th style={S.th}>Monto</th><th style={S.th}>Estado</th><th style={S.th}></th></tr></thead>
                <tbody>{deudas.map(d=>{const al=alumnos.find(a=>a.id===d.sid);return <tr key={d.id}><td style={S.td}>{al?.nombre||"-"}</td><td style={{...S.td,color:C.muted}}>{d.anio}</td><td style={S.td}>{d.descripcion}</td><td style={{...S.td,color:d.pagado?C.green:C.red,fontVariantNumeric:"tabular-nums"}}>- {pesos(d.monto)}</td><td style={S.td}>{d.pagado?<Badge type="paid">Pagada</Badge>:<Badge type="pending">Pendiente</Badge>}</td><td style={S.td}><div style={{display:"flex",gap:".4rem"}}>{!d.pagado&&<Btn onClick={()=>setCurso(c=>({...c,deudas:c.deudas.map(x=>x.id===d.id?{...x,pagado:true}:x)}))} sm>Pagada</Btn>}<Btn onClick={()=>setCurso(c=>({...c,deudas:c.deudas.filter(x=>x.id!==d.id)}))} color="red" sm>x</Btn></div></td></tr>;})}
                </tbody></table>
              )}
            </div>
          </div>
        )}

        {tab==="reportes"&&(
          <div>
            <div style={{background:"rgba(212,175,100,.06)",border:"1px solid rgba(212,175,100,.15)",borderRadius:10,padding:".85rem 1rem",fontSize:".83rem",color:"rgba(232,226,213,.55)",lineHeight:1.6,marginBottom:"1.5rem"}}>Genera reportes CSV para abrir en Excel o Google Sheets.</div>
            <div style={S.card}>
              <div style={S.sec}>Aportes</div>
              <div style={{fontSize:".82rem",color:C.muted,marginBottom:"1rem"}}>Todos los aportes registrados: alumno, tipo, monto, fecha, anticipo.</div>
              <Btn onClick={()=>{const rows=[["Alumno","Apoderado","Tipo","Descripcion","Monto","Fecha","Anticipo"]];[...aportes].sort((a,b)=>a.fecha.localeCompare(b.fecha)).forEach(a=>{const al=alumnos.find(x=>x.id===a.sid);rows.push([al?.nombre||"-",al?.apoderado||"-",a.tipoId||"otro",a.nota,a.monto,a.fecha,a.anticipo?"Si":"No"]);});exportCSV(rows,"aportes.csv");}}>Descargar aportes (.csv)</Btn>
            </div>
            <div style={S.card}>
              <div style={S.sec}>Gastos</div>
              <div style={{fontSize:".82rem",color:C.muted,marginBottom:"1rem"}}>Todos los gastos: descripcion, categoria, monto, fecha.</div>
              <Btn onClick={()=>{const rows=[["Descripcion","Categoria","Monto","Fecha"]];[...gastos].sort((a,b)=>a.fecha.localeCompare(b.fecha)).forEach(g=>rows.push([g.descripcion,g.categoria,g.monto,g.fecha]));exportCSV(rows,"gastos.csv");}}>Descargar gastos (.csv)</Btn>
            </div>
            <div style={S.card}>
              <div style={S.sec}>Resumen por alumno</div>
              <div style={{fontSize:".82rem",color:C.muted,marginBottom:"1rem"}}>Un registro por alumno con totales consolidados.</div>
              <Btn onClick={()=>{const rows=[["Alumno","Apoderado","Total pagado","Liberado","En anticipo","Deuda hist.","Pendiente año","Tipo"]];alumnos.forEach(a=>{const lib=calcLiberado(a.id,aportes,reservas,now);const ant=calcAnticipo(a.id,aportes,reservas,now);const pag=calcPagadoBruto(a.id,aportes,reservas);const dh=deudas.filter(d=>d.sid===a.id&&!d.pagado).reduce((s,d)=>s+d.monto,0);const pend=Math.max(0,TOTAL_ANUAL-pag);const hasR=reservas.some(r=>r.sid===a.id);rows.push([a.nombre,a.apoderado||"-",pag,lib,ant,dh,pend,hasR?"Pago anual":pag>0?"Cuotas":"Sin aportes"]);});exportCSV(rows,"resumen.csv");}}>Descargar resumen (.csv)</Btn>
            </div>

            <div style={S.card}>
              <div style={S.sec}>Reporte de morosos</div>
              <div style={{fontSize:".82rem",color:C.muted,marginBottom:"1rem"}}>
                Lista de alumnos con cuotas vencidas del año actual y/o deudas históricas pendientes, con el detalle de lo que deben.
              </div>
              {(()=>{
                const mesActual = now.getMonth();
                const morosos = alumnos.map(a => {
                  const pagas = cuotasPagas(a.id, aportes, reservas);
                  const vencidas = [];
                  if (!pagas.has("caja_chica")) vencidas.push({concepto:"Caja chica", monto:CAJA_CHICA});
                  CUOTA_ORDER.forEach(c => {
                    if (CUOTA_MES[c] <= mesActual && !pagas.has(c)) {
                      vencidas.push({concepto:TIPOS.find(t=>t.id===c)?.nota||c, monto:CUOTA_MENSUAL});
                    }
                  });
                  const deudasHist = deudas.filter(d => d.sid===a.id && !d.pagado);
                  const totalVencido = vencidas.reduce((s,x)=>s+x.monto,0);
                  const totalDeudaHist = deudasHist.reduce((s,d)=>s+d.monto,0);
                  return {alumno:a, vencidas, deudasHist, totalVencido, totalDeudaHist, total:totalVencido+totalDeudaHist};
                }).filter(m => m.total > 0);

                return (
                  <div>
                    {morosos.length === 0 ? (
                      <div style={{background:"rgba(111,207,151,.08)",border:"1px solid rgba(111,207,151,.2)",borderRadius:10,padding:"1rem",textAlign:"center",color:C.green,marginBottom:"1rem"}}>
                        Sin morosos — todos al día
                      </div>
                    ) : (
                      <div style={{marginBottom:"1rem"}}>
                        <div style={{...S.card,padding:0,overflow:"hidden",marginBottom:".85rem"}}>
                          <table style={S.tbl}>
                            <thead><tr><th style={S.th}>Alumno</th><th style={S.th}>Apoderado</th><th style={S.th}>Detalle deuda</th><th style={S.th}>Total vencido</th><th style={S.th}>Deuda hist.</th><th style={S.th}>Total</th></tr></thead>
                            <tbody>
                              {morosos.map(m => (
                                <tr key={m.alumno.id}>
                                  <td style={S.td}>{m.alumno.nombre}</td>
                                  <td style={{...S.td,color:C.muted}}>{m.alumno.apoderado||"-"}</td>
                                  <td style={S.td}>
                                    <div style={{fontSize:".78rem",color:C.muted,lineHeight:1.6}}>
                                      {m.vencidas.map((v,i)=><div key={i}>{v.concepto}: <span style={{color:C.red}}>{pesos(v.monto)}</span></div>)}
                                      {m.deudasHist.map(d=><div key={d.id}>{d.anio} - {d.descripcion}: <span style={{color:C.red}}>{pesos(d.monto)}</span></div>)}
                                    </div>
                                  </td>
                                  <td style={{...S.td,color:C.red,fontVariantNumeric:"tabular-nums"}}>{m.totalVencido>0?pesos(m.totalVencido):"-"}</td>
                                  <td style={{...S.td,color:C.red,fontVariantNumeric:"tabular-nums"}}>{m.totalDeudaHist>0?pesos(m.totalDeudaHist):"-"}</td>
                                  <td style={{...S.td,color:C.red,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{pesos(m.total)}</td>
                                </tr>
                              ))}
                              <tr>
                                <td style={{...S.td,fontWeight:600}} colSpan={5}>Total deuda del curso</td>
                                <td style={{...S.td,color:C.red,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{pesos(morosos.reduce((s,m)=>s+m.total,0))}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    <Btn onClick={()=>{
                      const rows=[["Alumno","Apoderado","Concepto","Monto","Tipo deuda"]];
                      morosos.forEach(m=>{
                        m.vencidas.forEach(v=>rows.push([m.alumno.nombre,m.alumno.apoderado||"-",v.concepto,v.monto,"Cuota vencida año actual"]));
                        m.deudasHist.forEach(d=>rows.push([m.alumno.nombre,m.alumno.apoderado||"-",d.anio+" - "+d.descripcion,d.monto,"Deuda histórica"]));
                      });
                      exportCSV(rows,"morosos.csv");
                    }} color="red">Descargar morosos (.csv)</Btn>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {tab==="ajustes"&&(
          <div>
            <div style={S.card}>
              <div style={S.sec}>Nombre del curso</div>
              {editNombre?(
                <div>
                  <Campo label="Nombre"><input style={S.inp} type="text" value={tmpNombre} onChange={e=>setTmpNombre(e.target.value)} placeholder="Ej: Tesoreria 5to Basico"/></Campo>
                  <div style={{display:"flex",gap:".65rem",marginTop:".85rem"}}><Btn onClick={()=>{setCurso(c=>({...c,nombre:tmpNombre}));setEditNombre(false);}}>Guardar</Btn><Btn color="ghost" onClick={()=>{setTmpNombre(curso.nombre);setEditNombre(false);}}>Cancelar</Btn></div>
                </div>
              ):(
                <div style={{display:"flex",alignItems:"center",gap:"1rem"}}><div style={{fontFamily:"Georgia,serif",fontSize:"1.25rem",color:C.gold}}>{curso.nombre}</div><Btn onClick={()=>{setTmpNombre(curso.nombre);setEditNombre(true);}} color="ghost" sm>Editar</Btn></div>
              )}
            </div>

            <div style={S.card}>
              <div style={S.sec}>Codigo del curso</div>
              <div style={{fontSize:".82rem",color:C.muted,marginBottom:"1rem"}}>Comparte este codigo para que los apoderados puedan acceder.</div>
              {!editCodigo?(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1rem"}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:"1.8rem",color:C.gold,letterSpacing:".15em",background:"rgba(212,175,100,.08)",border:"1px solid rgba(212,175,100,.2)",borderRadius:10,padding:".5rem 1.25rem"}}>{curso.codigoCurso}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:".4rem"}}>
                      <Btn onClick={()=>{try{navigator.clipboard.writeText(curso.codigoCurso).then(()=>{setCopiado(true);setTimeout(()=>setCopiado(false),2000);});}catch(e){setCopiado(true);setTimeout(()=>setCopiado(false),2000);}}} color="ghost" sm>{copiado?"Copiado!":"Copiar"}</Btn>
                      <Btn onClick={()=>{setTmpCodigo(curso.codigoCurso);setEditCodigo(true);}} color="ghost" sm>Cambiar</Btn>
                    </div>
                  </div>
                  <div style={{fontSize:".78rem",color:"rgba(232,226,213,.35)",lineHeight:1.6}}>Comparte este codigo por WhatsApp o en la reunion. Todos deben ingresarlo para acceder.</div>
                </div>
              ):(
                <div>
                  <Campo label="Nuevo codigo"><input style={{...S.inp,textTransform:"uppercase",letterSpacing:".15em",textAlign:"center"}} value={tmpCodigo} onChange={e=>setTmpCodigo(e.target.value.toUpperCase())} placeholder="Ej: CIAP2026"/></Campo>
                  <div style={{display:"flex",gap:".65rem",marginTop:".85rem"}}><Btn onClick={()=>{if(tmpCodigo.length>=4){setCurso(c=>({...c,codigoCurso:tmpCodigo}));setEditCodigo(false);}}} >Guardar</Btn><Btn color="ghost" onClick={()=>setEditCodigo(false)}>Cancelar</Btn></div>
                </div>
              )}
            </div>

            <div style={S.card}>
              <div style={S.sec}>Contrasena de administrador</div>
              {!editAdminPw?(
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:C.muted,fontSize:".85rem"}}>Contraseña: •••••••</span>
                  <Btn onClick={()=>{setEditAdminPw(true);setAdminPwf({actual:"",nueva:"",confirma:""});setAdminPwMsg("");}} color="ghost" sm>Cambiar</Btn>
                </div>
              ):(
                <div>
                  <div style={S.fgrid}>
                    <Campo label="Contraseña actual"><input style={S.inp} type="password" value={adminPwf.actual} onChange={e=>setAdminPwf(f=>({...f,actual:e.target.value}))} placeholder="Actual"/></Campo>
                    <Campo label="Nueva contraseña"><input style={S.inp} type="password" value={adminPwf.nueva} onChange={e=>setAdminPwf(f=>({...f,nueva:e.target.value}))} placeholder="Minimo 4"/></Campo>
                    <Campo label="Confirmar"><input style={S.inp} type="password" value={adminPwf.confirma} onChange={e=>setAdminPwf(f=>({...f,confirma:e.target.value}))}/></Campo>
                  </div>
                  {adminPwMsg&&<div style={{color:adminPwMsg.startsWith("OK")?C.green:C.red,fontSize:".82rem",marginBottom:".65rem"}}>{adminPwMsg}</div>}
                  <div style={{display:"flex",gap:".65rem"}}>
                    <Btn color="gold" onClick={()=>{if(adminPwf.actual!==curso.adminPw){setAdminPwMsg("Contraseña actual incorrecta.");return;}if(adminPwf.nueva.length<4){setAdminPwMsg("Mínimo 4 caracteres.");return;}if(adminPwf.nueva!==adminPwf.confirma){setAdminPwMsg("No coinciden.");return;}setCurso(c=>({...c,adminPw:adminPwf.nueva}));setEditAdminPw(false);setAdminPwMsg("OK - Actualizada.");}}>Guardar</Btn>
                    <Btn color="ghost" onClick={()=>{setEditAdminPw(false);setAdminPwMsg("");}}>Cancelar</Btn>
                  </div>
                </div>
              )}
            </div>

            <div style={S.card}>
              <div style={S.sec}>Contrasenas de apoderados</div>
              <div style={{fontSize:".82rem",color:C.muted,marginBottom:"1rem"}}>Resetea la contrasena de un apoderado si la olvido.</div>
              <div style={{...S.card,padding:0,overflow:"hidden"}}>
                <table style={S.tbl}><thead><tr><th style={S.th}>Alumno</th><th style={S.th}>Apoderado</th><th style={S.th}>Estado</th><th style={S.th}>Accion</th></tr></thead>
                <tbody>{alumnos.map(a=>{const tiene=!!curso.claves[a.id];return <tr key={a.id}><td style={S.td}>{a.nombre}</td><td style={{...S.td,color:C.muted}}>{a.apoderado||"-"}</td><td style={S.td}>{tiene?<Badge type="paid">Activa</Badge>:<Badge type="pending">Sin cuenta</Badge>}</td><td style={S.td}>{tiene?<Btn onClick={()=>setCurso(c=>{const n={...c.claves};delete n[a.id];return {...c,claves:n};})} color="yellow" sm>Resetear</Btn>:<span style={{color:C.muted,fontSize:".8rem"}}>-</span>}</td></tr>;})}
                </tbody></table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [cursos, setCursos] = useState([CURSO_DEMO]);
  const [cursoActivo, setCursoActivo] = useState(null);
  const [pantalla, setPantalla] = useState("codigo");  // codigo | crear | rol | apoderado-login | portal | publico | admin
  const [apoderado, setApoderado] = useState(null);

  const setCursoActivoData = (updater) => {
    setCursos(cs => cs.map(c => c.id === cursoActivo.id ? (typeof updater === "function" ? updater(c) : updater) : c));
    setCursoActivo(c => typeof updater === "function" ? updater(c) : updater);
  };

  const salir = () => { setCursoActivo(null); setApoderado(null); setPantalla("codigo"); };

  const cursoByCodigo = (cod) => cursos.find(c => c.codigoCurso === cod.toUpperCase());

  if (pantalla === "codigo")
    return <PantallaCodigo cursos={cursos} onAcceder={c=>{setCursoActivo(c);setPantalla("rol");}} onCrearCurso={()=>setPantalla("crear")}/>;

  if (pantalla === "crear")
    return <PantallaCrearCurso cursos={cursos} onCursoCreado={c=>{setCursos(cs=>[...cs,c]);setCursoActivo(c);setPantalla("rol");}} onVolver={()=>setPantalla("codigo")}/>;

  if (pantalla === "rol")
    return <PantallaRol curso={cursoActivo} onElegirRol={rol=>{if(rol==="admin")setPantalla("admin");else if(rol==="apoderado")setPantalla("apoderado-login");else setPantalla("publico");}} onVolver={salir}/>;

  if (pantalla === "apoderado-login")
    return <LoginApoderado curso={cursoActivo} setCurso={setCursoActivoData} onLogin={a=>{setApoderado(a);setPantalla("portal");}} onVolver={()=>setPantalla("rol")}/>;

  if (pantalla === "publico")
    return <VistaPublica curso={cursoActivo} onVolver={()=>setPantalla("rol")}/>;

  if (pantalla === "portal")
    return <PortalApoderado alumno={apoderado} curso={cursoActivo} setCurso={setCursoActivoData} onSalir={salir}/>;

  if (pantalla === "admin")
    return <Admin curso={cursoActivo} setCurso={setCursoActivoData} onSalir={salir}/>;

  return null;
}
