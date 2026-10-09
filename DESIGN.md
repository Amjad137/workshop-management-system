# Architecture & Design Decisions

This document outlines the architectural choices, design trade-offs, concurrency guarantees, and assumptions for the Workshop Registration Service.

---

## 1. Stack Choices & Rationale

* **Backend: Express + TypeScript + Mongoose + Better-Auth**
  - *Why:* Express provides predictable, lightweight HTTP routing. MongoDB + Mongoose handles semi-structured catalogue data naturally. Better-Auth provides secure session management, credential hashing, and cookie exchange without rolling bespoke auth security risks.
* **Frontend: Next.js (App Router) + React 19 + TailwindCSS + Radix UI + TanStack Query**
  - *Why:* Component modularity, responsive design, automatic optimistic caching via TanStack Query, and client-side route proxying.

---

## 2. Preventing Over-Registration (Concurrency Guarantee)

### The Problem
During peak registration hours (e.g., Saturday mornings), multiple front-desk staff can simultaneously submit registration forms for the final remaining seat in a workshop. A naive `read -> check -> write` pattern causes race conditions where both requests observe `activeCount < capacity` and both proceed, resulting in overbooking.

### The Solution: Atomic Conditional Updates
Instead of multi-step application-level locks or relying on replica set distributed transactions, we utilize MongoDB's single-operation document-level atomicity:

```typescript
const updatedWorkshop = await Workshop.findOneAndUpdate(
  {
    _id: workshopId,
    status: 'SCHEDULED',
    $expr: { $lt: ['$activeRegistrationsCount', '$capacity'] }
  },
  { $inc: { activeRegistrationsCount: 1 } },
  { new: true }
);

if (!updatedWorkshop) {
  throw new ConflictException("Workshop is at full capacity. No seats available.");
}
```

1. **Atomicity:** MongoDB's document-level write lock ensures that even if 50 requests reach the database engine concurrently, each operation evaluates the `$expr` condition sequentially and atomically.
2. **Deterministic Rollback:** If document creation fails (e.g. duplicate key for identical attendee), the increment is atomically decremented (`$inc: { activeRegistrationsCount: -1 }`).
3. **Cancellation Safety:** When cancelling, the registration status transitions from `REGISTERED` to `CANCELLED` atomically, and `$inc: -1` is applied to `activeRegistrationsCount`.
4. **Standalone Compatible:** Works seamlessly on single-node MongoDB, replica sets, and sharded clusters without multi-document transaction lock overhead.

---

## 3. Access Control & Strict Permission Matrix

The client specification strictly mandates backend-level rejection:
> *"Anything not marked must be refused by the backend, not just hidden in the interface."*

| Feature | Admin | Manager | Staff | Backend Enforcement |
| :--- | :---: | :---: | :---: | :--- |
| **Create user accounts & set roles** | **Yes** | ❌ | ❌ | `validateAdmin` guard on `POST /v1/user` |
| **Add & edit workshops** | ❌ | **Yes** | ❌ | `validateManager` guard on `POST /v1/workshop` & `PATCH /v1/workshop/:id` |
| **Register & cancel attendees** | ❌ | **Yes** | **Yes** | `validateManagerOrStaff` (Admin returns `403 Forbidden`) |
| **View workshops & history** | ❌ | **Yes** | **Yes** | `validateManagerOrStaff` (Admin returns `403 Forbidden`) |

---

## 4. Design Trade-offs & Assumptions

1. **Atomic Counter vs Dynamic Aggregation:**
   - *Decision:* Maintain `activeRegistrationsCount` directly on the `Workshop` document alongside individual `Registration` records.
   - *Trade-off:* Requires decrement logic on cancellation, but eliminates costly `countDocuments()` scans on every list and registration operation, providing sub-millisecond atomic conditional checks.
2. **Attendee Accounts vs Front-Desk Data Entry:**
   - *Assumption:* Attendees do not have passwords or login accounts. Name and email are entered by front desk staff. A partial unique index (`workshopId` + `attendeeEmail` where `status: 'REGISTERED'`) prevents duplicate active tickets for the same attendee while allowing re-registration if previously cancelled.
3. **Permanent Retention:**
   - *Decision:* Registrations are never hard-deleted. Cancellations store `cancelledBy`, `cancelledAt`, and `cancellationReason` for complete audit integrity.

---

## 5. Bonus Features Implemented

* **Audit Trail (`AuditLog`):** Workshop creations, updates, registrations, and cancellations automatically generate structured audit log entries recording actor ID, timestamp, and change deltas.
* **Waitlist Engine:** When a workshop is full, staff can enqueue attendees to a waitlist. When cancellations occur, the system identifies and returns the next waitlisted attendee.
