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
  nombre: "Tesoreria 4to Básico",
  codigoCurso: "CIAP2026",
  adminPw: "tesorero2026",
  historialAnios: [],
  saldoAnterior: 0,
  cobros: [],
  alumnos: [
    {id:1,  nombre:"Acevedo Mesina Maximo Alejandro",      apoderado:""},
    {id:2,  nombre:"Aguilar Manzo Blanca Antonia",          apoderado:""},
    {id:3,  nombre:"Aguirre Quiñones Alfonso Mariaño",      apoderado:""},
    {id:4,  nombre:"Alvarado Muñoz Julieta Esperanza",      apoderado:""},
    {id:5,  nombre:"Aranda Vasquez Valentina Paz",          apoderado:""},
    {id:6,  nombre:"Araneda Jorquera Dante Eloy",           apoderado:""},
    {id:7,  nombre:"Arenas Mora Emilia Antonia",            apoderado:""},
    {id:8,  nombre:"Barrera Arce Josefa Antonia",           apoderado:""},
    {id:9,  nombre:"Bravo Valderrama Santiago Nicolas",     apoderado:""},
    {id:10, nombre:"Campos Berrera Mateo Ignacio",          apoderado:""},
    {id:11, nombre:"Candía Vidal Militza Constanza",        apoderado:""},
    {id:12, nombre:"Carrasco Zúñiga Emilio Javier",         apoderado:""},
    {id:13, nombre:"Castro Gonzalez Matilde Lucia",         apoderado:""},
    {id:14, nombre:"Cortes Opazo Joaquin Alonso",           apoderado:""},
    {id:15, nombre:"Espinoza Balduzzi Josefina Andrea",     apoderado:""},
    {id:16, nombre:"Fuentes Gutierrez Cristobal Ignacio",   apoderado:""},
    {id:17, nombre:"Gomez Urriola Europa Valentina",        apoderado:""},
    {id:18, nombre:"Gonzalez Serraño Macarena del Rosario", apoderado:""},
    {id:19, nombre:"Herrera Vinet Fernanda Andrea",         apoderado:""},
    {id:20, nombre:"Huaiquivil Araya Agustina Amparo",      apoderado:""},
    {id:21, nombre:"Jara Vinet Javiera Ignacia",            apoderado:""},
    {id:22, nombre:"Navarro Aviles Gaspar Alonso",          apoderado:""},
    {id:23, nombre:"Rivas Millares Benjamin Ignacio",       apoderado:""},
    {id:24, nombre:"Rodriguez Hernandez Mateo Alonso",      apoderado:""},
    {id:25, nombre:"Sartori San Martin Amelia Trinidad",    apoderado:""},
    {id:26, nombre:"Sartori San Martin Pedro Ignacio",      apoderado:""},
    {id:27, nombre:"Silva Zambraño Rafaella Victoria",      apoderado:""},
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
  const mes = CUOTA_MES[tipoId]; // 0-indexed month
  const vencimiento = new Date(now.getFullYear(), mes, 5); // 05 del mes
  return now > vencimiento; // vence el 06, el 05 es vigente
}

function estaVencida(tipoId, now) {
  // Una cuota está vencida si ya pasó el día 05 de su mes y no fue pagada
  if (!CUOTA_MES[tipoId]) return false;
  const mes = CUOTA_MES[tipoId];
  const vencimiento = new Date(now.getFullYear(), mes, 5);
  return now > vencimiento;
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

// Meta esperada a la fecha: caja chica de todos + cuotas de meses transcurridos
function calcMetaAFecha(nAlumnos, now, cobros=[]) {
  const cuotasVencidas = CUOTA_ORDER.filter(c => estaVencida(c, now)).length;
  const baseMeta = nAlumnos * (CAJA_CHICA + cuotasVencidas * CUOTA_MENSUAL);
  // Add cobros classified as "Meta de recaudación"
  const cobrosMeta = (cobros||[]).filter(co=>co.clasificacion==="Meta de recaudación")
    .reduce((s,co)=>s+co.alumnosIds.length*co.monto,0);
  return baseMeta + cobrosMeta;
}

// Meta esperada para un alumno específico a la fecha
function calcMetaAlumnoAFecha(now, sid, cobros=[]) {
  const cuotasVencidas = CUOTA_ORDER.filter(c => estaVencida(c, now)).length;
  const base = CAJA_CHICA + cuotasVencidas * CUOTA_MENSUAL;
  const cobrosMeta = (cobros||[]).filter(co=>co.clasificacion==="Meta de recaudación"&&co.alumnosIds.includes(sid))
    .reduce((s,co)=>s+co.monto,0);
  return base + cobrosMeta;
}

// ─── GENERAR PDF ESTADO DE CUENTA ────────────────────────────────────────────
function generarPDF(alumno, curso, aportes, reservas, gastos, deudas, cobros, now) {
  const pagas = cuotasPagas(alumno.id, aportes, reservas);
  const pagado = calcPagadoBruto(alumno.id, aportes, reservas);
  const metaAlu = calcMetaAlumnoAFecha(now,sid,cobros||[]);
  const diff = pagado - metaAlu;
  const mesActual = now.getMonth();
  const totalLib = [alumno].reduce((s,a)=>s, 0); // placeholder
  const totalLibCurso = curso.alumnos.reduce((s,a)=>s+calcLiberado(a.id,aportes,reservas,now),0);
  const totalGastoCurso = gastos.reduce((s,g)=>s+g.monto,0);
  const saldoCurso = totalLibCurso - totalGastoCurso;
  const pagadosN = new Set([...aportes.map(a=>a.sid),...reservas.map(r=>r.sid)]).size;
  const metaFecha = calcMetaAFecha(curso.alumnos.length, now, curso.cobros||[]);
  const pendVenc = [];
  if (!pagas.has("caja_chica")) pendVenc.push({label:"Caja chica", monto:CAJA_CHICA});
  CUOTA_ORDER.forEach(c=>{if(CUOTA_MES[c]<=mesActual&&!pagas.has(c))pendVenc.push({label:TIPOS.find(t=>t.id===c)?.nota||c,monto:CUOTA_MENSUAL});});
  const pendProx = CUOTA_ORDER.filter(c=>CUOTA_MES[c]>mesActual&&!pagas.has(c)).map(c=>({label:TIPOS.find(t=>t.id===c)?.nota||c,monto:CUOTA_MENSUAL}));
  const deudaHist = deudas.filter(d=>d.sid===alumno.id&&!d.pagado);
  const cobrosAlu = (cobros||[]).filter(co=>co.alumnosIds.includes(alumno.id));
  const misAportes = aportes.filter(a=>a.sid===alumno.id);
  const fechaHoy = now.toLocaleDateString("es-CL",{day:"numeric",month:"long",year:"numeric"});

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>Estado de Cuenta - ${alumno.nombre}</title>
<style>
  body{font-family:Arial,sans-serif;color:#222;margin:0;padding:0;background:#fff;}
  .page{max-width:720px;margin:0 auto;padding:2rem;}
  .header{background:#1a1f2e;color:#d4af64;padding:1.5rem 2rem;border-radius:8px;margin-bottom:1.5rem;}
  .header h1{margin:0;font-size:1.4rem;font-family:Georgia,serif;}
  .header p{margin:.3rem 0 0;font-size:.85rem;color:rgba(232,226,213,.6);}
  .badge{display:inline-block;padding:2px 10px;border-radius:20px;font-size:.75rem;font-weight:700;margin-left:.5rem;}
  .badge-green{background:#d4edda;color:#155724;}
  .badge-red{background:#f8d7da;color:#721c24;}
  .badge-blue{background:#d1ecf1;color:#0c5460;}
  .section{margin-bottom:1.5rem;}
  .section h2{font-size:1rem;font-family:Georgia,serif;color:#1a1f2e;border-bottom:2px solid #d4af64;padding-bottom:.4rem;margin-bottom:.75rem;}
  .row{display:flex;justify-content:space-between;padding:.4rem 0;border-bottom:1px solid #f0f0f0;font-size:.88rem;}
  .row .label{color:#555;}
  .row .value{font-weight:600;}
  .value-green{color:#155724;}
  .value-red{color:#721c24;}
  .value-blue{color:#0c5460;}
  .value-gold{color:#856404;}
  table{width:100%;border-collapse:collapse;font-size:.85rem;margin-top:.5rem;}
  th{background:#f8f9fa;text-align:left;padding:.5rem .75rem;font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;color:#666;border-bottom:2px solid #dee2e6;}
  td{padding:.5rem .75rem;border-bottom:1px solid #f0f0f0;}
  .total-row td{font-weight:700;background:#f8f9fa;}
  .footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #dee2e6;font-size:.75rem;color:#999;text-align:center;}
  .summary-box{background:#f8f9fa;border-left:4px solid #d4af64;padding:1rem;border-radius:0 8px 8px 0;margin-bottom:1rem;}
  .alert-green{background:#d4edda;border:1px solid #c3e6cb;border-radius:6px;padding:.75rem 1rem;color:#155724;font-size:.88rem;}
  .alert-red{background:#f8d7da;border:1px solid #f5c6cb;border-radius:6px;padding:.75rem 1rem;color:#721c24;font-size:.88rem;}
  @medía print{body{margin:0;}button{display:none!important;}.page{padding:1rem;}}
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <h1>${curso.nombre}</h1>
    <p>Estado de cuenta individual &mdash; ${fechaHoy}</p>
  </div>

  <div class="section">
    <h2>Datos del alumno</h2>
    <div class="row"><span class="label">Alumno/a</span><span class="value">${alumno.nombre}</span></div>
    ${alumno.apoderado?`<div class="row"><span class="label">Apoderado 1</span><span class="value">${alumno.apoderado}</span></div>`:""}
    ${alumno.apoderado2?`<div class="row"><span class="label">Apoderado 2</span><span class="value">${alumno.apoderado2}</span></div>`:""}
  </div>

  <div class="section">
    <h2>Resumen de pagos</h2>
    <div class="row"><span class="label">Total pagado</span><span class="value value-green">${pesos(pagado)}</span></div>
    <div class="row"><span class="label">Debería llevar pagado a la fecha</span><span class="value value-gold">${pesos(metaAlu)}</span></div>
    <div class="row"><span class="label">Diferencia</span><span class="value ${diff>=0?"value-green":"value-red"}">${diff>=0?"+":"-"} ${pesos(Math.abs(diff))}</span></div>
    <br/>
    <div class="${diff>=0?"alert-green":"alert-red"}">
      ${diff>=0?"✓ Estado: Al día — lleva "+pesos(diff)+" adelantado":"⚠ Estado: Pendiente — falta "+pesos(Math.abs(diff))+" para estar al día"}
    </div>
  </div>

  ${pendVenc.length>0?`
  <div class="section">
    <h2>Pagos vencidos pendientes</h2>
    <table><thead><tr><th>Concepto</th><th>Monto</th></tr></thead><tbody>
    ${pendVenc.map(it=>`<tr><td>${it.label}</td><td>${pesos(it.monto)}</td></tr>`).join("")}
    <tr class="total-row"><td>Total vencido</td><td>${pesos(pendVenc.reduce((s,x)=>s+x.monto,0))}</td></tr>
    </tbody></table>
  </div>`:""}

  ${pendProx.length>0?`
  <div class="section">
    <h2>Próximos vencimientos</h2>
    <table><thead><tr><th>Concepto</th><th>Monto</th></tr></thead><tbody>
    ${pendProx.map(it=>`<tr><td>${it.label}</td><td>${pesos(it.monto)}</td></tr>`).join("")}
    <tr class="total-row"><td>Total próximo</td><td>${pesos(pendProx.reduce((s,x)=>s+x.monto,0))}</td></tr>
    </tbody></table>
  </div>`:""}

  ${deudaHist.length>0?`
  <div class="section">
    <h2>Deuda histórica</h2>
    <table><thead><tr><th>Año</th><th>Descripción</th><th>Monto</th></tr></thead><tbody>
    ${deudaHist.map(d=>`<tr><td>${d.anio}</td><td>${d.descripción}</td><td>${pesos(d.monto)}</td></tr>`).join("")}
    <tr class="total-row"><td colspan="2">Total deuda histórica</td><td>${pesos(deudaHist.reduce((s,d)=>s+d.monto,0))}</td></tr>
    </tbody></table>
  </div>`:""}

  ${cobrosAlu.length>0?`
  <div class="section">
    <h2>Cobros extraordinarios</h2>
    <table><thead><tr><th>Cobro</th><th>Vencimiento</th><th>Monto</th><th>Estado</th></tr></thead><tbody>
    ${cobrosAlu.map(co=>{const est=(co.pagos||{})[alumno.id]||"pendiente";return `<tr><td>${co.nombre}</td><td>${fFecha(co.vencimiento)}</td><td>${pesos(co.monto)}</td><td>${est==="pagado"?"Pagado":est==="aviso"?"En verificación":"Pendiente"}</td></tr>`;}).join("")}
    </tbody></table>
  </div>`:""}

  ${misAportes.length>0?`
  <div class="section">
    <h2>Historial de aportes</h2>
    <table><thead><tr><th>Fecha</th><th>Descripción</th><th>Monto</th></tr></thead><tbody>
    ${misAportes.map(a=>`<tr><td>${fFecha(a.fecha)}</td><td>${a.nota}</td><td>${pesos(a.monto)}</td></tr>`).join("")}
    <tr class="total-row"><td colspan="2">Total pagado</td><td>${pesos(pagado)}</td></tr>
    </tbody></table>
  </div>`:""}

  <div class="section">
    <h2>Resumen general del curso</h2>
    <div class="summary-box">
      <div class="row"><span class="label">Alumnos en el curso</span><span class="value">${curso.alumnos.length}</span></div>
      <div class="row"><span class="label">Han pagado</span><span class="value value-green">${pagadosN} de ${curso.alumnos.length}</span></div>
      <div class="row"><span class="label">Meta a la fecha</span><span class="value value-gold">${pesos(metaFecha)}</span></div>
      <div class="row"><span class="label">Total recaudado</span><span class="value value-green">${pesos(totalLibCurso)}</span></div>
      <div class="row"><span class="label">Total gastos</span><span class="value value-red">${pesos(totalGastoCurso)}</span></div>
      <div class="row"><span class="label">Saldo disponible</span><span class="value value-green">${pesos(saldoCurso)}</span></div>
    </div>
  </div>

  <div class="footer">
    Documento generado el ${fechaHoy} &mdash; ${curso.nombre} &mdash; TesoAPP
  </div>
</div>
<script>window.onload=()=>{const btn=document.createElement("button");btn.textContent="Guardar como PDF (Ctrl+P / Imprimir)";btn.style.cssText="position:fixed;top:1rem;right:1rem;background:#1a1f2e;color:#d4af64;border:1px solid #d4af64;padding:.6rem 1.2rem;border-radius:8px;cursor:pointer;font-size:.9rem;font-weight:600;z-index:999;";btn.onclick=()=>window.print();document.body.appendChild(btn);};</script>
</body>
</html>`;

  // Use data URI to open in new tab - works in sandboxed environments
  const encoded = "data:text/html;charset=utf-8," + encodeURIComponent(html);
  const link = document.createElement("a");
  link.setAttribute("href", encoded);
  link.setAttribute("download", "estado_cuenta_" + alumno.nombre.replace(/ /g,"_") + ".html");
  link.setAttribute("target", "_blank");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


// ─── ESTILOS ─────────────────────────────────────────────────────────────────
const C = {gold:"#e8b84b",green:"#3dd68c",red:"#f05a6a",blue:"#60a5fa",yellow:"#fbbf24",bg:"#0f1117",card:"#1a2035",muted:"rgba(148,163,184,.6)",text:"#e2e8f0"};
const S = {
  app:  {minHeight:"100vh",color:C.text,fontFamily:"Calibri,'Trebuchet MS',sans-serif",backgroundColor:"#0f1117",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect x='20' y='30' width='40' height='50' rx='3' fill='none' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3Cline x1='40' y1='30' x2='40' y2='80' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3Cline x1='45' y1='38' x2='55' y2='38' stroke='%23e8b84b' stroke-width='1' opacity='0.06'/%3E%3Cline x1='45' y1='44' x2='55' y2='44' stroke='%23e8b84b' stroke-width='1' opacity='0.06'/%3E%3Crect x='110' y='15' width='8' height='45' rx='1' transform='rotate(30 114 37)' fill='none' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3Ccircle cx='200' cy='50' r='18' fill='none' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3Crect x='280' y='20' width='12' height='55' rx='2' fill='none' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3Crect x='350' y='25' width='35' height='45' rx='4' fill='none' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3Crect x='30' y='140' width='45' height='50' rx='8' fill='none' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3Cpolygon points='160,130 164,143 178,143 167,151 171,164 160,156 149,164 153,151 142,143 156,143' fill='none' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3Ccircle cx='240' cy='150' r='25' fill='none' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3Crect x='130' y='250' width='50' height='60' rx='3' fill='none' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3Ccircle cx='250' cy='280' r='22' fill='none' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3Crect x='20' y='345' width='70' height='45' rx='3' fill='none' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3Ccircle cx='160' cy='365' r='7' fill='none' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3Cpath d='M260 375 Q265 350 270 340 Q275 350 280 375' fill='none' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3Cline x1='340' y1='340' x2='355' y2='385' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3Cline x1='370' y1='340' x2='355' y2='385' stroke='%23e8b84b' stroke-width='1.2' opacity='0.08'/%3E%3C/svg%3E\")",backgroundSize:"400px 400px",backgroundRepeat:"repeat"},
  hdr:  {background:"#131929",borderBottom:"2px solid rgba(232,184,75,.2)",boxShadow:"0 2px 12px rgba(0,0,0,.4)",borderBottom:"1px solid rgba(212,175,100,.2)",padding:"0 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,position:"sticky",top:0,zIndex:100,gap:"1rem"},
  main: {padding:"1rem",maxWidth:960,margin:"0 auto"},
  card: {background:"#1a2035",border:"1px solid rgba(96,165,250,.12)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1rem",boxShadow:"0 4px 16px rgba(0,0,0,.3)"},
  grid: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(165px,1fr))",gap:"1rem",marginBottom:"1.5rem"},
  inp:  {width:"100%",maxWidth:"100%",boxSizing:"border-box",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,padding:".6rem .85rem",color:C.text,fontFamily:"inherit",fontSize:".88rem",outline:"none"},
  lbl:  {display:"block",fontSize:".72rem",color:C.muted,marginBottom:".35rem",textTransform:"uppercase",letterSpacing:".06em"},
  fgrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,220px),1fr))",gap:".75rem",marginBottom:".85rem"},
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
  return <div style={{display:"flex",gap:".2rem",background:"#131929",borderBottom:"1px solid rgba(96,165,250,.12)",padding:"0 1.5rem",overflowX:"auto"}}>{tabs.map(t=><button key={t.id} onClick={()=>onChange(t.id)} style={{padding:".65rem 1rem",border:"none",background:"transparent",color:active===t.id?C.gold:"rgba(232,226,213,.5)",cursor:"pointer",fontFamily:"inherit",fontSize:".82rem",borderBottom:active===t.id?"2px solid "+C.gold:"2px solid transparent",whiteSpace:"nowrap",transition:"all .2s"}}>{t.label}</button>)}</div>;
}
function PillTabs({tabs,active,onChange}) {
  return <div style={{display:"flex",gap:".4rem",background:"#131929",borderBottom:"1px solid rgba(96,165,250,.12)",padding:".6rem 1.5rem",overflowX:"auto"}}>{tabs.map(t=><button key={t.id} onClick={()=>onChange(t.id)} style={{padding:".3rem .85rem",borderRadius:20,border:active===t.id?"1px solid rgba(212,175,100,.4)":"1px solid rgba(255,255,255,.1)",background:active===t.id?"rgba(212,175,100,.12)":"transparent",color:active===t.id?C.gold:"rgba(232,226,213,.5)",cursor:"pointer",fontFamily:"inherit",fontSize:".8rem",transition:"all .2s",whiteSpace:"nowrap"}}>{t.label}</button>)}</div>;
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
  const [código, setCodigo] = useState("");
  const [err, setErr] = useState("");

  const intentar = () => {
    const c = código.trim().toUpperCase();
    if (!c) { setErr("Ingresa un código."); return; }
    const curso = cursos.find(x => x.codigoCurso === c);
    if (!curso) { setErr("Código incorrecto. Verifica con el tesorero de tu curso."); return; }
    onAcceder(curso);
  };

  return (
    <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
      <div style={{...S.card,maxWidth:420,width:"100%",textAlign:"center"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:".3rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:".6rem",marginBottom:".4rem"}}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="52" height="52" rx="12" fill="rgba(232,184,75,0.15)" stroke="rgba(232,184,75,0.4)" strokeWidth="1.5"/>
              <rect x="8" y="12" width="18" height="26" rx="2" stroke="#e8b84b" strokeWidth="1.5" fill="none"/>
              <line x1="17" y1="12" x2="17" y2="38" stroke="#e8b84b" strokeWidth="1.5"/>
              <line x1="19" y1="18" x2="24" y2="18" stroke="#e8b84b" strokeWidth="1" opacity="0.6"/>
              <line x1="19" y1="23" x2="24" y2="23" stroke="#e8b84b" strokeWidth="1" opacity="0.6"/>
              <line x1="19" y1="28" x2="24" y2="28" stroke="#e8b84b" strokeWidth="1" opacity="0.5"/>
              <rect x="30" y="10" width="6" height="18" rx="1.5" transform="rotate(20 30 10)" stroke="#e8b84b" strokeWidth="1.3" fill="none"/>
              <polygon points="33,30 37,30 35,35" stroke="#e8b84b" strokeWidth="1.2" fill="none" transform="rotate(20 35 32)"/>
              <text x="29" y="48" fontSize="13" fontWeight="900" fill="#e8b84b" fontFamily="Arial,sans-serif" textAnchor="middle">$</text>
              <line x1="29" y1="36" x2="29" y2="50" stroke="#e8b84b" strokeWidth="1" opacity="0.5"/>
            </svg>
            <div style={{fontFamily:"Georgia,serif",fontSize:"2.4rem",color:C.gold,letterSpacing:".06em",fontWeight:400}}>TesoAPP</div>
          </div>
        </div>
        <div style={{color:C.muted,fontSize:".85rem",marginBottom:"2rem"}}>Ingresa el código de tu curso para continuar</div>

        <Campo label="Código del curso">
          <input
            style={{...S.inp,textTransform:"uppercase",letterSpacing:".2em",fontSize:"1.2rem",textAlign:"center"}}
            value={código}
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
  const [form, setForm] = useState({nombre:"", código:"", adminPw:"", adminPw2:""});
  const [err, setErr] = useState("");

  const crear = () => {
    if (!form.nombre.trim()) { setErr("Ingresa el nombre del curso."); return; }
    const c = form.código.trim().toUpperCase();
    if (c.length < 4) { setErr("El código debe tener al menos 4 caracteres."); return; }
    if (cursos.some(x=>x.codigoCurso===c)) { setErr("Ese código ya existe. Elige uno diferente."); return; }
    if (form.adminPw.length < 4) { setErr("La contraseña debe tener al menos 4 caracteres."); return; }
    if (form.adminPw !== form.adminPw2) { setErr("Las contraseñas no coinciden."); return; }
    const nuevo = {
      id: genId().toString(),
      nombre: form.nombre.trim(),
      codigoCurso: c,
      adminPw: form.adminPw,
      alumnos:[], aportes:[], gastos:[], claves:{}, notifs:[], reservas:[], deudas:[], cobros:[], historialAnios:[], saldoAnterior:0,
    };
    onCursoCreado(nuevo);
  };

  return (
    <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
      <div style={{...S.card,maxWidth:420,width:"100%"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:"1.4rem",color:C.gold,marginBottom:".3rem",textAlign:"center"}}>Crear nuevo curso</div>
        <div style={{color:C.muted,fontSize:".85rem",marginBottom:"1.5rem",textAlign:"center"}}>Este código sera el acceso para todos los miembros del curso</div>

        <div style={{display:"flex",flexDirection:"column",gap:".85rem",marginBottom:"1rem"}}>
          <Campo label="Nombre del curso">
            <input style={S.inp} type="text" value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))} placeholder="Ej: Tesoreria 4to Básico A"/>
          </Campo>
          <Campo label="Código del curso (para que ingresen todos)">
            <input style={{...S.inp,textTransform:"uppercase",letterSpacing:".15em",textAlign:"center"}} value={form.código} onChange={e=>setForm(f=>({...f,código:e.target.value.toUpperCase()}))} placeholder="Ej: CIAP2026"/>
          </Campo>
          <Campo label="Contraseña de administrador">
            <input style={S.inp} type="password" value={form.adminPw} onChange={e=>setForm(f=>({...f,adminPw:e.target.value}))} placeholder="Mínimo 4 caracteres"/>
          </Campo>
          <Campo label="Confirmar contraseña">
            <input style={S.inp} type="password" value={form.adminPw2} onChange={e=>setForm(f=>({...f,adminPw2:e.target.value}))} placeholder="Repite la contraseña"/>
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
        <Campo label="Contraseña de administrador">
          <input style={S.inp} type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false);}} onKeyDown={e=>e.key==="Enter"&&tryAdmin()} placeholder="Contraseña del tesorero"/>
        </Campo>
        {err && <div style={{color:C.red,fontSize:".8rem",marginTop:".4rem"}}>Contraseña incorrecta.</div>}
        <div style={{marginTop:".85rem",marginBottom:"1.25rem"}}>
          <Btn full onClick={tryAdmin}>Ingresar como administrador</Btn>
        </div>

        <Btn full color="ghost" onClick={onVolver}>Cambiar código de curso</Btn>
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
      else setErr("Contraseña incorrecta.");
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
              <div style={{background:"#1a2035",border:"1px solid rgba(212,175,100,.2)",borderRadius:10,maxHeight:200,overflowY:"auto"}}>
                {filtrados.map(a=><div key={a.id} onClick={()=>elegir(a)} style={{padding:".65rem 1rem",cursor:"pointer",fontSize:".88rem",borderBottom:"1px solid rgba(255,255,255,.04)"}}>{a.nombre}</div>)}
              </div>
            )}
            {busca.length>1&&filtrados.length===0&&<div style={{fontSize:".8rem",color:"rgba(232,226,213,.35)",marginTop:".4rem"}}>Sin resultados.</div>}
          </div>
        ) : (
          <div>
            <div style={{background:"rgba(126,184,247,.08)",border:"1px solid rgba(126,184,247,.2)",borderRadius:10,padding:".7rem 1rem",marginBottom:"1rem"}}>
              <div style={{fontSize:".68rem",color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:".2rem"}}>Alumno/a selecciónado</div>
              <div style={{color:C.blue,fontWeight:500}}>{sel.nombre}</div>
            </div>
            {esNuevo && <div style={{fontSize:".8rem",color:C.muted,marginBottom:".85rem"}}>Primera vez que ingresas. Crea tu contraseña:</div>}
            <div style={{display:"flex",flexDirection:"column",gap:".65rem",marginBottom:".65rem"}}>
              <Campo label={esNuevo?"Nueva contraseña":"Tu contraseña"}>
                <input style={S.inp} type="password" placeholder="Mínimo 4 caracteres" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>!esNuevo&&e.key==="Enter"&&ingresar()} autoFocus/>
              </Campo>
              {esNuevo && (
                <Campo label="Confirmar contraseña">
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
  const {alumnos,aportes,gastos,reservas,cobros=[]} = curso;
  const totalLib  = alumnos.reduce((s,a)=>s+calcLiberado(a.id,aportes,reservas,now),0);
  const totalAnt  = alumnos.reduce((s,a)=>s+calcAnticipo(a.id,aportes,reservas,now),0);
  const totalCobrosMeta = (cobros||[]).filter(co=>co.clasificacion==="Meta de recaudación").reduce((s,co)=>s+Object.keys(co.pagos||{}).filter(k=>(co.pagos||{})[k]==="pagado").length*co.monto,0);
  const totalLibConCobros = totalLib + totalCobrosMeta;
  const totalGasto = gastos.reduce((s,g)=>s+g.monto,0);
  const saldo     = totalLibConCobros + totalAnt - totalGasto;
  const pagIds    = new Set([...aportes.map(a=>a.sid),...reservas.map(r=>r.sid)]);
  const nPag      = pagIds.size;
  const nPend     = alumnos.length-nPag;
  const metaFechaVista = calcMetaAFecha(alumnos.length,now,cobros||[]);
  const pct       = Math.round(totalLibConCobros/(metaFechaVista||1)*100);

  return (
    <div style={S.app}>
      <div style={S.hdr}>
        <div style={{fontFamily:"Georgia,serif",color:C.gold,fontSize:"1rem"}}>{curso.nombre}</div>
        <Btn onClick={onVolver} color="ghost" sm>Volver</Btn>
      </div>
      <div style={S.main}>
        {(()=>{
          const alDia = alumnos.filter(a=>{
            const p=cuotasPagas(a.id,aportes,reservas);
            const tieneR=reservas.some(r=>r.sid===a.id);
            if(tieneR) return true;
            const venc=[];
            if(!p.has("caja_chica"))venc.push(1);
            CUOTA_ORDER.forEach(c=>{if(estaVencida(c,now)&&!p.has(c))venc.push(1);});
            return venc.length===0;
          }).length;
          const unMoroso = alumnos.filter(a=>{
            const p=cuotasPagas(a.id,aportes,reservas);
            if(reservas.some(r=>r.sid===a.id)) return false;
            let v=0;
            if(!p.has("caja_chica"))v++;
            CUOTA_ORDER.forEach(c=>{if(estaVencida(c,now)&&!p.has(c))v++;});
            return v===1;
          }).length;
          const masMoroso = alumnos.filter(a=>{
            const p=cuotasPagas(a.id,aportes,reservas);
            if(reservas.some(r=>r.sid===a.id)) return false;
            let v=0;
            if(!p.has("caja_chica"))v++;
            CUOTA_ORDER.forEach(c=>{if(estaVencida(c,now)&&!p.has(c))v++;});
            return v>1;
          }).length;
          return (
            <div style={S.grid}>
              <StatCard label="Alumnos"       value={alumnos.length} sub="En el curso"/>
              <StatCard label="Al día"        value={alDia}          sub="Familias al día" color="green"/>
              <StatCard label="1 cuota vencida" value={unMoroso}    sub="Familias"  color="yellow"/>
              <StatCard label="Más de 1 cuota vencida" value={masMoroso}  sub="Familias"  color="red"/>
              <StatCard label="Saldo en cuenta" value={pesos(saldo)} sub="Total recaudado - gastos" color="green"/>
            </div>
          );
        })()}
        {(()=>{
          const metaFecha = calcMetaAFecha(alumnos.length, now, cobros||[]);
          const diff = totalLib - metaFecha;
          const cuotasTrans = CUOTA_ORDER.filter(c=>estaVencida(c,now)).length;
          return (
            <div style={{background:"linear-gradient(135deg,#1a1f2e,#141c2a)",border:"1px solid rgba(212,175,100,.15)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.5rem"}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:"1rem",color:C.text,marginBottom:"1rem"}}>Recaudación esperada a la fecha</div>
              <div style={S.row}><span style={{color:C.muted}}>Caja chica ({alumnos.length} alumnos)</span><span style={{color:C.gold,fontVariantNumeric:"tabular-nums"}}>{pesos(alumnos.length*CAJA_CHICA)}</span></div>
              <div style={S.row}><span style={{color:C.muted}}>Cuotas ({cuotasTrans} mes{cuotasTrans!==1?"es":""} × {alumnos.length})</span><span style={{color:C.gold,fontVariantNumeric:"tabular-nums"}}>{pesos(alumnos.length*cuotasTrans*CUOTA_MENSUAL)}</span></div>
              {(cobros||[]).filter(co=>co.clasificacion==="Meta de recaudación").map(co=>(
                <div key={co.id} style={S.row}>
                  <span style={{color:C.muted}}>
                    <span style={{background:"rgba(126,184,247,.15)",color:"#7eb8f7",padding:"1px 5px",borderRadius:3,fontSize:".72rem",marginRight:".4rem"}}>Cobro</span>
                    {co.nombre} ({co.alumnosIds.length} alumnos)
                  </span>
                  <span style={{color:C.gold,fontVariantNumeric:"tabular-nums"}}>{pesos(co.alumnosIds.length*co.monto)}</span>
                </div>
              ))}
              <div style={{...S.div,margin:".75rem 0"}}/>
              <div style={S.row}><span style={{fontWeight:600}}>Meta a la fecha</span><span style={{fontFamily:"Georgia,serif",fontSize:"1.2rem",color:C.gold,fontVariantNumeric:"tabular-nums"}}>{pesos(metaFecha)}</span></div>
              <div style={S.row}><span style={{color:C.muted}}>Recaudado real</span><span style={{color:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(totalLibConCobros)}</span></div>
              <div style={{...S.div,margin:".75rem 0"}}/>
              <div style={S.row}><span style={{fontWeight:600}}>{diff>=0?"Superávit":"Déficit"}</span><span style={{fontFamily:"Georgia,serif",fontSize:"1.2rem",color:diff>=0?C.green:C.red,fontVariantNumeric:"tabular-nums"}}>{diff>=0?"+":""}{pesos(diff)}</span></div>
              <div style={{marginTop:".75rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:".72rem",color:C.muted,marginBottom:".4rem"}}><span>Avance sobre meta</span><span>{metaFecha>0?Math.round(totalLib/metaFecha*100):0}%</span></div>
                <ProgBar pct={metaFecha>0?totalLib/metaFecha*100:0}/>
              </div>
            </div>
          );
        })()}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1.5rem"}}>
          <div style={{...S.card,marginBottom:0,display:"flex",flexDirection:"column",alignItems:"center",padding:"1.5rem"}}>
            <div style={{fontSize:".72rem",color:C.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:"1rem",textAlign:"center"}}>Participación</div>
            <DonutChart pagas={nPag} pendientes={nPend} total={alumnos.length}/>
            <div style={{display:"flex",gap:"1rem",marginTop:"1rem",fontSize:".76rem"}}>
              <span style={{display:"flex",alignItems:"center",gap:".4rem"}}><span style={{width:9,height:9,borderRadius:"50%",background:C.green,display:"inline-block"}}/><span style={{color:C.green}}>{nPag} al dia</span></span>
              <span style={{display:"flex",alignItems:"center",gap:".4rem"}}><span style={{width:9,height:9,borderRadius:"50%",background:C.red,display:"inline-block"}}/><span style={{color:C.red}}>{nPend} pendientes</span></span>
            </div>
          </div>
          <div style={{...S.card,marginBottom:0,display:"flex",flexDirection:"column",justifyContent:"center",gap:".75rem"}}>
            <div style={{fontSize:".72rem",color:C.muted,textTransform:"uppercase",letterSpacing:".08em"}}>Resumen de caja</div>
            <div style={S.row}><span style={{color:C.muted}}>Recaudado liberado</span><span style={{color:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(totalLib)}</span></div>
            {totalAnt>0&&<div style={S.row}><span style={{color:C.muted}}>Pagos anticipados</span><span style={{color:C.blue,fontVariantNumeric:"tabular-nums"}}>+ {pesos(totalAnt)}</span></div>}
            <div style={S.row}><span style={{color:C.muted}}>Gastos</span><span style={{color:C.red,fontVariantNumeric:"tabular-nums"}}>- {pesos(totalGasto)}</span></div>
            <div style={S.div}/>
            <div style={S.row}><span style={{fontWeight:600}}>Saldo en cuenta</span><span style={{fontFamily:"Georgia,serif",fontSize:"1.3rem",color:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(saldo)}</span></div>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".72rem",color:C.muted,marginBottom:".4rem"}}><span>Avance</span><span>{pct}%</span></div>
              <ProgBar pct={pct}/>
            </div>
          </div>
        </div>
        <div style={S.sec}>Detalle de gastos</div>
        <div style={{...S.card,padding:0,overflow:"hidden"}}>
          {gastos.length===0?<div style={{padding:"3rem",textAlign:"center",color:C.muted}}>Sin gastos aun.</div>:(
            <table style={S.tbl}><thead><tr><th style={S.th}>Fecha</th><th style={S.th}>Descripción</th><th style={S.th}>Categoria</th><th style={S.th}>Monto</th></tr></thead>
            <tbody>{[...gastos].reverse().map(g=><tr key={g.id}><td style={{...S.td,color:C.muted}}>{fFecha(g.fecha)}</td><td style={S.td}>{g.descripcion}</td><td style={S.td}><span style={{background:"rgba(212,175,100,.1)",border:"1px solid rgba(212,175,100,.2)",color:C.gold,padding:"2px 7px",borderRadius:4,fontSize:".7rem"}}>{g.categoria}</span></td><td style={{...S.td,color:C.red,fontVariantNumeric:"tabular-nums"}}>- {pesos(g.monto)}</td></tr>)}</tbody></table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PANEL NOTIFICACIONES ─────────────────────────────────────────────────────
function PanelNotifs({notifs,alumnos,onConfirmar,onRechazar,onCerrar}) {
  const [rechazando, setRechazando] = useState(null);
  const [motivo, setMotivo] = useState("");
  const pend = notifs.filter(n=>n.estado==="pendiente");
  if (pend.length===0) { onCerrar(); return null; }
  return (
    <div>
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",zIndex:199}} onClick={onCerrar}/>
      <div style={{position:"fixed",top:60,right:0,width:340,maxHeight:"calc(100vh - 60px)",background:C.card,borderLeft:"1px solid rgba(212,175,100,.2)",overflowY:"auto",zIndex:200,boxShadow:"-8px 0 32px rgba(0,0,0,.4)"}}>
        <div style={{padding:"1rem 1.25rem",borderBottom:"1px solid rgba(255,255,255,.07)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"Georgia,serif",color:C.text}}>Avisos de pago ({pend.length})</span>
          <Btn onClick={onCerrar} color="red" sm>x Cerrar</Btn>
        </div>
        {pend.map(n=>{
          const al=alumnos.find(a=>a.id===n.sid);
          const esRechazando = rechazando===n.id;
          return (
            <div key={n.id} style={{padding:"1rem 1.25rem",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
              <div style={{fontWeight:500,marginBottom:".2rem"}}>{al?.nombre||"Alumno"}</div>
              <div style={{fontSize:".76rem",color:C.muted,marginBottom:".65rem",lineHeight:1.5}}>
                Avisa que pagó: <strong style={{color:C.yellow}}>{n.nota}</strong><br/>
                Monto: <strong style={{color:C.green}}>{pesos(n.monto)}</strong><br/>
                <span style={{fontSize:".7rem"}}>{fDT(n.creadoEn)}</span>
                {n.mensaje&&<><br/><em>"{n.mensaje}"</em></>}
              </div>
              {esRechazando ? (
                <div>
                  <div style={{fontSize:".75rem",color:C.muted,marginBottom:".4rem"}}>Motivo del rechazo (opcional):</div>
                  <input
                    style={{...S.inp,fontSize:".82rem",padding:".4rem .65rem",marginBottom:".5rem"}}
                    type="text"
                    value={motivo}
                    onChange={e=>setMotivo(e.target.value)}
                    placeholder="Ej: No se encontró el pago"
                    autoFocus
                  />
                  <div style={{display:"flex",gap:".4rem"}}>
                    <Btn onClick={()=>{onRechazar(n,motivo);setRechazando(null);setMotivo("");}} color="red" sm>Confirmar rechazo</Btn>
                    <Btn onClick={()=>{setRechazando(null);setMotivo("");}} color="ghost" sm>Cancelar</Btn>
                  </div>
                </div>
              ) : (
                <div style={{display:"flex",gap:".5rem"}}>
                  <Btn onClick={()=>onConfirmar(n)} color="solidg" sm>Confirmar</Btn>
                  <Btn onClick={()=>{setRechazando(n.id);setMotivo("");}} color="red" sm>Rechazar</Btn>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PORTAL APODERADO ─────────────────────────────────────────────────────────
function PortalApoderado({alumno: alumnoInicial, curso, setCurso, onSalir}) {
  const alumno = curso.alumnos.find(a=>a.id===alumnoInicial.id) || alumnoInicial;
  const [tab, setTab] = useState("aportes");
  const [showForm, setShowForm] = useState(false);
  const [nf, setNf] = useState({tiposIds:[],mensaje:""});
  const [nErr, setNErr] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [showCambiarPw, setShowCambiarPw] = useState(false);
  const [pwf, setPwf] = useState({actual:"",nueva:"",confirma:""});
  const [pwMsg, setPwMsg] = useState("");
  const [editApodorado, setEditApodorado] = useState(false);
  const [tmpApo, setTmpApo] = useState("");
  const [editTelefono, setEditTelefono] = useState(false);
  const [tmpTelefono, setTmpTelefono] = useState("");
  const now = new Date();
  const sid = alumno.id;
  const {alumnos,aportes,gastos,reservas,deudas,notifs,cobros=[],historialAnios=[],saldoAnterior=0} = curso;

  const misAportes   = aportes.filter(a=>a.sid===sid);
  const tieneReserva = reservas.some(r=>r.sid===sid);
  const liberado     = calcLiberado(sid,aportes,reservas,now);
  const anticipo     = calcAnticipo(sid,aportes,reservas,now);
  const pagadoBruto  = calcPagadoBruto(sid,aportes,reservas);
  const pendiente    = Math.max(0,TOTAL_ANUAL-pagadoBruto);
  const tieneNP      = notifs.some(n=>n.sid===sid&&n.estado==="pendiente");
  const tieneAvisos   = notifs.some(n=>n.sid===sid&&(n.estado==="pendiente"||n.estado==="rechazado"));
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
    if (nf.tiposIds.length===0) { setNErr("Seleccióna al menos un pago."); return; }
    setNErr("");
    const nuevasNotifs = nf.tiposIds.map(tipoId => {
      const tipo = TIPOS.find(t=>t.id===tipoId);
      return {id:genId(), sid, tipoId, nota:tipo?.nota||"", monto:tipo?.monto||0, mensaje:nf.mensaje, creadoEn:new Date().toISOString(), estado:"pendiente"};
    });
    setCurso(c=>({...c, notifs:[...c.notifs, ...nuevasNotifs]}));
    setShowForm(false); setNf({tiposIds:[], mensaje:""});
  };

  const tabs=[{id:"aportes",label:"Mis aportes"},{id:"resumen",label:"Resumen de pagos"},{id:"cuenta",label:"Mi cuenta"}];

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
                <div style={{fontSize:".82rem",color:"rgba(232,226,213,.55)",marginBottom:".85rem"}}>{tieneReserva?"Pagaste el año completo. Las cuotas se liberan mes a mes.":"Pagaste cuotas por adelantado. Se liberan cuando llegue su mes."}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:".75rem",textAlign:"center"}}>
                  <div><div style={{fontSize:".65rem",color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:".2rem"}}>Total pagado</div><div style={{fontFamily:"Georgia,serif",color:C.blue}}>{pesos(pagadoBruto)}</div></div>
                  <div><div style={{fontSize:".65rem",color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:".2rem"}}>Liberado hoy</div><div style={{fontFamily:"Georgia,serif",color:C.green}}>{pesos(liberado)}</div></div>
                  <div><div style={{fontSize:".65rem",color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:".2rem"}}>En anticipo</div><div style={{fontFamily:"Georgia,serif",color:C.muted}}>{pesos(anticipo)}</div></div>
                </div>
              </div>
            )}
            {totalDeuda>0&&(
              <div style={{background:"rgba(235,87,87,.08)",border:"1px solid rgba(235,87,87,.25)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.25rem"}}>
                <div style={{fontFamily:"Georgia,serif",color:C.red,marginBottom:".4rem"}}>Deuda de años anteriores</div>
                <div style={{fontSize:".82rem",color:"rgba(232,226,213,.55)",marginBottom:".75rem"}}>Tienes pagos pendientes de años anteriores. Contacta al tesorero.</div>
                <table style={S.tbl}><thead><tr><th style={{...S.th,padding:".4rem .5rem"}}>Ano</th><th style={{...S.th,padding:".4rem .5rem"}}>Descripción</th><th style={{...S.th,padding:".4rem .5rem"}}>Monto</th></tr></thead>
                <tbody>{misDeudas.map(d=><tr key={d.id}><td style={{...S.td,padding:".5rem",color:C.muted}}>{d.anio}</td><td style={{...S.td,padding:".5rem"}}>{d.descripción}</td><td style={{...S.td,padding:".5rem",color:C.red,fontVariantNumeric:"tabular-nums"}}>- {pesos(d.monto)}</td></tr>)}<tr><td style={{...S.td,padding:".5rem",fontWeight:600}} colSpan={2}>Total</td><td style={{...S.td,padding:".5rem",color:C.red,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>- {pesos(totalDeuda)}</td></tr></tbody></table>
              </div>
            )}
            {recordatorio&&(
              <div style={{background:"rgba(242,201,76,.1)",border:"1px solid rgba(242,201,76,.3)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.25rem"}}>
                <div style={{fontFamily:"Georgia,serif",color:C.yellow,marginBottom:".2rem"}}>Recordatorio - {MESES_ES[now.getMonth()]}</div>
                <div style={{fontSize:".82rem",color:"rgba(232,226,213,.6)"}}>{diasRest===0?"Hoy es el ultimo día del mes!":"Quedan "+diasRest+" "+(diasRest===1?"día":"días")+" para el cierre."} No olvides pagar tu cuota de {pesos(CUOTA_MENSUAL)}.</div>
              </div>
            )}
            <div style={{background:"rgba(111,207,151,.07)",border:"1px solid rgba(111,207,151,.22)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.25rem"}}>
              <div style={{fontFamily:"Georgia,serif",color:C.green,marginBottom:".4rem"}}>¿Ya pagaste? Avísale al tesorero</div>
              <div style={{fontSize:".82rem",color:"rgba(232,226,213,.55)",marginBottom:".85rem"}}>Si ya realizaste tu pago, notifícalo para que el tesorero lo verifique.</div>
              {tieneAvisos && (
                <div style={{marginBottom:".85rem"}}>
                  {notifs.filter(n=>n.sid===sid&&(n.estado==="pendiente"||n.estado==="rechazado")).map(n=>(
                    <div key={n.id} style={{display:"flex",alignItems:"center",gap:".5rem",background:n.estado==="rechazado"?"rgba(235,87,87,.08)":"rgba(242,201,76,.08)",border:"1px solid "+(n.estado==="rechazado"?"rgba(235,87,87,.25)":"rgba(242,201,76,.2)"),borderRadius:8,padding:".5rem .85rem",marginBottom:".4rem",fontSize:".82rem"}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{color:n.estado==="rechazado"?C.red:C.yellow}}>{n.estado==="rechazado"?"Rechazado":"En verificación"}:</span>
                          <span style={{color:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(n.monto)}</span>
                        </div>
                        <div style={{color:C.text,fontSize:".82rem"}}>{n.nota||TIPOS.find(t=>t.id===n.tipoId)?.nota||"Pago"}</div>
                        {n.estado==="rechazado"&&<div style={{color:C.red,fontSize:".75rem",marginTop:".15rem"}}>Rechazado{n.motivoRechazo?": "+n.motivoRechazo:""}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!showForm ? (
                <Btn onClick={()=>{setShowForm(true);setNf({tiposIds:[],mensaje:""});setNErr("");}} color="green" full>+ Avisar pago(s)</Btn>
              ) : (
                <div>
                  <div style={{fontSize:".82rem",color:C.muted,marginBottom:".65rem"}}>Marca los pagos que realizaste:</div>
                  <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",borderRadius:10,marginBottom:".75rem"}}>
                    {(()=>{
                      const pagas = cuotasPagas(sid,aportes,reservas);
                      // Find first unpaid cuota (considering already selected ones as "paid" for ordering)
                      const todasSelYPagas = new Set([...pagas, ...nf.tiposIds]);
                      return TIPOS.filter(t=>t.id!=="otro").map(t=>{
                        const pagada = pagas.has(t.id);
                        const enAviso = notifs.some(n=>n.sid===sid&&n.tipoId===t.id&&n.estado==="pendiente");
                        if (pagada) return null;
                        if (enAviso) return (
                          <div key={t.id} style={{display:"flex",alignItems:"center",gap:".75rem",padding:".6rem .85rem",borderBottom:"1px solid rgba(255,255,255,.04)",opacity:.45,cursor:"not-allowed"}}>
                            <span style={{width:18,height:18,borderRadius:4,border:"1px solid rgba(242,201,76,.4)",background:"rgba(242,201,76,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".65rem",color:C.yellow,flexShrink:0}}>⏳</span>
                            <span style={{flex:1,fontSize:".85rem",color:C.muted}}>{t.nota}</span>
                            <span style={{color:C.yellow,fontSize:".75rem"}}>En validación</span>
                          </div>
                        );
                        const sel = nf.tiposIds.includes(t.id);
                        // For cuotas: check if previous cuota is either paid, selected, or this is the first
                        let bloqueada = false;
                        if (CUOTA_ORDER.includes(t.id)) {
                          const idx = CUOTA_ORDER.indexOf(t.id);
                          if (idx > 0) {
                            const prev = CUOTA_ORDER[idx-1];
                            const prevEnAviso = notifs.some(n=>n.sid===sid&&n.tipoId===prev&&n.estado==="pendiente");
                            // Unblocked if previous is: paid, selected, OR in validation
                            bloqueada = !pagas.has(prev) && !nf.tiposIds.includes(prev) && !prevEnAviso;
                          }
                        }
                        return (
                          <div key={t.id}
                            onClick={()=>{
                              if (bloqueada) return;
                              if (sel) {
                                // Deselect this and all subsequent selected cuotas
                                const idx = CUOTA_ORDER.indexOf(t.id);
                                const toRemove = new Set([t.id, ...CUOTA_ORDER.slice(idx+1)]);
                                setNf(f=>({...f,tiposIds:f.tiposIds.filter(x=>!toRemove.has(x))}));
                              } else {
                                setNf(f=>({...f,tiposIds:[...f.tiposIds,t.id]}));
                              }
                            }}
                            style={{display:"flex",alignItems:"center",gap:".75rem",padding:".6rem .85rem",borderBottom:"1px solid rgba(255,255,255,.04)",cursor:bloqueada?"not-allowed":"pointer",background:sel?"rgba(212,175,100,.08)":bloqueada?"rgba(255,255,255,.01)":"transparent",opacity:bloqueada?.4:1}}>
                            <span style={{width:18,height:18,borderRadius:4,border:"1px solid "+(sel?"#d4af64":bloqueada?"rgba(255,255,255,.1)":"rgba(255,255,255,.2)"),background:sel?"#d4af64":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",color:"#0f1117",flexShrink:0,fontWeight:700}}>{sel?"v":""}</span>
                            <span style={{flex:1,fontSize:".85rem",color:bloqueada?C.muted:C.text}}>{t.nota}{bloqueada&&<span style={{fontSize:".72rem",color:C.muted,marginLeft:".4rem"}}>(seleccióna la anterior primero)</span>}</span>
                            <span style={{color:bloqueada?C.muted:C.gold,fontSize:".82rem",fontVariantNumeric:"tabular-nums"}}>{pesos(t.monto)}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  {nf.tiposIds.length>0&&(
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:".82rem",marginBottom:".75rem",padding:"0 .2rem"}}>
                      <span style={{color:C.muted}}>{nf.tiposIds.length} pago{nf.tiposIds.length>1?"s":""} selecciónado{nf.tiposIds.length>1?"s":""}</span>
                      <span style={{color:C.gold,fontWeight:600}}>{pesos(nf.tiposIds.reduce((s,id)=>s+(TIPOS.find(t=>t.id===id)?.monto||0),0))}</span>
                    </div>
                  )}
                  <div style={{marginBottom:".75rem"}}>
                    <Campo label="Mensaje opciónal">
                      <input style={S.inp} type="text" value={nf.mensaje} onChange={e=>setNf(f=>({...f,mensaje:e.target.value}))} placeholder="Ej: Transferi a las 10am"/>
                    </Campo>
                  </div>
                  <Alerta msg={nErr}/>
                  {(()=>{
                    const pagas2 = cuotasPagas(sid,aportes,reservas);
                    const hayCobrosDisp=(cobros||[]).some(co=>co.clasificacion==="Meta de recaudación"&&co.alumnosIds.includes(sid)&&(co.pagos||{})[sid]!=="pagado"&&!notifs.some(n=>n.sid===sid&&n.tipoId==="cobro_"+co.id&&n.estado==="pendiente"));
                    const haySeleccionables = hayCobrosDisp || TIPOS.filter(t=>t.id!=="otro").some(t=>{
                      if(pagas2.has(t.id)) return false;
                      if(notifs.some(n=>n.sid===sid&&n.tipoId===t.id&&n.estado==="pendiente")) return false;
                      if(CUOTA_ORDER.includes(t.id)){
                        const idx=CUOTA_ORDER.indexOf(t.id);
                        if(idx>0){
                          const prev=CUOTA_ORDER[idx-1];
                          const prevEnAviso=notifs.some(n=>n.sid===sid&&n.tipoId===prev&&n.estado==="pendiente");
                          if(!pagas2.has(prev)&&!nf.tiposIds.includes(prev)&&!prevEnAviso) return false;
                        }
                      }
                      return true;
                    });
                    if(!haySeleccionables) return (
                      <div style={{background:"rgba(242,201,76,.08)",border:"1px solid rgba(242,201,76,.2)",borderRadius:8,padding:".6rem .85rem",fontSize:".82rem",color:C.yellow,marginBottom:".5rem"}}>
                        Todos los pagos disponibles ya tienen un aviso en validación. Espera que el tesorero los confirme.
                      </div>
                    );
                    return (
                      <div style={{display:"flex",gap:".5rem"}}>
                        <Btn onClick={enviarNotif} color="green" disabled={nf.tiposIds.length===0} full>Enviar {nf.tiposIds.length>1?"avisos":"aviso"}</Btn>
                        <Btn onClick={()=>setShowForm(false)} color="ghost">Cancelar</Btn>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
            {/* Pendientes por pagar */}
            {(()=>{
              const pagas = cuotasPagas(sid,aportes,reservas);
              const cobrosMetaPend2 = (cobros||[]).filter(co=>co.clasificacion==="Meta de recaudación"&&co.alumnosIds.includes(sid)&&(co.pagos||{})[sid]!=="pagado");
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
                      {cobrosMetaPend2.map(co=>(
                        <tr key={co.id}>
                          <td style={S.td}><span style={{background:"rgba(126,184,247,.1)",color:C.blue,padding:"1px 6px",borderRadius:4,fontSize:".72rem",marginRight:".4rem"}}>Cobro</span>{co.nombre}</td>
                          <td style={{...S.td,color:C.red,fontVariantNumeric:"tabular-nums"}}>{pesos(co.monto)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td style={{...S.td,fontWeight:600}}>Total pendiente</td>
                        <td style={{...S.td,color:C.red,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{pesos(items.reduce((s,it)=>s+it.monto,0)+cobrosMetaPend2.reduce((s,co)=>s+co.monto,0))}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })()}
            {/* Cobros extraordinarios */}
            {(()=>{
              const misCobros = cobros.filter(co => co.alumnosIds.includes(sid));
              if (misCobros.length === 0) return null;
              const vigentes = misCobros.filter(co => co.vencimiento >= hoy());
              const vencidos  = misCobros.filter(co => co.vencimiento < hoy());
              const pendVenc  = vencidos.filter(co  => (co.pagos||{})[sid] !== "pagado");
              const pendVig   = vigentes.filter(co  => (co.pagos||{})[sid] !== "pagado");
              const pagados   = misCobros.filter(co => (co.pagos||{})[sid] === "pagado");
              const avisados  = misCobros.filter(co => (co.pagos||{})[sid] === "aviso");

              return (
                <div style={{marginBottom:"1.25rem"}}>
                  {pendVenc.length > 0 && (
                    <div style={{...S.card,marginBottom:"1rem",borderColor:"rgba(235,87,87,.3)"}}>
                      <div style={{fontFamily:"Georgia,serif",color:C.red,marginBottom:".75rem"}}>Cobros vencidos sin pagar</div>
                      <table style={S.tbl}>
                        <thead><tr><th style={S.th}>Cobro</th><th style={S.th}>Vencimiento</th><th style={S.th}>Monto</th><th style={S.th}></th></tr></thead>
                        <tbody>
                          {pendVenc.map(co=>(
                            <tr key={co.id}>
                              <td style={S.td}>{co.nombre}{co.descripción&&<div style={{fontSize:".75rem",color:C.muted}}>{co.descripción}</div>}</td>
                              <td style={{...S.td,color:C.red,fontSize:".82rem"}}>{fFecha(co.vencimiento)}</td>
                              <td style={{...S.td,color:C.red,fontVariantNumeric:"tabular-nums"}}>{pesos(co.monto)}</td>
                              <td style={S.td}>
                                {(co.pagos||{})[sid]!=="aviso"&&(
                                  <Btn sm color="green" onClick={()=>{
                                    setCurso(c=>({...c,cobros:(c.cobros||[]).map(x=>x.id===co.id?{...x,pagos:{...x.pagos,[sid]:"aviso"}}:x)}));
                                  }}>Avisar pago</Btn>
                                )}
                                {(co.pagos||{})[sid]==="aviso"&&<Badge type="waiting">Aviso enviado</Badge>}
                              </td>
                            </tr>
                          ))}
                          <tr><td style={{...S.td,fontWeight:600}} colSpan={2}>Total vencido</td><td style={{...S.td,color:C.red,fontWeight:600,fontVariantNumeric:"tabular-nums"}} colSpan={2}>{pesos(pendVenc.reduce((s,co)=>s+co.monto,0))}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {pendVig.length > 0 && (
                    <div style={{...S.card,marginBottom:"1rem",borderColor:"rgba(212,175,100,.25)"}}>
                      <div style={{fontFamily:"Georgia,serif",color:C.gold,marginBottom:".75rem"}}>Próximos cobros</div>
                      <table style={S.tbl}>
                        <thead><tr><th style={S.th}>Cobro</th><th style={S.th}>Vencimiento</th><th style={S.th}>Monto</th><th style={S.th}></th></tr></thead>
                        <tbody>
                          {pendVig.map(co=>(
                            <tr key={co.id}>
                              <td style={S.td}>{co.nombre}{co.descripción&&<div style={{fontSize:".75rem",color:C.muted}}>{co.descripción}</div>}</td>
                              <td style={{...S.td,color:C.gold,fontSize:".82rem"}}>{fFecha(co.vencimiento)}</td>
                              <td style={{...S.td,color:C.gold,fontVariantNumeric:"tabular-nums"}}>{pesos(co.monto)}</td>
                              <td style={S.td}>
                                {(co.pagos||{})[sid]!=="aviso"&&(
                                  <Btn sm color="green" onClick={()=>{
                                    setCurso(c=>({...c,cobros:(c.cobros||[]).map(x=>x.id===co.id?{...x,pagos:{...x.pagos,[sid]:"aviso"}}:x)}));
                                  }}>Avisar pago</Btn>
                                )}
                                {(co.pagos||{})[sid]==="aviso"&&<Badge type="waiting">Aviso enviado</Badge>}
                              </td>
                            </tr>
                          ))}
                          <tr><td style={{...S.td,fontWeight:600}} colSpan={2}>Total próximo</td><td style={{...S.td,color:C.gold,fontWeight:600,fontVariantNumeric:"tabular-nums"}} colSpan={2}>{pesos(pendVig.reduce((s,co)=>s+co.monto,0))}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {pagados.length > 0 && (
                    <div style={{...S.card,marginBottom:"1rem",borderColor:"rgba(111,207,151,.2)"}}>
                      <div style={{fontFamily:"Georgia,serif",color:C.green,marginBottom:".75rem"}}>Cobros pagados</div>
                      <table style={S.tbl}>
                        <thead><tr><th style={S.th}>Cobro</th><th style={S.th}>Vencimiento</th><th style={S.th}>Monto</th></tr></thead>
                        <tbody>
                          {pagados.map(co=>(
                            <tr key={co.id}>
                              <td style={S.td}>{co.nombre}</td>
                              <td style={{...S.td,color:C.muted,fontSize:".82rem"}}>{fFecha(co.vencimiento)}</td>
                              <td style={{...S.td,color:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(co.monto)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })()}

            <div style={S.sec}>Historial</div>
            <div style={{...S.card,padding:0,overflow:"hidden"}}>
              {misAportes.length===0&&!tieneReserva?<div style={{padding:"3rem",textAlign:"center",color:C.muted}}>Aún no hay aportes.</div>:(
                <table style={S.tbl}><thead><tr><th style={S.th}>Fecha</th><th style={S.th}>Descripción</th><th style={S.th}>Monto</th></tr></thead>
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

            {(()=>{
              const metaAlumno = calcMetaAlumnoAFecha(now,sid,cobros||[]);
              const pagadoAlumno = calcPagadoBruto(sid, aportes, reservas);
              const diffAlumno = pagadoAlumno - metaAlumno;
              const cuotasTrans = CUOTA_ORDER.filter(c=>estaVencida(c,now)).length;
              return (
                <div style={{background:"linear-gradient(135deg,rgba(126,184,247,.08),rgba(126,184,247,.04))",border:"1px solid rgba(126,184,247,.2)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.5rem"}}>
                  <div style={{fontFamily:"Georgia,serif",fontSize:"1rem",color:C.blue,marginBottom:"1rem"}}>Tu avance esperado vs real</div>
                  <div style={S.row}>
                    <span style={{color:C.muted}}>Caja chica</span>
                    <span style={{color:C.gold,fontVariantNumeric:"tabular-nums"}}>{pesos(CAJA_CHICA)}</span>
                  </div>
                  <div style={S.row}>
                    <span style={{color:C.muted}}>Cuotas ({cuotasTrans} mes{cuotasTrans!==1?"es":""} transcurrido{cuotasTrans!==1?"s":""})</span>
                    <span style={{color:C.gold,fontVariantNumeric:"tabular-nums"}}>{pesos(cuotasTrans*CUOTA_MENSUAL)}</span>
                  </div>
                  <div style={{...S.div,margin:".75rem 0"}}/>
                  <div style={S.row}>
                    <span style={{fontWeight:600}}>Deberías llevar pagado</span>
                    <span style={{fontFamily:"Georgia,serif",fontSize:"1.2rem",color:C.gold,fontVariantNumeric:"tabular-nums"}}>{pesos(metaAlumno)}</span>
                  </div>
                  <div style={S.row}>
                    <span style={{color:C.muted}}>Lo que llevas pagado</span>
                    <span style={{color:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(pagadoAlumno)}</span>
                  </div>
                  <div style={{...S.div,margin:".75rem 0"}}/>
                  <div style={S.row}>
                    <span style={{fontWeight:600}}>{diffAlumno>=0?"Estás al día":"Te falta"}</span>
                    <span style={{fontFamily:"Georgia,serif",fontSize:"1.2rem",color:diffAlumno>=0?C.green:C.red,fontVariantNumeric:"tabular-nums"}}>{diffAlumno>=0?"✓ "+pesos(diffAlumno)+" adelantado":pesos(Math.abs(diffAlumno))}</span>
                  </div>
                  <div style={{marginTop:".75rem"}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:".72rem",color:C.muted,marginBottom:".4rem"}}>
                      <span>Avance sobre lo esperado</span>
                      <span>{metaAlumno>0?Math.round(pagadoAlumno/metaAlumno*100):0}%</span>
                    </div>
                    <ProgBar pct={metaAlumno>0?pagadoAlumno/metaAlumno*100:0} color="blue"/>
                  </div>
                  {(()=>{
                    const enValidacion = notifs.filter(n=>n.sid===sid&&n.estado==="pendiente");
                    if(enValidacion.length===0) return null;
                    const totalEnVal = enValidacion.reduce((s,n)=>s+n.monto,0);
                    return (
                      <div style={{background:"rgba(242,201,76,.08)",border:"1px solid rgba(242,201,76,.25)",borderRadius:8,padding:".65rem .85rem",marginTop:".75rem"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:".83rem",marginBottom:".5rem"}}>
                          <span style={{color:C.yellow,fontWeight:600}}>Pendiente de validación</span>
                          <span style={{color:C.yellow,fontVariantNumeric:"tabular-nums",fontWeight:600}}>{pesos(totalEnVal)}</span>
                        </div>
                        {enValidacion.map(n=>(
                          <div key={n.id} style={{display:"flex",justifyContent:"space-between",fontSize:".8rem",padding:".25rem 0",borderBottom:"1px solid rgba(242,201,76,.1)"}}>
                            <span style={{color:C.muted}}>{n.nota||TIPOS.find(t=>t.id===n.tipoId)?.nota||"Pago"}</span>
                            <span style={{color:C.yellow,fontVariantNumeric:"tabular-nums"}}>{pesos(n.monto)}</span>
                          </div>
                        ))}
                        <div style={{fontSize:".75rem",color:C.muted,marginTop:".4rem"}}>El tesorero aún no ha confirmado estos pagos.</div>
                      </div>
                    );
                  })()}
                </div>
              );
            })()}

            <div style={S.sec}>Detalle de gastos</div>
            <div style={{...S.card,padding:0,overflow:"hidden"}}>
              {gastos.length===0
                ? <div style={{padding:"2rem",textAlign:"center",color:C.muted}}>Sin gastos registrados aún.</div>
                : <table style={S.tbl}>
                    <thead><tr><th style={S.th}>Fecha</th><th style={S.th}>Descripción</th><th style={S.th}>Categoría</th><th style={S.th}>Origen</th><th style={S.th}>Monto</th></tr></thead>
                    <tbody>{[...gastos].reverse().map(g=>(
                      <tr key={g.id}>
                        <td style={{...S.td,color:C.muted}}>{fFecha(g.fecha)}</td>
                        <td style={S.td}>{g.descripcion}{g.comentario&&<div style={{fontSize:".75rem",color:C.muted,marginTop:".2rem"}}>{g.comentario}</div>}</td>
                        <td style={S.td}><span style={{background:"rgba(212,175,100,.1)",border:"1px solid rgba(212,175,100,.2)",color:C.gold,padding:"2px 7px",borderRadius:4,fontSize:".7rem"}}>{g.categoria}</span></td>
                        <td style={S.td}><span style={{background:"rgba(126,184,247,.1)",border:"1px solid rgba(126,184,247,.2)",color:C.blue,padding:"2px 7px",borderRadius:4,fontSize:".7rem"}}>{g.origen||"—"}</span></td>
                        <td style={{...S.td,color:C.red,fontVariantNumeric:"tabular-nums"}}>- {pesos(g.monto)}</td>
                      </tr>
                    ))}</tbody>
                  </table>
              }
            </div>

            {alumnos.some(a=>a.telefono) && (
              <div style={{marginTop:"1.5rem"}}>
                <div style={S.sec}>Directorio de apoderados</div>
                <div style={{...S.card,padding:0,overflow:"hidden"}}>
                  <table style={S.tbl}>
                    <thead><tr><th style={S.th}>Alumno</th><th style={S.th}>Apoderado</th><th style={S.th}>Contacto</th></tr></thead>
                    <tbody>
                      {alumnos.filter(a=>a.telefono||a.telefono2).map(a=>(
                        <tr key={a.id}>
                          <td style={S.td}>{a.nombre}</td>
                          <td style={{...S.td,color:C.muted}}>
                            {a.apoderado&&<div style={{marginBottom:a.apoderado2?".3rem":0}}>{a.apoderado}</div>}
                            {a.apoderado2&&<div style={{color:C.muted}}>{a.apoderado2}</div>}
                          </td>
                          <td style={S.td}>
                            <div style={{display:"flex",flexDirection:"column",gap:".35rem"}}>
                              {a.telefono&&<a href={"https://wa.me/569"+a.telefono} target="_blank" rel="noreferrer" style={{background:"#25D366",color:"#fff",padding:"3px 10px",borderRadius:8,fontSize:".75rem",fontWeight:600,textDecoration:"none",display:"inline-block"}}>WA {a.apoderado||"Apoderado 1"}</a>}
                              {a.telefono2&&<a href={"https://wa.me/569"+a.telefono2} target="_blank" rel="noreferrer" style={{background:"#25D366",color:"#fff",padding:"3px 10px",borderRadius:8,fontSize:".75rem",fontWeight:600,textDecoration:"none",display:"inline-block"}}>WA {a.apoderado2||"Apoderado 2"}</a>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
              <div style={S.sec}>Mi información</div>
              <div style={S.row}><span style={{color:C.muted}}>Alumno/a</span><span style={{color:C.blue,fontWeight:500}}>{alumno.nombre}</span></div>
              <div style={{...S.row,alignItems:"flex-start",flexDirection:"column",gap:".4rem"}}>
                <span style={{color:C.muted,fontSize:".82rem",textTransform:"uppercase",letterSpacing:".06em"}}>Apoderado</span>
                {editApodorado ? (
                  <div style={{display:"flex",gap:".5rem",alignItems:"center",width:"100%"}}>
                    <input style={{...S.inp,padding:".4rem .7rem",fontSize:".86rem",flex:1}} autoFocus value={tmpApo} onChange={e=>setTmpApo(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){setCurso(c=>({...c,alumnos:c.alumnos.map(x=>x.id===alumno.id?{...x,apoderado:tmpApo}:x)}));setEditApodorado(false);}if(e.key==="Escape")setEditApodorado(false);}} placeholder="Tu nombre completo"/>
                    <Btn sm onClick={()=>{setCurso(c=>({...c,alumnos:c.alumnos.map(x=>x.id===alumno.id?{...x,apoderado:tmpApo}:x)}));setEditApodorado(false);}}>Guardar</Btn>
                    <Btn sm color="ghost" onClick={()=>setEditApodorado(false)}>x</Btn>
                  </div>
                ) : (
                  <div style={{display:"flex",alignItems:"center",gap:".75rem"}}>
                    <span>{alumno.apoderado||<span style={{color:C.red,fontSize:".82rem"}}>Sin nombre registrado</span>}</span>
                    <Btn sm color="ghost" onClick={()=>{setTmpApo(alumno.apoderado||"");setEditApodorado(true);}}>Editar</Btn>
                  </div>
                )}
              </div>
              <div style={S.row}><span style={{color:C.muted}}>Curso</span><span>{curso.nombre}</span></div>
              <div style={{...S.row,alignItems:"flex-start",flexDirection:"column",gap:".4rem"}}>
                <span style={{color:C.muted,fontSize:".82rem",textTransform:"uppercase",letterSpacing:".06em"}}>WhatsApp</span>
                {editTelefono ? (
                  <div style={{display:"flex",gap:".5rem",alignItems:"center",width:"100%"}}>
                    <div style={{display:"flex",alignItems:"center",flex:1,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,overflow:"hidden"}}>
                      <span style={{padding:"0 .75rem",color:C.muted,fontSize:".86rem",borderRight:"1px solid rgba(255,255,255,.1)",whiteSpace:"nowrap"}}>+569</span>
                      <input style={{...S.inp,border:"none",borderRadius:0,background:"transparent",flex:1}} type="tel" maxLength={8} autoFocus value={tmpTelefono} onChange={e=>setTmpTelefono(e.target.value.replace(/\D/g,"").slice(0,8))} onKeyDown={e=>{if(e.key==="Enter"){setCurso(c=>({...c,alumnos:c.alumnos.map(x=>x.id===alumno.id?{...x,telefono:tmpTelefono}:x)}));setEditTelefono(false);}if(e.key==="Escape")setEditTelefono(false);}} placeholder="12345678"/>
                    </div>
                    <Btn sm onClick={()=>{setCurso(c=>({...c,alumnos:c.alumnos.map(x=>x.id===alumno.id?{...x,telefono:tmpTelefono}:x)}));setEditTelefono(false);}}>Guardar</Btn>
                    <Btn sm color="ghost" onClick={()=>setEditTelefono(false)}>x</Btn>
                  </div>
                ) : (
                  <div style={{display:"flex",alignItems:"center",gap:".75rem"}}>
                    <span style={{color:alumno.telefono?C.text:C.muted}}>{alumno.telefono ? "+569 "+alumno.telefono : "Sin registrar"}</span>
                    <Btn sm color="ghost" onClick={()=>{setTmpTelefono(alumno.telefono||"");setEditTelefono(true);}}>Editar</Btn>
                    {alumno.telefono && <a href={"https://wa.me/569"+alumno.telefono} target="_blank" rel="noreferrer" style={{background:"#25D366",color:"#fff",padding:"3px 10px",borderRadius:8,fontSize:".75rem",fontWeight:600,textDecoration:"none"}}>WhatsApp</a>}
                  </div>
                )}
              </div>
            </div>
            <div style={{marginTop:".75rem"}}>
              <Btn full color="ghost" onClick={()=>generarPDF(alumno,curso,aportes,reservas,gastos,deudas,cobros||[],now)}>
                Descargar mi estado de cuenta (PDF)
              </Btn>
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
  const [af, setAf] = useState({sid:"",tiposIds:[],fecha:hoy()});
  const [afErr, setAfErr] = useState("");
  const [filtAlumno, setFiltAlumno] = useState("");
  const [filtTipo, setFiltTipo] = useState("");
  const [filtAntAlumno, setFiltAntAlumno] = useState("");
  const [gf, setGf] = useState({descripcion:"",monto:"",fecha:hoy(),categoria:"Celebraciones",origen:"Cuota mensual",comentario:""});
  const [sof, setSof] = useState({nombre:"",apoderado:"",telefono:"",apoderado2:"",telefono2:""});
  const [showApo2, setShowApo2] = useState(false);
  const [editApoderado, setEditApoderado] = useState(null);
  const [tmpApoderado, setTmpApoderado] = useState("");
  const [expandedAlumno, setExpandedAlumno] = useState(null);
  const [df, setDf] = useState({sid:"",año:"2024",monto:"",descripcion:"Cuotas impagas"});
  const [cf, setCf] = useState({nombre:"",descripcion:"",monto:"",vencimiento:hoy(),alumnosIds:[],clasificacion:"Meta de recaudación"});
  const [cfErr, setCfErr] = useState("");
  // Ajustes
  const [editNombre, setEditNombre] = useState(false);
  const [tmpNombre, setTmpNombre] = useState(curso.nombre);
  const [editCodigo, setEditCodigo] = useState(false);
  const [tmpCodigo, setTmpCodigo] = useState(curso.codigoCurso);
  const [copiado, setCopiado] = useState(false);
  const [editAdminPw, setEditAdminPw] = useState(false);
  const [adminPwf, setAdminPwf] = useState({actual:"",nueva:"",confirma:""});
  const [adminPwMsg, setAdminPwMsg] = useState("");

  const {alumnos,aportes,gastos,reservas,deudas,notifs,cobros=[],historialAnios=[],saldoAnterior=0} = curso;
  const totalLibBase = alumnos.reduce((s,a)=>s+calcLiberado(a.id,aportes,reservas,now),0) + saldoAnterior;
  const totalCobrosMeta = (cobros||[]).filter(co=>co.clasificacion==="Meta de recaudación").reduce((s,co)=>s+Object.keys(co.pagos||{}).filter(k=>(co.pagos||{})[k]==="pagado").length*co.monto,0);
  const totalLib   = totalLibBase + totalCobrosMeta;
  const totalAnt   = alumnos.reduce((s,a)=>s+calcAnticipo(a.id,aportes,reservas,now),0);
  const totalGasto = gastos.reduce((s,g)=>s+g.monto,0);
  const saldo      = totalLib-totalGasto;
  const pagIds     = new Set([...aportes.map(a=>a.sid),...reservas.map(r=>r.sid)]);
  const notifsPend = notifs.filter(n=>n.estado==="pendiente");
  const cobrosAvisos = (cobros||[]).reduce((s,co)=>s+Object.values(co.pagos||{}).filter(v=>v==="aviso").length,0);
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
    if (!af.sid||af.tiposIds.length===0) { setAfErr("Selecciona al menos un tipo de aporte."); return; }
    const s=Number(af.sid);
    if (reservas.some(r=>r.sid===s)) { setAfErr("Este alumno tiene reserva anual - cuotas ya cubiertas."); return; }
    // Check order: each selected cuota must have previous cuota paid OR selected
    const pagas=cuotasPagas(s,aportes,reservas);
    for (const tipoId of af.tiposIds) {
      if(CUOTA_ORDER.includes(tipoId)){
        const idx=CUOTA_ORDER.indexOf(tipoId);
        if(idx>0){
          const prev=CUOTA_ORDER[idx-1];
          if(!pagas.has(prev)&&!af.tiposIds.includes(prev)){
            setAfErr("Debes seleccionar las cuotas en orden.");return;
          }
        }
      }
      // Check if already paid (not anticipo case)
      if(pagas.has(tipoId)&&!CUOTA_MES[tipoId]){
        setAfErr(TIPOS.find(t=>t.id===tipoId)?.nota+" ya está pagado.");return;
      }
    }
    setAfErr("");
    const nuevosAportes = [];
    const cobrosPagadosUpdate = {};
    af.tiposIds.forEach(tipoId=>{
      if(tipoId.startsWith("cobro_")){
        const coId=tipoId.replace("cobro_","");
        cobrosPagadosUpdate[coId]=s;
      } else {
        const t=TIPOS.find(x=>x.id===tipoId);
        const esAnt=!!CUOTA_MES[tipoId]&&!estaLiberada(tipoId,now);
        nuevosAportes.push({id:genId(),sid:s,tipoId,monto:t?.monto||0,nota:t?.nota||"",fecha:af.fecha,anticipo:esAnt});
      }
    });
    setCurso(c=>({
      ...c,
      aportes:[...c.aportes,...nuevosAportes],
      cobros:(c.cobros||[]).map(co=>cobrosPagadosUpdate[co.id]?{...co,pagos:{...co.pagos,[cobrosPagadosUpdate[co.id]]:"pagado"}}:co)
    }));
    setAf(f=>({...f,sid:"",tiposIds:[]}));
  };

  const confirmarNotif = (n) => {
    if(n.tipoId&&n.tipoId.startsWith("cobro_")){
      const coId=n.tipoId.replace("cobro_","");
      setCurso(c=>({...c,
        cobros:(c.cobros||[]).map(co=>co.id===coId?{...co,pagos:{...co.pagos,[n.sid]:"pagado"}}:co),
        notifs:c.notifs.map(x=>x.id===n.id?{...x,estado:"confirmado"}:x)
      }));
      return;
    }
    const esAnt=!!CUOTA_MES[n.tipoId]&&!estaLiberada(n.tipoId,now);
    setCurso(c=>({...c,
      aportes:[...c.aportes,{id:genId(),sid:n.sid,monto:n.monto,fecha:hoy(),nota:n.nota+" (verificado)",tipoId:n.tipoId||"",anticipo:esAnt}],
      notifs:c.notifs.map(x=>x.id===n.id?{...x,estado:"confirmado"}:x)
    }));
    // Keep panel open after confirming
  };
  const rechazarNotif = (n, motivo) => setCurso(c=>({...c,notifs:c.notifs.map(x=>x.id===n.id?{...x,estado:"rechazado",motivoRechazo:motivo||""}:x)}));

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
    {id:"cobros",   label:"Cobros extra"},
    {id:"deudas",   label:"Deudas hist."},
    {id:"reportes", label:"Reportes"},
    {id:"ajustes",  label:"Ajustes"},
  ];

  return (
    <div style={S.app}>
      <div style={S.hdr}>
        <div style={{fontFamily:"Georgia,serif",color:C.gold,fontSize:"1rem"}}>{curso.nombre} <span style={{background:C.gold,color:"#0f1117",fontSize:".6rem",padding:"2px 7px",borderRadius:20,fontWeight:700,letterSpacing:".08em",marginLeft:".4rem"}}>ADMIN</span></div>
        <div style={{display:"flex",gap:".65rem",alignItems:"center",flexShrink:0}}>
          <button onClick={()=>setShowNotifs(v=>!v)} style={{position:"relative",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:C.text,padding:"0 .75rem",height:34,borderRadius:10,cursor:"pointer",fontSize:".78rem",display:"flex",alignItems:"center",justifyContent:"center",gap:".3rem",whiteSpace:"nowrap"}}>
            Avisos{(notifsPend.length+cobrosAvisos)>0&&<span style={{position:"absolute",top:-3,right:-3,background:C.red,color:"#fff",fontSize:".55rem",fontWeight:700,width:15,height:15,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid "+C.bg}}>{notifsPend.length+cobrosAvisos}</span>}
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
            {(()=>{
              const pagadoTotal = alumnos.filter(a=>{
                const p=cuotasPagas(a.id,aportes,reservas);
                if(reservas.some(r=>r.sid===a.id)) return true;
                let v=0; if(!p.has("caja_chica"))v++;
                CUOTA_ORDER.forEach(c=>{if(estaVencida(c,now)&&!p.has(c))v++;});
                return v===0;
              }).length;
              const pagadoParcial = alumnos.filter(a=>{
                const p=cuotasPagas(a.id,aportes,reservas);
                if(reservas.some(r=>r.sid===a.id)) return false;
                const pagoBruto = calcPagadoBruto(a.id,aportes,reservas,cobros||[]);
                let v=0; if(!p.has("caja_chica"))v++;
                CUOTA_ORDER.forEach(c=>{if(estaVencida(c,now)&&!p.has(c))v++;});
                return pagoBruto>0 && v===1;
              }).length;
              const masMoroso2 = alumnos.filter(a=>{
                const p=cuotasPagas(a.id,aportes,reservas);
                if(reservas.some(r=>r.sid===a.id)) return false;
                let v=0; if(!p.has("caja_chica"))v++;
                CUOTA_ORDER.forEach(c=>{if(estaVencida(c,now)&&!p.has(c))v++;});
                return v>1;
              }).length;
              return (
                <div style={S.grid}>
                  <StatCard label="Alumnos"          value={alumnos.length}    sub="En el curso"/>
                  <StatCard label="Al día"            value={pagadoTotal}       sub="Familias al día"       color="green"/>
                  <StatCard label="Pago parcial"      value={pagadoParcial}     sub="1 cuota vencida"       color="yellow"/>
                  <StatCard label="Más de 1 cuota vencida"  value={masMoroso2}        sub="Familias"              color="red"/>
                  {notifsPend.length>0&&<StatCard label="Por verificar" value={notifsPend.length} sub="Avisos" color="yellow"/>}
                  {totalAnt>0&&<StatCard label="En anticipo" value={pesos(totalAnt)} sub="Se libera por mes" color="blue"/>}
                  <StatCard label="Saldo"             value={pesos(saldo)}      sub="Disponible"            color="blue"/>
                </div>
              );
            })()}
            {(()=>{
              const metaFecha = calcMetaAFecha(alumnos.length, now, cobros||[]);
              const diff = totalLib - metaFecha;
              const cuotasTrans = CUOTA_ORDER.filter(c=>estaVencida(c,now)).length;
              return (
                <div style={{background:"linear-gradient(135deg,#1a1f2e,#141c2a)",border:"1px solid rgba(212,175,100,.15)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.5rem"}}>
                  <div style={{fontFamily:"Georgia,serif",fontSize:"1rem",color:C.text,marginBottom:"1rem"}}>Recaudación esperada vs real</div>
                  <div style={S.row}>
                    <span style={{color:C.muted}}>Caja chica ({alumnos.length} alumnos)</span>
                    <span style={{color:C.gold,fontVariantNumeric:"tabular-nums"}}>{pesos(alumnos.length*CAJA_CHICA)}</span>
                  </div>
                  <div style={S.row}>
                    <span style={{color:C.muted}}>Cuotas mensuales ({cuotasTrans} mes{cuotasTrans!==1?"es":""} × {alumnos.length} alumnos)</span>
                    <span style={{color:C.gold,fontVariantNumeric:"tabular-nums"}}>{pesos(alumnos.length*cuotasTrans*CUOTA_MENSUAL)}</span>
                  </div>
                  {(cobros||[]).filter(co=>co.clasificacion==="Meta de recaudación").map(co=>(
                    <div key={co.id} style={S.row}>
                      <span style={{color:C.muted}}>
                        <span style={{background:"rgba(126,184,247,.15)",color:"#7eb8f7",padding:"1px 5px",borderRadius:3,fontSize:".72rem",marginRight:".4rem"}}>Cobro</span>
                        {co.nombre} ({co.alumnosIds.length} alumnos)
                      </span>
                      <span style={{color:C.gold,fontVariantNumeric:"tabular-nums"}}>{pesos(co.alumnosIds.length*co.monto)}</span>
                    </div>
                  ))}
                  <div style={{display:"none"}}>
                  </div>
                  <div style={{...S.div,margin:".75rem 0"}}/>
                  <div style={S.row}>
                    <span style={{fontWeight:600}}>Meta a la fecha</span>
                    <span style={{fontFamily:"Georgia,serif",fontSize:"1.2rem",color:C.gold,fontVariantNumeric:"tabular-nums"}}>{pesos(metaFecha)}</span>
                  </div>
                  <div style={{...S.div,margin:".75rem 0"}}/>
                  <div style={{fontSize:".72rem",color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:".4rem"}}>Recaudado real</div>
                  {(()=>{
                    const rCajaChica = aportes.filter(a=>a.tipoId==="caja_chica"&&!a.anticipo).reduce((s,a)=>s+a.monto,0);
                    const rCuotas = aportes.filter(a=>CUOTA_ORDER.includes(a.tipoId)&&!a.anticipo).reduce((s,a)=>s+a.monto,0);
                    const rOtros = aportes.filter(a=>a.tipoId==="otro").reduce((s,a)=>s+a.monto,0);
                    return (
                      <>
                        {rCajaChica>0&&<div style={S.row}><span style={{color:C.muted,fontSize:".83rem"}}>Caja chica</span><span style={{color:C.green,fontSize:".83rem",fontVariantNumeric:"tabular-nums"}}>{pesos(rCajaChica)}</span></div>}
                        {rCuotas>0&&<div style={S.row}><span style={{color:C.muted,fontSize:".83rem"}}>Cuotas mensuales</span><span style={{color:C.green,fontSize:".83rem",fontVariantNumeric:"tabular-nums"}}>{pesos(rCuotas)}</span></div>}
                        {rOtros>0&&<div style={S.row}><span style={{color:C.muted,fontSize:".83rem"}}>Otros aportes</span><span style={{color:C.green,fontSize:".83rem",fontVariantNumeric:"tabular-nums"}}>{pesos(rOtros)}</span></div>}
                        {saldoAnterior>0&&<div style={S.row}><span style={{color:C.muted,fontSize:".83rem"}}>Saldo año anterior</span><span style={{color:C.green,fontSize:".83rem",fontVariantNumeric:"tabular-nums"}}>{pesos(saldoAnterior)}</span></div>}
                        {(cobros||[]).filter(co=>co.clasificacion==="Meta de recaudación"&&Object.values(co.pagos||{}).some(v=>v==="pagado")).map(co=>{
                          const nPag=Object.values(co.pagos||{}).filter(v=>v==="pagado").length;
                          return <div key={co.id} style={S.row}><span style={{color:C.muted,fontSize:".83rem"}}><span style={{background:"rgba(126,184,247,.15)",color:"#7eb8f7",padding:"1px 5px",borderRadius:3,fontSize:".7rem",marginRight:".3rem"}}>Cobro</span>{co.nombre} ({nPag} pagados)</span><span style={{color:C.green,fontSize:".83rem",fontVariantNumeric:"tabular-nums"}}>{pesos(nPag*co.monto)}</span></div>;
                        })}
                        <div style={S.row}><span style={{fontWeight:600}}>Total recaudado</span><span style={{fontFamily:"Georgia,serif",fontSize:"1.1rem",color:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(totalLib)}</span></div>
                      </>
                    );
                  })()}
                  <div style={{...S.div,margin:".75rem 0"}}/>
                  <div style={S.row}>
                    <span style={{fontWeight:600}}>{diff>=0?"Superávit":"Déficit a la fecha"}</span>
                    <span style={{fontFamily:"Georgia,serif",fontSize:"1.2rem",color:diff>=0?C.green:C.red,fontVariantNumeric:"tabular-nums"}}>{diff>=0?"+":""}{pesos(diff)}</span>
                  </div>
                  <div style={{marginTop:".75rem"}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:".72rem",color:C.muted,marginBottom:".4rem"}}>
                      <span>Avance sobre meta a la fecha</span>
                      <span>{metaFecha>0?Math.round(totalLib/metaFecha*100):0}%</span>
                    </div>
                    <ProgBar pct={metaFecha>0?totalLib/metaFecha*100:0}/>
                  </div>
                </div>
              );
            })()}
            <CajaResumen liberado={totalLib} anticipo={totalAnt} gasto={totalGasto}/>
            {(()=>{
              const totalGastoReal = gastos.reduce((s,g)=>s+g.monto,0);
              const saldoReal = totalLib + totalAnt + saldoAnterior - totalGastoReal;
              return (
                <div style={{background:"linear-gradient(135deg,rgba(61,214,140,.1),rgba(61,214,140,.04))",border:"2px solid rgba(61,214,140,.3)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.5rem"}}>
                  <div style={{fontSize:".72rem",color:C.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:".5rem"}}>Saldo en cuenta del curso</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:"2.2rem",color:C.green,fontVariantNumeric:"tabular-nums",marginBottom:".75rem"}}>{pesos(saldoReal)}</div>
                  <div style={{height:1,background:"rgba(111,207,151,.15)",marginBottom:".75rem"}}/>
                  <div style={{display:"flex",flexDirection:"column",gap:".35rem",fontSize:".82rem"}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.muted}}>Recaudado liberado</span><span style={{color:C.green,fontVariantNumeric:"tabular-nums"}}>+ {pesos(totalLib)}</span></div>
                    {totalAnt>0&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.muted}}>Pagos anticipados</span><span style={{color:C.blue,fontVariantNumeric:"tabular-nums"}}>+ {pesos(totalAnt)}</span></div>}
                    {saldoAnterior>0&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.muted}}>Saldo año anterior</span><span style={{color:C.green,fontVariantNumeric:"tabular-nums"}}>+ {pesos(saldoAnterior)}</span></div>}
                    <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.muted}}>Total gastos</span><span style={{color:C.red,fontVariantNumeric:"tabular-nums"}}>- {pesos(totalGastoReal)}</span></div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {tab==="aportes"&&(
          <div>
            <div style={S.card}>
              <div style={S.sec}>Registrar aporte</div>
              <div style={S.fgrid}>
                <Campo label="Alumno">
                  <select style={S.inp} value={af.sid} onChange={e=>{setAf(f=>({...f,sid:e.target.value,tiposIds:[]}));setAfErr("");}}>
                    <option value="">Seleccionar alumno...</option>
                    {alumnos.map(a=><option key={a.id} value={a.id}>{a.nombre}</option>)}
                  </select>
                </Campo>
                <Campo label="Fecha">
                  <input style={S.inp} type="date" value={af.fecha} onChange={e=>setAf(f=>({...f,fecha:e.target.value}))}/>
                </Campo>
              </div>
              {sid>0&&(
                <div style={{marginBottom:".85rem"}}>
                  <label style={S.lbl}>Pagos a registrar</label>
                  <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",borderRadius:10,overflow:"hidden"}}>
                    {TIPOS.filter(t=>t.id!=="otro").map(t=>{
                      const pagas=cuotasPagas(sid,aportes,reservas);
                      const pagada=pagas.has(t.id);
                      let bloq=false;
                      if(CUOTA_ORDER.includes(t.id)){
                        const idx=CUOTA_ORDER.indexOf(t.id);
                        if(idx>0){
                          const prev=CUOTA_ORDER[idx-1];
                          const pagas2=cuotasPagas(sid,aportes,reservas);
                          bloq=!pagas2.has(prev)&&!af.tiposIds.includes(prev);
                        }
                      }
                      if(pagada) return null;
                      const sel=af.tiposIds.includes(t.id);
                      return (
                        <div key={t.id}
                          onClick={()=>{
                            if(bloq) return;
                            if(sel){
                              const idx=CUOTA_ORDER.indexOf(t.id);
                              const toRemove=new Set([t.id,...CUOTA_ORDER.slice(idx+1)]);
                              setAf(f=>({...f,tiposIds:f.tiposIds.filter(x=>!toRemove.has(x))}));
                            } else {
                              setAf(f=>({...f,tiposIds:[...f.tiposIds,t.id]}));
                            }
                            setAfErr("");
                          }}
                          style={{display:"flex",alignItems:"center",gap:".75rem",padding:".6rem .85rem",borderBottom:"1px solid rgba(255,255,255,.04)",cursor:bloq?"not-allowed":"pointer",background:sel?"rgba(212,175,100,.08)":"transparent",opacity:bloq?.4:1}}>
                          <span style={{width:18,height:18,borderRadius:4,border:"1px solid "+(sel?"#d4af64":"rgba(255,255,255,.2)"),background:sel?"#d4af64":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",color:"#0f1117",flexShrink:0,fontWeight:700}}>{sel?"v":""}</span>
                          <span style={{flex:1,fontSize:".85rem",color:bloq?C.muted:C.text}}>{t.nota}{bloq&&<span style={{fontSize:".72rem",color:C.muted,marginLeft:".4rem"}}>(selecciona la anterior primero)</span>}</span>
                          <span style={{color:bloq?C.muted:C.gold,fontSize:".82rem",fontVariantNumeric:"tabular-nums"}}>{pesos(t.monto)}</span>
                        </div>
                      );
                    })}
                  </div>
                  {af.tiposIds.length>0&&(
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:".82rem",marginTop:".5rem",padding:"0 .2rem"}}>
                      <span style={{color:C.muted}}>{af.tiposIds.length} pago{af.tiposIds.length>1?"s":""} seleccionado{af.tiposIds.length>1?"s":""}</span>
                      <span style={{color:C.gold,fontWeight:600}}>{pesos(af.tiposIds.reduce((s,id)=>s+(TIPOS.find(t=>t.id===id)?.monto||0),0))}</span>
                    </div>
                  )}
                </div>
              )}
              {!sid&&<div style={{fontSize:".82rem",color:C.muted,marginBottom:".65rem"}}>Selecciona un alumno para ver los pagos disponibles.</div>}
              <Alerta msg={afErr}/>
              <Btn onClick={addAporte} disabled={!af.sid||af.tiposIds.length===0}>
                Registrar {af.tiposIds.length>1?"aportes":"aporte"}{af.tiposIds.length>0?" ("+af.tiposIds.length+")":""}
              </Btn>
            </div>
            {/* Filtros */}
            <div style={{...S.card,marginBottom:".75rem"}}>
              <div style={{display:"flex",gap:".75rem",flexWrap:"wrap",alignItems:"flex-end"}}>
                <div style={{flex:"1 1 180px"}}>
                  <Campo label="Filtrar por alumno">
                    <select style={S.inp} value={filtAlumno} onChange={e=>setFiltAlumno(e.target.value)}>
                      <option value="">Todos los alumnos</option>
                      {alumnos.map(a=><option key={a.id} value={a.id}>{a.nombre}</option>)}
                    </select>
                  </Campo>
                </div>
                <div style={{flex:"1 1 180px"}}>
                  <Campo label="Filtrar por tipo">
                    <select style={S.inp} value={filtTipo} onChange={e=>setFiltTipo(e.target.value)}>
                      <option value="">Todos los tipos</option>
                      {TIPOS.filter(t=>t.id!=="otro").map(t=><option key={t.id} value={t.id}>{t.nota}</option>)}
                    </select>
                  </Campo>
                </div>
                {(filtAlumno||filtTipo)&&(
                  <Btn sm color="ghost" onClick={()=>{setFiltAlumno("");setFiltTipo("");}}>x Limpiar filtros</Btn>
                )}
              </div>
            </div>
            {(()=>{
              const aporteFiltrados = [...aportes].reverse().filter(a=>{
                if(filtAlumno && a.sid!==Number(filtAlumno)) return false;
                if(filtTipo && a.tipoId!==filtTipo) return false;
                return true;
              });
              const totalFiltrado = aporteFiltrados.reduce((s,a)=>s+a.monto,0);
              return (
                <>
                  <div style={S.sec}>Historial <span style={{fontSize:".85rem",color:C.muted,fontWeight:400}}>{aporteFiltrados.length} de {aportes.length} registros{(filtAlumno||filtTipo)?" (filtrado)":""} — {pesos(totalFiltrado)}</span></div>
                  <div style={{...S.card,padding:0,overflow:"hidden"}}>
                    {aporteFiltrados.length===0?<div style={{padding:"3rem",textAlign:"center",color:C.muted}}>{aportes.length===0?"Sin aportes.":"Sin resultados para este filtro."}</div>:(
                      <table style={S.tbl}>
                        <thead><tr><th style={S.th}>Fecha</th><th style={S.th}>Alumno</th><th style={S.th}>Descripción</th><th style={S.th}>Monto</th><th style={S.th}></th></tr></thead>
                        <tbody>{aporteFiltrados.map(a=>{
                          const al=alumnos.find(x=>x.id===a.sid);
                          return <tr key={a.id}>
                            <td style={{...S.td,color:C.muted}}>{fFecha(a.fecha)}</td>
                            <td style={S.td}>{al?.nombre||"-"}</td>
                            <td style={{...S.td,color:C.muted}}>{a.nota}{a.anticipo&&<span style={{marginLeft:".4rem"}}><Badge type="anticipo">anticipo</Badge></span>}</td>
                            <td style={{...S.td,color:a.anticipo?C.blue:C.green,fontVariantNumeric:"tabular-nums"}}>{pesos(a.monto)}</td>
                            <td style={S.td}><Btn onClick={()=>setCurso(c=>({...c,aportes:c.aportes.filter(x=>x.id!==a.id)}))} color="red" sm>x</Btn></td>
                          </tr>;
                        })}</tbody>
                      </table>
                    )}
                  </div>
                </>
              );
            })()}

            <div style={S.sec}>Estado de aportes</div>
            {(cobros||[]).filter(co=>co.clasificacion==="Meta de recaudación").length>0&&(
              <div style={{fontSize:".78rem",color:C.muted,marginBottom:".75rem"}}>
                Cobros extra en meta: {(cobros||[]).filter(co=>co.clasificacion==="Meta de recaudación").map(co=>(
                  <span key={co.id} style={{background:"rgba(126,184,247,.1)",color:"#7eb8f7",padding:"2px 7px",borderRadius:4,marginRight:".4rem"}}>{co.nombre} — {Object.values(co.pagos||{}).filter(v=>v==="pagado").length}/{co.alumnosIds.length} pagados</span>
                ))}
              </div>
            )}
            <div style={{...S.card,padding:0,overflow:"hidden"}}>
              <table style={S.tbl}><thead><tr><th style={S.th}>Alumno</th><th style={S.th}>Apoderado</th><th style={S.th}>Estado</th><th style={S.th}>Liberado</th></tr></thead>
              <tbody>{alumnos.map(a=>{
                const lib=calcLiberado(a.id,aportes,reservas,now);
                const ant=calcAnticipo(a.id,aportes,reservas,now);
                const hasR=reservas.some(r=>r.sid===a.id);
                const hasP=notifs.some(n=>n.sid===a.id&&n.estado==="pendiente");
                const isPend = !hasR && !hasP && lib===0;
                const isExpanded = expandedAlumno===a.id;
                // Calculate pending items for this alumno
                const pagas = cuotasPagas(a.id,aportes,reservas);
                const pendItems = [];
                if (!pagas.has("caja_chica")) pendItems.push({label:"Caja chica",monto:CAJA_CHICA});
                CUOTA_ORDER.forEach(c=>{if(estaVencida(c,now)&&!pagas.has(c))pendItems.push({label:TIPOS.find(t=>t.id===c)?.nota||c,monto:CUOTA_MENSUAL});});
                const deudaHist = deudas.filter(d=>d.sid===a.id&&!d.pagado);
                const hasPendientes = pendItems.length>0||deudaHist.length>0;
                return (
                  <>
                    <tr key={a.id} style={{cursor:hasPendientes?"pointer":undefined}} onClick={()=>hasPendientes&&setExpandedAlumno(isExpanded?null:a.id)}>
                      <td style={S.td}>{a.nombre}</td>
                      <td style={{...S.td,color:C.muted}}>{a.apoderado||"-"}</td>
                      <td style={S.td}>
                        <div style={{display:"flex",alignItems:"center",gap:".5rem"}}>
                          {hasR?<Badge type="annual">Pago anual</Badge>:hasP?<Badge type="waiting">Aviso pago</Badge>:lib>0?<Badge type="paid">Al dia</Badge>:<Badge type="pending">Pendiente</Badge>}
                          {hasPendientes&&<span style={{color:C.muted,fontSize:".75rem"}}>{isExpanded?"▲":"▼"}</span>}
                        </div>
                      </td>
                      <td style={{...S.td,color:lib>0?C.green:C.muted,fontVariantNumeric:"tabular-nums"}}>{lib>0?pesos(lib)+(ant>0?" + "+pesos(ant)+" ant.":""):"-"}</td>
                    </tr>
                    {isExpanded&&hasPendientes&&(
                      <tr key={a.id+"_det"}>
                        <td colSpan={4} style={{padding:0,borderTop:"none"}}>
                          <div style={{background:"rgba(235,87,87,.05)",borderTop:"1px dashed rgba(235,87,87,.2)",padding:".75rem 1rem 1rem 1rem"}}>
                            <div style={{fontSize:".72rem",color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:".6rem"}}>Pendiente por pagar</div>
                            <div style={{display:"flex",flexDirection:"column",gap:".35rem"}}>
                              {pendItems.map((it,i)=>(
                                <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:".84rem"}}>
                                  <span style={{color:C.text}}>{it.label}</span>
                                  <span style={{color:C.red,fontVariantNumeric:"tabular-nums"}}>{pesos(it.monto)}</span>
                                </div>
                              ))}
                              {deudaHist.map(d=>(
                                <div key={d.id} style={{display:"flex",justifyContent:"space-between",fontSize:".84rem"}}>
                                  <span style={{color:C.text}}>{d.anio} - {d.descripción}</span>
                                  <span style={{color:C.red,fontVariantNumeric:"tabular-nums"}}>{pesos(d.monto)}</span>
                                </div>
                              ))}
                              <div style={{borderTop:"1px solid rgba(235,87,87,.2)",marginTop:".35rem",paddingTop:".35rem",display:"flex",justifyContent:"space-between",fontWeight:600,fontSize:".84rem"}}>
                                <span>Total pendiente</span>
                                <span style={{color:C.red,fontVariantNumeric:"tabular-nums"}}>{pesos([...pendItems,...deudaHist].reduce((s,x)=>s+(x.monto||0),0))}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}</tbody></table>
            </div>
          </div>
        )}

        {tab==="gastos"&&(
          <div>
            <div style={S.card}>
              <div style={S.sec}>Registrar gasto</div>
              <div style={S.fgrid}>
                <Campo label="Descripción"><input style={S.inp} type="text" value={gf.descripcion} onChange={e=>setGf(f=>({...f,descripcion:e.target.value}))} placeholder="Ej: Decoracion"/></Campo>
                <Campo label="Monto ($)"><input style={S.inp} type="number" value={gf.monto} onChange={e=>setGf(f=>({...f,monto:e.target.value}))} placeholder="0"/></Campo>
                <Campo label="Fecha"><input style={S.inp} type="date" value={gf.fecha} onChange={e=>setGf(f=>({...f,fecha:e.target.value}))}/></Campo>
                <Campo label="Categoria"><select style={S.inp} value={gf.categoria} onChange={e=>setGf(f=>({...f,categoria:e.target.value}))}>{CATEGORIAS.map(c=><option key={c}>{c}</option>)}</select></Campo>
                <Campo label="Origen de fondos">
                  <select style={S.inp} value={gf.origen} onChange={e=>setGf(f=>({...f,origen:e.target.value}))}>
                    <option value="Cuota mensual">Cuota mensual</option>
                    <option value="Caja chica">Caja chica</option>
                    {(cobros||[]).map(co=><option key={co.id} value={co.nombre}>{co.nombre}</option>)}
                    <option value="Fondo general">Fondo general</option>
                  </select>
                </Campo>
              </div>
              <Campo label="Comentario (opcional)">
                <input style={S.inp} type="text" maxLength={150} value={gf.comentario} onChange={e=>setGf(f=>({...f,comentario:e.target.value}))} placeholder="Ej: Compra en Lider, boleta N°1234 — max 150 caracteres"/>
              </Campo>
              <Btn onClick={()=>{if(!gf.descripcion||!gf.monto)return;setCurso(c=>({...c,gastos:[...c.gastos,{id:genId(),...gf,monto:Number(gf.monto)}]}));setGf(f=>({...f,descripcion:"",monto:"",comentario:""}));}}>Registrar gasto</Btn>
            </div>
            <div style={S.sec}>Historial <span style={{fontSize:".85rem",color:C.muted,fontWeight:400}}>{gastos.length} registros - {pesos(totalGasto)}</span></div>
            <div style={{...S.card,padding:0,overflow:"hidden"}}>
              {gastos.length===0?<div style={{padding:"3rem",textAlign:"center",color:C.muted}}>Sin gastos.</div>:(
                <table style={S.tbl}><thead><tr><th style={S.th}>Fecha</th><th style={S.th}>Descripción</th><th style={S.th}>Categoria</th><th style={S.th}>Origen</th><th style={S.th}>Monto</th><th style={S.th}></th></tr></thead>
                <tbody>{[...gastos].reverse().map(g=><tr key={g.id}><td style={{...S.td,color:C.muted}}>{fFecha(g.fecha)}</td><td style={S.td}>{g.descripcion}{g.comentario&&<div style={{fontSize:".75rem",color:C.muted,marginTop:".2rem"}}>{g.comentario}</div>}</td><td style={S.td}><span style={{background:"rgba(212,175,100,.1)",border:"1px solid rgba(212,175,100,.2)",color:C.gold,padding:"2px 7px",borderRadius:4,fontSize:".7rem"}}>{g.categoria}</span></td><td style={S.td}><span style={{background:"rgba(126,184,247,.1)",border:"1px solid rgba(126,184,247,.2)",color:C.blue,padding:"2px 7px",borderRadius:4,fontSize:".7rem"}}>{g.origen||"—"}</span></td><td style={{...S.td,color:C.red,fontVariantNumeric:"tabular-nums"}}>- {pesos(g.monto)}</td><td style={S.td}><Btn onClick={()=>setCurso(c=>({...c,gastos:c.gastos.filter(x=>x.id!==g.id)}))} color="red" sm>x</Btn></td></tr>)}</tbody></table>
              )}
            </div>
          </div>
        )}

        {tab==="alumnos"&&(
          <div>
            <div style={S.card}>
              <div style={S.sec}>Agregar alumno</div>
              <div style={S.fgrid}>
                <Campo label="Nombre del alumno *"><input style={S.inp} type="text" value={sof.nombre} onChange={e=>setSof(f=>({...f,nombre:e.target.value}))} placeholder="Nombre Apellido" autoFocus/></Campo>
                <Campo label="Apoderado 1"><input style={S.inp} type="text" value={sof.apoderado} onChange={e=>setSof(f=>({...f,apoderado:e.target.value}))} placeholder="Nombre Apellido"/></Campo>
                <Campo label="WhatsApp apoderado 1">
                  <div style={{display:"flex",alignItems:"center",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,overflow:"hidden"}}>
                    <span style={{padding:"0 .75rem",color:C.muted,fontSize:".86rem",borderRight:"1px solid rgba(255,255,255,.1)",whiteSpace:"nowrap"}}>+569</span>
                    <input style={{...S.inp,border:"none",borderRadius:0,background:"transparent",flex:1}} type="tel" maxLength={8} value={sof.telefono} onChange={e=>setSof(f=>({...f,telefono:e.target.value.replace(/[^0-9]/g,"").slice(0,8)}))} placeholder="12345678"/>
                  </div>
                </Campo>
              </div>
              {showApo2 ? (
                <div style={{...S.fgrid,marginTop:".5rem"}}>
                  <Campo label="Apoderado 2"><input style={S.inp} type="text" value={sof.apoderado2} onChange={e=>setSof(f=>({...f,apoderado2:e.target.value}))} placeholder="Nombre Apellido"/></Campo>
                  <Campo label="WhatsApp apoderado 2">
                    <div style={{display:"flex",alignItems:"center",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,overflow:"hidden"}}>
                      <span style={{padding:"0 .75rem",color:C.muted,fontSize:".86rem",borderRight:"1px solid rgba(255,255,255,.1)",whiteSpace:"nowrap"}}>+569</span>
                      <input style={{...S.inp,border:"none",borderRadius:0,background:"transparent",flex:1}} type="tel" maxLength={8} value={sof.telefono2} onChange={e=>setSof(f=>({...f,telefono2:e.target.value.replace(/[^0-9]/g,"").slice(0,8)}))} placeholder="12345678"/>
                    </div>
                  </Campo>
                </div>
              ) : (
                <div style={{marginBottom:".85rem"}}>
                  <Btn color="ghost" sm onClick={()=>setShowApo2(true)}>+ Agregar segúndo apoderado</Btn>
                </div>
              )}
              <Btn onClick={()=>{if(!sof.nombre)return;setCurso(c=>({...c,alumnos:[...c.alumnos,{id:genId(),...sof}]}));setSof({nombre:"",apoderado:"",telefono:"",apoderado2:"",telefono2:""});setShowApo2(false);}}>Agregar alumno</Btn>
            </div>

            <div style={S.card}>
              <div style={S.sec}>Importar desde CSV / Excel</div>
              <div style={{fontSize:".82rem",color:C.muted,marginBottom:"1rem",lineHeight:1.6}}>
                Sube un archivo CSV o Excel exportado como CSV con dos columnas: <strong style={{color:C.gold}}>Nombre</strong> y <strong style={{color:C.gold}}>Apoderado</strong> (apoderado es opciónal). Se omiten duplicados automáticamente.
              </div>
              <div style={{background:"rgba(212,175,100,.05)",border:"2px dashed rgba(212,175,100,.25)",borderRadius:10,padding:"1.5rem",textAlign:"center",marginBottom:"1rem"}}>
                <div style={{color:C.muted,fontSize:".85rem",marginBottom:".85rem"}}>Formato esperado:<br/><span style={{fontFamily:"monospace",color:C.gold,fontSize:".8rem"}}>Nombre Alumno, Nombre Apoderado</span></div>
                <input ref={fileRef} type="file" accept=".csv,.txt" style={{display:"none"}} onChange={handleImport}/>
                <Btn onClick={()=>fileRef.current?.click()}>Selecciónar archivo CSV</Btn>
              </div>
              {importMsg&&<Alerta msg={importMsg} ok={importMsg.startsWith("OK")}/>}
            </div>

            <div style={S.sec}>Lista <span style={{fontSize:".85rem",color:C.muted,fontWeight:400}}>{alumnos.length} alumnos</span></div>
            <div style={{...S.card,padding:0,overflow:"hidden",overflowX:"auto"}}>
              <table style={S.tbl}><thead><tr><th style={S.th}>#</th><th style={S.th}>Alumno</th><th style={S.th}>Apoderado 1</th><th style={S.th}>Apoderado 2</th><th style={S.th}></th></tr></thead>
              <tbody>{alumnos.map((a,i)=>{
                return (
                    <tr key={a.id}>
                      <td style={{...S.td,color:C.muted}}>{i+1}</td>
                      <td style={S.td}>{a.nombre}</td>
                      <td style={S.td}>
                        {editApoderado===a.id ? (
                          <div style={{display:"flex",gap:".4rem",alignItems:"center"}}>
                            <input style={{...S.inp,padding:".3rem .6rem",fontSize:".82rem"}} type="text" value={tmpApoderado} onChange={e=>setTmpApoderado(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){setCurso(c=>({...c,alumnos:c.alumnos.map(x=>x.id===a.id?{...x,apoderado:tmpApoderado}:x)}));setEditApoderado(null);}if(e.key==="Escape")setEditApoderado(null);}} autoFocus placeholder="Nombre apoderado"/>
                            <Btn sm onClick={()=>{setCurso(c=>({...c,alumnos:c.alumnos.map(x=>x.id===a.id?{...x,apoderado:tmpApoderado}:x)}));setEditApoderado(null);}}>OK</Btn>
                            <Btn sm color="ghost" onClick={()=>setEditApoderado(null)}>x</Btn>
                          </div>
                        ) : editApoderado===("tel1_"+a.id) ? (
                          <div style={{display:"flex",gap:".4rem",alignItems:"center"}}>
                            <div style={{display:"flex",alignItems:"center",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,overflow:"hidden"}}>
                              <span style={{padding:"0 .5rem",color:C.muted,fontSize:".78rem",borderRight:"1px solid rgba(255,255,255,.1)",whiteSpace:"nowrap"}}>+569</span>
                              <input style={{...S.inp,border:"none",borderRadius:0,background:"transparent",width:90,fontSize:".82rem",padding:".3rem .5rem"}} type="tel" maxLength={8} autoFocus value={tmpApoderado} onChange={e=>setTmpApoderado(e.target.value.replace(/[^0-9]/g,"").slice(0,8))} onKeyDown={e=>{if(e.key==="Enter"){setCurso(c=>({...c,alumnos:c.alumnos.map(x=>x.id===a.id?{...x,telefono:tmpApoderado}:x)}));setEditApoderado(null);}if(e.key==="Escape")setEditApoderado(null);}} placeholder="12345678"/>
                            </div>
                            <Btn sm onClick={()=>{setCurso(c=>({...c,alumnos:c.alumnos.map(x=>x.id===a.id?{...x,telefono:tmpApoderado}:x)}));setEditApoderado(null);}}>OK</Btn>
                            <Btn sm color="ghost" onClick={()=>setEditApoderado(null)}>x</Btn>
                          </div>
                        ) : (
                          <div style={{display:"flex",flexDirection:"column",gap:".4rem"}}>
                            <div style={{display:"flex",gap:".5rem",alignItems:"center"}}>
                              <span style={{color:a.apoderado?C.text:C.muted,fontSize:".85rem"}}>{a.apoderado||"Sin apoderado"}</span>
                              <Btn sm color="ghost" onClick={()=>{setEditApoderado(a.id);setTmpApoderado(a.apoderado||"");}}>editar</Btn>
                            </div>
                            <div style={{display:"flex",gap:".4rem",alignItems:"center"}}>
                              {a.telefono
                                ? <a href={"https://wa.me/569"+a.telefono} target="_blank" rel="noreferrer" style={{background:"#25D366",color:"#fff",padding:"2px 8px",borderRadius:8,fontSize:".72rem",fontWeight:600,textDecoration:"none"}}>+569 {a.telefono}</a>
                                : <span style={{color:C.muted,fontSize:".78rem"}}>Sin WhatsApp</span>
                              }
                              <Btn sm color="ghost" onClick={()=>{setEditApoderado("tel1_"+a.id);setTmpApoderado(a.telefono||"");}}>editar</Btn>
                              {a.telefono&&<Btn sm color="red" onClick={()=>setCurso(c=>({...c,alumnos:c.alumnos.map(x=>x.id===a.id?{...x,telefono:""}:x)}))}>x</Btn>}
                            </div>
                          </div>
                        )}
                      </td>
                      <td style={S.td}>
                        {/* Apoderado 2 name */}
                        {editApoderado===("apo2_"+a.id) ? (
                          <div style={{display:"flex",gap:".4rem",alignItems:"center",flexDirection:"column"}}>
                            <input style={{...S.inp,padding:".3rem .6rem",fontSize:".82rem"}} type="text" autoFocus value={tmpApoderado} onChange={e=>setTmpApoderado(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){setCurso(c=>({...c,alumnos:c.alumnos.map(x=>x.id===a.id?{...x,apoderado2:tmpApoderado}:x)}));setEditApoderado(null);}if(e.key==="Escape")setEditApoderado(null);}} placeholder="Nombre apoderado 2"/>
                            <div style={{display:"flex",gap:".4rem"}}>
                              <Btn sm onClick={()=>{setCurso(c=>({...c,alumnos:c.alumnos.map(x=>x.id===a.id?{...x,apoderado2:tmpApoderado}:x)}));setEditApoderado(null);}}>OK</Btn>
                              <Btn sm color="ghost" onClick={()=>setEditApoderado(null)}>x</Btn>
                            </div>
                          </div>
                        ) : editApoderado===("tel2_"+a.id) ? (
                          <div style={{display:"flex",gap:".4rem",alignItems:"center"}}>
                            <div style={{display:"flex",alignItems:"center",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,overflow:"hidden"}}>
                              <span style={{padding:"0 .5rem",color:C.muted,fontSize:".78rem",borderRight:"1px solid rgba(255,255,255,.1)",whiteSpace:"nowrap"}}>+569</span>
                              <input style={{...S.inp,border:"none",borderRadius:0,background:"transparent",width:90,fontSize:".82rem",padding:".3rem .5rem"}} type="tel" maxLength={8} autoFocus value={tmpApoderado} onChange={e=>setTmpApoderado(e.target.value.replace(/[^0-9]/g,"").slice(0,8))} onKeyDown={e=>{if(e.key==="Enter"){setCurso(c=>({...c,alumnos:c.alumnos.map(x=>x.id===a.id?{...x,telefono2:tmpApoderado}:x)}));setEditApoderado(null);}if(e.key==="Escape")setEditApoderado(null);}} placeholder="12345678"/>
                            </div>
                            <Btn sm onClick={()=>{setCurso(c=>({...c,alumnos:c.alumnos.map(x=>x.id===a.id?{...x,telefono2:tmpApoderado}:x)}));setEditApoderado(null);}}>OK</Btn>
                            <Btn sm color="ghost" onClick={()=>setEditApoderado(null)}>x</Btn>
                          </div>
                        ) : (
                          <div style={{display:"flex",flexDirection:"column",gap:".4rem"}}>
                            {/* Name row */}
                            <div style={{display:"flex",gap:".4rem",alignItems:"center"}}>
                              <span style={{color:a.apoderado2?C.text:C.muted,fontSize:".83rem"}}>{a.apoderado2||"Sin apoderado 2"}</span>
                              <Btn sm color="ghost" onClick={()=>{setEditApoderado("apo2_"+a.id);setTmpApoderado(a.apoderado2||"");}}>editar</Btn>
                              {a.apoderado2&&<Btn sm color="red" onClick={()=>setCurso(c=>({...c,alumnos:c.alumnos.map(x=>x.id===a.id?{...x,apoderado2:"",telefono2:""}:x)}))}>x</Btn>}
                            </div>
                            {/* WhatsApp row */}
                            <div style={{display:"flex",gap:".4rem",alignItems:"center"}}>
                              {a.telefono2
                                ? <a href={"https://wa.me/569"+a.telefono2} target="_blank" rel="noreferrer" style={{background:"#25D366",color:"#fff",padding:"2px 8px",borderRadius:8,fontSize:".72rem",fontWeight:600,textDecoration:"none"}}>+569 {a.telefono2}</a>
                                : <span style={{color:C.muted,fontSize:".78rem"}}>Sin WhatsApp</span>
                              }
                              <Btn sm color="ghost" onClick={()=>{setEditApoderado("tel2_"+a.id);setTmpApoderado(a.telefono2||"");}}>editar</Btn>
                              {a.telefono2&&<Btn sm color="red" onClick={()=>setCurso(c=>({...c,alumnos:c.alumnos.map(x=>x.id===a.id?{...x,telefono2:""}:x)}))}>x</Btn>}
                            </div>
                          </div>
                        )}
                      </td>
                      <td style={S.td}><Btn onClick={()=>setCurso(c=>({...c,alumnos:c.alumnos.filter(x=>x.id!==a.id)}))} color="red" sm>x</Btn></td>
                    </tr>
                  );
              })}</tbody></table>
            </div>
          </div>
        )}

        {tab==="reservas"&&(
          <div>
            {(()=>{
              // Solo alumnos con anticipos ACTIVOS ahora (cuotas pagadas cuyo mes aún no llega)
              const alumnosConAnticipo = alumnos.map(a=>{
                const ant = calcAnticipo(a.id, aportes, reservas, now);
                if(ant===0) return null;
                // Detalle de anticipos activos
                const pagas = cuotasPagas(a.id, aportes, reservas);
                const items = [];
                // Cuotas pagadas pero aún no vencidas (anticipadas)
                CUOTA_ORDER.forEach(c=>{
                  if(pagas.has(c) && !estaVencida(c,now)) {
                    items.push({concepto:TIPOS.find(t=>t.id===c)?.nota||c, monto:CUOTA_MENSUAL});
                  }
                });
                // Si tiene reserva anual, calcular cuotas futuras
                if(reservas.some(r=>r.sid===a.id)) {
                  items.length=0;
                  CUOTA_ORDER.forEach(c=>{
                    if(!estaVencida(c,now)) items.push({concepto:TIPOS.find(t=>t.id===c)?.nota||c, monto:CUOTA_MENSUAL});
                  });
                }
                return {alumno:a, ant, items};
              }).filter(Boolean);

              const totalAnticipo = alumnosConAnticipo.reduce((s,x)=>s+x.ant,0);

              if(alumnosConAnticipo.length===0) return (
                <div style={{...S.card,padding:"3rem",textAlign:"center",color:C.muted}}>
                  No hay pagos anticipados activos en este momento.
                </div>
              );

              return (
                <>
                  <div style={S.grid}>
                    <StatCard label="Alumnos con anticipo" value={alumnosConAnticipo.length} sub="En este momento" color="blue"/>
                    <StatCard label="Total anticipado" value={pesos(totalAnticipo)} sub="Por liberar" color="yellow"/>
                  </div>
                  <div style={{...S.card,marginBottom:".75rem"}}>
                    <div style={{display:"flex",gap:".75rem",alignItems:"flex-end",flexWrap:"wrap"}}>
                      <div style={{flex:"1 1 200px"}}>
                        <Campo label="Filtrar por alumno">
                          <select style={S.inp} value={filtAntAlumno} onChange={e=>setFiltAntAlumno(e.target.value)}>
                            <option value="">Todos los alumnos</option>
                            {alumnosConAnticipo.map(({alumno:a})=><option key={a.id} value={a.id}>{a.nombre}</option>)}
                          </select>
                        </Campo>
                      </div>
                      {filtAntAlumno&&<Btn sm color="ghost" onClick={()=>setFiltAntAlumno("")}>x Limpiar</Btn>}
                    </div>
                  </div>
                  <div style={{...S.card,padding:0,overflow:"hidden"}}>
                    <table style={S.tbl}>
                      <thead><tr>
                        <th style={S.th}>Alumno</th>
                        <th style={S.th}>Pagos anticipados activos</th>
                        <th style={S.th}>Total anticipo</th>
                      </tr></thead>
                      <tbody>
                        {alumnosConAnticipo.filter(x=>!filtAntAlumno||x.alumno.id===Number(filtAntAlumno)).map(({alumno:a,ant,items})=>(
                          <tr key={a.id}>
                            <td style={S.td}>{a.nombre}</td>
                            <td style={S.td}>
                              <div style={{display:"flex",flexDirection:"column",gap:".2rem"}}>
                                {items.map((it,i)=>(
                                  <span key={i} style={{fontSize:".82rem",color:C.muted}}>{it.concepto}: <span style={{color:C.blue,fontVariantNumeric:"tabular-nums"}}>{pesos(it.monto)}</span></span>
                                ))}
                              </div>
                            </td>
                            <td style={{...S.td,color:C.blue,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{pesos(ant)}</td>
                          </tr>
                        ))}
                        <tr>
                          <td style={{...S.td,fontWeight:600}} colSpan={2}>Total anticipado del curso</td>
                          <td style={{...S.td,color:C.blue,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{pesos(totalAnticipo)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {tab==="cobros"&&(
          <div>
            <div style={{background:"rgba(126,184,247,.06)",border:"1px solid rgba(126,184,247,.15)",borderRadius:10,padding:".85rem 1rem",fontSize:".83rem",color:"rgba(232,226,213,.55)",lineHeight:1.6,marginBottom:"1.5rem"}}>
              Crea cobros extraordinarios (salidas, materiales, etc.) y asígnalos a alumnos específicos. Aparecen en el portal de cada apoderado como vigente o vencido según la fecha.
            </div>

            <div style={S.card}>
              <div style={S.sec}>Crear nuevo cobro</div>
              <div style={S.fgrid}>
                <Campo label="Nombre del cobro">
                  <input style={S.inp} type="text" value={cf.nombre} onChange={e=>setCf(f=>({...f,nombre:e.target.value}))} placeholder="Ej: Salida pedagógica"/>
                </Campo>
                <Campo label="Descripción">
                  <input style={S.inp} type="text" value={cf.descripcion} onChange={e=>setCf(f=>({...f,descripcion:e.target.value}))} placeholder="Ej: Visita al museo"/>
                </Campo>
                <Campo label="Monto ($)">
                  <input style={S.inp} type="number" value={cf.monto} onChange={e=>setCf(f=>({...f,monto:e.target.value}))} placeholder="0"/>
                </Campo>
                <Campo label="Fecha de vencimiento">
                  <input style={S.inp} type="date" value={cf.vencimiento} onChange={e=>setCf(f=>({...f,vencimiento:e.target.value}))}/>
                </Campo>
                <Campo label="Clasificación del cobro">
                  <select style={S.inp} value={cf.clasificacion} onChange={e=>setCf(f=>({...f,clasificacion:e.target.value}))}>
                    <option value="Meta de recaudación">Meta de recaudación (suma al total esperado)</option>
                    <option value="Cobro extraordinario">Cobro extraordinario (se muestra separado)</option>
                    <option value="Fondo de reserva">Fondo de reserva</option>
                  </select>
                </Campo>
              </div>
              <Campo label={"Alumnos que aplican (" + cf.alumnosIds.length + " selecciónados)"}>
                <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,padding:".65rem .85rem",maxHeight:200,overflowY:"auto"}}>
                  <div style={{display:"flex",gap:".5rem",marginBottom:".65rem",flexWrap:"wrap"}}>
                    <Btn sm color="ghost" onClick={()=>setCf(f=>({...f,alumnosIds:alumnos.map(a=>a.id)}))}>Todos</Btn>
                    <Btn sm color="ghost" onClick={()=>setCf(f=>({...f,alumnosIds:[]}))}>Ningúno</Btn>
                  </div>
                  {alumnos.map(a=>(
                    <div key={a.id} onClick={()=>setCf(f=>({...f,alumnosIds:f.alumnosIds.includes(a.id)?f.alumnosIds.filter(x=>x!==a.id):[...f.alumnosIds,a.id]}))} style={{display:"flex",alignItems:"center",gap:".6rem",padding:".35rem .5rem",borderRadius:6,cursor:"pointer",background:cf.alumnosIds.includes(a.id)?"rgba(212,175,100,.1)":"transparent",marginBottom:".2rem"}}>
                      <span style={{width:16,height:16,borderRadius:4,border:"1px solid "+(cf.alumnosIds.includes(a.id)?"#d4af64":"rgba(255,255,255,.2)"),background:cf.alumnosIds.includes(a.id)?"#d4af64":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".7rem",color:"#0f1117",flexShrink:0}}>{cf.alumnosIds.includes(a.id)?"✓":""}</span>
                      <span style={{fontSize:".85rem"}}>{a.nombre}</span>
                    </div>
                  ))}
                </div>
              </Campo>
              <Alerta msg={cfErr}/>
              <div style={{marginTop:".85rem"}}>
                <Btn onClick={()=>{
                  if (!cf.nombre) { setCfErr("Ingresa el nombre del cobro."); return; }
                  if (!cf.monto)  { setCfErr("Ingresa el monto."); return; }
                  if (cf.alumnosIds.length===0) { setCfErr("Seleccióna al menos un alumno."); return; }
                  setCfErr("");
                  setCurso(c=>({...c, cobros:[...(c.cobros||[]), {id:genId(), nombre:cf.nombre, descripcion:cf.descripcion, monto:Number(cf.monto), vencimiento:cf.vencimiento, alumnosIds:cf.alumnosIds, clasificacion:cf.clasificacion, pagos:{}}]}));
                  setCf({nombre:"",descripcion:"",monto:"",vencimiento:hoy(),alumnosIds:[],clasificacion:"Meta de recaudación"});
                }}>Crear cobro</Btn>
              </div>
            </div>

            <div style={S.sec}>Cobros creados <span style={{fontSize:".85rem",color:C.muted,fontWeight:400}}>{cobros.length} cobros</span></div>
            {cobros.length===0 ? (
              <div style={{...S.card,padding:"3rem",textAlign:"center",color:C.muted}}>Sin cobros extraordinarios creados.</div>
            ) : cobros.map(co=>{
              const vencido = co.vencimiento < hoy();
              const nPagaron = Object.keys(co.pagos||{}).filter(k=>(co.pagos||{})[k]==="pagado").length;
              const nTotal   = co.alumnosIds.length;
              return (
                <div key={co.id} style={{...S.card,marginBottom:"1rem",borderColor:vencido?"rgba(235,87,87,.3)":"rgba(126,184,247,.25)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".75rem",flexWrap:"wrap",gap:".5rem"}}>
                    <div>
                      <div style={{fontFamily:"Georgia,serif",fontSize:"1rem",color:C.text,marginBottom:".2rem"}}>{co.nombre}</div>
                      {co.descripción&&<div style={{fontSize:".8rem",color:C.muted}}>{co.descripción}</div>}
                    </div>
                    <div style={{display:"flex",gap:".5rem",alignItems:"center",flexShrink:0}}>
                      <span style={{fontFamily:"Georgia,serif",fontSize:"1.1rem",color:C.gold}}>{pesos(co.monto)}</span>
                      <span style={{background:vencido?"rgba(235,87,87,.15)":"rgba(126,184,247,.15)",color:vencido?C.red:C.blue,border:"1px solid "+(vencido?"rgba(235,87,87,.3)":"rgba(126,184,247,.3)"),padding:"2px 9px",borderRadius:20,fontSize:".7rem",fontWeight:600}}>{vencido?"Vencido":"Vigente"}</span>
                      <Btn onClick={()=>setCurso(c=>({...c,cobros:(c.cobros||[]).filter(x=>x.id!==co.id)}))} color="red" sm>x</Btn>
                    </div>
                  </div>
                  <div style={{fontSize:".78rem",color:C.muted,marginBottom:".75rem"}}>Vencimiento: {fFecha(co.vencimiento)} · {nPagaron}/{nTotal} pagaron</div>
                  <div style={{...S.card,padding:0,overflow:"hidden",marginBottom:0}}>
                    <table style={S.tbl}>
                      <thead><tr><th style={S.th}>Alumno</th><th style={S.th}>Estado</th><th style={S.th}>Acción</th></tr></thead>
                      <tbody>
                        {co.alumnosIds.map(aid=>{
                          const al=alumnos.find(a=>a.id===aid);
                          const estado=(co.pagos||{})[aid]||"pendiente";
                          return (
                            <tr key={aid}>
                              <td style={S.td}>{al?.nombre||"-"}</td>
                              <td style={S.td}>
                                {estado==="pagado"?<Badge type="paid">Pagado</Badge>:estado==="aviso"?<Badge type="waiting">Avisó que pagó</Badge>:<Badge type="pending">Pendiente</Badge>}
                              </td>
                              <td style={S.td}>
                                {estado!=="pagado"&&(
                                  <Btn sm onClick={()=>setCurso(c=>({...c,cobros:(c.cobros||[]).map(x=>x.id===co.id?{...x,pagos:{...x.pagos,[aid]:"pagado"}}:x)}))}>Marcar pagado</Btn>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab==="deudas"&&(
          <div>
            <div style={{background:"rgba(235,87,87,.06)",border:"1px solid rgba(235,87,87,.18)",borderRadius:10,padding:".85rem 1rem",fontSize:".83rem",color:"rgba(232,226,213,.55)",lineHeight:1.6,marginBottom:"1.5rem"}}>Deudas de años anteriores. Aparecen en el portal del apoderado.</div>
            <div style={S.card}>
              <div style={S.sec}>Registrar deuda</div>
              <div style={S.fgrid}>
                <Campo label="Alumno"><select style={S.inp} value={df.sid} onChange={e=>setDf(f=>({...f,sid:e.target.value}))}><option value="">Selecciónar...</option>{alumnos.map(a=><option key={a.id} value={a.id}>{a.nombre}</option>)}</select></Campo>
                <Campo label="Ano"><select style={S.inp} value={df.anio} onChange={e=>setDf(f=>({...f,año:e.target.value}))}>{["2021","2022","2023","2024","2025"].map(y=><option key={y}>{y}</option>)}</select></Campo>
                <Campo label="Monto ($)"><input style={S.inp} type="number" value={df.monto} onChange={e=>setDf(f=>({...f,monto:e.target.value}))} placeholder="0"/></Campo>
                <Campo label="Descripción"><input style={S.inp} type="text" value={df.descripcion} onChange={e=>setDf(f=>({...f,descripcion:e.target.value}))} placeholder="Ej: Cuotas impagas"/></Campo>
              </div>
              <Btn onClick={()=>{if(!df.sid||!df.monto)return;setCurso(c=>({...c,deudas:[...c.deudas,{id:genId(),sid:Number(df.sid),año:df.anio,monto:Number(df.monto),descripcion:df.descripcion,pagado:false}]}));setDf(f=>({...f,sid:"",monto:""}));}}>Registrar deuda</Btn>
            </div>
            <div style={S.sec}>Registro <span style={{fontSize:".85rem",color:C.muted,fontWeight:400}}>{deudas.filter(d=>!d.pagado).length} pendientes</span></div>
            <div style={{...S.card,padding:0,overflow:"hidden"}}>
              {deudas.length===0?<div style={{padding:"3rem",textAlign:"center",color:C.muted}}>Sin deudas.</div>:(
                <table style={S.tbl}><thead><tr><th style={S.th}>Alumno</th><th style={S.th}>Ano</th><th style={S.th}>Descripción</th><th style={S.th}>Monto</th><th style={S.th}>Estado</th><th style={S.th}></th></tr></thead>
                <tbody>{deudas.map(d=>{const al=alumnos.find(a=>a.id===d.sid);return <tr key={d.id}><td style={S.td}>{al?.nombre||"-"}</td><td style={{...S.td,color:C.muted}}>{d.anio}</td><td style={S.td}>{d.descripción}</td><td style={{...S.td,color:d.pagado?C.green:C.red,fontVariantNumeric:"tabular-nums"}}>- {pesos(d.monto)}</td><td style={S.td}>{d.pagado?<Badge type="paid">Pagada</Badge>:<Badge type="pending">Pendiente</Badge>}</td><td style={S.td}><div style={{display:"flex",gap:".4rem"}}>{!d.pagado&&<Btn onClick={()=>setCurso(c=>({...c,deudas:c.deudas.map(x=>x.id===d.id?{...x,pagado:true}:x)}))} sm>Pagada</Btn>}<Btn onClick={()=>setCurso(c=>({...c,deudas:c.deudas.filter(x=>x.id!==d.id)}))} color="red" sm>x</Btn></div></td></tr>;})}
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
              <Btn onClick={()=>{const rows=[["Alumno","Apoderado","Tipo","Descripción","Monto","Fecha","Anticipo"]];[...aportes].sort((a,b)=>a.fecha.localeCompare(b.fecha)).forEach(a=>{const al=alumnos.find(x=>x.id===a.sid);rows.push([al?.nombre||"-",al?.apoderado||"-",a.tipoId||"otro",a.nota,a.monto,a.fecha,a.anticipo?"Si":"No"]);});exportCSV(rows,"aportes.csv");}}>Descargar aportes (.csv)</Btn>
            </div>
            <div style={S.card}>
              <div style={S.sec}>Gastos</div>
              <div style={{fontSize:".82rem",color:C.muted,marginBottom:"1rem"}}>Todos los gastos: descripción, categoria, monto, fecha.</div>
              <Btn onClick={()=>{const rows=[["Descripción","Categoria","Origen de fondos","Monto","Fecha"]];[...gastos].sort((a,b)=>a.fecha.localeCompare(b.fecha)).forEach(g=>rows.push([g.descripcion,g.categoria,g.origen||"-",g.monto,g.fecha]));exportCSV(rows,"gastos.csv");}}>Descargar gastos (.csv)</Btn>
            </div>
            <div style={S.card}>
              <div style={S.sec}>Resumen por alumno</div>
              <div style={{fontSize:".82rem",color:C.muted,marginBottom:"1rem"}}>Un registro por alumno con totales consolidados.</div>
              <Btn onClick={()=>{const rows=[["Alumno","Apoderado","Total pagado","Liberado","En anticipo","Deuda hist.","Pendiente año","Tipo"]];alumnos.forEach(a=>{const lib=calcLiberado(a.id,aportes,reservas,now);const ant=calcAnticipo(a.id,aportes,reservas,now);const pag=calcPagadoBruto(a.id,aportes,reservas,cobros||[]);const dh=deudas.filter(d=>d.sid===a.id&&!d.pagado).reduce((s,d)=>s+d.monto,0);const pend=Math.max(0,TOTAL_ANUAL-pag);const hasR=reservas.some(r=>r.sid===a.id);rows.push([a.nombre,a.apoderado||"-",pag,lib,ant,dh,pend,hasR?"Pago anual":pag>0?"Cuotas":"Sin aportes"]);});exportCSV(rows,"resumen.csv");}}>Descargar resumen (.csv)</Btn>
            </div>

            <div style={S.card}>
              <div style={S.sec}>Reporte de alumnos</div>
              <div style={{fontSize:".82rem",color:C.muted,marginBottom:"1rem"}}>
                Estado de cada alumno con detalle de deuda y descarga de estado de cuenta individual.
              </div>
              <div style={{...S.card,padding:0,overflow:"hidden",marginBottom:"1rem"}}>
                <table style={S.tbl}>
                  <thead>
                    <tr>
                      <th style={S.th}>Alumno</th>
                      <th style={S.th}>Apoderado</th>
                      <th style={S.th}>Estado</th>
                      <th style={S.th}>Deuda vencida</th>
                      <th style={S.th}>Deuda hist.</th>
                      <th style={S.th}>PDF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(()=>{
                      return alumnos.map(a => {
                        const pagas = cuotasPagas(a.id, aportes, reservas);
                        const pagado = calcPagadoBruto(a.id, aportes, reservas);
                        const hasR = reservas.some(r=>r.sid===a.id);
                        const vencidas = [];
                        if (!pagas.has("caja_chica")) vencidas.push({concepto:"Caja chica", monto:CAJA_CHICA});
                        CUOTA_ORDER.forEach(c=>{if(estaVencida(c,now)&&!pagas.has(c))vencidas.push({concepto:TIPOS.find(t=>t.id===c)?.nota||c,monto:CUOTA_MENSUAL});});
                        const deudasHist = deudas.filter(d=>d.sid===a.id&&!d.pagado);
                        const totalVenc = vencidas.reduce((s,x)=>s+x.monto,0);
                        const totalDH   = deudasHist.reduce((s,d)=>s+d.monto,0);
                        const alDia     = totalVenc===0 && totalDH===0;
                        return (
                          <tr key={a.id}>
                            <td style={S.td}>{a.nombre}</td>
                            <td style={{...S.td,color:C.muted,fontSize:".82rem"}}>
                              {a.apoderado||"-"}
                              {a.apoderado2&&<div style={{color:C.muted}}>{a.apoderado2}</div>}
                            </td>
                            <td style={S.td}>
                              {hasR
                                ? <Badge type="annual">Pago anual</Badge>
                                : alDia
                                  ? <Badge type="paid">Al dia</Badge>
                                  : <div>
                                      <Badge type="pending">Pendiente</Badge>
                                      {vencidas.length>0&&<div style={{fontSize:".72rem",color:C.muted,marginTop:".3rem",lineHeight:1.5}}>{vencidas.map((v,i)=><div key={i}>{v.concepto}</div>)}</div>}
                                      {deudasHist.length>0&&<div style={{fontSize:".72rem",color:C.muted}}>{deudasHist.map(d=><div key={d.id}>{d.anio} {d.descripción}</div>)}</div>}
                                    </div>
                              }
                            </td>
                            <td style={{...S.td,color:totalVenc>0?C.red:C.muted,fontVariantNumeric:"tabular-nums"}}>{totalVenc>0?pesos(totalVenc):"-"}</td>
                            <td style={{...S.td,color:totalDH>0?C.red:C.muted,fontVariantNumeric:"tabular-nums"}}>{totalDH>0?pesos(totalDH):"-"}</td>
                            <td style={S.td}>
                              <Btn sm onClick={()=>generarPDF(a,curso,aportes,reservas,gastos,deudas,cobros||[],now)}>PDF</Btn>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                    <tr>
                      <td style={{...S.td,fontWeight:600}} colSpan={3}>Total deuda del curso</td>
                      <td style={{...S.td,color:C.red,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>
                        {pesos(alumnos.reduce((s,a)=>{const p=cuotasPagas(a.id,aportes,reservas);let v=0;if(!p.has("caja_chica"))v+=CAJA_CHICA;CUOTA_ORDER.forEach(c=>{if(estaVencida(c,now)&&!p.has(c))v+=CUOTA_MENSUAL;});return s+v;},0))}
                      </td>
                      <td style={{...S.td,color:C.red,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>
                        {pesos(deudas.filter(d=>!d.pagado).reduce((s,d)=>s+d.monto,0))}
                      </td>
                      <td style={S.td}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Btn onClick={()=>{
                const mesActual=now.getMonth();
                const rows=[["Alumno","Apoderado","Concepto","Monto","Tipo"]];
                alumnos.forEach(a=>{
                  const p=cuotasPagas(a.id,aportes,reservas);
                  if(!p.has("caja_chica"))rows.push([a.nombre,a.apoderado||"-","Caja chica",CAJA_CHICA,"Cuota vencida"]);
                  CUOTA_ORDER.forEach(c=>{if(estaVencida(c,now)&&!p.has(c))rows.push([a.nombre,a.apoderado||"-",TIPOS.find(t=>t.id===c)?.nota||c,CUOTA_MENSUAL,"Cuota vencida"]);});
                  deudas.filter(d=>d.sid===a.id&&!d.pagado).forEach(d=>rows.push([a.nombre,a.apoderado||"-",d.anio+" - "+d.descripción,d.monto,"Deuda histórica"]));
                });
                exportCSV(rows,"reporte_alumnos.csv");
              }} color="red">Descargar reporte (.csv)</Btn>
            </div>
          </div>
        )}

        {tab==="ajustes"&&(
          <div>
            <div style={{...S.card,marginBottom:"1rem",borderColor:"rgba(235,87,87,.25)"}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:"1rem",color:C.text,marginBottom:".5rem"}}>Cierre de año y migración</div>
              <div style={{fontSize:".82rem",color:C.muted,marginBottom:"1.25rem",lineHeight:1.6}}>
                Al cerrar el año se genera un reporte histórico completo y el saldo queda registrado como saldo inicial del año siguiente. Los alumnos y apoderados se mantienen. Los aportes y gastos quedan archivados.
              </div>
              {saldoAnterior > 0 && (
                <div style={{background:"rgba(111,207,151,.08)",border:"1px solid rgba(111,207,151,.2)",borderRadius:10,padding:".75rem 1rem",marginBottom:"1rem"}}>
                  <div style={{fontSize:".82rem",color:C.green}}>Saldo traspasado del año anterior: <strong>{pesos(saldoAnterior)}</strong></div>
                </div>
              )}
              {historialAnios.length > 0 && (
                <div style={{marginBottom:"1rem"}}>
                  <div style={{fontSize:".82rem",color:C.muted,marginBottom:".5rem"}}>Años cerrados:</div>
                  {historialAnios.map((h,i) => (
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:".5rem .75rem",background:"rgba(255,255,255,.03)",borderRadius:8,marginBottom:".35rem",fontSize:".82rem"}}>
                      <span style={{color:C.text}}>{h.nombre} — {h.anio}</span>
                      <span style={{color:C.green,fontVariantNumeric:"tabular-nums"}}>Saldo: {pesos(h.saldo)}</span>
                    </div>
                  ))}
                </div>
              )}
              <Btn color="red" onClick={()=>{
                const now = new Date();
                const anioActual = now.getFullYear();
                // Calculate final balance
                const totalLib = alumnos.reduce((s,a)=>s+calcLiberado(a.id,aportes,reservas,now),0);
                const totalGasto = gastos.reduce((s,g)=>s+g.monto,0);
                const saldoFinal = totalLib - totalGasto;
                // Build CSV report
                const rows = [
                  ["=== REPORTE HISTORICO - "+curso.nombre+" - "+anioActual+" ==="],
                  [],
                  ["RESUMEN FINANCIERO"],
                  ["Total recaudado",totalLib],
                  ["Total gastos",totalGasto],
                  ["Saldo final",saldoFinal],
                  [],
                  ["APORTES"],
                  ["Alumno","Apoderado","Descripción","Monto","Fecha","Anticipo"],
                ];
                [...aportes].forEach(a=>{
                  const al=alumnos.find(x=>x.id===a.sid);
                  rows.push([al?.nombre||"-",al?.apoderado||"-",a.nota,a.monto,a.fecha,a.anticipo?"Si":"No"]);
                });
                rows.push([]);
                rows.push(["GASTOS"]);
                rows.push(["Descripción","Categoria","Origen","Monto","Fecha"]);
                [...gastos].forEach(g=>rows.push([g.descripcion,g.categoria,g.origen||"-",g.monto,g.fecha]));
                rows.push([]);
                rows.push(["ALUMNOS"]);
                rows.push(["Nombre","Apoderado","Total pagado"]);
                alumnos.forEach(a=>{
                  const pag = calcPagadoBruto(a.id,aportes,reservas,cobros||[]);
                  rows.push([a.nombre,a.apoderado||"-",pag]);
                });
                const csv = rows.map(r=>Array.isArray(r)?r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(","):"").join("\n");
                const blob = new Blob(["﻿"+csv],{type:"text/csv;charset=utf-8;"});
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href=url; a.download="historial_"+anioActual+".csv"; a.click(); URL.revokeObjectURL(url);
                // Archive and reset
                const nuevoHistorial = [...historialAnios, {nombre:curso.nombre, año:anioActual, saldo:saldoFinal, totalRecaudado:totalLib, totalGasto}];
                setCurso(c=>({
                  ...c,
                  historialAnios: nuevoHistorial,
                  saldoAnterior: saldoFinal,
                  aportes: [],
                  gastos: [],
                  reservas: [],
                  notifs: [],
                  cobros: [],
                  deudas: [],
                }));
              }}>Cerrar año y generar reporte histórico</Btn>
            </div>

            <div style={S.card}>
              <div style={S.sec}>Nombre del curso</div>
              {editNombre?(
                <div>
                  <Campo label="Nombre"><input style={S.inp} type="text" value={tmpNombre} onChange={e=>setTmpNombre(e.target.value)} placeholder="Ej: Tesoreria 5to Básico"/></Campo>
                  <div style={{display:"flex",gap:".65rem",marginTop:".85rem"}}><Btn onClick={()=>{setCurso(c=>({...c,nombre:tmpNombre}));setEditNombre(false);}}>Guardar</Btn><Btn color="ghost" onClick={()=>{setTmpNombre(curso.nombre);setEditNombre(false);}}>Cancelar</Btn></div>
                </div>
              ):(
                <div style={{display:"flex",alignItems:"center",gap:"1rem"}}><div style={{fontFamily:"Georgia,serif",fontSize:"1.25rem",color:C.gold}}>{curso.nombre}</div><Btn onClick={()=>{setTmpNombre(curso.nombre);setEditNombre(true);}} color="ghost" sm>Editar</Btn></div>
              )}
            </div>

            <div style={S.card}>
              <div style={S.sec}>Código del curso</div>
              <div style={{fontSize:".82rem",color:C.muted,marginBottom:"1rem"}}>Comparte este código para que los apoderados puedan acceder.</div>
              {!editCodigo?(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1rem"}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:"1.8rem",color:C.gold,letterSpacing:".15em",background:"rgba(212,175,100,.08)",border:"1px solid rgba(212,175,100,.2)",borderRadius:10,padding:".5rem 1.25rem"}}>{curso.codigoCurso}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:".4rem"}}>
                      <Btn onClick={()=>{try{navigator.clipboard.writeText(curso.codigoCurso).then(()=>{setCopiado(true);setTimeout(()=>setCopiado(false),2000);});}catch(e){setCopiado(true);setTimeout(()=>setCopiado(false),2000);}}} color="ghost" sm>{copiado?"Copiado!":"Copiar"}</Btn>
                      <Btn onClick={()=>{setTmpCodigo(curso.codigoCurso);setEditCodigo(true);}} color="ghost" sm>Cambiar</Btn>
                    </div>
                  </div>
                  <div style={{fontSize:".78rem",color:"rgba(232,226,213,.35)",lineHeight:1.6}}>Comparte este código por WhatsApp o en la reunion. Todos deben ingresarlo para acceder.</div>
                </div>
              ):(
                <div>
                  <Campo label="Nuevo código"><input style={{...S.inp,textTransform:"uppercase",letterSpacing:".15em",textAlign:"center"}} value={tmpCodigo} onChange={e=>setTmpCodigo(e.target.value.toUpperCase())} placeholder="Ej: CIAP2026"/></Campo>
                  <div style={{display:"flex",gap:".65rem",marginTop:".85rem"}}><Btn onClick={()=>{if(tmpCodigo.length>=4){setCurso(c=>({...c,codigoCurso:tmpCodigo}));setEditCodigo(false);}}} >Guardar</Btn><Btn color="ghost" onClick={()=>setEditCodigo(false)}>Cancelar</Btn></div>
                </div>
              )}
            </div>

            <div style={S.card}>
              <div style={S.sec}>Contraseña de administrador</div>
              {!editAdminPw?(
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:C.muted,fontSize:".85rem"}}>Contraseña: •••••••</span>
                  <Btn onClick={()=>{setEditAdminPw(true);setAdminPwf({actual:"",nueva:"",confirma:""});setAdminPwMsg("");}} color="ghost" sm>Cambiar</Btn>
                </div>
              ):(
                <div>
                  <div style={S.fgrid}>
                    <Campo label="Contraseña actual"><input style={S.inp} type="password" value={adminPwf.actual} onChange={e=>setAdminPwf(f=>({...f,actual:e.target.value}))} placeholder="Actual"/></Campo>
                    <Campo label="Nueva contraseña"><input style={S.inp} type="password" value={adminPwf.nueva} onChange={e=>setAdminPwf(f=>({...f,nueva:e.target.value}))} placeholder="Mínimo 4"/></Campo>
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
              <div style={S.sec}>Contraseñas de apoderados</div>
              <div style={{fontSize:".82rem",color:C.muted,marginBottom:"1rem"}}>Resetea la contraseña de un apoderado si la olvido.</div>
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
  const [cursos, setCursos] = useState([CURSO_DEMO.id ? {...CURSO_DEMO, cobros:[]} : CURSO_DEMO]);
  const [cursoActivo, setCursoActivo] = useState(null);
  const [pantalla, setPantalla] = useState("codigo");  // código | crear | rol | apoderado-login | portal | publico | admin
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