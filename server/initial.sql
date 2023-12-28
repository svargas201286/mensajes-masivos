-- Reemplazar nombre de base de datos por la que quieran
CREATE DATABASE IF NOT EXISTS whatsapp_post_auto;

-- Seleccionar la base de datos
USE whatsapp_post_auto;

-- Crear la tabla 'users'
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    mail VARCHAR(255) NOT NULL,
    contraseña VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS mensajes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT,
    FOREIGN KEY (id_user) REFERENCES users(id),
    numeros VARCHAR(255) NOT NULL,
    mensaje TEXT,
    totaldemensajes INT, -- Agregar la nueva columna 'totaldemensajes'
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar un usuario de ejemplo con la contraseña encriptada "admin"
INSERT INTO users (nombre, mail, contraseña) VALUES
    ('admin', 'admin@admin.com', '$2b$10$aP4VJqcEMP1/6YlpPJNyuelka6ysc6VPKqSZ/XlFh9zkPlD4Zviqu');