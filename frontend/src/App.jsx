import { useState } from 'react';
import { LoginScreen } from './pages/LoginScreen.jsx';
import { DashboardScreen } from './pages/DashboardScreen.jsx';
import { ActivosScreen } from './pages/ActivosScreen.jsx';
import { DetallesActivosScreen } from './pages/DetallesActivosScreen.jsx';
import { CrearActivoScreen } from './components/CrearActivoScreen.jsx';
import { OrdenesScreen } from './pages/OrdenesScreen.jsx';
import { CrearOrdenScreen } from './pages/CrearOrdenesScreen.jsx';
import { MisTareasScreen } from './pages/MisTareasScreen.jsx';
import { RegistrarIntervencionScreen } from './pages/RegistrarIntervencionScreen.jsx';
import { InspeccionesScreen } from './pages/InspeccionesScreen.jsx';
import { UsuariosScreen } from './pages/UsuariosScreen.jsx';
import { RepuestosScreen } from './pages/RepuestosScreen.jsx';
import { MainLayout } from './components/MainLayout.jsx';

export default function App() {
  const [current, setCurrent] = useState('login');
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);
  const [otSeleccionada, setOtSeleccionada] = useState(null);

  const handleNavigate = (tab, id = null) => {
    setCurrent(tab);
    if (id) setActivoSeleccionado(id);
  };

  if (current === 'login') return <LoginScreen onLogin={() => setCurrent('dashboard')} />;

  return (
    <MainLayout activeTab={current} onNavigate={setCurrent}>


      {current === 'dashboard' && <DashboardScreen onNavigate={setCurrent} />}
      {current === 'activos' && (
        <ActivosScreen
          onNavigate={setCurrent}
          onSelectActivo={setActivoSeleccionado} // <--- EL CABLE REAL
        />
      )}
      {current === 'crear-activo' && <CrearActivoScreen onNavigate={setCurrent} />}
      {current === 'detalle-activo' && (
        <DetallesActivosScreen activo={activoSeleccionado} onBack={() => setCurrent('activos')}/>)}
      {current === 'ordenes' && ( <OrdenesScreen onNavigate={setCurrent}
          onSelectOrden={setOtSeleccionada}/>)}
      {current === 'crear-orden' && <CrearOrdenScreen onBack={() => setCurrent('ordenes')} />}
      {current === 'tareas' && (<MisTareasScreen ot={otSeleccionada} onNavigate={setCurrent} />)}
      {current === 'registrar-intervencion' && (<RegistrarIntervencionScreen
    ot={otSeleccionada} onBack={() => setCurrent('tareas')} onNavigate={setCurrent}/>)}
      {current === 'inspecciones' && <InspeccionesScreen />}
      {current === 'usuarios' && <UsuariosScreen onNavigate={setCurrent} />}
      {current === 'repuestos' && <RepuestosScreen onNavigate={setCurrent} />}

      {/* Pantallas fantasma pendientes del último Sprint */}
      {
        current !== 'registrar-intervencion' &&
        current !== 'inspecciones'

      }

    </MainLayout>
  );
}