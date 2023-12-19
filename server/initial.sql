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

-- Insertar un usuario de ejemplo con la contraseña encriptada "admin"
INSERT INTO users (nombre, mail, contraseña) VALUES
    ('admin', 'admin@admin.com', '$2b$10$aP4VJqcEMP1/6YlpPJNyuelka6ysc6VPKqSZ/XlFh9zkPlD4Zviqu');