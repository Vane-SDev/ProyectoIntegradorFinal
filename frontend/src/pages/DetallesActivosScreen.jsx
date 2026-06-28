import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ArrowLeft, QrCode, FileText, History, Wrench, Download, AlertTriangle, Tag, X, RefreshCw, Clock } from 'lucide-react';

export const DetallesActivosScreen = ({ activo, onBack }) => {
  const [activeTab, setActiveTab] = useState('historial');
  const [showModalQR, setShowModalQR] = useState(false);
  
  // ESTADOS NUEVOS PARA LAS OTs RELACIONADAS
  const [ordenesAsociadas, setOrdenesAsociadas] = useState([]);
  const [loadingOTs, setLoadingOTs] = useState(false);

  // Parseador de fechas seguro anti-huso horario
  const formatearFecha = (isoString) => {
    if (!isoString) return 'S/F';
    const [anio, mes, dia] = isoString.split('T')[0].split('-');
    return `${dia}/${mes}/${anio}`;
  };

  // Diccionario de semáforo para los estados de las OTs en la subtabla
  const getBadgeEstadoOT = (est) => {
    switch (est) {
      case 'Finalizada': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'En Curso': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  // CAPTURA DE HISTORIAL EN TIEMPO REAL
  useEffect(() => {
    if (activo && activo.id_activo) {
      const cargarHistorialComponente = async () => {
        setLoadingOTs(true);
        try {
          const data = await api.getOrdenesPorActivo(activo.id_activo);
          setOrdenesAsociadas(data);
        } catch (err) {
          console.error("Error trayendo historial del activo:", err);
        } finally {
          setLoadingOTs(false);
        }
      };
      cargarHistorialComponente();
    }
  }, [activo]);

  if (!activo) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-8 rounded-2xl text-center max-w-md mx-auto mt-12 space-y-3 shadow-sm">
        <AlertTriangle className="text-amber-600 mx-auto" size={32} />
        <h3 className="font-black text-slate-800 text-sm uppercase">No se cargó el equipo</h3>
        <p className="text-xs text-slate-600">El registro se liberó de la memoria. Volvé al catálogo.</p>
        <button onClick={onBack} className="mt-2 bg-[#0A2540] text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer">
          ← Volver al Catálogo
        </button>
      </div>
    );
  }

  const { id_activo, codigo, nombre, descripcion, fabricante, modelo, numero_serie, area, planta, sector, criticidad, estado } = activo;

  const configEstado = {
    'Operativo': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    'En Mantenimiento': { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    'Fuera de Servicio': { bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  }[estado] || { bg: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-400' };

  // GENERADOR DE PDF NATIVO
  const generarPDFNativo = () => {
    const stringQR = `SIGMA-CMMS||TAG:${codigo}||EQ:${nombre}||SERIE:${numero_serie || 'SN'}`;
    const urlQR = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(stringQR)}`;
    
    const htmlFicha = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ficha_Tecnica_${codigo}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #111; line-height: 1.4; }
          .header { border-bottom: 2px solid #007AFF; padding-bottom: 12px; margin-bottom: 30px; display: flex; justify-content: space-between; items-center; }
          .logo { font-size: 22px; font-weight: 900; color: #0A2540; letter-spacing: -0.5px; }
          .badge-tag { background: #0A2540; color: white; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 16px; }
          h1 { margin: 0 0 5px 0; font-size: 26px; color: #0A2540; }
          .sub { color: #64748b; font-size: 13px; margin-bottom: 25px; }
          .grid { display: flex; gap: 20px; margin-bottom: 30px; }
          .col { flex: 1; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          th { background-color: #f8fafc; color: #475569; width: 32%; font-weight: 700; uppercase; }
          .qr-box { text-align: center; padding: 15px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; width: 140px; }
          .qr-box img { width: 110px; height: 110px; margin-bottom: 5px; opacity: 0; transition: opacity 0.3s; }
          .qr-box img.loaded { opacity: 1; }
          .qr-box span { font-size: 10px; color: #64748b; font-family: monospace; block; }
          .footer { margin-top: 50px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; pt: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">SIGMA CMMS <span style="font-size:12px; color:#007AFF; display:block; font-weight:600;">Planta Industrial</span></div>
          <div class="badge-tag">${codigo}</div>
        </div>
        <div class="grid">
          <div class="col" style="flex: 2.5;">
            <h1>${nombre}</h1>
            <div class="sub">${descripcion || 'Sin descripción técnica operativa declarada.'}</div>
            <table>
              <tr><th>Localización</th><td>${planta || 'Planta'} / ${sector || 'Sector'} (${area || 'Área'})</td></tr>
              <tr><th>Fabricante / Mod.</th><td>${fabricante || 'Genérico'} ${modelo ? `— Mod: ${modelo}` : ''}</td></tr>
              <tr><th>N° de Serie</th><td style="font-family: monospace; font-weight:bold;">${numero_serie || 'S/N'}</td></tr>
              <tr><th>Nivel Criticidad</th><td><span style="font-weight:bold; color: ${criticidad === 'Alta' ? '#dc2626' : '#d97706'}">${criticidad || 'Media'}</span></td></tr>
              <tr><th>Estado Actual</th><td><strong>${estado}</strong></td></tr>
            </table>
          </div>
          <div class="col qr-box">
            <img id="pdfQR" src="${urlQR}" />
            <span>SCAN FOR LIVE DATA</span>
          </div>
        </div>
        <div class="footer">Documento emitido bajo norma SIGMA • Fecha de impresión: ${new Date().toLocaleDateString('es-AR')}</div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=650,width=900');
    printWindow.document.write(htmlFicha);
    printWindow.document.close();
    printWindow.focus();

    const imgNode = printWindow.document.getElementById('pdfQR');
    const doPrintAndClose = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 50);
    };

    if (imgNode.complete) {
      imgNode.classList.add('loaded');
      doPrintAndClose();
    } else {
      imgNode.onload = () => {
        imgNode.classList.add('loaded');
        doPrintAndClose();
      };
      setTimeout(doPrintAndClose, 6000);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-2xl mx-auto text-left pb-12">
      
      <button onClick={onBack} className="flex items-center gap-2 text-[11px] font-black text-slate-500 hover:text-[#007AFF] transition-colors uppercase tracking-wider cursor-pointer">
        <ArrowLeft size={14} className="stroke-[3]" />
        <span>Volver al catálogo</span>
      </button>

      {/* CAJA SUPERIOR QR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="w-full h-40 bg-slate-50 rounded-xl flex flex-col items-center justify-center text-slate-400 font-bold text-xs border border-dashed border-slate-200 p-4 text-center gap-1">
          <Tag size={20} className="text-slate-300 mb-1" />
          <span className="text-slate-700 font-black text-sm">{nombre}</span>
          <span className="text-[11px] font-mono font-normal text-slate-400">[{codigo}]</span>
        </div>
        
        <button 
          onClick={() => setShowModalQR(true)} 
          className="w-full flex items-center justify-center gap-2 bg-[#007AFF] hover:bg-blue-600 text-white font-black text-xs py-3.5 rounded-xl shadow-md shadow-blue-500/15 transition-all uppercase tracking-wider cursor-pointer active:scale-[0.99]"
        >
          <QrCode size={16} />
          <span>Generar Código QR del Equipo</span>
        </button>
      </div>

      {/* FICHA TÉCNICA */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Ficha Técnica de Planta</h3>
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">Criticidad: {criticidad || 'Media'}</span>
        </div>
        
        <div className="space-y-2.5 text-xs">
          {[
            { label: "Tag ID", val: codigo, highlight: true },
            { label: "Equipo", val: nombre },
            { label: "Función", val: descripcion || "Sin descripción declarada" },
            { label: "Marca / Modelo", val: `${fabricante || 'Genérico'} ${modelo || ''}`.trim() },
            { label: "N° de Serie", val: numero_serie || "S/N", mono: true },
            { label: "Ubicación", val: `${planta || 'Planta'} / ${sector || 'Sector'} (${area || 'Área'})` },
          ].map((item, i) => (
            <div key={i} className="border-b border-slate-50 pb-2 last:border-0 last:pb-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">{item.label}</span>
              <span className={`text-xs mt-0.5 block ${item.highlight ? 'font-mono font-black text-[#007AFF] text-sm' : 'font-bold text-[#0A2540]'} ${item.mono ? 'font-mono' : ''}`}>
                {item.val}
              </span>
            </div>
          ))}

          <div className="pt-1 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Estado en Planta:</span>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[10px] uppercase border ${configEstado.bg}`}>
              <span className={`w-2 h-2 rounded-full ${configEstado.dot}`}></span>
              {estado}
            </div>
          </div>
        </div>
      </div>

      {/* TAB SUB-SECCIONES RELACIONADAS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50">
          {[
            { id: 'historial', icon: History, label: 'Historial OTs' },
            { id: 'doc', icon: FileText, label: 'Manuales' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3.5 text-[11px] font-black border-b-2 transition-all uppercase tracking-wider cursor-pointer ${
                activeTab === tab.id ? 'bg-white border-[#007AFF] text-[#007AFF]' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 bg-white min-h-[140px]">
        
          {activeTab === 'historial' && (
            <div className="space-y-3">
              {loadingOTs && (
                <div className="py-6 text-center text-slate-400 font-bold flex items-center justify-center gap-2">
                  <RefreshCw size={14} className="animate-spin text-[#007AFF]" />
                  <span>Consultando libro de intervenciones...</span>
                </div>
              )}

              {!loadingOTs && ordenesAsociadas.length === 0 && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-400 font-bold text-center">
                  Este equipo no registra intervenciones u Órdenes de Trabajo en el sistema.
                </div>
              )}

              {!loadingOTs && ordenesAsociadas.length > 0 && (
                <div className="space-y-2.5">
                  {ordenesAsociadas.map((otItem) => (
                    <div key={otItem.id_ot} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-[#007AFF] text-sm">{otItem.numero_ot}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-200/60 px-1.5 py-0.5 rounded">
                            {otItem.tipo_mantenimiento}
                          </span>
                          <span className={`px-2 py-0.5 border text-[9px] font-black uppercase rounded ${getBadgeEstadoOT(otItem.estado)}`}>
                            {otItem.estado}
                          </span>
                        </div>
                        <p className="font-bold text-slate-700">{otItem.descripcion}</p>
                        {otItem.observaciones && (
                          <p className="text-[11px] text-slate-500 font-medium italic border-l-2 border-slate-300 pl-2 mt-1">
                            {otItem.observaciones}
                          </p>
                        )}
                        {otItem.horas_hombre > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mt-1">
                            <Clock size={11} /> Mano de obra: {otItem.horas_hombre} hs/hombre
                          </span>
                        )}
                      </div>
                      
                      <div className="text-left sm:text-right text-[10px] font-bold text-slate-400 shrink-0 self-start sm:self-center">
                        <div>RESP: {otItem.tecnico_nombre || 'Sin técnico'}</div>
                        <div className="font-mono mt-0.5">{formatearFecha(otItem.fecha_programada)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PESTAÑA MANUALES */}
          {activeTab === 'doc' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-blue-50/20 rounded-xl border border-blue-100 text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="p-1.5 bg-[#007AFF] text-white rounded-lg font-black text-[10px]">PDF</div>
                  <div className="truncate">
                    <h4 className="font-bold text-[#0A2540] truncate">Manual_Operador_{codigo}.pdf</h4>
                    <span className="text-[9px] text-slate-400 font-bold">Ficha técnica imprimible</span>
                  </div>
                </div>
                
                <button 
                  onClick={generarPDFNativo}
                  title="Descargar Ficha en PDF"
                  className="p-2 bg-white text-[#007AFF] hover:bg-blue-50 rounded-lg shadow-sm border border-slate-100 transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  <Download size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* OVERLAY MODAL: CÓDIGO QR */}
      {showModalQR && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 text-left">
              <div>
                <h4 className="font-black text-[#0A2540] text-sm">Etiqueta QR Dinámica</h4>
                <p className="text-[10px] text-slate-400 font-bold">TAG: {codigo}</p>
              </div>
              <button onClick={() => setShowModalQR(false)} className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`SIGMA||TAG:${codigo}||EQ:${nombre}`)}`} alt="QR" className="w-44 h-44 shadow-sm rounded-lg mb-2" />
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">SCAN WITH MOBILE</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Pegá esta etiqueta en el chasis del equipo para acceso directo.</p>
          </div>
        </div>
      )}

    </div>
  );
};