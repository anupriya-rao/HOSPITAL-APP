# 🏥 Hospital Continuity App

A full-stack healthcare platform that provides every patient with a **permanent QR-based medical identity**, enabling doctors across hospitals to instantly access a patient's medical history and ensure continuity of care.

## 🌟 Problem Statement

Medical records are often fragmented across different hospitals and clinics, making it difficult for doctors to access a patient's complete history during emergencies or consultations.

The Hospital Continuity App solves this problem by creating a **single digital medical identity** for every patient through a QR code that securely links to their health records.

---

## ✨ Features

### 👤 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Role-based access control
* Three user roles:

  * Patient
  * Doctor
  * Admin

### 🩺 Patient Management

* Create and manage patient profiles
* Store complete medical history
* Emergency contact information
* Allergy and chronic condition tracking
* Permanent QR code generation for every patient

### 👨‍⚕️ Doctor Portal

* Access patient history by scanning QR code
* Add new medical visit entries
* Record diagnosis, prescriptions, and notes
* Drug-allergy conflict detection
* Mark patients as high-risk or chronic

### 🛡️ Admin Portal

* Doctor onboarding and verification
* Audit logging of patient record access
* Hospital analytics and insights

### 📄 Additional Features

* Prescription PDF download
* Medication reminders
* End-to-end role-based workflows
* Realistic dummy data for demonstrations

---

# 🏗️ Tech Stack

| Technology | Purpose               |
| ---------- | --------------------- |
| React      | Frontend              |
| Node.js    | Runtime Environment   |
| Express.js | Backend Framework     |
| MongoDB    | Database              |
| Mongoose   | MongoDB ODM           |
| JWT        | Authentication        |
| bcryptjs   | Password Hashing      |
| QRCode     | QR Generation         |
| dotenv     | Environment Variables |
| CORS       | Cross-Origin Requests |

---

# 📂 Project Structure

```text
hospital-app/
├── client/
└── server/
    ├── models/
    │   ├── User.js
    │   └── Patient.js
    ├── routes/
    │   ├── auth.js
    │   ├── patient.js
    │   └── doctor.js
    ├── middleware/
    │   └── auth.js
    ├── config/
    ├── index.js
    └── .env
```

---

# 🗄️ Database Models

## User

* name
* email
* password (hashed)
* role
* linkedId
* createdAt

## Patient

* name
* age
* gender
* phone
* bloodGroup
* allergies
* chronicConditions
* highRisk
* chronic
* qrCode
* emergencyContact
* medicalHistory
* createdAt

---

# 🔐 Authentication

The application uses **JWT Authentication**.

Protected routes require:

```http
Authorization: Bearer <token>
```

Token contains:

```json
{
  "id": "userId",
  "role": "doctor",
  "name": "Test Doctor"
}
```

---

# 🚀 API Endpoints

## Authentication

### Register User

```http
POST /api/auth/register
```

### Login User

```http
POST /api/auth/login
```

---

## Patient Routes

### Create Patient

```http
POST /api/patient/create
```

### Get Patient Profile

```http
GET /api/patient/profile/:id
```

### Scan Patient QR

```http
GET /api/patient/scan/:id
```

---

## Doctor Routes

### Add Medical Visit

```http
POST /api/doctor/visit/:patientId
```

### Flag Patient

```http
PATCH /api/doctor/flag/:patientId
```

---

# 🩺 Medical History Entry Structure

```json
{
  "date": "2026-07-01",
  "hospital": "AIIMS Delhi",
  "doctor": "Dr. XYZ",
  "diagnosis": "Type 2 Diabetes",
  "prescription": [
    "Metformin",
    "Glipizide"
  ],
  "notes": "Routine Checkup"
}
```

---

# ⚠️ Drug Conflict Detection

Before adding a prescription, the system checks whether any prescribed medicine conflicts with the patient's recorded allergies.

Example:

```text
Patient Allergy: Penicillin
Prescription: Penicillin
```

Response:

```json
{
  "message": "Drug conflict detected"
}
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/hospitalapp
JWT_SECRET=your_secret_key
```

---

# ▶️ Installation

## Clone Repository

```bash
git clone https://github.com/anupriya-rao/HOSPITAL-APP.git
cd HOSPITAL-APP
```

## Install Dependencies

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd client
npm install
```

---

# ▶️ Run Application

### Start MongoDB

```bash
brew services start mongodb-community
```

### Start Backend

```bash
cd server
npm start
```

Runs on:

```text
http://127.0.0.1:8000
```

### Start Frontend

```bash
cd client
npm start
```

---

# 🎯 Future Scope

* Multi-hospital integration
* Cloud deployment
* Secure document uploads
* Appointment booking
* AI-powered health insights
* Integration with national healthcare systems
* Advanced analytics dashboard

---

# 👩‍💻 Developed By

**Anupriya Rao**
B.Tech (Information Technology)
Indira Gandhi Delhi Technical University for Women (IGDTUW)

---

# 📜 License

This project is developed for educational and demonstration purposes.
