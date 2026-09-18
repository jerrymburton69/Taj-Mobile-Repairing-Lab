/**
 * InfinityFree / cPanel Deployment Exporter
 * Generates ready-to-import MySQL database schema, configuration, and security rules.
 */

export function generateMySQLSchema(): string {
  return `-- ==========================================================
-- TAJ MOBILE REPAIRING LAB - Master MySQL Production Schema
-- Compatible with InfinityFree / cPanel MySQL 5.7+ / MariaDB
-- ==========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Table: admins
CREATE TABLE IF NOT EXISTS \`admins\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`username\` varchar(50) NOT NULL,
  \`password_hash\` varchar(255) NOT NULL,
  \`full_name\` varchar(100) NOT NULL,
  \`role\` varchar(30) DEFAULT 'admin',
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`username\` (\`username\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: customers
CREATE TABLE IF NOT EXISTS \`customers\` (
  \`id\` varchar(64) NOT NULL,
  \`name\` varchar(100) NOT NULL,
  \`phone\` varchar(30) NOT NULL,
  \`whatsapp\` varchar(30) NOT NULL,
  \`email\` varchar(120) DEFAULT NULL,
  \`address\` text DEFAULT NULL,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_phone\` (\`phone\`),
  KEY \`idx_whatsapp\` (\`whatsapp\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: repairs
CREATE TABLE IF NOT EXISTS \`repairs\` (
  \`id\` varchar(64) NOT NULL,
  \`customer_code\` varchar(20) NOT NULL,
  \`customer_id\` varchar(64) NOT NULL,
  \`customer_name\` varchar(100) NOT NULL,
  \`customer_phone\` varchar(30) NOT NULL,
  \`customer_whatsapp\` varchar(30) NOT NULL,
  \`device_brand\` varchar(50) NOT NULL,
  \`device_model\` varchar(100) NOT NULL,
  \`imei_serial\` varchar(50) DEFAULT NULL,
  \`service_type\` varchar(100) NOT NULL,
  \`issue_description\` text NOT NULL,
  \`status\` enum('Received','Diagnostic','Awaiting Approval','Approved','Repairing','Quality Check','Ready for Pickup','Delivered','Cancelled') DEFAULT 'Received',
  \`estimated_cost\` decimal(10,2) DEFAULT 0.00,
  \`final_cost\` decimal(10,2) DEFAULT NULL,
  \`currency\` varchar(10) DEFAULT 'PKR',
  \`assigned_technician\` varchar(100) DEFAULT 'Master Tech Taj',
  \`check_in_date\` varchar(30) NOT NULL,
  \`estimated_completion\` varchar(50) DEFAULT NULL,
  \`completed_date\` varchar(30) DEFAULT NULL,
  \`technician_notes\` text DEFAULT NULL,
  \`public_notes\` text DEFAULT NULL,
  \`is_home_service\` tinyint(1) DEFAULT 0,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`customer_code\` (\`customer_code\`),
  KEY \`idx_customer_id\` (\`customer_id\`),
  KEY \`idx_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: repair_history
CREATE TABLE IF NOT EXISTS \`repair_history\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`repair_id\` varchar(64) NOT NULL,
  \`status\` varchar(50) NOT NULL,
  \`timestamp\` varchar(30) NOT NULL,
  \`note\` text DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_repair_id\` (\`repair_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: leads
CREATE TABLE IF NOT EXISTS \`leads\` (
  \`id\` varchar(64) NOT NULL,
  \`name\` varchar(100) NOT NULL,
  \`phone\` varchar(30) NOT NULL,
  \`whatsapp\` varchar(30) NOT NULL,
  \`email\` varchar(120) DEFAULT NULL,
  \`device_brand\` varchar(50) DEFAULT NULL,
  \`device\` varchar(100) NOT NULL,
  \`problem\` text NOT NULL,
  \`preferred_contact\` varchar(20) DEFAULT 'WhatsApp',
  \`preferred_date\` varchar(30) DEFAULT NULL,
  \`preferred_time\` varchar(30) DEFAULT NULL,
  \`area\` varchar(100) DEFAULT NULL,
  \`address\` text DEFAULT NULL,
  \`is_home_service\` tinyint(1) DEFAULT 0,
  \`status\` enum('New','Contacted','Scheduled','In Progress','Converted','Closed') DEFAULT 'New',
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_lead_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: invalidated_codes
CREATE TABLE IF NOT EXISTS \`invalidated_codes\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`old_code\` varchar(30) NOT NULL,
  \`repair_id\` varchar(64) NOT NULL,
  \`invalidated_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`old_code\` (\`old_code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: website_settings
CREATE TABLE IF NOT EXISTS \`website_settings\` (
  \`setting_key\` varchar(100) NOT NULL,
  \`setting_value\` text NOT NULL,
  \`setting_group\` varchar(50) DEFAULT 'general',
  PRIMARY KEY (\`setting_key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: activity_logs
CREATE TABLE IF NOT EXISTS \`activity_logs\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`action\` varchar(100) NOT NULL,
  \`details\` text NOT NULL,
  \`user\` varchar(50) NOT NULL,
  \`related_id\` varchar(64) DEFAULT NULL,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_created_at\` (\`created_at\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Core Initial Settings
INSERT INTO \`website_settings\` (\`setting_key\`, \`setting_value\`, \`setting_group\`) VALUES
('brand_name', 'TAJ MOBILE REPAIRING LAB', 'branding'),
('tagline', 'Precision Mobile Diagnostics & Board-Level Repair', 'branding'),
('phone', '03214810938', 'contact'),
('whatsapp', '+923214810938', 'contact'),
('address', 'Shop # M-11, Fazal Trade Centre, near Hafeez Center, Block E1, Gulberg III, Lahore', 'contact'),
('hero_headline', 'Precision repair for the device you depend on.', 'hero'),
('hero_subheadline', 'Professional mobile diagnostics and repair, with transparency at every step.', 'hero'),
('oem_statement', 'Where replacement is required, we prioritize original OEM parts appropriate for the device and repair. We do not position cheap aftermarket parts as equivalent to OEM components.', 'trust'),
('trust_statement', 'Every device is treated as mission-critical equipment. We use calibrated ESD-safe workstations, stereomicroscopes, and thermal diagnostic imaging.', 'trust');

COMMIT;
`;
}

export function generateInfinityFreeGuide(): string {
  return `# InfinityFree / cPanel Deployment Guide for Taj Mobile Repairing Lab

## Step 1: Create MySQL Database
1. Log into your InfinityFree Control Panel (VistaPanel) or cPanel.
2. Navigate to "MySQL Databases".
3. Create a database (e.g. \`tajlab\`).
4. Note your credentials:
   - MySQL Host (e.g. sql205.infinityfree.com)
   - Database Name (e.g. if0_12345678_tajlab)
   - Database Username (e.g. if0_12345678)
   - MySQL Password (your InfinityFree account vPanel password)

## Step 2: Import Database Schema
1. Open "phpMyAdmin" from the control panel.
2. Select your newly created database.
3. Click the "Import" tab at the top.
4. Upload \`database.sql\`.
5. Click "Go" to create all tables and default lab settings.

## Step 3: Configure Database Connection
1. Edit \`/config/config.php\` on your server:
   - Update \`DB_HOST\`, \`DB_NAME\`, \`DB_USER\`, and \`DB_PASS\` with your MySQL credentials.
   - Save the file.

## Step 4: First Admin User Setup
1. On initial visit to \`/api/auth.php\`, or via phpMyAdmin, create your administrator account.
2. The password will be securely hashed with \`password_hash(..., PASSWORD_BCRYPT)\`.

## Step 5: Upload Files via FTP
1. Build the production files: \`npm run build\`.
2. Connect using FileZilla to your hosting account:
   - Host: ftpupload.net
   - Username & Password from your client area
3. Upload all files into the \`htdocs\` or \`public_html\` directory.
4. Ensure \`.htaccess\` is uploaded to handle routing and file protection.

## Step 6: Verify Deployment
- Homepage: \`https://yourdomain.com\`
- Public Tracking: \`https://yourdomain.com/api/tracking.php?code=TJ-48291\`
- Admin Console: \`https://yourdomain.com/admin/\`
`;
}

export function downloadInfinityFreePackage(): void {
  const sql = generateMySQLSchema();
  const guide = generateInfinityFreeGuide();

  const combinedPackage = `/* ==========================================================
 * TAJ MOBILE REPAIRING LAB - INFINITYFREE / CPANEL PACKAGE
 * Location: Shop # M-11, Fazal Trade Centre, Gulberg III, Lahore
 * Phone / WhatsApp: +923214810938
 * ==========================================================
 */

${guide}

/* ==========================================================
 * FILE: database.sql
 * Import below SQL in phpMyAdmin
 * ========================================================== */
${sql}
`;

  const blob = new Blob([combinedPackage], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'taj-mobile-infinityfree-backend.sql';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
