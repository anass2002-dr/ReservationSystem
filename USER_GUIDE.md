# Paragliding Reservation & Operations Management System
# Comprehensive User & Operations Manual
**Version:** 2.0  
**Target Audience:** System Administrators, Booking Agents, Cashiers, Dispatchers, and Operations Staff  
**System Architecture:** ASP.NET Core Web API (Backend) | Angular 19 (Frontend) | MariaDB / MySQL Database

---

## Table of Contents
1. [Introduction & System Overview](#1-introduction--system-overview)
2. [Getting Started & Authentication](#2-getting-started--authentication)
3. [Global Header Navigation & Tools](#3-global-header-navigation--tools)
   - 3.1 Live Currency Ticker & Rate Overrides
   - 3.2 Quick Currency Converter Tool
   - 3.3 Multilingual Language Switcher
   - 3.4 User Profile & Logout
4. [Operational Dashboard](#4-operational-dashboard)
5. [Reservations Management](#5-reservations-management)
   - 5.1 Schedule View (Kanban / Time Slot Board) & Drag-and-Drop
   - 5.2 List View, Advanced Filters & Excel Export
   - 5.3 Financial Analytics & Channel Breakdown
   - 5.4 Flight Slot Manifest (PDF Generation)
   - 5.5 Flight Voucher Printing
6. [Creating & Editing Reservations (Step-by-Step)](#6-creating--editing-reservations-step-by-step)
   - 6.1 General Booking Information & Booking Channels
   - 6.2 Managing Multiple Passengers (PAX)
   - 6.3 Customer Auto-Complete & Registry
   - 6.4 Pilot Group Filtering & Assignment
   - 6.5 Packages, Extra Services & Pricing Calculation
   - 6.6 Weight Limit Verification
   - 6.7 Pickup Location Search & Interactive Map
   - 6.8 Photo & Document Attachments (Passports, Receipts)
7. [Payments & Cashier Management](#7-payments--cashier-management)
   - 7.1 Daily Payment Collection Board
   - 7.2 Recording Payments & Multi-Currency Split Payments
   - 7.3 Processing Deposits & Tracking Remaining Balances
   - 7.4 Handling Cancellations & Issuing Refunds
   - 7.5 Thermal Receipt Printing (80mm POS Format)
   - 7.6 Financial Audit Log & Filtering
8. [Customer Directory](#8-customer-directory)
9. [Partner Agencies Management](#9-partner-agencies-management)
10. [Pilots & Flight Operations](#10-pilots--flight-operations)
    - 10.1 Pilot Directory & License Management
    - 10.2 Pilot Groups / Teams
    - 10.3 Daily Flight Roster & Attendance Tracking
    - 10.4 Manual Metric Adjustments
11. [Logistics & Transport Groups](#11-logistics--transport-groups)
12. [Flight Packages & Extra Services Setup](#12-flight-packages--extra-services-setup)
13. [Flight Times / Daily Slots Configuration](#13-flight-times--daily-slots-configuration)
14. [Exchange Rates & Currency Calculator](#14-exchange-rates--currency-calculator)
15. [User & Security Administration (Admin Only)](#15-user--security-administration-admin-only)
16. [Frequently Asked Questions (FAQ) & Troubleshooting](#16-frequently-asked-questions-faq--troubleshooting)

---

# 1. Introduction & System Overview

The **Paragliding Reservation & Operations Management System** is an enterprise-grade web application designed specifically for commercial tandem paragliding companies, flight schools, and adventure tour operators.

### Key System Capabilities:
* **Real-Time Flight Scheduling:** Interactive time-slot board with drag-and-drop flight rescheduling.
* **Multi-Currency Engine:** Live exchange rate synchronization and calculations supporting **Turkish Lira (TRY ₺)**, **US Dollar (USD $)**, **Euro (EUR €)**, and **British Pound (GBP £)**.
* **Cashier & POS Billing:** Split payments, deposits, currency conversions at payment time, and 80mm thermal receipt printing.
* **Operational Dispatch & Roster:** Pilot flight quotas, attendance verification (*Confirmed* vs. *No-Show*), and automated flight count tracking.
* **Agency & Direct Channel Management:** Track partner agency bookings, custom billing, and ticket/billet numbers.
* **Logistics & Shuttle Dispatch:** Hotel pickup geolocation with interactive maps and driver shuttle assignment.
* **Document & Voucher Printing:** Single-click printable customer vouchers and slot manifest PDF reports.

---

# 2. Getting Started & Authentication

### 2.1 Accessing the Application
1. Open your web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari).
2. Navigate to your application URL: `http://localhost:8080` (or your company domain name).
3. If you are not logged in, the system automatically redirects you to the **Login Page** (`/login`).

### 2.2 Logging In
1. Enter your assigned **Username** (e.g., `admin` or your staff username).
2. Enter your **Password**.
3. Click **Sign In**.
4. Upon successful authentication, a secure JSON Web Token (JWT) is generated and stored for your session, directing you to the **Operational Dashboard**.

> [!NOTE]
> Sessions remain active securely. If your token expires or you log out, you will be prompted to re-enter your credentials.

---

# 3. Global Header Navigation & Tools

The fixed top navigation bar is available across every screen in the system:

```
+---------------------------------------------------------------------------------------------------------+
| [=] LOGO | [USD/TRY 38.20] [USD/EUR 0.92] [USD/GBP 0.79] [Update Rate] | [Calc: 100 USD -> TRY 3820] | [EN] [User] |
+---------------------------------------------------------------------------------------------------------+
```

### 3.1 Live Currency Ticker & Rate Overrides
* **Currency Badges:** Displays current market rates for **USD/TRY**, **USD/EUR**, and **USD/GBP**.
* **Update Rate Button (Admin Role Only):**
  1. Click **Update Rate** to open the custom exchange rate modal.
  2. Enter your company's operational rates (e.g., `1 USD = 38.50 TRY`).
  3. Click **Save Rates**. All reservation price conversions across the system will immediately recalculate based on these custom rates.

### 3.2 Quick Currency Converter Tool
Located directly in the header for fast cashier calculations without leaving the current screen:
1. Type an **Amount** into the input box (e.g., `150`).
2. Select the **Source Currency** (e.g., `EUR`).
3. Select the **Target Currency** (e.g., `TRY`).
4. The converted value appears instantaneously.

### 3.3 Multilingual Language Switcher
Click the flag / language selector dropdown in the header to switch between interface languages in real time:
* 🇬🇧 **English (En)** — Default international language
* 🇹🇷 **Türkçe (Tr)** — Turkish language localization
* Language preferences are automatically saved in local browser storage across sessions.

### 3.4 User Profile & Sign Out
Click your profile avatar or name in the top right corner to access:
* **My Profile:** View personal details, role badges, and update your avatar photo.
* **Manage Users:** Quick shortcut for Administrators to access user permissions.
* **Sign Out:** Securely ends your current session.

---

# 4. Operational Dashboard

**Route:** `/dashboard`

The Operational Dashboard is your daily flight command center:

### 4.1 Key Performance Indicators (KPI Cards)
* **Total Reservations:** Lifetime total bookings with performance growth indicator.
* **Today's Flights:** Total number of tandem flight slots scheduled for the current calendar day.
* **Total Revenue:** Total gross income generated in base currency (USD).
* **Active Customers:** Total registered unique clients in the database.

### 4.2 Today's Flight Schedule Table
A real-time overview of today's schedule displaying:
* **Time Slot:** Takeoff hour (e.g., 08:30, 10:30, 13:00, 15:00, 17:00).
* **Reservation Title & ID:** Booking reference name and `#ID`.
* **Passengers (PAX):** Number of flyers in the group.
* **Status Badge:**
  * 🟢 **Confirmed** – Booking verified and ready.
  * 🟡 **Pending** – Awaiting confirmation or deposit.
  * 🔴 **Cancelled** – Flight cancelled.
* **Action Button:** Quick edit pencil icon to modify the reservation directly.

### 4.3 Quick Action Shortcuts
* **New Reservation:** Opens the booking creation form.
* **Process Payment:** Opens the cashier payment terminal.
* **Check Exchange Rates:** Opens the currency exchange overview.

---

# 5. Reservations Management

**Route:** `/reservations`

The Reservations module features two complementary views: **Schedule View** and **List View**.

```
+----------------------------------------------------------------------------------------------------+
|  Reservations Dashboard                      [ < Date: 07/09/2026 > ]   [ + New Reservation ]       |
|  [ Schedule View ]  [ List View ]                                                                  |
+----------------------------------------------------------------------------------------------------+
```

### 5.1 Schedule View (Kanban / Time Slot Board)
Designed for dispatchers and ground operations on flight days:
* **Daily Time Columns:** Each column represents an active flight slot (e.g., `08:30`, `10:30`, `13:00`, `15:00`, `17:00`).
* **Drag-and-Drop Rescheduling:**
  * Simply click and drag any reservation card from one time slot column and drop it into another.
  * The system automatically updates the database in real-time.
* **Reservation Card Summary:**
  * **Header:** Title, Reservation ID, PAX count badge, Booking channel badge (Direct / Agency Name).
  * **Badges:** Status (Confirmed / Pending / Cancelled), Payment Indicator (Paid / Balance Due / Refund Alert).
  * **Body:** Customer names and assigned Pilot names.
  * **Financials:** Total Amount, Deposit paid, and remaining balance due.
  * **Quick Actions on Card:**
    * 🟢 **Pay:** Opens cashier modal for instant payment collection.
    * 🖨️ **Print:** Prints the official Flight Voucher.
    * ✏️ **Edit:** Opens the reservation editor.
    * 🗑️ **Delete:** Deletes the reservation after confirmation.

### 5.2 List View, Advanced Filters & Excel Export
Switch to **List View** for high-volume searching, reporting, and auditing:
* **Filter Options:**
  1. **Status:** All Statuses, Pending, Confirmed, Cancelled.
  2. **Flight Time:** Filter by specific slot or view all.
  3. **Date Range:** Filter by *Selected Day*, *One Week*, *One Month*, *One Year*, or *All Time*.
  4. **Search Bar:** Real-time search across Reservation ID, Title, Customer Name, or Phone.
* **Export to Excel:** Click **Export Excel** to download a spreadsheet (`.xlsx`) containing all filtered reservations, passenger counts, financials, and pilot assignments.

### 5.3 Financial Analytics & Channel Breakdown
Located below the list view table:
* **Financial Summary Table:** Aggregated breakdown of **Total Price**, **Total Paid**, and **Remaining Due** segmented by each currency (TRY, USD, EUR, GBP).
* **Booking Channels:** Passenger volume distribution per channel (Direct, WhatsApp, Phone, Agency, Website).
* **Booking Overview:** Total bookings, total passengers (PAX), and status counts.

### 5.4 Flight Slot Manifest (PDF Generation)
At the top of each time slot column in Schedule View:
1. Click the red **Print PDF** button on any slot (e.g., `10:30`).
2. The system generates a clean, printable flight manifest containing:
   * Company header and selected flight date & time slot.
   * Full passenger list with weights, nationalities, and assigned pilots.
   * Transport driver and vehicle information.
   * Special remarks/notes.
3. Ideal for handing to takeoff marshals and mountain drivers.

### 5.5 Flight Voucher Printing
1. Click the **Print** (printer icon) button on any reservation card or list item.
2. A formatted customer voucher opens ready for print or PDF saving:
   * Includes Customer Details, Flight Date & Time, Pickup Location, Package Information, Deposit Paid, Balance Due, and Terms & Conditions.

---

# 6. Creating & Editing Reservations (Step-by-Step)

**Route:** `/reservations/add` (New) or `/reservations/edit/:id` (Edit)

```
================================================================================
                           NEW RESERVATION WIZARD
================================================================================
[ 1 PAX v ] | Book a New Flight
--------------------------------------------------------------------------------
1. GENERAL INFORMATION
   - Title: [ John Doe VIP Flight               ]   - Source: [ WhatsApp     v ]
   - Date:  [ 07/09/2026                        ]   - Slot:   [ 10:30        v ]
   - Status:[ Confirmed                      v ]   - Type:   [ Agency       v ]
   - Agency:[ Sky Tours Agency               v ]   - Billet: [ TIK-99281       ]
   - Currency: [ USD ($) v ]  - Total: [ 180.00 ]  - Deposit:[ 50.00 | Card v ]
--------------------------------------------------------------------------------
2. PASSENGER INFORMATION (PAX 1)
   - Search Customer: [ John Doe              v ]
   - Full Name:    [ John Doe                 ]  - DOB:     [ 15/04/1992     ]
   - Phone:        [ +1 555 234 5678          ]  - Country: [ United States v]
   - Pilot Group:  [ Team Alpha               v ]  - Pilot:   [ Capt. Mehmet   ]
   - Package:      [ Sunset VIP Flight        v ]  - Shuttle: [ Bus 1 (Ali)  v ]
   - Extras:       [ [x] 360 Video  [x] Drone ]  - [x] Weight Limit Verified
--------------------------------------------------------------------------------
3. PICKUP & LOGISTICS
   - Pickup:       [ Hotel Pickup             v ]
   - Location:     [ Hilton Resort Lobby      ]  [ Search Map ]
--------------------------------------------------------------------------------
4. PHOTOS & ATTACHMENTS
   - [ Drag & Drop Passports, Tickets, Receipts ]
--------------------------------------------------------------------------------
                                   [ Cancel ]   [ Complete Booking / Save ]
================================================================================
```

### Step 1: Select Passenger Count (PAX)
* At the top of the form, select the number of flyers in the dropdown (e.g., `1 PAX`, `2 PAX`, `4 PAX`).
* The system automatically generates the exact number of passenger detail cards below.

### Step 2: Fill General Information
1. **Reservation Title:** Enter a descriptive name (e.g., `Smith Family`, `VIP Sunset Flight`).
2. **Booking Source:** Select how the booking was made (`WhatsApp`, `Direct Walk-in`, `Phone Call`, `Website`, `Agency`).
3. **Flight Date & Time Slot:** Select the scheduled date and takeoff hour.
4. **Booking Status:** Set to `Pending`, `Confirmed`, or `Cancelled`.
5. **Booking Type (Direct vs. Agency):**
   * If **Direct Booking**: Selected by default.
   * If **Agency Booking**: Choose the partner agency from the searchable dropdown and enter their external **Billet / Voucher Number**.
6. **Currency & Total Amount:**
   * Choose the preferred currency (`USD`, `EUR`, `GBP`, `TRY`).
   * The total amount will auto-calculate when packages and extra services are chosen for each passenger, or you can enter a custom negotiated total amount.
7. **Deposit & Deposit Method:**
   * Enter any upfront deposit collected (e.g., `50`).
   * Select how the deposit was received (`Cash`, `Card`, `Transfer/IBAN`).
   * The live **Rest to Pay** badge updates automatically.

### Step 3: Enter Passenger Details (For Each PAX)
1. **Customer Search & Auto-Fill:**
   * Start typing the customer's name in the search box.
   * If they exist in your database, selecting them automatically fills their Full Name, Date of Birth, Phone, Email, and Nationality.
   * If it is a new customer, simply fill in the fields, and they will be automatically saved to your Customer Directory.
2. **Assigning Pilots:**
   * *(Optional)* Select a **Pilot Group** to filter available pilots.
   * In the **Assigned Pilot** dropdown, each pilot's name is displayed alongside their live stats: `(Assigned: X, Flown: Y)`.
3. **Select Flight Package & Extras:**
   * Choose the flight package (e.g., *Standard Tandem*, *Acrobatic Flight*).
   * Multi-select optional extra services (e.g., *360 GoPro Video*, *Drone Footage*).
4. **Assign Transport:**
   * Select the designated shuttle vehicle/driver.
5. **Weight Limit Verification:**
   * Toggle the **Passenger Weight Limit Verified** switch to confirm the passenger is within safe flying weight limits (under 105-110 kg).

### Step 4: Configure Pickup Logistics & Interactive Map
1. Choose the **Pickup Service** type (*Hotel Pickup*, *Meeting Point*, *Airport Shuttle*, *Not Required*).
2. If pickup is required:
   * Type the hotel name or landmark in the **Pickup Location** box.
   * As you type, the system provides live address suggestions.
   * Click **Search** to pinpoint the exact location on the interactive Leaflet map.

### Step 5: Special Notes & Instructions
Enter any special remarks (e.g., *"Customer birthday surprise"*, *"Speaks only German"*, *"Motion sickness prone"*).

### Step 6: Upload Photos & Documents
* Drag and drop files or click **Choose Photos**.
* Attach customer passport photos, physical agency ticket photos, payment receipts, or signed liability waivers.
* Uploaded thumbnails can be clicked for full-size inspection or deleted with the `X` button.

### Step 7: Save & Confirm
Click **Complete Booking** (or **Update Reservation**). The system validates all fields, saves the booking, updates pilot counters, and redirects you back to the schedule view.

---

# 7. Payments & Cashier Management

**Route:** `/payments`

The Payments module is divided into two operational tabs: **Collect Payments** (daily operations) and **Payment Records** (accounting ledger).

```
+----------------------------------------------------------------------------------------------------+
|  Payments Management                                     [ Date: 07/09/2026 ]                       |
|  [ Collect Payments ]  [ Payment Records ]                                                         |
+----------------------------------------------------------------------------------------------------+
```

### 7.1 Daily Payment Collection Board
* Organizes today's reservations into flight time slot cards.
* Instantly highlights:
  * 🟢 **Paid:** Full balance received.
  * 🟡 **Make Payment:** Outstanding balance due.
  * 🔴 **Issue Refund:** Flight cancelled with prior payments.
* Click any card to open the **Payment & Cashier Modal**.

### 7.2 Recording Payments & Multi-Currency Split Payments
When collecting payment at the desk or landing site:
1. Click **Make Payment** on the reservation.
2. The modal displays:
   * **Total Amount Due**
   * **Deposit Paid**
   * **Total Paid So Far**
   * **Rest to Pay**
3. **Paying in a Different Currency:**
   * If the reservation is in USD ($150) but the customer pays in **TRY (₺)** or **EUR (€)**:
   * Select the payment currency from the **Pay in Currency** dropdown.
   * The system automatically applies the live exchange rate and shows the exact equivalent deducted from the reservation balance.
   * You can also manually adjust the exchange rate if needed.
4. **Partial / Split Payments:**
   * Customers can pay part of the balance in Cash and part by Card. Enter the first amount (e.g., $50 Cash) and save. Then open the modal again to pay the remainder ($100 Card).
5. Click **Confirm Payment**.

### 7.3 Processing Deposits
* Deposits recorded during reservation creation are automatically logged as verified deposit transactions in the ledger.
* Any remaining balance is clearly displayed on all cashier screens.

### 7.4 Handling Cancellations & Issuing Refunds
If weather conditions prevent takeoff or a flight is cancelled:
1. Set the reservation status to **Cancelled**.
2. Open the Payments module. The reservation will appear with an **Issue Refund** button.
3. Click **Issue Refund** to enter refund mode (modal header turns red).
4. Enter the refund amount (or click **Refund All**).
5. The system prevents over-refunding and logs a negative transaction record (`Refund`) for accurate end-of-day accounting.

### 7.5 Thermal Receipt Printing (80mm POS Format)
1. In the **Payment Records** tab, locate the transaction row.
2. Click the blue **Print** (printer icon) button.
3. A formatted 80mm thermal receipt will open formatted for POS receipt printers:
   * Company Header & Contact info
   * Receipt Number & Timestamp
   * Reservation # and Passenger Names
   * Line-item breakdown of Flight Package & Extras
   * Total Amount, Deposit, Amount Paid, and Remaining Balance
   * Payment Method (Cash / Card / Transfer)
   * Official footer message

### 7.6 Financial Audit Log & Filtering
In the **Payment Records** tab:
* **Currency Summary Cards:** Top counters display total revenue collected in **TRY ₺**, **USD $**, **EUR €**, and **GBP £** for the selected period.
* **Filters:** Filter by Start Date, End Date, Payment Method (Cash, Card, Transfer), and Currency.
* Search by Reservation ID, Customer Name, or Agency Name.

---

# 8. Customer Directory

**Route:** `/Customers`

Maintain a clean database of all passengers:
* **Customer List:** Displays ID, Full Name, Date of Birth, Phone Number, Email, and Country of Origin.
* **Add Customer:** Click **+ Add Customer**, enter personal details, select nationality from the searchable list, and save.
* **Edit / Delete:** Modify contact details or remove duplicate entries.
* *Note:* New customers entered on the reservation form are saved here automatically.

---

# 9. Partner Agencies Management & Financial Analytics

**Route:** `/agencies`

The Agencies module features two operational modes:

### 9.1 Analytics & Balances Tab
* **5 Executive KPI Cards:**
  * **Total Agencies:** Count of registered partner agencies.
  * **Agency Bookings:** Total reservation orders placed through agencies.
  * **Total Clients Sent (Pax):** Total passenger volume sent by partner agencies.
  * **Total Turnover:** Contracted business volume ($).
  * **Total Outstanding (Rest to Pay):** Uncollected debt with live warning badges.
* **Financial Table & Filter Pills:**
  * Filter by **All Balances**, **Has Balance Due** (unsettled debt), and **Fully Settled**.
  * Real-time search by agency name, contact person, or phone number.
  * Instant status badges: `Settled` (green) vs. `Balance Due` (red pulse).
* **View Statement of Account:**
  * Click **View Statement** on any agency row to open an itemized ledger.
  * Displays total agreed price, total paid, and net balance due.
  * Lists all individual tickets/billets, flight dates, time slots, and passenger names.
  * Includes a **Print Statement** button for monthly invoicing and reconciliation.

### 9.2 Directory Tab
* **Agency Profiles Grid:** Displays cards for each agency with Contact Person, Phone, Email, and Physical Office Address.
* **Add / Edit Agency:** Click **+ Add New Agency**, enter corporate details, and save.
* **Seamless Integration:** When creating a reservation in the Reservation Form, selecting an agency automatically assigns wholesale pricing and links bookings directly to the agency's ledger.

---

# 10. Pilots & Flight Operations

**Route:** `/pilots`

The Pilots module combines roster management, flight allocation, and attendance tracking:

### 10.1 Pilot Directory Tab
* Displays all pilots grouped by their designated flight teams.
* Lists: Full Name, License Number, Pilot Group, **Flights Assigned**, **Flights Flown**, and Status (Active / On Leave / Inactive).
* Click **+ Add Pilot** to register a new tandem pilot.

### 10.2 Pilot Groups (Teams)
* Click **Manage Groups** to create squads (e.g., *Morning Flight Team*, *Weekend Squad*, *Senior Instructors*).
* Helps dispatchers quickly filter pilots during busy peak-season booking.

### 10.3 Daily Flight Roster & Attendance Tracking
Click the **Flight Roster** tab:
* Shows all pilot flight assignments for current and upcoming reservations.
* **Attendance Actions for Dispatchers:**
  * 🟢 **Confirmed:** Click when the pilot reports for duty and completes the flight. This automatically increments the pilot's **Flights Flown** total.
  * 🔴 **Did Not Come / No-Show:** Mark if a pilot is absent. Enter an optional reason note.

### 10.4 Manual Metric Adjustments
* Open any pilot in edit mode to inspect the **Flight Metrics Override** panel.
* If physical logbooks differ from system tallies, administrators can manually adjust *Flights Assigned* and *Flights Flown*.

---

# 11. Logistics & Transport Groups

**Route:** `/transport-groups`

Organize mountain transport vehicles and shuttle vans:
* **Transport List:** Departure Time, Vehicle License Plate (e.g., `48 BB 1234`), and Driver Name (e.g., `Mustafa`).
* **Add Transport Group:** Define departure hours, vehicle plates, and assigned drivers.
* Passengers assigned to this transport group will be listed together on the slot manifest for the driver.

---

# 12. Flight Packages & Extra Services Setup

### 12.1 Flight Packages (`/flight-packages`)
* Define your core experiences (e.g., *Standard Tandem Flight - $120*, *Sunset Deluxe Flight - $160*, *Acrobatic Extreme Flight - $180*).
* Set USD pricing and description of inclusions (duration, photos, insurance).

### 12.2 Extra Services (`/extra-services`)
* Define add-on products (e.g., *GoPro 360° Video - $35*, *Drone 4K Follow Video - $50*, *Souvenir T-Shirt - $15*).
* These add-ons appear as checkboxes in the reservation wizard and automatically tally into the total bill.

---

# 13. Flight Times / Daily Slots Configuration

**Route:** `/flight-times`

Control takeoff time windows based on season and sunlight hours:
* **Time Slots List:** View existing daily slots (e.g., `08:30`, `10:30`, `13:00`, `15:00`, `17:00`).
* **Add / Edit Slot:** Enter the hour in `HH:mm` format and toggle the **Active Status** switch.
* Inactive slots are immediately hidden from new booking forms and schedule boards without affecting historical records.

---

# 14. Exchange Rates & Currency Calculator

**Route:** `/exchange-rates`

* **Live Market Rates:** View conversion rates for USD to TRY, EUR, and GBP.
* **Refresh Rates:** Click the refresh button to pull the latest rates from the global currency exchange API.
* **Interactive Converter:** Built-in two-way currency conversion calculator with instant swap.
* **Conversion Matrix:** Reference table showing cross-rates relative to 1 USD and 1 TRY.

---

# 15. User & Security Administration (Admin Only)

**Route:** `/admin/users`

> [!IMPORTANT]
> This section is strictly accessible to users with the **Admin** role.

* **User Accounts List:** View all staff accounts, usernames, emails, and assigned roles.
* **Add New User:** Click **Add New User** to register staff accounts with specific roles:
  * `Admin` – Full system privileges, user management, rate overrides, deletions.
  * `User` – Daily operations, bookings, payments, customer directory.
* **Password Reset:** Click the key icon on any user row to assign a new secure password.
* **Edit / Delete User:** Update account email, username, or revoke access.

---

# 16. Frequently Asked Questions (FAQ) & Troubleshooting

### Q1: How do I reschedule a customer to another time slot on the same day?
> **Answer:** Navigate to **Reservations -> Schedule View**. Simply drag the customer's reservation card and drop it into the new time slot column. The change is saved automatically.

### Q2: A customer wants to pay in Euros (€), but the price is in USD ($). What should I do?
> **Answer:** In the reservation payment modal, change the **Pay in Currency** dropdown to **EUR**. The system will calculate the exact Euro equivalent based on current exchange rates and record the payment properly.

### Q3: How do I print an 80mm thermal receipt for the customer?
> **Answer:** Go to **Payments -> Payment Records**, locate the transaction, and click the blue **Print** icon. Choose your 80mm POS receipt printer in the print dialog.

### Q4: What happens if a flight is cancelled due to bad weather?
> **Answer:** 
> 1. Edit the reservation and change its status to **Cancelled**.
> 2. Open **Payments -> Collect Payments**, locate the cancelled reservation, and click **Issue Refund**.
> 3. Enter the refund amount and confirm.

### Q5: How do I print the passenger list for the pilot shuttle van?
> **Answer:** Go to **Reservations -> Schedule View**, find the scheduled takeoff time slot, and click the red **Print PDF** button. This produces the complete slot manifest.

---

*Manual generated for Paragliding Reservation Management System.*  
*For technical support, contact the IT Systems Administrator.*
