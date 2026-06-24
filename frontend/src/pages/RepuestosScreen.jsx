import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, Plus, RefreshCw, AlertTriangle, Database, Package } from 'lucide-react';

export const RepuestosScreen = ({ onNavigate }) => {
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const evaluarStock = (actual, minimo) => {
    const act = Number(actual) || 0;
    const min = Number(minimo) || 0;

    if (act === 0) return { texto: 'SIN STOCK', estilo: 'bg-red-50 text-red-700 border-red-200' };
    if (act <= min) return { texto: 'PUNTO DE PEDIDO', estilo: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { texto: 'STOCK NORMAL', estilo: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const obtenerRepuestos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getRepuestos();
      setRepuestos(data);
    } catch (err) {
      console.error("Error al traer repuestos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerRepuestos();
  }, []);

  return (
    <div className="space-y-4 md:space-y-6 text-left pb-6">
      
      {/* BARRA SUPERIOR */}
      <div className="flex flex-col sm:flex-row gap-2.5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar repuesto por código o nombre..." 
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#007AFF]"
          />
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={obtenerRepuestos} 
            title="Refrescar Base"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#007AFF]" : ""} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          <button 
            onClick={() => onNavigate('crear-repuesto')} 
            className="flex items-center justify-center gap-1 bg-[#0A2540] hover:bg-[#007AFF] text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-md transition-all whitespace-nowrap"
          >
            <Plus size={16} />
            <span>Nuevo Repuesto</span>
          </button>
        </div>
      </div>

      {/* ESTADO 1: CARGANDO */}
      {loading && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3 shadow-sm">
          <RefreshCw size={28} className="animate-spin text-[#007AFF] mx-auto" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Consultando pañol en MySQL...</p>
        </div>
      )}

      {/* ESTADO 2: ERROR */}
      {!loading && error && (
        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl text-center space-y-3">
          <AlertTriangle size={32} className="text-red-600 mx-auto animate-bounce" />
          <h3 className="font-black text-sm text-red-900 uppercase">Error de conexión con el Almacén</h3>
          <p className="text-xs text-red-700 font-medium max-w-sm mx-auto">{error}</p>
        </div>
      )}

      {/* ESTADO 3: RENDER DE TABLA */}
      {!loading && !error && (
        <div className="space-y-2.5">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Database size={12} className="text-blue-500 inline" /> MySQL Live Data
            </span>
            <span className="text-[11px] font-bold text-slate-600">Total: {repuestos.length} ítems en catálogo</span>
          </div>

          {repuestos.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400 font-bold">
              No hay repuestos registrados en la base de datos.
            </div>
          ) : (
            repuestos.map((item) => {
              const estadoStock = evaluarStock(item.stock_actual, item.stock_minimo);
              return (
                <div 
                  key={item.id_repuesto || item.codigo} 
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#007AFF] transition-all shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-[#0A2540] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.codigo}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase truncate">
                        {item.fabricante || 'Generico'}
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-xs text-slate-800 truncate">{item.nombre}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{item.descripcion}</p>
                  </div>

                  <div className="flex flex-col items-end justify-center gap-1 shrink-0">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${estadoStock.estilo}`}>
                      {estadoStock.texto}
                    </span>
                    <span className="text-xs font-black text-slate-700">
                      {item.stock_actual} <span className="text-[10px] font-normal text-slate-400">{item.unidad_medida}</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
};