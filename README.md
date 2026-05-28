# EKYAM — Unity Through Collaboration

**EKYAM** (Sanskrit: एक्यम् — oneness) is a full-stack community platform for fostering unity and collaboration among diverse communities through **shared resources** and **collaborative projects**.

This repository includes a production-ready **Node.js REST API**, **React frontend**, **JWT authentication**, **email OTP verification** (Mailtrap), **role-based admin access**, and **MongoDB Atlas** integration — structured like a professional coursework submission.

---

## Features

- **Secure user authentication** — Register, email OTP verify, login, JWT sessions
- **Email verification** — 4-digit OTP via [Mailtrap](https://mailtrap.io/) HTTP API (same approach as INT222)
- **Password security** — `bcryptjs` hashing
- **Shared resources** — Books, tools, skills, space — request & approve flow
- **Community projects** — Create projects, join requests, member management
- **Collaboration dashboard** — Incoming/outgoing requests, approve/reject
- **Admin panel** — Platform stats and user management
- **Cloud-ready** — Deploy frontend on Vercel, API on Render, DB on MongoDB Atlas

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| Email | Mailtrap Sending API (`fetch`) |

---

## Project Structure

```text
ekyam123/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── api/               # API client
│   │   ├── components/        # Navbar, Layout, ProtectedRoute
│   │   ├── context/           # AuthContext
│   │   └── pages/             # Home, Resources, Projects, Dashboard, Admin
│   ├── vercel.json
│   └── .env.example
├── server/                    # Express backend
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/auth.js
│   ├── models/                # User, Resource, Project, Collaboration
│   ├── routes/
│   ├── utils/email.js         # Mailtrap OTP
│   └── scripts/seedAdmin.js
├── render.yaml                # One-click API deploy on Render
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (local MongoDB also works)
- [Mailtrap](https://mailtrap.io/) account (optional for OTP; skip for local auto-verify)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/ekyam.git
cd ekyam
```

2. **Install dependencies**

```bash
cd server && npm install
cd ../client && npm install
```

3. **Environment variables**

Create `server/.env` (do **not** commit):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ekyam
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000

# Optional — enables real email OTP (production / demo)
MAILTRAP_TOKEN=your_mailtrap_sending_api_token
```

4. **Seed admin (optional)**

```bash
cd server
npm run seed
```

Admin: `admin@ekyam.com` / `admin123`

5. **Run locally**

Terminal 1 — API:

```bash
cd server
npm run dev
```

Terminal 2 — Frontend:

```bash
cd client
npm run dev
```

Open **http://localhost:3000**

> Without `MAILTRAP_TOKEN`, registration auto-verifies (OTP printed in server console for testing).

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register user; sends OTP if Mailtrap configured | No |
| `POST` | `/api/auth/verify-otp` | Verify OTP; returns JWT | No |
| `POST` | `/api/auth/login` | Login; returns JWT | No |
| `GET` | `/api/auth/me` | Current user profile | Yes |
| `GET` | `/api/resources` | List shared resources | No |
| `POST` | `/api/resources` | Create resource | Yes |
| `POST` | `/api/resources/:id/request` | Request a resource | Yes |
| `GET` | `/api/projects` | List community projects | No |
| `POST` | `/api/projects` | Create project | Yes |
| `POST` | `/api/projects/:id/join` | Request to join project | Yes |
| `GET` | `/api/collaborations/mine` | My collaboration requests | Yes |
| `PATCH` | `/api/collaborations/:id` | Approve / reject / complete | Yes |
| `GET` | `/api/admin/stats` | Admin dashboard stats | Admin |
| `GET` | `/api/admin/users` | List all users | Admin |

---

## Deployment (Vercel + Render + Atlas)

`

**Vercel env vars:** `VITE_API_URL` = `https://your-api.onrender.com/api`

After 

---

## Comparison with INT222 (Agri-Chain)

| Feature | INT222 Project | EKYAM |
|---------|----------------|-------|
| JWT + bcrypt | Yes | Yes |
| Email OTP (Mailtrap) | Yes | Yes |
| Role-based access | Yes | Yes (member + admin) |
| Live deployment | Vercel | Vercel + Render |
| Domain features | Farming auth | Resources + Projects + Collaborations |
| Admin panel | — | Yes |
| REST CRUD | Auth focus | Auth + Resources + Projects |

EKYAM matches the **technical bar** of the reference project and adds **more application features** for community collaboration.

---

## Subject Report Mapping

| Concept | Implementation |
|---------|----------------|
| REST API | Express routes for auth, resources, projects |
| MVC | Models, controllers, routes |
| Database | MongoDB schemas with references |
| Authentication | JWT middleware, OTP verification |
| Security | bcrypt password hashing |
| Deployment | Vercel, Render, MongoDB Atlas |

---

## License

MIT — Educational use.
