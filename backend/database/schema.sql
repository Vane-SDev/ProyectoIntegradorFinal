CREATE DATABASE IF NOT EXISTS sigma DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE sigma;

CREATE TABLE IF NOT EXISTS roles (
    id_rol INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

INSERT IGNORE INTO roles (id_rol, nombre) VALUES 
(1, 'Administrador del sistema'), 
(2, 'Supervisor de mantenimiento'), 
(3, 'Técnico de mantenimiento'),
(4, 'Responsable operativo / planificación'),
(5, 'Personal administrativo'),
(6, 'Contratista externo');

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
) ENGINE=InnoDB;

INSERT IGNORE INTO usuarios (id_usuario, nombre, email, password, id_rol) VALUES 
(1, 'Vanesa Soria', 'vsoria@planta.inti', '1234', 1);



CREATE TABLE IF NOT EXISTS activos (
    id_activo INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fabricante VARCHAR(100),
    modelo VARCHAR(100),
    numero_serie VARCHAR(100),
    area VARCHAR(100),
    planta VARCHAR(100),
    sector VARCHAR(100),
    criticidad VARCHAR(20) DEFAULT 'Media',
    estado VARCHAR(50) DEFAULT 'Operativo'
) ENGINE=InnoDB;

INSERT IGNORE INTO activos (id_activo, codigo, nombre, descripcion, fabricante, modelo, numero_serie, area, planta, sector, criticidad, estado) VALUES 
(1, 'P-101', 'Bomba de impulsión principal', 'Alimenta el circuito de refrigeración', 'Flowserve', 'HDX-2500', 'SN-99482', 'Nave 2 (Separación)', 'Planta Alta', 'Procesos', 'Alta', 'Operativo');



CREATE TABLE IF NOT EXISTS ordenes_trabajo (
    id_ot INT AUTO_INCREMENT PRIMARY KEY,
    numero_ot VARCHAR(20) NOT NULL UNIQUE,
    tipo_mantenimiento VARCHAR(50) NOT NULL,
    id_activo INT NOT NULL,
    id_tecnico INT NULL,
    horas_hombre DECIMAL(5,2) DEFAULT 0.00,
    prioridad VARCHAR(20) DEFAULT 'Media',
    estado VARCHAR(50) DEFAULT 'Pendiente',
    descripcion TEXT,
    observaciones TEXT,
    fecha_programada DATE,
    fecha_finalizacion DATE,
    FOREIGN KEY (id_activo) REFERENCES activos(id_activo) ON DELETE CASCADE,
    FOREIGN KEY (id_tecnico) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT IGNORE INTO ordenes_trabajo (id_ot, numero_ot, tipo_mantenimiento, id_activo, id_tecnico, horas_hombre, prioridad, estado, descripcion, observaciones, fecha_programada) VALUES 
(1, 'OT-1001', 'Preventivo', 1, 1, 2.50, 'Alta', 'En Curso', 'Ajuste de sellos mecánicos y lubricación de biela', 'Se desmontó la carcasa frontal y se reemplazó el juego de sellos mecánicos.', '2026-06-25');

CREATE TABLE IF NOT EXISTS repuestos_ot (
    id_repuesto_ot INT AUTO_INCREMENT PRIMARY KEY,
    id_ot INT NOT NULL,
    repuesto VARCHAR(150) NOT NULL,
    cantidad INT DEFAULT 1,
    FOREIGN KEY (id_ot) REFERENCES ordenes_trabajo(id_ot) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT IGNORE INTO repuestos_ot (id_ot, repuesto, cantidad) VALUES 
(1, 'Juntas de teflón 3/4 (x2)', 1);