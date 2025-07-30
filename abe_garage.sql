-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 25, 2025 at 10:33 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `abe_garage`
--

-- --------------------------------------------------------

--
-- Table structure for table `common_services`
--

CREATE TABLE `common_services` (
  `service_id` int(11) NOT NULL,
  `service_name` varchar(100) NOT NULL,
  `service_description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `common_services`
--

INSERT INTO `common_services` (`service_id`, `service_name`, `service_description`, `created_at`, `updated_at`) VALUES
(1, 'Oil Change', 'Complete oil change service with filter replacement', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(2, 'Brake Service', 'Brake pad replacement and brake system inspection', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(3, 'Tire Rotation', 'Tire rotation and balance service', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(4, 'Engine Tune-up', 'Complete engine tune-up including spark plugs and filters', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(5, 'AC Service', 'Air conditioning system service and refrigerant check', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(6, 'Battery Replacement', 'Battery testing and replacement service', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(7, 'Transmission Service', 'Transmission fluid change and inspection', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(8, 'Wheel Alignment', 'Four-wheel alignment service', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(9, 'Diagnostic Service', 'Computer diagnostic service for check engine light', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(10, 'Fuel System Service', 'Fuel filter replacement and fuel system cleaning', '2025-06-21 16:06:48', '2025-06-21 16:06:48');

-- --------------------------------------------------------

--
-- Table structure for table `company_roles`
--

CREATE TABLE `company_roles` (
  `company_role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `role_description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_roles`
--

INSERT INTO `company_roles` (`company_role_id`, `role_name`, `role_description`, `created_at`, `updated_at`) VALUES
(1, 'Manager', 'Garage manager with full access to all operations', '2025-06-21 16:06:47', '2025-06-21 16:06:47'),
(2, 'Mechanic', 'Certified mechanic responsible for vehicle repairs', '2025-06-21 16:06:47', '2025-06-21 16:06:47'),
(3, 'Receptionist', 'Front desk staff handling customer service', '2025-06-21 16:06:47', '2025-06-21 16:06:47'),
(4, 'Admin', 'System administrator with full access', '2025-06-21 16:06:47', '2025-06-21 16:06:47');

-- --------------------------------------------------------

--
-- Table structure for table `customer_identifier`
--

CREATE TABLE `customer_identifier` (
  `customer_id` int(11) NOT NULL,
  `customer_email` varchar(100) NOT NULL,
  `customer_phone_number` varchar(20) DEFAULT NULL,
  `customer_hash` varchar(255) DEFAULT NULL,
  `customer_password` varchar(255) DEFAULT NULL,
  `customer_added_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_identifier`
--

INSERT INTO `customer_identifier` (`customer_id`, `customer_email`, `customer_phone_number`, `customer_hash`, `customer_password`, `customer_added_date`, `updated_at`) VALUES
(1, 'john.customer@email.com', '555-1001', 'customer_hash_1', '$2b$10$customerpass1', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(2, 'mary.customer@email.com', '555-1002', 'customer_hash_2', '$2b$10$customerpass2', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(3, 'david.customer@email.com', '555-1003', 'customer_hash_3', '$2b$10$customerpass3', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(4, 'lisa.customer@email.com', '555-1004', 'customer_hash_4', '$2b$10$customerpass4', '2025-06-21 16:06:48', '2025-06-21 16:06:48');

-- --------------------------------------------------------

--
-- Table structure for table `customer_info`
--

CREATE TABLE `customer_info` (
  `customer_id` int(11) NOT NULL,
  `customer_username` varchar(50) NOT NULL,
  `customer_first_name` varchar(50) NOT NULL,
  `customer_last_name` varchar(50) NOT NULL,
  `active_customer_status` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_info`
--

INSERT INTO `customer_info` (`customer_id`, `customer_username`, `customer_first_name`, `customer_last_name`, `active_customer_status`, `created_at`, `updated_at`) VALUES
(1, 'john_customer', 'John', 'Customer', 1, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(2, 'mary_customer', 'Mary', 'Customer', 1, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(3, 'david_customer', 'David', 'Customer', 1, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(4, 'lisa_customer', 'Lisa', 'Customer', 1, '2025-06-21 16:06:48', '2025-06-21 16:06:48');

-- --------------------------------------------------------

--
-- Stand-in structure for view `customer_order_details`
-- (See below for the actual view)
--
CREATE TABLE `customer_order_details` (
`order_id` int(11)
,`order_date` timestamp
,`active_order` tinyint(1)
,`customer_first_name` varchar(50)
,`customer_last_name` varchar(50)
,`customer_email` varchar(100)
,`customer_phone_number` varchar(20)
,`vehicle_make` varchar(50)
,`vehicle_model` varchar(50)
,`vehicle_year` int(11)
,`vehicle_tag` varchar(20)
,`employee_first_name` varchar(50)
,`employee_last_name` varchar(50)
,`order_status` enum('pending','in_progress','completed','cancelled')
,`order_total_price` decimal(10,2)
,`additional_request` text
);

-- --------------------------------------------------------

--
-- Table structure for table `customer_vehicle_info`
--

CREATE TABLE `customer_vehicle_info` (
  `vehicle_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `vehicle_year` int(11) NOT NULL,
  `vehicle_make` varchar(50) NOT NULL,
  `vehicle_model` varchar(50) NOT NULL,
  `vehicle_type` varchar(30) DEFAULT NULL,
  `vehicle_mileage` int(11) DEFAULT NULL,
  `vehicle_tag` varchar(20) DEFAULT NULL,
  `vehicle_serial` varchar(50) DEFAULT NULL,
  `vehicle_color` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_vehicle_info`
--

INSERT INTO `customer_vehicle_info` (`vehicle_id`, `customer_id`, `vehicle_year`, `vehicle_make`, `vehicle_model`, `vehicle_type`, `vehicle_mileage`, `vehicle_tag`, `vehicle_serial`, `vehicle_color`, `created_at`, `updated_at`) VALUES
(1, 1, 2020, 'Toyota', 'Camry', 'Sedan', 45000, 'ABC123', 'TOY2020CAM001', 'Silver', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(2, 1, 2018, 'Honda', 'CR-V', 'SUV', 62000, 'XYZ789', 'HON2018CRV001', 'Blue', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(3, 2, 2021, 'Ford', 'F-150', 'Truck', 28000, 'DEF456', 'FOR2021F15001', 'Red', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(4, 3, 2019, 'BMW', 'X5', 'SUV', 38000, 'GHI789', 'BMW2019X5001', 'Black', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(5, 4, 2022, 'Tesla', 'Model 3', 'Electric', 15000, 'JKL012', 'TES2022MOD3001', 'White', '2025-06-21 16:06:48', '2025-06-21 16:06:48');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `employee_id` int(11) NOT NULL,
  `employee_email` varchar(100) NOT NULL,
  `active_employee` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_info`
--

CREATE TABLE `employee_info` (
  `employee_id` int(11) NOT NULL,
  `employee_first_name` varchar(50) NOT NULL,
  `employee_last_name` varchar(50) NOT NULL,
  `employee_phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_pass`
--

CREATE TABLE `employee_pass` (
  `employee_id` int(11) NOT NULL,
  `employee_password_hashed` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_pass`
--

INSERT INTO `employee_pass` (`employee_id`, `employee_password_hashed`, `created_at`, `updated_at`) VALUES
(1, '$2b$10$hashedpassword1', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(2, '$2b$10$hashedpassword2', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(3, '$2b$10$hashedpassword3', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(4, '$2b$10$hashedpassword4', '2025-06-21 16:06:48', '2025-06-21 16:06:48');

-- --------------------------------------------------------

--
-- Table structure for table `employee_role`
--

CREATE TABLE `employee_role` (
  `employee_id` int(11) NOT NULL,
  `company_role_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_role`
--

INSERT INTO `employee_role` (`employee_id`, `company_role_id`, `created_at`, `updated_at`) VALUES
(2, 2, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(3, 2, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(4, 3, '2025-06-21 16:06:48', '2025-06-21 16:06:48');

-- --------------------------------------------------------

--
-- Stand-in structure for view `employee_workload`
-- (See below for the actual view)
--
CREATE TABLE `employee_workload` (
`employee_id` int(11)
,`employee_first_name` varchar(50)
,`employee_last_name` varchar(50)
,`role_name` varchar(50)
,`total_orders` bigint(21)
,`completed_orders` bigint(21)
,`active_orders` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `order_hash` varchar(255) DEFAULT NULL,
  `active_order` tinyint(1) DEFAULT 1,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `employee_id`, `customer_id`, `vehicle_id`, `order_hash`, `active_order`, `order_date`, `updated_at`) VALUES
(1, 2, 1, 1, 'order_hash_001', 1, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(2, 3, 2, 3, 'order_hash_002', 1, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(3, 2, 3, 4, 'order_hash_003', 0, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(4, 4, 4, 5, 'order_hash_004', 1, '2025-06-21 16:06:48', '2025-06-21 16:06:48');

-- --------------------------------------------------------

--
-- Table structure for table `order_info`
--

CREATE TABLE `order_info` (
  `order_id` int(11) NOT NULL,
  `order_total_price` decimal(10,2) DEFAULT 0.00,
  `additional_request` text DEFAULT NULL,
  `additional_requests_completed` tinyint(1) DEFAULT 0,
  `completion_date` timestamp NULL DEFAULT NULL,
  `notes_for_internal_use` text DEFAULT NULL,
  `notes_for_customer` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_info`
--

INSERT INTO `order_info` (`order_id`, `order_total_price`, `additional_request`, `additional_requests_completed`, `completion_date`, `notes_for_internal_use`, `notes_for_customer`, `created_at`, `updated_at`) VALUES
(1, 89.99, 'Please check tire pressure', 0, NULL, NULL, NULL, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(2, 245.50, 'Customer requested premium oil', 1, NULL, NULL, NULL, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(3, 156.75, 'None', 1, NULL, NULL, NULL, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(4, 89.99, 'Please wash the car', 0, NULL, NULL, NULL, '2025-06-21 16:06:48', '2025-06-21 16:06:48');

-- --------------------------------------------------------

--
-- Table structure for table `order_services`
--

CREATE TABLE `order_services` (
  `order_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `service_completed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_services`
--

INSERT INTO `order_services` (`order_id`, `service_id`, `service_completed`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(1, 3, 0, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(2, 1, 1, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(2, 4, 1, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(3, 2, 1, '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(4, 1, 0, '2025-06-21 16:06:48', '2025-06-21 16:06:48');

-- --------------------------------------------------------

--
-- Table structure for table `order_status`
--

CREATE TABLE `order_status` (
  `order_id` int(11) NOT NULL,
  `order_status` enum('pending','in_progress','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_status`
--

INSERT INTO `order_status` (`order_id`, `order_status`, `created_at`, `updated_at`) VALUES
(1, 'in_progress', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(2, 'completed', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(3, 'completed', '2025-06-21 16:06:48', '2025-06-21 16:06:48'),
(4, 'pending', '2025-06-21 16:06:48', '2025-06-21 16:06:48');

-- --------------------------------------------------------

--
-- Structure for view `customer_order_details`
--
DROP TABLE IF EXISTS `customer_order_details`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `customer_order_details`  AS SELECT `o`.`order_id` AS `order_id`, `o`.`order_date` AS `order_date`, `o`.`active_order` AS `active_order`, `ci`.`customer_first_name` AS `customer_first_name`, `ci`.`customer_last_name` AS `customer_last_name`, `cid`.`customer_email` AS `customer_email`, `cid`.`customer_phone_number` AS `customer_phone_number`, `cvi`.`vehicle_make` AS `vehicle_make`, `cvi`.`vehicle_model` AS `vehicle_model`, `cvi`.`vehicle_year` AS `vehicle_year`, `cvi`.`vehicle_tag` AS `vehicle_tag`, `ei`.`employee_first_name` AS `employee_first_name`, `ei`.`employee_last_name` AS `employee_last_name`, `os`.`order_status` AS `order_status`, `oi`.`order_total_price` AS `order_total_price`, `oi`.`additional_request` AS `additional_request` FROM ((((((`orders` `o` join `customer_info` `ci` on(`o`.`customer_id` = `ci`.`customer_id`)) join `customer_identifier` `cid` on(`o`.`customer_id` = `cid`.`customer_id`)) join `customer_vehicle_info` `cvi` on(`o`.`vehicle_id` = `cvi`.`vehicle_id`)) join `employee_info` `ei` on(`o`.`employee_id` = `ei`.`employee_id`)) join `order_status` `os` on(`o`.`order_id` = `os`.`order_id`)) join `order_info` `oi` on(`o`.`order_id` = `oi`.`order_id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `employee_workload`
--
DROP TABLE IF EXISTS `employee_workload`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `employee_workload`  AS SELECT `e`.`employee_id` AS `employee_id`, `ei`.`employee_first_name` AS `employee_first_name`, `ei`.`employee_last_name` AS `employee_last_name`, `cr`.`role_name` AS `role_name`, count(`o`.`order_id`) AS `total_orders`, count(case when `os`.`order_status` = 'completed' then 1 end) AS `completed_orders`, count(case when `os`.`order_status` = 'in_progress' then 1 end) AS `active_orders` FROM (((((`employee` `e` join `employee_info` `ei` on(`e`.`employee_id` = `ei`.`employee_id`)) join `employee_role` `er` on(`e`.`employee_id` = `er`.`employee_id`)) join `company_roles` `cr` on(`er`.`company_role_id` = `cr`.`company_role_id`)) left join `orders` `o` on(`e`.`employee_id` = `o`.`employee_id`)) left join `order_status` `os` on(`o`.`order_id` = `os`.`order_id`)) WHERE `e`.`active_employee` = 1 GROUP BY `e`.`employee_id`, `ei`.`employee_first_name`, `ei`.`employee_last_name`, `cr`.`role_name` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `common_services`
--
ALTER TABLE `common_services`
  ADD PRIMARY KEY (`service_id`);

--
-- Indexes for table `company_roles`
--
ALTER TABLE `company_roles`
  ADD PRIMARY KEY (`company_role_id`);

--
-- Indexes for table `customer_identifier`
--
ALTER TABLE `customer_identifier`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `customer_email` (`customer_email`),
  ADD KEY `idx_customer_email` (`customer_email`);

--
-- Indexes for table `customer_info`
--
ALTER TABLE `customer_info`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `customer_username` (`customer_username`);

--
-- Indexes for table `customer_vehicle_info`
--
ALTER TABLE `customer_vehicle_info`
  ADD PRIMARY KEY (`vehicle_id`),
  ADD UNIQUE KEY `vehicle_tag` (`vehicle_tag`),
  ADD KEY `idx_vehicle_tag` (`vehicle_tag`),
  ADD KEY `idx_customer_vehicle` (`customer_id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`employee_id`),
  ADD UNIQUE KEY `employee_email` (`employee_email`),
  ADD KEY `idx_employee_email` (`employee_email`);

--
-- Indexes for table `employee_info`
--
ALTER TABLE `employee_info`
  ADD PRIMARY KEY (`employee_id`);

--
-- Indexes for table `employee_pass`
--
ALTER TABLE `employee_pass`
  ADD PRIMARY KEY (`employee_id`);

--
-- Indexes for table `employee_role`
--
ALTER TABLE `employee_role`
  ADD PRIMARY KEY (`employee_id`),
  ADD KEY `company_role_id` (`company_role_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `idx_order_date` (`order_date`);

--
-- Indexes for table `order_info`
--
ALTER TABLE `order_info`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `order_services`
--
ALTER TABLE `order_services`
  ADD PRIMARY KEY (`order_id`,`service_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `order_status`
--
ALTER TABLE `order_status`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `idx_order_status` (`order_status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `common_services`
--
ALTER TABLE `common_services`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `company_roles`
--
ALTER TABLE `company_roles`
  MODIFY `company_role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `customer_identifier`
--
ALTER TABLE `customer_identifier`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `customer_vehicle_info`
--
ALTER TABLE `customer_vehicle_info`
  MODIFY `vehicle_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customer_info`
--
ALTER TABLE `customer_info`
  ADD CONSTRAINT `customer_info_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer_identifier` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `customer_vehicle_info`
--
ALTER TABLE `customer_vehicle_info`
  ADD CONSTRAINT `customer_vehicle_info_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer_info` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_info`
--
ALTER TABLE `employee_info`
  ADD CONSTRAINT `employee_info_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_pass`
--
ALTER TABLE `employee_pass`
  ADD CONSTRAINT `employee_pass_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_role`
--
ALTER TABLE `employee_role`
  ADD CONSTRAINT `employee_role_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_role_ibfk_2` FOREIGN KEY (`company_role_id`) REFERENCES `company_roles` (`company_role_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customer_info` (`customer_id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`vehicle_id`) REFERENCES `customer_vehicle_info` (`vehicle_id`);

--
-- Constraints for table `order_info`
--
ALTER TABLE `order_info`
  ADD CONSTRAINT `order_info_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_services`
--
ALTER TABLE `order_services`
  ADD CONSTRAINT `order_services_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `common_services` (`service_id`);

--
-- Constraints for table `order_status`
--
ALTER TABLE `order_status`
  ADD CONSTRAINT `order_status_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
