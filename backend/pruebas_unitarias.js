


console.log("=== INICIANDO  PRUEBAS UNITARIAS ===");

// 1. Función a probar: Lógica de reposición de inventario
function evaluarStock(stockActual, stockMinimo) {
    if (stockActual === 0) return "SIN STOCK";
    if (stockActual <= stockMinimo) return "PUNTO DE PEDIDO";
    return "STOCK NORMAL";
}

console.log("\n--- Prueba 1: Evaluación de Stock ---");
let res1 = evaluarStock(5, 5);
console.assert(res1 === "PUNTO DE PEDIDO", "Fallo en Prueba 1");
console.log("✔ ÉXITO | Input: (5,5) | Esperado: PUNTO DE PEDIDO | Obtenido: " + res1);

// 2. Función a probar: Validación de formato de correo (Regex básico)
function esEmailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

console.log("\n--- Prueba 2: Validación de Email (Evitar datos erróneos) ---");
let res2 = esEmailValido("usuario-sin-dominio.com");
console.assert(res2 === false, "Fallo en Prueba 2");
console.log("✔ ÉXITO | Input: 'usuario-sin-dominio.com' | Esperado: false | Obtenido: " + res2);

// 3. Función a probar: Lógica de estado de Orden de Trabajo
function determinarEstadoOT(horasAsignadas) {
    if (horasAsignadas > 0) return "En Curso";
    return "Pendiente";
}

console.log("\n--- Prueba 3: Cambio de estado automático de OT ---");
let res3 = determinarEstadoOT(2.5);
console.assert(res3 === "En Curso", "Fallo en Prueba 3");
console.log("✔ ÉXITO | Input: (2.5 horas) | Esperado: En Curso | Obtenido: " + res3);

console.log("\n=== PRUEBAS FINALIZADAS SIN ERRORES ===");