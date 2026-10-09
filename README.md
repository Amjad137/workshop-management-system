# Workshop Registration Service

Full-stack solution for community training centre workshop management, capacity enforcement, and front-desk attendee registrations.

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: v20+
- **Yarn**: v1.22+
- **MongoDB**: Local MongoDB running on `mongodb://127.0.0.1:27017`

---

### 1. Backend Setup (`server`)

```bash
cd server

# Install dependencies (if not already installed)
yarn install

# Seed Admin, Manager, Staff accounts & sample workshops
yarn seed
# (or: npx tsx scripts/seed.ts)

# Start the Express API server (runs on port 8000)
yarn start:local
```

### 2. Frontend Setup (`client`)

```bash
cd client

# Install dependencies (if not already installed)
yarn install

# Start Next.js development server (runs on port 3000)
npx next dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Seeded Demo Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@workshop.com` | `Password123!` | User account creation & role assignment |
| **Manager** | `manager@workshop.com` | `Password123!` | Add/edit workshops, register/cancel attendees, view history |
| **Staff** | `staff@workshop.com` | `Password123!` | Register & cancel attendees, view workshops catalogue & history |

> **Tip:** The Sign-In page features a **1-Click Demo Fill** helper to switch between Admin, Manager, and Staff roles instantly.

---

## 🧪 Automated Concurrency Verification Test

To verify that the capacity rule holds and zero overbooking occurs under high concurrent load:

```bash
cd server
npx tsx src/concurrency-test.ts
```

**What this test does:**
1. Dynamically provisions a test workshop with `capacity = 5`.
2. Fires **30 simultaneous registration requests** at the exact same millisecond.
3. Verifies that **exactly 5 succeed** and **25 fail** with `409 Conflict (Capacity Full)`.
4. Confirms that `activeRegistrationsCount === 5` in MongoDB.

---

## 📋 Features Overview

- **Strict Role-Based Access Control (RBAC):** Backend-enforced permissions matching the exact requirement matrix. Unauthorized actions return `403 Forbidden`.
- **Atomic Capacity Enforcement:** Single-operation atomic `$expr` conditional updates eliminate race conditions and overbooking.
- **Permanent Audit Trail:** Cancellations free seats immediately, but registration records are never deleted—retaining timestamps and actor identities.
- **Search & Filter:** Find workshops by date range, available seats, location (Downtown, North Campus, West End), category, and status.
- **Waitlist Queue (Bonus):** If a workshop is full, staff can queue attendees to a waitlist.
- **Comprehensive Audit Logs (Bonus):** Modifications to workshops and registrations are recorded.

---

For architecture rationale, trade-offs, and design decisions, see [DESIGN.md](./DESIGN.md).
