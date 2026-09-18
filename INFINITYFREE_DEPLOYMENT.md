# INFINITYFREE & CPANEL DEPLOYMENT MANUAL
## TAJ MOBILE REPAIRING LAB

This manual provides step-by-step deployment instructions for hosting the **Taj Mobile Repairing Lab** website, public repair tracking system, and management console on free or budget PHP/MySQL shared hosting (such as **InfinityFree**, **000webhost**, or standard **cPanel** hosting).

---

## Prerequisites
1. An active account on [InfinityFree](https://www.infinityfree.com/) (or any cPanel host).
2. An FTP client installed on your computer (e.g. [FileZilla](https://filezilla-project.org/)).
3. A built copy of this project (run `npm run build` to generate the `dist/` directory).

---

## Step 1: Create Your MySQL Database in VistaPanel / cPanel
1. Log into your hosting account client area and open the **Control Panel** (VistaPanel).
2. Scroll down to the **Databases** section and click **MySQL Databases**.
3. In the **Create Database** field, enter `tajlab` and click **Create Database**.
4. Take note of the connection details displayed on this screen:
   - **MySQL Database Name**: e.g., `if0_38192847_tajlab`
   - **MySQL Hostname**: e.g., `sql208.infinityfree.com`
   - **MySQL Username**: e.g., `if0_38192847`
   - **MySQL Password**: Your hosting account vPanel password (visible under Client Area > Account Details).

---

## Step 2: Import the Database Schema
1. In the Control Panel, click **phpMyAdmin**.
2. Locate and click on your newly created database in the left sidebar (e.g., `if0_38192847_tajlab`).
3. Click the **Import** tab in the top navigation bar.
4. Click **Choose File** and select the `database.sql` file located in the root of your project directory.
5. Click the **Go** button at the bottom of the page.
6. Verify that the following tables have been successfully created:
   - `admins`
   - `customers`
   - `repairs`
   - `repair_history`
   - `leads`
   - `invalidated_codes`
   - `website_settings`
   - `activity_logs`

---

## Step 3: Configure Database Credentials in `config/config.php`
1. Open the `/config/config.php` file on your computer in any text editor (Notepad, VS Code).
2. Update the credentials with the exact values noted in Step 1:
   ```php
   define('DB_HOST', 'sql208.infinityfree.com'); // Your MySQL Hostname
   define('DB_NAME', 'if0_38192847_tajlab');     // Your Full Database Name
   define('DB_USER', 'if0_38192847');            // Your MySQL Username
   define('DB_PASS', 'YourActualPasswordHere');  // Your Hosting Password
   ```
3. Save the file.
   *(Note: The included `.htaccess` file prevents anyone on the web from downloading or viewing this file directly).*

---

## Step 4: Build the Frontend Assets
1. In your local development terminal, run:
   ```bash
   npm run build
   ```
2. This creates a `dist/` folder containing the compiled HTML, JavaScript, CSS, and 3D assets.

---

## Step 5: Upload Files to the Web Server via FTP
1. Open **FileZilla** and enter your FTP details (found in your InfinityFree Client Area):
   - **Host**: `ftpupload.net`
   - **Username**: `if0_38192847`
   - **Password**: Your hosting password
   - **Port**: `21`
2. Click **Quickconnect**.
3. In the remote panel (right side), double-click to enter the **`htdocs/`** directory.
   *(On some cPanel hosts, this folder is named `public_html/`).*
4. Upload all files from your compiled project into `htdocs/`:
   - All files and folders from inside `dist/` (`index.html`, `assets/`, etc.)
   - The `/api/` folder (contains `auth.php`, `tracking.php`, `repairs.php`, `leads.php`, `settings.php`, `activity.php`)
   - The `/config/` folder (contains `config.php`)
   - The `/.htaccess` file (ensure hidden files are shown in FileZilla: *Server > Force showing hidden files*)

---

## Step 6: First-Time Administrator Login & Password Setup
1. Open your browser and navigate to your website:
   `https://yourdomain.com` (or your free `.infinityfreeapp.com` subdomain).
2. Click the small lock icon in the footer or navbar, or add `?admin=true` to the URL.
3. If no admin account exists yet in the database, the system will prompt you to set your primary Administrator username and password on first sign-in.
4. If you imported the sample data, default master credentials can be used or updated in phpMyAdmin using BCrypt hashing:
   - To hash a new password manually in PHP: `echo password_hash('YourSecretPassword', PASSWORD_BCRYPT);`

---

## Step 7: Post-Deployment Verification Checklist
Run through this checklist to ensure all systems are operating:
- [ ] **Homepage Loads**: 3D smartphone renders smoothly and responds to dragging/touch.
- [ ] **Scroll Story**: Scrolling through the 6 stages properly animates the phone teardown.
- [ ] **Inquiry Form ("Tell Us What's Wrong")**: Fill out a test repair intake. Check that a success confirmation is shown and the inquiry appears in the Admin Console.
- [ ] **Doorstep Service ("We Can Come To You")**: Submit a test home repair booking.
- [ ] **Public Repair Tracking**:
  - Test tracking with the initial code: `TJ-48291`.
  - Confirm the progress timeline displays without leaking phone numbers, prices, or internal notes.
- [ ] **Code Invalidation Check**:
  - Log into the Admin Console, open repair `TJ-48291`, and click **Regenerate Code**.
  - Search for the old code `TJ-48291` in the public tracking form and verify that the system notifies the user that this voucher was superseded.
- [ ] **Admin Console**: Verify that you can view inquiries, convert them to active repairs, and edit website settings.

---

## Technical Support & Shop Coordinates
- **Laboratory Location**: Shop # M-11, Fazal Trade Centre, near Hafeez Center, Block E1, Gulberg III, Lahore, 54000, Pakistan
- **Phone**: 03214810938
- **WhatsApp**: +923214810938
- **Google Maps**: [https://maps.app.goo.gl/qezz1h1sno7cHVAj6](https://maps.app.goo.gl/qezz1h1sno7cHVAj6)
