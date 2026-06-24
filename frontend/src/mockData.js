export const MOCK_DATA = {
  user: { name: "Vanesa Soria", role: "Supervisor de Planta", legajo: "VS-404" },
  dashboard: {
    ordenesAbiertas: 24,
    ordenesVencidas: 3,
    equiposCriticos: 5,
    tareasHoy: 12,
    actividadReciente: [
      { fecha: "15/06", equipo: "Bomba P-101", estado: "Finalizada" },
      { fecha: "15/06", equipo: "Compresor C-05", estado: "Pendiente" },
      { fecha: "14/06", equipo: "Tablero T-02", estado: "En proceso" }
    ]
  }
};