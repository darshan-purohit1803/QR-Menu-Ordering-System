# Shree Restaurant — QR-Based Digital Menu & Food Ordering Sales Demo

A premium, frictionless table-side digital ordering interface built to pitch restaurant owners in **Nadiad, Gujarat, India**.

Demonstrates the complete customer ordering journey and kitchen staff workflow without requiring customers to download an application, create an account, or log in.

---

## 🍽️ Key Highlights

- **Pure Veg & Regional Cuisine**: Tailored for Nadiad dining heritage with 10 structured categories: Gujarati Thalis, Khaman Dhokla, Surti Undhiyu, Sev Tameta, Kathiyawadi Kadhi-Khichdi, Jain specialties, Punjabi curries, Tandoori breads, Chaas/Lassi, and traditional sweets.
- **Calm, Restrained Aesthetic**: Designed with a warm ivory background (`#FAF7F2`), deep charcoal typography (`#26201B`), and muted terracotta accents (`#A3432B`). Zero aggressive animations, neon gradients, or generic AI templates.
- **Instant Table-Side Ordering**: Customers scan a table QR code (e.g. `/menu?table=07`), browse, adjust quantities, add cooking instructions, and submit an order in seconds.
- **Combined Table Support (Demo Group G12)**: Staff can merge adjacent tables (Table 07 + Table 08 into Seating Group G12) with one click; customer menus and kitchen receipts update reactively.
- **Real-Time Kitchen Display System (KDS)**: `/staff` dashboard tracks live order queues across **Received &rarr; Preparing &rarr; Ready &rarr; Served** status stages with time elapsed and reject protection.
- **Integrated QR Generator**: Staff area generates live, scannable QR codes for sample tables (Tables 07, 08, 01, 02, 03, 05, 09, 12).
- **Persistent Local State with Reactive Sync**: Utilizes browser `localStorage` and custom events so split tabs and same-browser windows update immediately without polling.

---

## 🚀 Routes

| Route | Description |
|---|---|
| `/menu?table=07` | Customer ordering interface for **Table 07** |
| `/menu?table=08` | Customer ordering interface for **Table 08** |
| `/order-confirmation` | Order confirmation screen with live 4-step status tracker and itemized receipt |
| `/staff` | Demo restaurant staff kitchen display & table management dashboard |
| `/` | Root route (redirects automatically to `/menu?table=07`) |

---

## 🛠️ Installation & Development

### Prerequisites
- Node.js v18+ or v20+
- npm v9+

### Setup Commands
```bash
# 1. Clone or navigate to the project directory
cd shree-restaurant-qr

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start the local development server
npm run dev

# 4. Open in browser
# Customer view: http://localhost:5173/menu?table=07
# Kitchen view:  http://localhost:5173/staff
```

### Production Build
```bash
npm run build
```

### Automated End-to-End Test Suite
Runs a headless browser test verifying mobile viewports (360px, 390px, 430px), search, category filters, cart calculations, order submission, kitchen status changes, and table combining:
```bash
node test-app.cjs
```

---

## 📋 Demonstration Flow for Pitching in Nadiad

When pitching to restaurant owners in Nadiad, follow this recommended walkthrough:

1. **The Customer Entry Point**:
   - Open `/menu?table=07` on a mobile device or responsive browser.
   - Point out that **no mobile app install or phone number login** is required.
   - Show the compact header with the pure vegetarian emblem and Table 07 badge.

2. **Browsing & Dietary Confidence**:
   - Scroll horizontally through the 10 menu categories.
   - Tap **"Jain Friendly Only"** toggle to highlight how Jain customers can immediately filter dishes.
   - Use the **"Search dishes..."** field (e.g. typing "Paneer" or "Thali").

3. **Cart & Special Cooking Instructions**:
   - Tap **"+ ADD"** on Paneer Tikka and Gujarati Thali. Observe the clean `[-] [qty] [+]` controls.
   - Review the sticky bottom bar (`2 items in order • ₹520 + tax`).
   - Open the **Cart Drawer**, point out transparent 5% GST itemization (CGST 2.5% + SGST 2.5%), and add special notes (*"Extra roasted papad and medium spicy please"*).
   - Tap **"Place Demo Order"**.

4. **Order Confirmation & Tracker**:
   - View the generated demo order number (e.g. `#SR-4093`) and the 4-step status stepper (**Received &rarr; Preparing &rarr; Ready &rarr; Served**).

5. **Kitchen Display System (`/staff`)**:
   - Open `/staff` in another tab or split window.
   - Watch the new Table 07 order appear live under **New / Received** with order notes and ₹ total.
   - Click **"Accept & Prepare"** &rarr; Order status transitions to **Preparing**.
   - Click **"Mark Ready to Serve"** &rarr; Order status transitions to **Ready to Serve**.
   - Click **"Mark Served to Table"** &rarr; Order completes.

6. **Demonstrating Table Merging (Group G12)**:
   - On `/staff`, click **"Combine Table 07 + 08 &rarr; Group G12"**.
   - Switch back to `/menu?table=08` or `/menu?table=07`. Notice the header immediately updates to **"Table 08 (Group G12 • Tables 07 + 08)"**.

7. **Table QR Codes & 1-Click Reset**:
   - Click **"Table QR Codes"** on `/staff` to show owners the scannable QR tents.
   - Click **"Reset Demo State"** at any time to restore the initial sample orders for the next pitch.

---

## ⚠️ Demo Scope & Limitations

This application is engineered specifically as a **frontend sales demonstration**:
- **Simulated Orders Only**: No food is prepared in a real kitchen, and no actual payment gateway is charged.
- **Local Browser Synchronization**: Orders and table groupings are stored in browser `localStorage`. Real cross-device production deployment would connect a cloud database (e.g. PostgreSQL/Firebase) and WebSocket server.
- **Dietary Claims**: Jain labels and vegetarian indicators are simulated menu tags and should be verified with kitchen staff in a production deployment.
