# 🧾 Inventory QR Report Dashboard

A modern, Hebrew-supported admin dashboard built with **Next.js**, **Clerk Authentication**, and **jsPDF** to generate printable QR-coded PDF reports. Designed for inventory and product management.

![Next.js](https://img.shields.io/badge/Next.js-13-black)
![Clerk](https://img.shields.io/badge/Auth-Clerk-blue)
![MongoDB](https://img.shields.io/badge/database-MongoDB-green)
![PDF Export](https://img.shields.io/badge/expot-pdf-red)

---

## ✨ Features

- 🔐 Secure user authentication via Clerk
- 📄 Export clean, RTL-compatible PDF reports with jsPDF & QR codes
- 🧠 Hebrew font support (Alef) for proper layout
- 📦 Manage products, orders, stock, and car-specific inventory
- 📊 Dashboard with car search, scanning, and reports
- 🖼️ Product images embedded in PDF using Cloudinary
- 📁 Modular file structure and clean component architecture

---

## 📁 Folder Structure Overview

```
app/
├── (auth)/sign-in, sign-up         # Clerk auth routes
├── (dashboard)/                   # Main dashboard routes
│   ├── products, orders, reports, stock-count, scan
│   └── car-search, result/[query]
├── layout.tsx                     # Shared app layout
├── page.tsx                       # Root landing (dashboard)
├── api/                           # Route handlers (Next.js 13 API routes)
│   ├── products, stock, search, reports, orders
components/
├── products, orders, layout       # Modular React components
├── custom ui/                     # Custom buttons, cards, etc.
lib/
├── models, fonts, actions         # Logic layer and fonts
├── mongoDB.ts                     # MongoDB connector
public/
├── icons/, logo.png               # Static assets
.env, next.config.mjs              # Environment and config files
```

---

## 🛠️ Technologies

- [Next.js 13](https://nextjs.org/)
- [Clerk](https://clerk.dev/) for authentication
- [MongoDB](https://www.mongodb.com/) (via mongoose or native driver)
- [jsPDF](https://github.com/parallax/jsPDF) + [qrcode](https://www.npmjs.com/package/qrcode)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/) for image hosting
- [TypeScript](https://www.typescriptlang.org/)

---

## 🌍 Environment Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME={value}

MONGODB_URL=mongodb+srv://{uname}:{pass}@cluster0.mongodb.net/

ADMIN_DASHBOARD_URL=http://localhost:{port}
```

---

## 🚀 Getting Started

```bash
# Clone and install dependencies
git clone https://github.com/your-username/admin_master.git
cd admin_master
npm install

# Start local dev server
npm run dev
```

---

## 📄 PDF Report Example

Each report includes:

- Product ID
- Title (in Hebrew)
- Quantity
- Location list
- QR code
- Image (if exists)

Example PDF rendering logic:

```tsx
doc.addImage(qr, "PNG", 14, yOffset, 24, 24);
doc.text(`📦 ${item.title}`, 180, yOffset + 12, { align: "right" });
item.location?.forEach((loc, i) =>
  doc.text(`📍 ${loc}`, 180, yOffset + 26 + i * 7, { align: "right" })
);
```

---

## 📌 To Do / Future Features

- [ ] Export filtered products only
- [ ] Add multi-language support
- [ ] Dashboard analytics widgets
- [ ] Role-based permissions

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

## 👤 Author

Built by **Mohammad Yosef**
GitHub: [@J0kErF](https://github.com/J0kErF)
Email: mohammad@mryosef.com
