const connection = require("../database/connection");


const obtenerOrdenes = (req, res) => {
    const sql = `
        SELECT 
            ot.*,
            a.nombre AS activo_nombre,
            a.codigo AS activo_codigo,
            u.nombre AS tecnico_nombre
        FROM ordenes_trabajo ot
        LEFT JOIN activos a ON ot.id_activo = a.id_activo
        LEFT JOIN usuarios u ON ot.id_tecnico = u.id_usuario
        ORDER BY ot.fecha_programada DESC
    `;

    connection.query(sql, (error, results) => {
        if (error) {
            console.log("Error SQL en OTs:", error);
            return res.status(500).json({ mensaje: "Error al obtener órdenes de trabajo" });
        }
        res.status(200).json(results);
    });
};

// 2. CREAR ORDEN
const crearOrden = (req, res) => {
    const {
        numero_ot, tipo_mantenimiento, id_activo, id_tecnico, prioridad, descripcion, fecha_programada
    } = req.body;

    const sql = `
        INSERT INTO ordenes_trabajo (
            numero_ot, tipo_mantenimiento, id_activo, id_tecnico, prioridad, descripcion, fecha_programada, estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Pendiente')
    `;

    connection.query(
        sql,
        [numero_ot, tipo_mantenimiento, id_activo, id_tecnico || null, prioridad, descripcion, fecha_programada],
        (error, results) => {
            if (error) {
                console.log("Error al crear OT:", error);
                return res.status(500).json({ mensaje: "Error al crear la orden de trabajo", error: error.sqlMessage });
            }
            res.status(201).json({ mensaje: "Orden creada correctamente", id_ot: results.insertId });
        }
    );
};

// 3. OBTENER POR ID
const obtenerOrdenPorId = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT ot.*, a.nombre AS activo_nombre, a.codigo AS activo_codigo, u.nombre AS tecnico_nombre
        FROM ordenes_trabajo ot
        LEFT JOIN activos a ON ot.id_activo = a.id_activo
        LEFT JOIN usuarios u ON ot.id_tecnico = u.id_usuario
        WHERE ot.id_ot = ?
    `;

    connection.query(sql, [id], (error, results) => {
        if (error) return res.status(500).json({ mensaje: "Error al consultar la orden" });
        if (results.length === 0) return res.status(404).json({ mensaje: "Orden no encontrada" });
        res.status(200).json(results[0]);
    });
};

// 4. ACTUALIZAR ORDEN COMPLETA
const actualizarOrden = (req, res) => {
    const { id } = req.params;
    const {
        tipo_mantenimiento, id_activo, id_tecnico, prioridad, estado, descripcion, 
        observaciones, horas_hombre, fecha_programada, fecha_finalizacion, repuestos
    } = req.body;

    connection.beginTransaction((err) => {
        if (err) {
            console.error("Error iniciando Transacción ACID:", err);
            return res.status(500).json({ mensaje: "Error del motor SQL al abrir transacción" });
        }

        const sqlOT = `
            UPDATE ordenes_trabajo SET
                tipo_mantenimiento = ?, id_activo = ?, id_tecnico = ?, prioridad = ?, estado = ?, 
                descripcion = ?, observaciones = ?, horas_hombre = ?, fecha_programada = ?, fecha_finalizacion = ?
            WHERE id_ot = ?
        `;

        const paramsOT = [
            tipo_mantenimiento, id_activo, id_tecnico || null, prioridad, estado, 
            descripcion, observaciones, horas_hombre || 0, fecha_programada, fecha_finalizacion, id
        ];

        connection.query(sqlOT, paramsOT, (err) => {
            if (err) {
                return connection.rollback(() => {
                    console.error("Rollback en UPDATE OT:", err);
                    res.status(500).json({ mensaje: "Falló la cabecera. Transacción abortada." });
                });
            }

            connection.query("DELETE FROM repuestos_ot WHERE id_ot = ?", [id], (err) => {
                if (err) {
                    return connection.rollback(() => {
                        console.error("Rollback en DELETE repuestos:", err);
                        res.status(500).json({ mensaje: "Error de sincronización. Transacción abortada." });
                    });
                }

                // PASO 3: Evaluar si el técnico consumió repuestos
                if (!repuestos || repuestos.length === 0) {
                    // No hay repuestos: Sellamos la transacción acá
                    connection.commit((err) => {
                        if (err) return connection.rollback(() => res.status(500).json({ mensaje: "Error en Commit final" }));
                        return res.status(200).json({ mensaje: "Orden cerrada exitosamente (Sin consumo de stock)" });
                    });
                } else {
                    // Armamos la matriz de inserción masiva para MySQL: [ [id, 'rep1', 1], [id, 'rep2', 1] ]
                    const valuesRepuestos = repuestos.map(rep => [id, rep, 1]);

                    connection.query("INSERT INTO repuestos_ot (id_ot, repuesto, cantidad) VALUES ?", [valuesRepuestos], (err) => {
                        if (err) {
                            return connection.rollback(() => {
                                console.error("Rollback en INSERT repuestos:", err);
                                res.status(500).json({ mensaje: "Rechazo en tabla de repuestos. Transacción abortada." });
                            });
                        }

                        connection.commit((err) => {
                            if (err) return connection.rollback(() => res.status(500).json({ mensaje: "Error al sellar COMMIT" }));
                            return res.status(200).json({ mensaje: "Transacción ACID completada con éxito." });
                        });
                    });
                }
            });
        });
    });
};


const cambiarEstadoOrden = (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    const sql = "UPDATE ordenes_trabajo SET estado = ? WHERE id_ot = ?";
    connection.query(sql, [estado, id], (error) => {
        if (error) return res.status(500).json({ mensaje: "Error al cambiar el estado" });
        res.status(200).json({ mensaje: "Estado actualizado correctamente" });
    });
};

// 6. OBTENER OTs POR ACTIVO 
const obtenerOrdenesPorActivo = (req, res) => {
    const { id_activo } = req.params;
    const sql = `
        SELECT ot.*, u.nombre AS tecnico_nombre
        FROM ordenes_trabajo ot
        LEFT JOIN usuarios u ON ot.id_tecnico = u.id_usuario
        WHERE ot.id_activo = ?
        ORDER BY ot.fecha_programada DESC
    `;

    connection.query(sql, [id_activo], (error, results) => {
        if (error) return res.status(500).json({ mensaje: "Error al consultar órdenes del activo" });
        res.status(200).json(results);
    });
};

// 7. OBTENER OTs POR TÉCNICO
const obtenerOrdenesPorTecnico = (req, res) => {
    const { id_tecnico } = req.params;
    const sql = `
        SELECT ot.*, a.nombre AS activo_nombre, a.codigo AS activo_codigo
        FROM ordenes_trabajo ot
        LEFT JOIN activos a ON ot.id_activo = a.id_activo
        WHERE ot.id_tecnico = ?
        ORDER BY ot.fecha_programada DESC
    `;

    connection.query(sql, [id_tecnico], (error, results) => {
        if (error) return res.status(500).json({ mensaje: "Error al consultar órdenes del técnico" });
        res.status(200).json(results);
    });
};

module.exports = {
    obtenerOrdenes, crearOrden, obtenerOrdenPorId, actualizarOrden, cambiarEstadoOrden, obtenerOrdenesPorActivo, obtenerOrdenesPorTecnico
};