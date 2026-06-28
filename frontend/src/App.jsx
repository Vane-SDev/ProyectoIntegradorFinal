import { useState, useEffect } from 'react';
import { LoginScreen } from './pages/LoginScreen.jsx';
import { DashboardScreen } from './pages/DashboardScreen.jsx';
import { ActivosScreen } from './pages/ActivosScreen.jsx';
import { DetallesActivosScreen } from './pages/DetallesActivosScreen.jsx';
import { CrearActivoScreen } from './components/CrearActivoScreen.jsx';
import { OrdenesScreen } from './pages/OrdenesScreen.jsx';
import { CrearOrdenScreen } from './pages/CrearOrdenesScreen.jsx';
import { MisTareasScreen } from './pages/MisTareasScreen.jsx';
import { RegistrarIntervencionScreen } from './pages/RegistrarIntervencionScreen.jsx';
import { HistorialScreen } from './pages/HistorialScreen.jsx';
import { InspeccionesScreen } from './pages/InspeccionesScreen.jsx';
import { UsuariosScreen } from './pages/UsuariosScreen.jsx';
import { RepuestosScreen } from './pages/RepuestosScreen.jsx';
import { CrearRepuestoScreen } from './pages/CrearRepuestoScreen.jsx';
import { MainLayout } from './components/MainLayout.jsx';

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [current, setCurrent] = useState('login');
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);
  const [otSeleccionada, setOtSeleccionada] = useState(null);

  const despacharSegunRol = (id_rol) => {
    const rolNum = Number(id_rol);
    if ([3, 6].includes(rolNum)) {
      setCurrent('tareas');
    } else {
      setCurrent('dashboard');
    }
  };

  useEffect(() => {
    if (usuario && current === 'login') {
      despacharSegunRol(usuario.id_rol);
    }
  }, []);

  useEffect(() => {
    const vistasExclusivasJefes = ['dashboard', 'activos', 'crear-activo', 'ordenes', 'crear-orden', 'usuarios', 'repuestos', 'crear-repuesto'];
    const esOperarioCampo = usuario && [3, 6].includes(Number(usuario.id_rol));

    if (esOperarioCampo && vistasExclusivasJefes.includes(current)) {
      setCurrent('tareas');
    }
  }, [current, usuario]);

  const handleLoginSuccess = () => {
    const userFresco = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(userFresco);
    if (userFresco) {
      despacharSegunRol(userFresco.id_rol);
    } else {
      setCurrent('dashboard');
    }
  };

  if (!usuario || current === 'login') {
    return <LoginScreen onLogin={handleLoginSuccess} />;
  }

  return (
    <MainLayout 
      key={usuario.id_usuario || 'sesion'} 
      activeTab={current} 
      onNavigate={setCurrent}
    >
      {current === 'dashboard' && <DashboardScreen onNavigate={setCurrent} />}
      {current === 'activos' && (
        <ActivosScreen onNavigate={setCurrent} onSelectActivo={setActivoSeleccionado} />
      )}
      {current === 'crear-activo' && <CrearActivoScreen onNavigate={setCurrent} />}
      {current === 'detalle-activo' && (
        <DetallesActivosScreen activo={activoSeleccionado} onBack={() => setCurrent('activos')} />
      )}
      {current === 'ordenes' && (
        <OrdenesScreen onNavigate={setCurrent} onSelectOrden={setOtSeleccionada} />
      )}
      {current === 'crear-orden' && <CrearOrdenScreen onBack={() => setCurrent('ordenes')} />}
      {current === 'tareas' && <MisTareasScreen ot={otSeleccionada} onNavigate={setCurrent} />}
      {current === 'registrar-intervencion' && (
        <RegistrarIntervencionScreen ot={otSeleccionada} onBack={() => setCurrent('tareas')} onNavigate={setCurrent} />
      )}
      {current === 'inspecciones' && <InspeccionesScreen />}
      {current === 'historial' && <HistorialScreen />}
      {current === 'usuarios' && <UsuariosScreen onNavigate={setCurrent} />}
      {current === 'repuestos' && <RepuestosScreen onNavigate={setCurrent} />}
      {current === 'crear-repuesto' && <CrearRepuestoScreen onNavigate={setCurrent} />} 
    </MainLayout>
  );
}