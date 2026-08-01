# EduConnect — Full-Stack LMS

A complete Learning Management System (LMS) built with **React**, **Node.js/Express**, and **MongoDB**.

---

## 🗂️ Project Structure

```
EduConnect/
├── backend/          ← Express REST API (Node.js + MongoDB)
└── frontend/         ← React SPA (Vite + TypeScript)
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (choose one):
  - Local: Install MongoDB Community → https://www.mongodb.com/try/download/community
  - Cloud: Free Atlas cluster → https://cloud.mongodb.com

---

### 1. Backend Setup

```bash
# Navigate to backend
cd EduConnect/backend

# Install dependencies
npm install

# The .env file is already created with defaults.
# Edit MONGO_URI if using MongoDB Atlas:
#   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/educonnect

# Start the dev server (runs on port 5000)
npm run dev
```

### 2. Frontend Setup

```bash
# In a NEW terminal, navigate to frontend
cd EduConnect/frontend

# Install dependencies
npm install

# Start the Vite dev server (runs on port 5173)
npm run dev
```

### 3. Open in Browser

```
http://localhost:5173
```

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login + get JWT |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/me` | ✅ | Get own profile |
| PUT | `/api/users/me` | ✅ | Update profile |
| PUT | `/api/users/me/password` | ✅ | Change password |

### Courses
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/courses` | ❌ | List all (search/filter) |
| GET | `/api/courses/:id` | ❌ | Get single course |
| GET | `/api/courses/my/courses` | ✅ | Get instructor's courses |
| POST | `/api/courses` | ✅ | Create course |
| PUT | `/api/courses/:id` | ✅ | Update course (owner) |
| DELETE | `/api/courses/:id` | ✅ | Delete course (owner) |

### Enrollment & Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/courses/:id/enroll` | ✅ | Enroll in course |
| GET | `/api/enrollments/my` | ✅ | Get enrolled courses |
| GET | `/api/courses/:id/reviews` | ❌ | List reviews |
| POST | `/api/courses/:id/reviews` | ✅ | Add review (enrolled only) |

---

## 🏗️ Architecture

### Backend (4-Layer)
```
Routes → Controllers → Services → Models (Mongoose)
```
- **Routes**: Define endpoints, attach validators
- **Controllers**: Handle req/res, call services
- **Services**: Core business logic (enrollment rules, rating calc)
- **Models**: Mongoose schemas with indexes

### Frontend (React)
```
Pages → Components → API Layer (Axios) → Backend
                  ↕
            AuthContext (Global State)
```
- **AuthContext**: JWT stored in localStorage, rehydrated on mount
- **Axios Interceptors**: Auto-attach JWT, auto-logout on 401
- **PrivateRoute**: Guards all dashboard/profile routes
- **react-hook-form**: Client-side validation on all forms

---

## 🔒 Security Features
- Passwords hashed with **bcryptjs** (salt rounds: 12)
- JWT expiry: 7 days
- `select: false` on password field — never returned in queries
- Ownership check on course update/delete (403 Forbidden)
- Enrollment check before allowing reviews (403 Forbidden)
- Express-validator on all input fields

---

## 📁 Environment Variables (backend/.env)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `MONGO_URI` | `mongodb://localhost:27017/educonnect` | MongoDB connection string |
| `JWT_SECRET` | *(see .env)* | Change this in production! |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `NODE_ENV` | `development` | Environment |
| `CLIENT_URL` | `http://localhost:5173` | CORS allowed origin |
