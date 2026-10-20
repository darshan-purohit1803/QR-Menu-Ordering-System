# Authentic Neapolitan Pizza — 100% Pure Vegetarian Artisanal Pizzeria & Cafe

An aesthetic, frictionless table-side digital ordering interface and Pizzaiolo kitchen display system built for **Authentic Neapolitan Pizza** (100% Pure Vegetarian Artisanal Woodfired Pizzeria & Cafe).

Demonstrates the complete customer table-side ordering journey and pizzeria kitchen workflow without requiring customers to download an app, create an account, or log in.

---

## 🍕 Key Highlights & What's New

- **100% Pure Vegetarian Neapolitan Menu**:
  - All non-vegetarian and meat items have been completely removed.
  - Features 10 curated pure vegetarian artisanal categories: Classic Neapolitan, Signature & Truffle, Spicy & Diavola, Pizza Bianca, Veggie Garden & Pesto, Gourmet Artisan Specials, Calzones & Stuffed Crusts, Starters & Crust Bites, Italian Craft Beverages, and Dolci & Gelato.
- **Large High-Impact Pizza Photography**:
  - Replaced small thumbnails with **large 16:10 hero pizza imagery** displaying the leopard-spotted cornicione crust, bubbling Fior di Latte mozzarella, fresh basil, and toppings in high resolution so guests get a clear, appetizing view of every pizza before ordering.
- **Stylish Modern Menu Page Theme**:
  - Modern hero section with artisanal badges (*"🌱 100% Pure Vegetarian"*, *"🔥 450°C Volcanic Stone Oven"*, *"48-Hour Cold Biga Fermentation"*).
  - Quick filter chips (*"All Pizzas & Items"*, *"⭐ Bestsellers"*, *"🍄 Truffle & Porcini"*, *"🌶️ Spicy Crusts"*, *"🥟 Calzones"*).
  - Modern glassmorphic search input and floating crust details.
- **Instant Table-Side Ordering**:
  - Customers scan table QR code (e.g. `/menu?table=07`), browse, adjust quantities, add kitchen instructions (*"Slice into 6 slices and extra chili oil"*), and submit orders with zero login barrier.
- **Combined Table Support (Demo Group G12)**:
  - Pizzaiolo staff can merge adjacent tables (Table 07 + Table 08 into Seating Group G12); customer menus immediately reflect the joint group.
- **Real-Time Pizzaiolo Kitchen Display System (KDS)**:
  - `/staff` tracks live orders across **Received &rarr; In Woodfired Oven (450°C) &rarr; Fresh from Oven &rarr; Served to Table**.
- **Table QR Code Generator**:
  - Staff area generates live, scannable QR codes for sample tables (Tables 07, 08, 01, 02, 03, 05, 09, 12).
- **Persistent Local State**:
  - Uses browser `localStorage` and real-time custom events for split-screen and cross-tab demonstration.

---

## 🚀 Routes

| Route | Description |
|---|---|
| `/menu?table=07` | Customer digital menu for **Table 07** |
| `/menu?table=08` | Customer digital menu for **Table 08** |
| `/order-confirmation` | Order confirmation screen with 4-step oven progress tracker |
| `/staff` | Pizzaiolo kitchen display & floor management dashboard |
| `/` | Root route (redirects automatically to `/menu?table=07`) |

---

## 🛠️ Installation & Development

### Setup Commands
```bash
# 1. Navigate to the project directory
cd shree-restaurant-qr

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start local development server
npm run dev

# 4. Open in browser:
# Customer Table 07: http://localhost:5173/menu?table=07
# Kitchen Display:   http://localhost:5173/staff
```

### Production Build
```bash
npm run build
```

### Automated End-to-End Test Suite
```bash
node test-app.cjs
```
