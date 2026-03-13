# Clinic Management System - Features & Topics Breakdown

This document provides a comprehensive overview of the features included in the Clinic Management System and categorizes them by their relevant technical and domain topics. It serves as a guide to understand what capabilities the system offers and how they map to specific areas of a clinic's operation.

---

## 1. Authentication & Security
**Topic: Identity Access Management (IAM) & Role-Based Access Control (RBAC)**

This area handles how users access the system and ensures that sensitive medical data is only visible to authorized personnel.

*   **Features:**
    *   **Secure User Login:** Authentication via email and password using JSON Web Tokens (JWT).
    *   **Role-Based Dashboards:** Distinct interface experiences and permissions for `Admin`, `Doctor`, and `Receptionist` roles.
    *   **Protected Routes:** Frontend prevents unauthorized access to private pages based on active user state and role.
    *   **Password Security:** Passwords hashed using `bcryptjs` before being stored in the database.

## 2. Patient Management
**Topic: Electronic Medical Records (EMR) & Demographics**

This involves the digital onboarding and cataloging of patient information, moving away from manual paper registers.

*   **Features:**
    *   **Patient Registration:** Ability for the Receptionist to create a new patient profile (Name, Age, Gender, Phone, Address).
    *   **Patient History Tracking:** Maintaining an accessible, searchable, and chronological record of a patient's visits.
    *   **Digital Patient Roster:** Viewing all registered patients in the database.

## 3. Token & Queue Management
**Topic: Workflow Automation & Patient Flow Optimization**

This is the core operational feature designed to streamline the wait times and organize the patient queue.

*   **Features:**
    *   **Automated Token Generation:** System algorithmically generates sequential tokens (`newToken = lastToken + 1`) upon patient arrival.
    *   **Token Status Tracking:** Dynamic updating of token states: `Waiting`, `In-progress`, `Completed`, and `Cancelled`.
    *   **Priority Queuing:** Categorizing tokens by urgency (`Normal`, `VIP`, `Emergency`).
    *   **Interactive Queue Dashboard:** Real-time visibility into the current queue for both the Doctor (to call the next patient) and the Receptionist (to inform waiting patients).

## 4. Consultation & Prescriptions
**Topic: Clinical Documentation & Health Informatics**

This module allows doctors to digitally document their consultations, creating a secure, trackable medical record.

*   **Features:**
    *   **Digital Prescription Pad:** Doctors can fill out digital forms detailing the diagnosis, prescribed medicines, and specific medical notes.
    *   **Direct Patient Linking:** Every prescription is intrinsically linked to the `PatientId` and `DoctorId` for accountability and historical reference.
    *   **Downloadable Records:** Ability to generate and download PDF copies of prescriptions (utilizing `jspdf`).

## 5. Billing & Invoicing
**Topic: Revenue Cycle Management & Financial Tracking**

This manages the financial transactions required for services rendered at the clinic.

*   **Features:**
    *   **Automated Bill Calculation:** The system computes the total cost by combining consultation fees and medication costs.
    *   **Payment Status Tracking:** Tagging invoices as either `Paid` or `Unpaid`.
    *   **Patient Billing History:** Access to past billing records for auditing or follow-up by the Receptionist.
    *   **Invoice Generation:** Generating exportable/printable bills for the patient.

## 6. Business Analytics & Admin Oversight
**Topic: Business Intelligence (BI) & System Administration**

Designed for the clinic management and owners to get a bird's-eye view of the clinic's performance.

*   **Features:**
    *   **Staff Management:** The Admin can add, remove, and manage clinic staff (Doctors and Receptionists).
    *   **Revenue Reporting:** Aggregation of billing data to show daily, weekly, or overall clinic revenue.
    *   **Data Visualization:** Utilizing charts (`recharts`) to visually represent patient volume over time, revenue trends, and departmental efficiency.
    *   **System Auditing:** Background logging (via `winston` and `morgan`) to track critical actions for debugging and compliance.

---

### Technical Topic Mapping (Stack Context)

*   **Frontend Technologies (UI/UX):** React.js, React Router, TailwindCSS, Lucide React (Icons), Recharts.
*   **Backend Technologies (API Layer):** Node.js, Express.js.
*   **Database Solutions (Data Persistence):** MongoDB, Mongoose (Schemas/Models).
*   **Data Export & Reporting:** jsPDF.
