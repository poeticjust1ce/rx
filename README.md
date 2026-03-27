# Web Application for Inventory Monitoring and Attendance System for RX Global SMC
## Overview

Web Application for Inventory Monitoring and Attendance System for RX Global SMC is a full-stack capstone project designed as an integrated inventory, employee management, and operations tracking system. It supports core business workflows such as stock management, employee attendance, product transfers, and delivery tracking.

The system provides a centralized platform that enables administrators, managers, and employees to efficiently manage resources and monitor operations in real time.

---

## Core Features

### Role-Based Access Control
- Admin: Full system control (inventory, users, suppliers, transfers)
- Manager: Team monitoring, attendance tracking, delivery oversight
- User: Inventory access, attendance logging, operational tasks

### Inventory Management
- Centralized inventory tracking
- Product creation with batch number and expiration date
- Supplier management
- Low stock monitoring
- Separate admin and employee inventories

### Transfer System
- Product transfers between users
- Automatic stock validation and updates
- Transfer status tracking (pending, accepted, rejected)
- Transfer history logs

### Attendance System
- Employee check-in and check-out
- Timestamp tracking
- Optional location and photo capture
- Manager-level visibility of attendance records

### Delivery Management
- Delivery logging and tracking
- Customer association
- Itemized delivery records with quantity and notes

### User & Customer Management
- Secure user registration and authentication
- Role assignment and access control
- Customer database for delivery tracking

---

## System Architecture

The application follows a modern full-stack architecture:

- Frontend: Component-based UI with server/client rendering
- Backend: Server actions and API routes
- Database: Document-based schema with relational mapping

The system enforces strict role-based routing and access control through middleware.

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- shadcn/ui (Radix UI)

### Backend
- Next.js Server Actions
- NextAuth (authentication)
- Zod (validation)

### Database
- MongoDB
- Prisma ORM

### Other Tools
- React Hook Form
- TanStack Table
---

## Key Implementation Highlights

- Role-based route protection using middleware
- Inventory transfer logic with stock validation and synchronization
- Modular and scalable component structure
- Structured Prisma schema supporting complex relationships
- Clean separation of concerns across frontend, backend, and database layers

---

## Installation

```bash
git clone https://github.com/poeticjust1ce/rx.git
cd rx
npm install
npm run dev
```

## Create a .env file and configure:

```bash
DATABASE_URL=
NEXTAUTH_SECRET=
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
```

## Usage
1. Register a user account
2. Wait for admin activation
3. Log in to access your role-based dashboard
4. Perform operations such as:
- Managing inventory
- Transferring products
- Logging attendance
- Tracking deliveries

## Research Context
This project was developed as a capstone research study focused on improving operational efficiency in small-to-medium business environments.
