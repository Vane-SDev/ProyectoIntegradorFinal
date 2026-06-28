const BASE_URL = 'http://localhost:3000/api';

export const api = {

  get: async (endpoint) => {
    const res = await fetch(`${BASE_URL}/${endpoint}`);
    if (!res.ok) throw new Error(`Error GET en ${endpoint}`);
    return res.json();
  },

  post: async (endpoint, data) => {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  put: async (endpoint, id, data) => {
    const res = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Credenciales inválidas');
    return res.json();
  },

  // USUARIOS
  getUsuarios: () => api.get('usuarios'),
  crearUsuario: (data) => api.post('usuarios', data),
  updateUsuario: (id, data) => api.put('usuarios', id, data),

  // ACTIVOS
  getActivos: () => api.get('activos'),
  crearActivo: (data) => api.post('activos', data),

  // REPUESTOS
  getRepuestos: () => api.get('repuestos'),
  crearRepuesto: (data) => api.post('repuestos', data),

  // ÓRDENES DE TRABAJO
  getOrdenes: () => api.get('ordenes-trabajo'),
  getOrdenesPorTecnico: async (idTecnico) => {
    return await api.get(`ordenes-trabajo/tecnico/${idTecnico}`);
  },
  getOrdenesPorActivo: (idActivo) => api.get(`ordenes-trabajo/activo/${idActivo}`),
  getOrdenesTrabajo: async () => {
    return await api.get('ordenes-trabajo'); 
  },
  crearOrden: (data) => api.post('ordenes-trabajo', data),



  // Cierre con repuestos y horas
  actualizarOrden: async (id, payload) => {
    const res = await fetch(`${BASE_URL}/ordenes-trabajo/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const textoError = await res.text();
      throw new Error(`Rechazo SQL: ${textoError}`);
    }
    return res.json();
  },

  // Cambio de estado
  actualizarEstadoOrden: async (id, estadoStr) => {
    const res = await fetch(`${BASE_URL}/ordenes-trabajo/estado/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: estadoStr })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Rechazo SQL: ${errorText}`);
    }
    return res.json();
  },

  cerrarOrden: async (id, payload) => {
    // 1. Clonamos el payload para no mutar el objeto original
    const payloadSano = { ...payload };

    // 2. formato de fechas 
    const fechaHoy = new Date().toISOString().split('T')[0];
    
    // Si la fecha programada es nula se le asigna la fecha del dia
    payloadSano.fecha_programada = payloadSano.fecha_programada 
      ? payloadSano.fecha_programada.split('T')[0] 
      : fechaHoy;

    payloadSano.fecha_finalizacion = fechaHoy;

    // 3. Forzamos el estado
    payloadSano.estado = 'Finalizada';

    // 4.eliminamos campos que causan conflicto en el UPDATE
    delete payloadSano.activo_nombre;
    delete payloadSano.activo_codigo;
    delete payloadSano.tecnico_nombre;
    delete payloadSano.asignado_a;

    const res = await fetch(`${BASE_URL}/ordenes-trabajo/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadSano)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error en el servidor: ${errorText}`);
    }
    return res.json();
  }
};