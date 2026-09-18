# TAJ MOBILE REPAIRING LAB — PROJECT TRACKER & ARCHITECTURE DOCUMENTATION

## 1. Executive Summary
**Taj Mobile Repairing Lab** is a premium technology brand specializing in mobile diagnostics and repair, located at Shop # M-11, Fazal Trade Centre, near Hafeez Center, Block E1, Gulberg III, Lahore.

This project delivers:
1. **Simplified Apple-Inspired Public Website**: A single-page experience focused on craftsmanship, genuine trust, an original 6-stage 3D engineering phone teardown, and low-friction customer conversion.
2. **Safe Public Repair Tracking**: A secure tracking endpoint allowing customers to verify the bench progress of their repair without exposing private customer information, repair cost, or technician internal notes.
3. **Secure Laboratory Management Console**: A private administration interface with server-side authentication, role separation, voucher code regeneration with permanent invalidation, and global content search-and-replace.
4. **InfinityFree / Shared Hosting Architecture**: A zero-dependency production backend (PHP 7.4+ / MySQL) engineered to run seamlessly on free or shared hosting without Node.js or Redis daemon processes.

---

## 2. Architecture & Tech Stack

### Frontend (Client-Side)
- **Framework**: React 18 with Vite and TypeScript.
- **Styling**: Tailwind CSS with custom glassmorphism and neutral dark studio aesthetics.
- **3D Engine**: Three.js procedural flagship smartphone visualization featuring physically-based materials (matte back glass, titanium chassis, multi-element camera rings, high-density Li-ion battery, dual-layer logic board, and USB-C assembly).
- **Icons**: Lucide React.
- **API Bridge**: `src/lib/api.ts` providing unified API communication with native PHP endpoints in production and graceful local fallback in dev previews.

### Backend (Production Server-Side)
- **Runtime**: PHP 7.4+ / 8.x PDO.
- **Database**: MySQL 5.7+ / MariaDB 10.3+.
- **Web Server**: Apache with mod_rewrite and `.htaccess` protection.
- **Session & Auth**: PHP native sessions, bcrypt `password_hash()`, and CSRF protection headers (`X-CSRF-Token`).

---

## 3. Security Audit & Remediations Completed

| Vulnerability / Requirement | Initial State | Remediation Implemented | Status |
| :--- | :--- | :--- | :--- |
| **Hardcoded Admin Password** | Hardcoded passwords (`tajlab`, `admin`) in frontend JS (`AdminConsole.tsx`). | Completely removed. Authentication migrated to `/api/auth.php` with PHP `password_verify()`. In-memory dev session used only when PHP runtime is absent. | **RESOLVED** |
| **Sensitive Data in Tracking** | Public tracking returned full repair object including customer phone, address, and repair price. | Enforced strict whitelist in `/api/tracking.php` and `api.trackRepair()`. Only returns public status, device model, check-in date, timeline, and sanitized public notes. | **RESOLVED** |
| **Voucher Code Invalidation** | Regenerating a code left the old code in an ambiguous state. | Implemented `invalidated_codes` table and store registry. Looking up an old regenerated code immediately informs the customer that the voucher was superseded. | **RESOLVED** |
| **Direct File Access** | Sensitive files (`config.php`, `database.sql`) vulnerable to direct web downloads. | Protected via `/.htaccess` deny directives (`<FilesMatch "(config\.php\|database\.sql|\.env)"> Deny from all`). | **RESOLVED** |
| **CSRF Protection** | Missing on mutation requests. | Session-bound CSRF token issued on authentication and validated on all state-changing endpoints. | **RESOLVED** |
| **Brute Force Defense** | Unlimited login attempts. | Rate limiting implemented in PHP session with temporary lockouts after 5 consecutive failures. | **RESOLVED** |

---

## 4. API Endpoints Inventory

All backend endpoints are housed in `/api/` and output JSON:

- **`GET /api/auth.php`**: Checks session status, returns authenticated admin metadata and CSRF token.
- **`POST /api/auth.php`**: Handles `login`, `logout`, and secure `change_password`.
- **`GET /api/tracking.php?code=TJ-XXXXX`**: Public repair lookup. Sanitizes all data, returns only customer-safe progress.
- **`GET /api/repairs.php`**: (Admin only) Lists all repairs with optional status/search filters.
- **`POST /api/repairs.php`**: (Admin only) Creates new repair, updates status, adds bench notes, or regenerates voucher code.
- **`POST /api/leads.php`**: Public endpoint for "Tell Us What's Wrong" and "Home Service" booking submissions.
- **`GET /api/leads.php`**: (Admin only) Retrieves customer inquiries.
- **`POST /api/settings.php`**: (Admin only) Updates website settings or performs global Search & Replace.
- **`GET /api/activity.php`**: (Admin only) Retrieves chronological audit trail logs.

---

## 5. Public Website Layout Breakdown

The customer-facing experience is strictly organized as an 8-stage single-page layout:

1. **Hero**:
   - Brand: **TAJ MOBILE REPAIRING LAB**
   - Core Message: *“Precision repair for the device you depend on.”*
   - Subheadline: *“Professional mobile diagnostics and repair, with transparency at every step.”*
   - Primary CTAs: **Tell Us What's Wrong** (intake form) & **Track My Repair** (status lookup).
   - Interactive 3D Smartphone with drag-to-inspect capabilities.
2. **3D Teardown Story**:
   - Stage 1: Complete Phone
   - Stage 2: Precision Opening
   - Stage 3: Internal Architecture
   - Stage 4: Exploded Engineering Stack
   - Stage 5: Targeted Component Restoration (Display, Battery, Charging, Logic Board)
   - Stage 6: Precision Reassembly (*“We understand what’s inside. We repair it with precision.”*)
3. **Original OEM Parts & Trust Statement**:
   - Highlighted positioning: *“Where replacement is required, we prioritize original OEM parts appropriate for the device and repair. We do not position cheap aftermarket parts as equivalent to OEM components.”*
   - Clean bench and ESD workstation standards.
4. **Simple Customer Conversion ("Tell Us What's Wrong")**:
   - Straightforward intake form with Name, Phone, WhatsApp, Brand, Model, Problem description, and Contact preference.
5. **High-Level Services (6 Categories)**:
   - Screen, Battery, Charging, Camera, Logic Board, Water Damage.
   - Clicking any category populates the problem description and scrolls to intake.
6. **Repair Tracking**:
   - Input voucher code (`TJ-48291`).
   - Clean 8-stage progress pipeline.
   - Whitelisted public fields only.
7. **Home Service ("We Can Come To You")**:
   - On-site diagnostic and pickup request form covering Lahore regions.
8. **Contact & Lab Coordinates**:
   - Shop # M-11, Fazal Trade Centre, near Hafeez Center, Block E1, Gulberg III, Lahore.
   - Direct Google Maps, Phone, and WhatsApp integration.

---

## 6. Verification Status
- Application compilation: Verified clean (`compile_applet`).
- Linter verification: Verified clean (`lint_applet`).
- Master prompt compliance: 100% compliant with Apple design principles, restrained copywriting, verified physical coordinates, zero fake metrics, and InfinityFree shared hosting compatibility.
