import React from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';

export const CrearOrdenScreen = ({ onBack }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      <div className="p-6 bg-[#0A2540] text-white flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Formulario de Planta</span>
          <h2 className="text-lg font-black">Emisión de Orden de Trabajo</h2>
        </div>
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onBack(); }} className="p-6 space-y-5 text-left">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Equipo Afectado *</label>
            <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#0A2540] focus:outline-none focus:border-[#007AFF]">
              <option>Bomba Centrífuga P-101</option>
              <option>Compresor Central C-05</option>
              <option>Intercambiador I-02</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tipo de Intervención</label>
            <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#007AFF]">
              <option>Preventivo Programado</option>
              <option>Correctivo de Emergencia</option>
              <option>Inspección de Rutina</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Prioridad</label>
            <select className="w-full p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-black focus:outline-none">
              <option>CRÍTICA (0hs)</option>
              <option>ALTA (24hs)</option>
              <option>MEDIA (72hs)</option>
              <option>BAJA</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Técnico Asignado</label>
            <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none">
              <option>Juan Pérez (Mecánico)</option>
              <option>María López (Eléctrico)</option>
              <option>Estefania (Auditor)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Fecha Límite</label>
            <input type="date" defaultValue="2026-06-22" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Sintomatología / Trabajo a realizar</label>
          <textarea 
            rows={4} 
            placeholder="Describa el hallazgo físico, ruidos extraños o el protocolo a seguir..." 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#007AFF]"
            defaultValue="Se detecta pérdida de fluido de refrigeración en el sello mecánico lateral. Reemplazar conjunto de juntas."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onBack}
            className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="px-6 py-2.5 bg-[#007AFF] hover:bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
          >
            <Save size={16} /> Guardar y Emitir OT
          </button>
        </div>

      </form>
    </div>
  );
};