-- Abe Garage Database Schema
-- Complete SQL script for the garage management system

-- Create the database
CREATE DATABASE IF NOT EXISTS abe_garage;
USE abe_garage;

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS order_status;
DROP TABLE IF EXISTS order_services;
DROP TABLE IF EXISTS order_info;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customer_vehicle_info;
DROP TABLE IF EXISTS employee_pass;
DROP TABLE IF EXISTS employee_role;
DROP TABLE IF EXISTS employee_info;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS company_roles;
DROP TABLE IF EXISTS common_services;
DROP TABLE IF EXISTS customer_info;
DROP TABLE IF EXISTS customer_identifier;

-- 1. Company Roles Table
CREATE TABLE company_roles (
    company_role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Customer Identifier Table (for authentication)
CREATE TABLE customer_identifier (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_email VARCHAR(100) UNIQUE NOT NULL,
    customer_phone_number VARCHAR(20),
    customer_hash VARCHAR(255),
    customer_password VARCHAR(255),
    customer_added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Customer Info Table
CREATE TABLE customer_info (
    customer_id INT PRIMARY KEY,
    customer_username VARCHAR(50) UNIQUE NOT NULL,
    customer_first_name VARCHAR(50) NOT NULL,
    customer_last_name VARCHAR(50) NOT NULL,
    active_customer_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer_identifier(customer_id) ON DELETE CASCADE
);

-- 4. Employee Table
CREATE TABLE employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_email VARCHAR(100) UNIQUE NOT NULL,
    active_employee BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Employee Info Table
CREATE TABLE employee_info (
    employee_id INT PRIMARY KEY,
    employee_first_name VARCHAR(50) NOT NULL,
    employee_last_name VARCHAR(50) NOT NULL,
    employee_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE
);

-- 6. Employee Password Table
CREATE TABLE employee_pass (
    employee_id INT PRIMARY KEY,
    employee_password_hashed VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE
);

-- 7. Employee Role Table
CREATE TABLE employee_role (
    employee_id INT PRIMARY KEY,
    company_role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (company_role_id) REFERENCES company_roles(company_role_id) ON DELETE RESTRICT
);

-- 8. Customer Vehicle Info Table
CREATE TABLE customer_vehicle_info (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    vehicle_year INT NOT NULL,
    vehicle_make VARCHAR(50) NOT NULL,
    vehicle_model VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(30),
    vehicle_mileage INT,
    vehicle_tag VARCHAR(20) UNIQUE,
    vehicle_serial VARCHAR(50),
    vehicle_color VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer_info(customer_id) ON DELETE CASCADE
);

-- 9. Common Services Table
CREATE TABLE common_services (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    service_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 10. Orders Table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    customer_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    order_hash VARCHAR(255),
    active_order BOOLEAN DEFAULT TRUE,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customer_info(customer_id) ON DELETE RESTRICT,
    FOREIGN KEY (vehicle_id) REFERENCES customer_vehicle_info(vehicle_id) ON DELETE RESTRICT
);

-- 11. Order Info Table
CREATE TABLE order_info (
    order_id INT PRIMARY KEY,
    order_total_price DECIMAL(10,2) DEFAULT 0.00,
    additional_request TEXT,
    additional_requests_completed BOOLEAN DEFAULT FALSE,
    completion_date TIMESTAMP NULL,
    notes_for_internal_use TEXT,
    notes_for_customer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- 12. Order Services Table
CREATE TABLE order_services (
    order_id INT NOT NULL,
    service_id INT NOT NULL,
    service_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (order_id, service_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES common_services(service_id) ON DELETE RESTRICT
);

-- 13. Order Status Table
CREATE TABLE order_status (
    order_id INT PRIMARY KEY,
    order_status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Insert sample data

-- Insert company roles
INSERT INTO company_roles (role_name, role_description) VALUES
('Manager', 'Garage manager with full access to all operations'),
('Mechanic', 'Certified mechanic responsible for vehicle repairs'),
('Receptionist', 'Front desk staff handling customer service'),
('Admin', 'System administrator with full access');

-- Insert sample employees
INSERT INTO employee (employee_email, active_employee) VALUES
('john.doe@abegarage.com', TRUE),
('jane.smith@abegarage.com', TRUE),
('mike.wilson@abegarage.com', TRUE),
('sarah.jones@abegarage.com', TRUE);

-- Insert employee info
INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES
(1, 'John', 'Doe', '555-0101'),
(2, 'Jane', 'Smith', '555-0102'),
(3, 'Mike', 'Wilson', '555-0103'),
(4, 'Sarah', 'Jones', '555-0104');

-- Insert employee passwords (hashed - in real app, use bcrypt)
INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES
(1, '$2b$10$hashedpassword1'),
(2, '$2b$10$hashedpassword2'),
(3, '$2b$10$hashedpassword3'),
(4, '$2b$10$hashedpassword4');

-- Insert employee roles
INSERT INTO employee_role (employee_id, company_role_id) VALUES
(1, 1), -- John Doe as Manager
(2, 2), -- Jane Smith as Mechanic
(3, 2), -- Mike Wilson as Mechanic
(4, 3); -- Sarah Jones as Receptionist

-- Insert sample customers
INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash, customer_password) VALUES
('john.customer@email.com', '555-1001', 'customer_hash_1', '$2b$10$customerpass1'),
('mary.customer@email.com', '555-1002', 'customer_hash_2', '$2b$10$customerpass2'),
('david.customer@email.com', '555-1003', 'customer_hash_3', '$2b$10$customerpass3'),
('lisa.customer@email.com', '555-1004', 'customer_hash_4', '$2b$10$customerpass4');

INSERT INTO customer_info (customer_id, customer_username, customer_first_name, customer_last_name, active_customer_status) VALUES
(1, 'john_customer', 'John', 'Customer', TRUE),
(2, 'mary_customer', 'Mary', 'Customer', TRUE),
(3, 'david_customer', 'David', 'Customer', TRUE),
(4, 'lisa_customer', 'Lisa', 'Customer', TRUE);

-- Insert sample vehicles
INSERT INTO customer_vehicle_info (customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color) VALUES
(1, 2020, 'Toyota', 'Camry', 'Sedan', 45000, 'ABC123', 'TOY2020CAM001', 'Silver'),
(1, 2018, 'Honda', 'CR-V', 'SUV', 62000, 'XYZ789', 'HON2018CRV001', 'Blue'),
(2, 2021, 'Ford', 'F-150', 'Truck', 28000, 'DEF456', 'FOR2021F15001', 'Red'),
(3, 2019, 'BMW', 'X5', 'SUV', 38000, 'GHI789', 'BMW2019X5001', 'Black'),
(4, 2022, 'Tesla', 'Model 3', 'Electric', 15000, 'JKL012', 'TES2022MOD3001', 'White');

-- Insert common services
INSERT INTO common_services (service_name, service_description) VALUES
('Oil Change', 'Complete oil change service with filter replacement'),
('Brake Service', 'Brake pad replacement and brake system inspection'),
('Tire Rotation', 'Tire rotation and balance service'),
('Engine Tune-up', 'Complete engine tune-up including spark plugs and filters'),
('AC Service', 'Air conditioning system service and refrigerant check'),
('Battery Replacement', 'Battery testing and replacement service'),
('Transmission Service', 'Transmission fluid change and inspection'),
('Wheel Alignment', 'Four-wheel alignment service'),
('Diagnostic Service', 'Computer diagnostic service for check engine light'),
('Fuel System Service', 'Fuel filter replacement and fuel system cleaning');

-- Insert sample orders
INSERT INTO orders (employee_id, customer_id, vehicle_id, order_hash, active_order) VALUES
(2, 1, 1, 'order_hash_001', TRUE),
(3, 2, 3, 'order_hash_002', TRUE),
(2, 3, 4, 'order_hash_003', FALSE),
(4, 4, 5, 'order_hash_004', TRUE);

-- Insert order info
INSERT INTO order_info (order_id, order_total_price, additional_request, additional_requests_completed) VALUES
(1, 89.99, 'Please check tire pressure', FALSE),
(2, 245.50, 'Customer requested premium oil', TRUE),
(3, 156.75, 'None', TRUE),
(4, 89.99, 'Please wash the car', FALSE);

-- Insert order services
INSERT INTO order_services (order_id, service_id, service_completed) VALUES
(1, 1, TRUE),  -- Oil change for order 1
(1, 3, FALSE), -- Tire rotation for order 1
(2, 1, TRUE),  -- Oil change for order 2
(2, 4, TRUE),  -- Engine tune-up for order 2
(3, 2, TRUE),  -- Brake service for order 3
(4, 1, FALSE); -- Oil change for order 4

-- Insert order status
INSERT INTO order_status (order_id, order_status) VALUES
(1, 'in_progress'),
(2, 'completed'),
(3, 'completed'),
(4, 'pending');

-- Create indexes for better performance
CREATE INDEX idx_customer_email ON customer_identifier(customer_email);
CREATE INDEX idx_employee_email ON employee(employee_email);
CREATE INDEX idx_vehicle_tag ON customer_vehicle_info(vehicle_tag);
CREATE INDEX idx_order_date ON orders(order_date);
CREATE INDEX idx_order_status ON order_status(order_status);
CREATE INDEX idx_customer_vehicle ON customer_vehicle_info(customer_id);

-- Create views for common queries

-- View for customer orders with details
CREATE VIEW customer_order_details AS
SELECT 
    o.order_id,
    o.order_date,
    o.active_order,
    ci.customer_first_name,
    ci.customer_last_name,
    cid.customer_email,
    cid.customer_phone_number,
    cvi.vehicle_make,
    cvi.vehicle_model,
    cvi.vehicle_year,
    cvi.vehicle_tag,
    ei.employee_first_name,
    ei.employee_last_name,
    os.order_status,
    oi.order_total_price,
    oi.additional_request
FROM orders o
JOIN customer_info ci ON o.customer_id = ci.customer_id
JOIN customer_identifier cid ON o.customer_id = cid.customer_id
JOIN customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
JOIN employee_info ei ON o.employee_id = ei.employee_id
JOIN order_status os ON o.order_id = os.order_id
JOIN order_info oi ON o.order_id = oi.order_id;

-- View for employee workload
CREATE VIEW employee_workload AS
SELECT 
    e.employee_id,
    ei.employee_first_name,
    ei.employee_last_name,
    cr.role_name,
    COUNT(o.order_id) as total_orders,
    COUNT(CASE WHEN os.order_status = 'completed' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN os.order_status = 'in_progress' THEN 1 END) as active_orders
FROM employee e
JOIN employee_info ei ON e.employee_id = ei.employee_id
JOIN employee_role er ON e.employee_id = er.employee_id
JOIN company_roles cr ON er.company_role_id = cr.company_role_id
LEFT JOIN orders o ON e.employee_id = o.employee_id
LEFT JOIN order_status os ON o.order_id = os.order_id
WHERE e.active_employee = TRUE
GROUP BY e.employee_id, ei.employee_first_name, ei.employee_last_name, cr.role_name;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON abe_garage.* TO 'your_username'@'localhost';
-- FLUSH PRIVILEGES;

-- Show table information
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    DATA_LENGTH,
    INDEX_LENGTH
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'abe_garage'
ORDER BY TABLE_NAME;

-- Show sample data
SELECT 'Company Roles' as table_name, COUNT(*) as record_count FROM company_roles
UNION ALL
SELECT 'Employees', COUNT(*) FROM employee
UNION ALL
SELECT 'Customers', COUNT(*) FROM customer_info
UNION ALL
SELECT 'Vehicles', COUNT(*) FROM customer_vehicle_info
UNION ALL
SELECT 'Services', COUNT(*) FROM common_services
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders; 