# 🏁 Honda Tuning Shop (Full-Stack Web Application)

ระบบร้านจำหน่ายอะไหล่แต่งรถยนต์ฮอนด้าและจองคิวบริการซ่อมบำรุง/ติดตั้ง (Full-Stack React + Node.js / Express)

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
honda-tuning-shop/
├── backend/                  # ฝั่ง Server: Node.js / Express
│   ├── uploads/              # เก็บรูปอะไหล่ และ สลิปชำระเงิน
│   ├── src/
│   │   ├── config/           # ตั้งค่าฐานข้อมูล & JWT
│   │   │   ├── db.js         # เชื่อมต่อ Database (MongoDB)
│   │   │   └── jwt.js        # Secret Key & Expiration
│   │   ├── controllers/      # Business Logic (Auth, Product, Booking, Order)
│   │   ├── models/           # Data Schema (User, Product, Booking, Order)
│   │   ├── routes/           # RESTful API Endpoints
│   │   ├── middlewares/      # JWT Auth, Admin RBAC, Multer, Error Handler
│   │   ├── utils/            # Helper Functions (Token Generator)
│   │   └── server.js         # Entry Point
│   ├── .env
│   └── package.json
│
├── frontend/                 # ฝั่ง Client: React + Vite + Tailwind CSS
│   ├── public/               # รูปภาพ & Favicon
│   ├── src/
│   │   ├── assets/styles/    # Global Tailwind styles
│   │   ├── components/       # UI Components (Navbar, Footer, ProductCard, etc.)
│   │   ├── pages/            # Pages (Home, Shop, Service, Checkout, Admin, etc.)
│   │   ├── context/          # State Management (AuthContext, CartContext)
│   │   ├── services/         # Axios API Services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 วิธีติดตั้งและรันโปรเจกต์ (Quick Start)

### 1. ติดตั้ง Dependencies ฝั่ง Backend
```bash
cd backend
npm install
npm run dev
```
*Backend จะทำงานที่: `http://localhost:5000`*

### 2. ติดตั้ง Dependencies ฝั่ง Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend จะทำงานที่: `http://localhost:5173`*

---

## ⚙️ Environment Variables (.env)

### Backend (`backend/.env`)
```env
PORT=5000
DB_URI=mongodb://localhost:27017/honda_tuning_shop
JWT_SECRET=super_secret_jwt_key_honda_racing
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
