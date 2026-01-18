# 🎨 Next.js Realtime Whiteboard

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-green.svg?style=for-the-badge)
![Website Status](https://img.shields.io/badge/Status-Development-orange.svg?style=for-the-badge)

Welcome to the **Realtime Whiteboard Solution**! This project is a feature-rich, full-stack web application built using the power of **Next.js**, **Socket.io**, and **MongoDB**. It provides a seamless collaborative drawing experience with integrated user authentication and persistent board saving.

---

## 🌟 Key Features

- **🎨 Real-time Collaboration**: Live, low-latency drawing updates shared across multiple users using **Socket.io**.
- **🔐 Secure Authentication**: Robust user authentication powered by **NextAuth.js**.
- **💾 Persistent Storage**: Save and load your whiteboard sessions securely with **MongoDB**.
- **🛠️ Drawing Tools**: interactive tools including pen, eraser, colors, and shapes.
- **⚡ High Performance**: Built on Next.js 15 with Turbopack for lightning-fast development and production builds.
- **📱 Responsive Design**: Fully responsive UI styled with **Tailwind CSS**.

---

## 🏗️ Project Structure

```bash
.
├── 📂 src
│   ├── 📂 app            # Next.js App Router & API Routes
│   │   ├── 📂 api        # Backend API Endpoints
│   │   ├── 📂 login      # Authentication Pages
│   │   └── 📂 whiteboard # Whiteboard Logic
│   ├── 📂 components     # Reusable UI Components
│   │   └── 📄 Whiteboard.tsx # Main Canvas Component
│   ├── 📂 lib            # Utility Functions & Config
│   └── 📂 models         # Mongoose Schema Definitions
├── 📂 public             # Static Assets
└── 📄 package.json       # Dependencies & Scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local installation
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AvadhutK01/next-js-realtime-whiteboard.git
   cd next-js-realtime-whiteboard
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
   ```

4. **Run the Application**
   Start the development server with Turbopack:
   ```bash
   npm run dev
   ```
   - App runs on: `http://localhost:3000`

---

## 🛠️ Tech Stack

| Frontend | Backend | Infrastructure |
| :-- | :-- | :-- |
| Next.js 15 | Next.js API Routes | Vercel (Recommended) |
| React 19 | Socket.io | MongoDB Atlas |
| Tailwind CSS | Mongoose | Docker (Optional) |
| Lucide React | NextAuth.js | |

---

## 📄 License
Distributed under the ISC License. See `package.json` for more information.

---
Built with ❤️ by [AvadhutK01](https://github.com/AvadhutK01)
