# Express Modular Backend (MongoDB)

Modular Express.js backend built with TypeScript and MongoDB (Mongoose).  
Implements basic POS features with role-based access control.

## 📦 Tech Stack
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication

## 📁 Modules
- **Admins**: Manage the system.
- **Cashiers**: Create receipts.
- **Branches**: Name, address, phone.
- **Products**: Name, price, image, category.
- **Receipts**: Created by cashiers from product list.

## 🔐 Roles
- `admin`: Full access.
- `cashier`: Can only create receipts.

## 🚀 Getting Started

### 1. Clone and install
```bash
git clone https://github.com/mohamedkhalil99/Neon_Task_MongoDB.git
cd Neon_Task_MongoDB
npm install
