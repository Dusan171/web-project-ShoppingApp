# E-Commerce Full-Stack Application 🛒

This is a comprehensive full-stack e-commerce solution built with a **React** frontend and a **Node.js/Express** backend.

## 🏗️ Architecture Overview
The project follows a classic **Client-Server architecture**:
- **Backend:** A RESTful API built with Node.js and Express, handling business logic and data persistence.
- **Frontend:** A dynamic React.js application that consumes the API and provides a smooth user experience.
- **Database:** Development-ready mock setup using JSON files for quick prototyping.

---

## 🚀 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Auth:** JWT-based authentication (JSON Web Tokens)
- **Data Storage:** File-based JSON database (located in `/data`)
- **Pattern:** Controller-Service-Repository pattern for clean code separation.

### Frontend
- **Library:** React.js
- **State Management:** React Hooks / Context API
- **Styling:** CSS (Modular/Responsive)
- **Build Tool:** Webpack/Vite

---

## ✨ Key Features

### 🛠 Backend
- **Authentication:** Secure Register/Login system with `authMiddleware`.
- **Product Management:** Full CRUD for products and categories.
- **Cart Logic:** Complex cart management including items, quantities, and price calculations.
- **Reviews & Reports:** Business logic for user feedback and sales analytics.

### 💻 Frontend
- **Interactive Catalog:** Browse products with category filtering.
- **User Dashboard:** Profile management and order tracking.
- **Live Cart:** Real-time updates to the shopping cart.
- **Responsive UI:** Optimized for both desktop and mobile devices.

---

### ⚙️ Setup & Installation
   1. Backend Setup
       cd backend
       npm install
       npm start
     * Note: Ensure you set up your .env variables for JWT if required.
   2. Frontend Setup
       cd frontend
       npm install
       npm start

## 👥 Tim
   1. Bojana Milošević
   2. Dušan Lazić
