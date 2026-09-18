-- ==========================================================
-- TAJ MOBILE REPAIRING LAB - Complete MySQL Database Schema
-- Compatible with InfinityFree / cPanel / MariaDB / MySQL 5.7+
-- ==========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table: admins
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `role` varchar(30) DEFAULT 'admin',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Note: The first-run setup script or admin setup in config will provision or let the owner set the initial master password securely.

-- --------------------------------------------------------
-- Table: customers
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `customers` (
  `id` varchar(64) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `whatsapp` varchar(30) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_whatsapp` (`whatsapp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: repair_statuses
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `repair_statuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status_name` varchar(50) NOT NULL,
  `color_hex` varchar(20) DEFAULT '#3b82f6',
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `status_name` (`status_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `repair_statuses` (`status_name`, `color_hex`, `sort_order`) VALUES
('Received', '#64748b', 1),
('Diagnostic', '#38bdf8', 2),
('Awaiting Approval', '#f59e0b', 3),
('Approved', '#3b82f6', 4),
('Repairing', '#a855f7', 5),
('Quality Check', '#06b6d4', 6),
('Ready for Pickup', '#10b981', 7),
('Delivered', '#22c55e', 8),
('Cancelled', '#ef4444', 9)
ON DUPLICATE KEY UPDATE `sort_order` = VALUES(`sort_order`);

-- --------------------------------------------------------
-- Table: repairs
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `repairs` (
  `id` varchar(64) NOT NULL,
  `customer_code` varchar(30) NOT NULL,
  `customer_id` varchar(64) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(30) NOT NULL,
  `customer_whatsapp` varchar(30) NOT NULL,
  `device_brand` varchar(50) NOT NULL,
  `device_model` varchar(100) NOT NULL,
  `imei_serial` varchar(50) DEFAULT NULL,
  `service_type` varchar(100) NOT NULL,
  `issue_description` text NOT NULL,
  `status` varchar(50) DEFAULT 'Received',
  `estimated_cost` decimal(10,2) DEFAULT 0.00,
  `final_cost` decimal(10,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'PKR',
  `assigned_technician` varchar(100) DEFAULT 'Master Tech Usman',
  `check_in_date` varchar(30) NOT NULL,
  `estimated_completion` varchar(50) DEFAULT NULL,
  `completed_date` varchar(30) DEFAULT NULL,
  `technician_notes` text DEFAULT NULL,
  `public_notes` text DEFAULT NULL,
  `is_home_service` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_code` (`customer_code`),
  KEY `idx_customer_id` (`customer_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: repair_code_history (For tracking invalidated codes)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `repair_code_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repair_id` varchar(64) NOT NULL,
  `old_code` varchar(30) NOT NULL,
  `invalidated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_old_code` (`old_code`),
  KEY `idx_repair_id` (`repair_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: repair_history
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `repair_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repair_id` varchar(64) NOT NULL,
  `status` varchar(50) NOT NULL,
  `timestamp` varchar(30) NOT NULL,
  `note` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_repair_id` (`repair_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: repair_notes (Internal vs Public)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `repair_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repair_id` varchar(64) NOT NULL,
  `author` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `is_internal` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_repair_id` (`repair_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: leads (Website repair inquiries & doorstep requests)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `leads` (
  `id` varchar(64) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `whatsapp` varchar(30) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `device_brand` varchar(50) DEFAULT NULL,
  `device_model` varchar(100) NOT NULL,
  `problem` text NOT NULL,
  `preferred_contact` varchar(30) DEFAULT 'WhatsApp',
  `is_home_service` tinyint(1) DEFAULT 0,
  `area` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `preferred_date` varchar(30) DEFAULT NULL,
  `preferred_time` varchar(30) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('New','Contacted','Scheduled','In Progress','Converted','Closed') DEFAULT 'New',
  `assigned_staff` varchar(100) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: website_settings
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `website_settings` (
  `setting_key` varchar(64) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `website_settings` (`setting_key`, `setting_value`) VALUES
('brand_name', 'TAJ MOBILE REPAIRING LAB'),
('tagline', 'Precision Mobile Diagnostics & Board-Level Repair'),
('phone', '03214810938'),
('whatsapp', '+923214810938'),
('email', 'contact@tajmobilelab.com'),
('address', 'Shop # M-11, Fazal Trade Centre, near Hafeez Center, Block E1, Gulberg III'),
('area', 'Gulberg III'),
('city', 'Lahore'),
('country', 'Pakistan'),
('postal_code', '54000'),
('google_maps_url', 'https://maps.app.goo.gl/qezz1h1sno7cHVAj6'),
('facebook_url', 'https://www.facebook.com/tajmobileofficial?mibextid=LQQJ4d'),
('instagram_url', 'https://instagram.com/tajmobilelab'),
('opening_hours', 'Mon – Sat: 11:00 AM – 9:30 PM | Sunday Closed'),
('hero_headline', 'Precision repair for the device you depend on.'),
('hero_subheadline', 'Professional mobile diagnostics and repair, with transparency at every step.'),
('hero_cta_repair', 'Tell Us What\'s Wrong'),
('hero_cta_track', 'Track My Repair'),
('oem_statement', 'Where replacement is required, we prioritize original OEM parts appropriate for the device and repair. We do not position cheap aftermarket parts as equivalent to OEM components.'),
('trust_statement', 'Every device is treated as mission-critical equipment. We use calibrated ESD-safe workstations, stereomicroscopes, and thermal diagnostic imaging.'),
('meta_title', 'Taj Mobile Repairing Lab — Precision Mobile Diagnostics & Repair Lahore'),
('meta_description', 'Professional mobile phone diagnostics and lab-grade repair in Gulberg III, Lahore near Hafeez Center. Screen, battery, charging, and logic board microsoldering with live tracking.'),
('theme_settings', '{\"preset\":\"taj-default\",\"primaryColor\":\"#38bdf8\",\"secondaryColor\":\"#0284c7\",\"accentColor\":\"#38bdf8\",\"backgroundColor\":\"#06070a\",\"surfaceColor\":\"#0d0f17\",\"elevatedSurfaceColor\":\"#141724\",\"primaryTextColor\":\"#f8fafc\",\"secondaryTextColor\":\"#94a3b8\",\"mutedTextColor\":\"#64748b\",\"borderColor\":\"rgba(255, 255, 255, 0.08)\",\"borderRadius\":\"rounded\",\"cornerRadius\":16,\"buttonStyle\":\"filled\",\"cardStyle\":\"subtle\",\"spacingScale\":\"balanced\",\"appearance\":\"dark\",\"animationIntensity\":\"standard\"}'),
('logo_settings', '{\"useCustomLogo\":false,\"maxWidthDesktop\":190,\"maxHeightDesktop\":48,\"maxWidthMobile\":140,\"maxHeightMobile\":36,\"desktopScale\":1,\"mobileScale\":1,\"verticalOffset\":0,\"padding\":0}'),
('visibility_settings', '{\"hero\":true,\"services\":true,\"laboratory\":true,\"oemTrust\":true,\"inquiry\":true,\"trackingCta\":true,\"homeService\":true,\"faqContact\":true,\"whatsappCta\":true,\"reviews\":true,\"footer\":true}'),
('section_order', '[{\"key\":\"hero\",\"label\":\"Hero Section\",\"enabled\":true},{\"key\":\"services\",\"label\":\"Services & Diagnostics\",\"enabled\":true},{\"key\":\"laboratory\",\"label\":\"Inside The Laboratory\",\"enabled\":true},{\"key\":\"trackingCta\",\"label\":\"Track Repair CTA\",\"enabled\":true},{\"key\":\"oemTrust\",\"label\":\"OEM & Trust Positioning\",\"enabled\":true},{\"key\":\"inquiry\",\"label\":\"Repair Booking & Inquiry\",\"enabled\":true},{\"key\":\"homeService\",\"label\":\"Home & Office Service\",\"enabled\":true},{\"key\":\"faqContact\",\"label\":\"FAQ & Lab Location\",\"enabled\":true}]'),
('laboratory_settings', '{\"enabled\":true,\"title\":\"Inside the Laboratory\",\"subtitle\":\"A continuous engineering teardown of flagship hardware architecture\",\"quality3D\":\"auto\",\"animationIntensity\":\"balanced\",\"autoRotate\":true,\"scrollInteraction\":true,\"lowPowerMode\":false,\"reducedMotionBehavior\":\"minimal\"}')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- --------------------------------------------------------
-- Table: activity_logs
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(100) NOT NULL,
  `details` text NOT NULL,
  `user` varchar(50) DEFAULT 'Admin',
  `ip_address` varchar(45) DEFAULT NULL,
  `reference_id` varchar(64) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: login_attempts (Brute-force protection)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `attempted_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ip` (`ip_address`, `attempted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
