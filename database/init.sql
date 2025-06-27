
-- Script de inicialización de la base de datos MikroTik Dashboard
-- Este script se ejecuta automáticamente cuando se crea el contenedor

USE mikrotik_dashboard;

-- Tabla de usuarios
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'operator', 'viewer') DEFAULT 'viewer',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Tabla de dispositivos MikroTik
CREATE TABLE mikrotik_devices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    port INT DEFAULT 80,
    username VARCHAR(50) NOT NULL,
    password_encrypted TEXT NOT NULL,
    use_https BOOLEAN DEFAULT FALSE,
    status ENUM('online', 'offline', 'warning') DEFAULT 'offline',
    last_seen TIMESTAMP NULL,
    version VARCHAR(50) NULL,
    board VARCHAR(100) NULL,
    uptime VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de interfaces de red
CREATE TABLE network_interfaces (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id INT NOT NULL,
    interface_name VARCHAR(50) NOT NULL,
    interface_type ENUM('ethernet', 'wireless', 'vpn', 'bridge') NOT NULL,
    status ENUM('up', 'down') DEFAULT 'down',
    rx_bytes BIGINT DEFAULT 0,
    tx_bytes BIGINT DEFAULT 0,
    rx_rate BIGINT DEFAULT 0,
    tx_rate BIGINT DEFAULT 0,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES mikrotik_devices(id) ON DELETE CASCADE
);

-- Tabla de conexiones VPN
CREATE TABLE vpn_connections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id INT NOT NULL,
    connection_name VARCHAR(100) NOT NULL,
    connection_type ENUM('pptp', 'l2tp', 'sstp', 'ovpn') NOT NULL,
    status ENUM('connected', 'disconnected', 'connecting') DEFAULT 'disconnected',
    user_name VARCHAR(100) NULL,
    uptime VARCHAR(100) NULL,
    rx_bytes BIGINT DEFAULT 0,
    tx_bytes BIGINT DEFAULT 0,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES mikrotik_devices(id) ON DELETE CASCADE
);

-- Tabla de interfaces wireless
CREATE TABLE wireless_interfaces (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id INT NOT NULL,
    interface_name VARCHAR(50) NOT NULL,
    ssid VARCHAR(100) NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    signal_strength INT DEFAULT 0,
    clients_count INT DEFAULT 0,
    rx_bytes BIGINT DEFAULT 0,
    tx_bytes BIGINT DEFAULT 0,
    status ENUM('up', 'down') DEFAULT 'down',
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES mikrotik_devices(id) ON DELETE CASCADE
);

-- Tabla de alertas
CREATE TABLE alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id INT NOT NULL,
    alert_type ENUM('critical', 'warning', 'info') NOT NULL,
    message TEXT NOT NULL,
    acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP NULL,
    acknowledged_by INT NULL,
    FOREIGN KEY (device_id) REFERENCES mikrotik_devices(id) ON DELETE CASCADE,
    FOREIGN KEY (acknowledged_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla de backups
CREATE TABLE backup_files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    backup_type ENUM('configuration', 'full') DEFAULT 'configuration',
    file_path VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES mikrotik_devices(id) ON DELETE CASCADE
);

-- Tabla de configuración del sistema
CREATE TABLE system_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    config_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de configuración de email
CREATE TABLE email_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    smtp_server VARCHAR(255) NOT NULL,
    smtp_port INT DEFAULT 587,
    username VARCHAR(255) NOT NULL,
    password_encrypted TEXT NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    use_ssl BOOLEAN DEFAULT TRUE,
    enabled BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de destinatarios de email
CREATE TABLE email_recipients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email_address VARCHAR(255) NOT NULL,
    alert_types SET('critical', 'warning', 'info') DEFAULT 'critical,warning',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario administrador por defecto
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@mikrotik.local', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insertar configuración inicial del sistema
INSERT INTO system_config (config_key, config_value, config_type, description) VALUES
('app_name', 'MikroTik Dashboard', 'string', 'Nombre de la aplicación'),
('refresh_interval', '30', 'number', 'Intervalo de actualización en segundos'),
('enable_notifications', 'true', 'boolean', 'Habilitar notificaciones'),
('session_timeout', '3600', 'number', 'Timeout de sesión en segundos'),
('max_login_attempts', '5', 'number', 'Máximo intentos de login'),
('require_strong_passwords', 'true', 'boolean', 'Requerir contraseñas fuertes');

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_devices_ip ON mikrotik_devices(ip_address);
CREATE INDEX idx_interfaces_device ON network_interfaces(device_id);
CREATE INDEX idx_alerts_device ON alerts(device_id);
CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_backups_device ON backup_files(device_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
