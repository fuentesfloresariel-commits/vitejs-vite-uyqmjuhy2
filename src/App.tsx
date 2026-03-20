import React, { useState, useEffect } from 'react';

// === CONFIGURACIÓN ===
const CODIGO_CORRECTO = "CIAP2026";
const NOMBRE_CURSO = "Tesorería 4to Básico - CIAP 2026";
const CUOTA_MENSUAL = 5000; // Cuota sugerida
const MESES = ["Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// === ESTRUCTURA DE DATOS (TYPESCRIPT) ===
interface Aporte {
  id: number;
  alumno: string;
  monto: number;
  fecha: string;
  mes: string;
}

// === COMPONENTE PRINCIPAL ===
export default function App() {
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  
  // === ESTADOS DE DATOS CON MEMORIA LOCAL ===
  const [aportes, setAportes] = useState<Aporte[]>(() => {
    const saved = localStorage.getItem('ciap2026_aportes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error cargando aportes guardados", e);
        return [];
      }
    }
    return [];
  });
  
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('');
  const [montoAporte, setMontoAporte] = useState(CUOTA_MENSUAL.toString());
  const [mesSeleccionado, setMesSeleccionado] = useState(MESES[0]);

  // === EFECTO PARA GUARDAR DATOS AUTOMÁTICAMENTE ===
  useEffect(() => {
    localStorage.setItem('ciap2026_aportes', JSON.stringify(aportes));
  }, [aportes]);

  // === LÓGICA DE NEGOCIO ===
  const handleIngresar = () => {
    if (codigoIngresado === CODIGO_CORRECTO) {
      setAutenticado(true);
    } else {
      alert("Código incorrecto.");
    }
  };

  const handleRegistrarAporte = () => {
    if (!alumnoSeleccionado || !montoAporte) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const nuevoAporte: Aporte = {
      id: Date.now(), // ID único basado en el tiempo
      alumno: alumnoSeleccionado,
      monto: parseInt(montoAporte, 10),
      fecha: new Date().toLocaleDateString('es-CL'), // Fecha en formato Chileno
      mes: mesSeleccionado,
    };

    setAportes(prev => [nuevoAporte, ...prev]);
    
    // Limpiar formulario
    setAlumnoSeleccionado('');
    setMontoAporte(CUOTA_MENSUAL.toString());
    alert("¡Aporte registrado correctamente!");
  };

  const calcularTotalAportes = () => aportes.reduce((sum, a) => sum + a.monto, 0);

  // === VISTAS ===
  
  // Vista 1: Login
  if (!autenticado) {
    return (
      <div style={styles.containerLogin}>
        <div style={styles.cardLogin}>
          <h2 style={styles.title}>{NOMBRE_CURSO}</h2>
          <p style={styles.subtitle}>Ingresa el código de tu curso para continuar</p>
          <input 
            style={styles.input}
            type="text" 
            value={codigoIngresado} 
            onChange={(e) => setCodigoIngresado(e.target.value.toUpperCase())}
            placeholder="Código del curso"
          />
          <button style={styles.button} onClick={handleIngresar}>Acceder al curso</button>
        </div>
      </div>
    );
  }

  // Vista 2: App Principal
  return (
    <div style={styles.containerApp}>
      <header style={styles.header}>
        <h2 style={styles.headerTitle}>{NOMBRE_CURSO}</h2>
        <span style={styles.totalBadge}>Total Recaudado: ${calcularTotalAportes().toLocaleString('es-CL')}</span>
      </header>

      <main style={styles.main}>
        {/* Formulario de Aportes */}
        <section style={styles.cardForm}>
          <h3>Registrar Nuevo Aporte</h3>
          
          <label style={styles.label}>Nombre del Alumno (RUT)</label>
          <input 
            style={styles.inputForm}
            type="text" 
            value={alumnoSeleccionado} 
            onChange={(e) => setAlumnoSeleccionado(e.target.value)} 
            placeholder="Ej: Juan Pérez - 20.123.456-7"
          />

          <label style={styles.label}>Monto del Aporte</label>
          <input 
            style={styles.inputForm}
            type="number" 
            value={montoAporte} 
            onChange={(e) => setMontoAporte(e.target.value)} 
            placeholder={`Sugerido: ${CUOTA_MENSUAL}`}
          />

          <label style={styles.label}>Mes Correspondiente</label>
          <select style={styles.inputForm} value={mesSeleccionado} onChange={(e) => setMesSeleccionado(e.target.value)}>
            {MESES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <button style={styles.buttonForm} onClick={handleRegistrarAporte}>Registrar Aporte</button>
        </section>

        {/* Historial de Aportes */}
        <section style={styles.cardHistory}>
          <h3>Historial de Aportes</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Alumno</th>
                  <th>Mes</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {aportes.length === 0 && <tr><td colSpan={4} style={styles.emptyText}>No hay aportes registrados aún.</td></tr>}
                {aportes.map(a => (
                  <tr key={a.id}>
                    <td>{a.fecha}</td>
                    <td>{a.alumno}</td>
                    <td>{a.mes}</td>
                    <td>${a.monto.toLocaleString('es-CL')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

// === ESTILOS (CSS-IN-JS) ===
// Fondo negro puro y tipografía moderna para alta resolución.
const styles = {
  // Login
  containerLogin: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000000' },
  cardLogin: { background: '#111111', padding: '40px', borderRadius: '15px', border: '1px solid #333333', textAlign: 'center', width: '300px', boxShadow: '0 4px 15px rgba(255,255,255,0.1)' },
  title: { color: '#ffffff', marginBottom: '10px', fontSize: '24px', fontWeight: 'bold' },
  subtitle: { color: '#999999', marginBottom: '30px', fontSize: '14px' },
  input: { background: '#000000', color: '#ffffff', border: '1px solid #333333', padding: '12px', borderRadius: '8px', width: '100%', marginBottom: '20px', textAlign: 'center' },
  button: { background: '#222222', color: '#ffffff', border: '1px solid #ffffff', padding: '12px', borderRadius: '8px', width: '100%', cursor: 'pointer', transition: 'background 0.3s' },
  
  // App
  containerApp: { background: '#000000', color: '#ffffff', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #333333' },
  headerTitle: { color: '#ffffff', fontSize: '20px', margin: 0 },
  totalBadge: { background: '#333333', color: '#ffffff', padding: '8px 15px', borderRadius: '20px', fontSize: '14px' },
  main: { padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' },
  
  // Tarjetas
  cardForm: { flex: '1 1 300px', background: '#111111', padding: '20px', borderRadius: '15px', border: '1px solid #333333', boxShadow: '0 4px 15px rgba(255,255,255,0.05)' },
  cardHistory: { flex: '2 1 500px', background: '#111111', padding: '20px', borderRadius: '15px', border: '1px solid #333333', boxShadow: '0 4px 15px rgba(255,255,255,0.05)' },
  
  // Formulario
  label: { color: '#cccccc', display: 'block', marginBottom: '5px', fontSize: '12px' },
  inputForm: { background: '#000000', color: '#ffffff', border: '1px solid #333333', padding: '10px', borderRadius: '8px', width: '100%', marginBottom: '15px' },
  buttonForm: { background: '#ffffff', color: '#000000', border: 'none', padding: '12px 20px', borderRadius: '8px', width: '100%', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },

  // Tabla
  tableWrapper: { marginTop: '15px', maxHeight: '400px', overflowY: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' },
  emptyText: { textAlign: 'center', color: '#999999', padding: '20px' },
};