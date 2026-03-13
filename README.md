# Clinic Management System (MERN Stack) - Complete Project Documentation

## 1. Project Overview
The Clinic Management System is a comprehensive web-based healthcare application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The system aims to digitize and streamline clinic operations, including patient registration, token queue management, doctor consultations, prescription management, and billing processes.

Traditional clinics often rely on manual registers to manage patients and maintain records, leading to inefficiencies such as difficulty in finding patient history, poor queue management, and the risk of data loss. This system solves these critical issues by maintaining all records digitally and providing role-based, intuitive dashboards for clinic staff.

## 2. Objectives of the System
- **Digitize clinic operations:** Transition from manual to digital record-keeping.
- **Automate token generation and queue management:** Streamline patient flow.
- **Maintain patient medical history:** Keep an accurate, easily accessible log of patient data.
- **Digital prescriptions:** Allow doctors to securely add and manage prescriptions.
- **Automated billing:** Generate transparent and error-free bills for consulting and pharmacy items.
- **Secure access:** Provide secure login functionality with role-based access control (RBAC).

## 3. User Roles

### Doctor
- View patient queue
- View patient information & history
- Add prescriptions

### Receptionist
- Register patients
- Generate tokens
- Manage billing & payments
- View patient records

### Admin
- Manage doctors & receptionists
- View analytics and revenue reports
- Monitor system logs

## 4. System Architecture
The architecture follows a robust 3-tier model:

### Frontend (Client Layer)
- React.js
- Axios for API calls
- TailwindCSS or Bootstrap for UI styling

### Backend (Application Layer)
- Node.js environment
- Express.js framework
- JWT (JSON Web Tokens) for authentication
- Winston/Morgan for application logging

### Database (Data Layer)
- MongoDB Atlas (Cloud Database)

**Data Flow:** Client → API Server → Service Layer → Database

## 5. Database Design (Collections)

### `Users`
- `name` (String)
- `email` (String)
- `password` (String, Hashed)
- `role` (Enum: Admin, Doctor, Receptionist)

### `Patients`
- `name` (String)
- `age` (Number)
- `gender` (Enum: Male, Female, Other)
- `phone` (String)
- `address` (String)
- `createdAt` (Date)

### `Tokens`
- `tokenNumber` (Number)
- `patientId` (ObjectId, ref: `Patients`)
- `status` (Enum: Waiting, In-progress, Completed, Cancelled)
- `priority` (Enum: Normal, VIP, Emergency)
- `createdAt` (Date)

### `Prescriptions`
- `patientId` (ObjectId, ref: `Patients`)
- `doctorId` (ObjectId, ref: `Users`)
- `diagnosis` (String)
- `medicines` (Array of Objects)
- `notes` (String)
- `date` (Date)

### `Bills`
- `patientId` (ObjectId, ref: `Patients`)
- `consultationFee` (Number)
- `medicineCost` (Number)
- `totalAmount` (Number)
- `paymentStatus` (Enum: Paid, Unpaid)
- `date` (Date)

## 6. Token Queue Algorithm
**Algorithm:** `newToken = lastToken + 1`

**Token States:**
1. `waiting`
2. `in-progress`
3. `completed`
4. `cancelled`

**Workflow:**
Patient arrives → Receptionist registers patient → Token generated → Doctor calls next token → Status updates to `in-progress` → Consultation finishes → Status updates to `completed`.

**Priority Tokens (Optional):**
- Emergency
- VIP
- Normal

## 7. Backend Architecture (Production Level)

**Folder Structure:**
```
backend/
├── config/
├── controllers/
├── services/
├── models/
├── routes/
├── middlewares/
└── utils/
```

**Architecture Pattern:** `Routes → Controllers → Services → Models → Database`
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Contain core business logic.
- **Models:** Define Mongoose schemas.
- **Routes:** Define API endpoints and attach middleware.

## 8. API Endpoints

### Auth
- `POST /api/auth/login`

### Patients
- `POST /api/patients` - Register a patient
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID

### Tokens
- `POST /api/tokens` - Generate a token
- `GET /api/tokens` - Get token queue

### Prescriptions
- `POST /api/prescriptions` - Add prescription
- `GET /api/prescriptions/:patientId` - Get patient's prescriptions

### Billing
- `POST /api/billing` - Generate bill
- `GET /api/billing/:patientId` - Get patient's bills

## 9. Dashboard Modules

### Receptionist Dashboard
- Add Patient
- Token Queue Management
- Billing Dashboard
- Patient Records

### Doctor Dashboard
- Interactive Token Queue
- Detailed Patient Information
- Digital Prescription Form
- Complete Patient History

### Admin Dashboard
- Manage Doctors and Receptionists
- Business Analytics
- Revenue Reports

## 10. UI Design System
- **Primary Color:** `#2563EB` (Blue)
- **Secondary Color:** `#3B82F6` (Light Blue)
- **Background:** `#F8FAFC` (Slate/Grey)
- **Card Background:** `#FFFFFF` (White)

**Status Colors:**
- **Success:** `#16A34A` (Green)
- **Warning:** `#FACC15` (Yellow)
- **Danger:** `#DC2626` (Red)

**Typography (Fonts):**
- Inter
- Roboto

## 11. Logging System
All critical actions within the system are logged for auditing and debugging.
**Examples:** User login, patient addition, token generation, prescription creation, bill generation.
**Libraries Used:** Winston & Morgan.

## 12. Deployment Setup
- **Frontend:** Vercel or Netlify
- **Backend:** Render or Railway
- **Database:** MongoDB Atlas

## 13. Testing
**Core Test Cases:**
- Login successfully opens the corresponding role dashboard.
- Adding a patient successfully saves the record in the database.
- Token generation creates a correct sequential token.
- Doctor adding a prescription reliably saves it to the DB.
- Generating a comprehensive bill calculates and stores the total accurately.
