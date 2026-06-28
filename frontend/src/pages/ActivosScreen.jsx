import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit2, Trash2, RefreshCw, AlertTriangle, Database } from 'lucide-react';

export const ActivosScreen = ({ onNavigate, onSelectActivo }) => {
    const [activos, setActivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Traductor de colores para el estado en la base de MySQL
    const getBadgeStyle = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'operativo': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'en mantenimiento': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'fuera de servicio': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };

    const obtenerActivosDesdeMySQL = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/api/activos');

            if (!response.ok) {
                throw new Error(`Error del servidor: HTTP ${response.status}`);
            }

            const data = await response.json();
            setActivos(data);
        } catch (err) {
            console.error("Falló el puente con el Backend:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerActivosDesdeMySQL();
    }, []);

    return (
        <div className="space-y-4 md:space-y-6 text-left pb-6">

            {/* BARRA SUPERIOR */}
            <div className="flex flex-col sm:flex-row gap-2.5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar en la base de datos..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#007AFF]"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={obtenerActivosDesdeMySQL}
                        title="Refrescar Base"
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin text-[#007AFF]" : ""} />
                        <span className="hidden sm:inline">Sync</span>
                    </button>

                    <button
                        onClick={() => onNavigate('crear-activo')}
                        className="flex items-center justify-center gap-1 bg-[#0A2540] hover:bg-[#007AFF] text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-md transition-all whitespace-nowrap"
                    >
                        <Plus size={16} />
                        <span>Nuevo</span>
                    </button>
                </div>
            </div>

            {/* ESTADO 1: CARGANDO */}
            {loading && (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3 shadow-sm">
                    <RefreshCw size={28} className="animate-spin text-[#007AFF] mx-auto" />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Consultando a MySQL...</p>
                </div>
            )}

            {/* ESTADO 2: ERROR DE CONEXIÓN */}
            {!loading && error && (
                <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl text-center space-y-3">
                    <AlertTriangle size={32} className="text-red-600 mx-auto animate-bounce" />
                    <h3 className="font-black text-sm text-red-900 uppercase">Se cortó el cable de red</h3>
                    <p className="text-xs text-red-700 font-medium max-w-sm mx-auto">
                        React intentó pedirle los datos a <span className="font-mono font-bold">http://localhost:3000/activos</span> pero el servidor Node lo rechazó.
                    </p>
                    <div className="text-[10px] bg-white text-slate-700 p-2 rounded-lg border border-red-100 font-mono inline-block">
                        Detalle técnico: {error}
                    </div>
                </div>
            )}

            {/* ESTADO 3: ÉXITO */}
            {!loading && !error && (
                <div className="space-y-2.5">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Database size={12} className="text-emerald-500 inline" /> MySQL Live Data
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600">Total: {activos.length} activos</span>
                    </div>

                    {activos.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400 font-bold">
                            La tabla 'activos' está completamente vacía.
                        </div>
                    ) : (
                        activos.map((item) => (
                            <div
                                key={item.id_activo || item.codigo}
                                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#007AFF] transition-all shadow-sm flex items-center justify-between gap-3"
                            >
                                <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-xs text-[#0A2540] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                            {item.codigo}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase truncate">{item.area}</span>
                                    </div>

                                    <h4 className="font-bold text-xs text-slate-800 truncate">{item.nombre}</h4>

                                    <div className="inline-flex pt-0.5">
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${getBadgeStyle(item.estado)}`}>
                                            {item.estado}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => {
                                            onSelectActivo(item);
                                            onNavigate('detalle-activo');
                                        }}
                                        className="w-9 h-9 rounded-xl bg-[#007AFF] hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-md"
                                    >
                                        <Eye size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

        </div>
    );
};