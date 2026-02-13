# TaskFlow - REST API & Frontend Application
**Backend Developer Intern Project Assignment**

A full-stack task management application featuring a secure, scalable Node.js REST API and a responsive React.js frontend. Built to demonstrate proficiency in API design, role-based access control, database management, and robust security practices.

## 🚀 Live Links

* **Frontend Application:** [https://backend-intern-project.vercel.app/](https://backend-intern-project.vercel.app/)
* **Backend API Base URL:** [https://backend-intern-project-rqvu.onrender.com/api/v1](https://backend-intern-project-rqvu.onrender.com/api/v1)
* **Interactive API Docs (Swagger):** [https://backend-intern-project-rqvu.onrender.com/api-docs](https://backend-intern-project-rqvu.onrender.com/api-docs)

---

## 📋 Project Overview
This project fulfills all requirements of the Backend Developer Intern assignment. The primary focus is a highly secure, modular backend architecture, supported by a clean, functional frontend to demonstrate the API's capabilities.

### ✨ Core Features Implemented
* **Authentication & Authorization:** Secure user registration and login using `bcryptjs` for password hashing and `jsonwebtoken` (JWT) for stateless authentication.
* **Role-Based Access Control (RBAC):** Distinct `user` and `admin` roles enforcing strict data isolation (users can only access/modify their own tasks).
* **CRUD Operations:** Complete RESTful actions for a secondary entity (Tasks) with pagination built into the `GET` endpoints.
* **API Versioning:** Routes are prefixed with `/api/v1/` for future-proofing.
* **Global Error Handling:** Centralized async error catching and validation error mapping.
* **Strict Validation:** Payload validation using `Zod` prior to database interaction.
* **Interactive Documentation:** Fully integrated Swagger UI for live API testing.

---

## 🌟 Advanced Features Implemented (Optional Criteria)
* **Docker Orchestration:** Full `docker-compose` setup spinning up Frontend, Backend, MongoDB, and Redis containers. Run via `docker-compose up`.
* **Redis Caching:** Integrated `redis` on the `GET /tasks` endpoint to serve frequent queries instantly from memory.
* **Persistent Logging:** Replaced console logs with `winston`, routing errors to `logs/error.log` for production-grade auditability.

---

## 🛠️ Technology Stack

**Backend (Primary Focus)**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Atlas) & Mongoose ODM
* **Security:** Helmet, Express Rate Limit, CORS, bcryptjs, JWT
* **Validation:** Zod
* **Documentation:** Swagger UI Express / Swagger JSDoc

**Frontend (Supportive UI)**
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS v4
* **Routing:** React Router DOM
* **HTTP Client:** Axios (with automated JWT interceptors)

---

## 🔒 Security & Optimization Practices
* **IDOR Prevention:** Backend strictly validates that the `req.user._id` matches the document owner before allowing updates or deletions.
* **Privilege Escalation Prevention:** Hardcoded role assignment on public registration routes.
* **NoSQL Injection Protection:** Enforced schema types via Mongoose and strict request body parsing via Zod.
* **Rate Limiting:** Global rate limiter applied to all `/api` routes to prevent DDoS and brute-force attacks.
* **HTTP Headers:** Secured using `helmet` to mitigate XSS and clickjacking.

---

## ⚙️ Local Installation & Setup

### Prerequisites
* Node.js (v18+)
* MongoDB (Local instance or Atlas URI)

### 1. Clone the repository
```bash
git clone [https://github.com/](https://github.com/)<your-username>/backend-intern-project.git
cd backend-intern-project

```

### 2. Backend Setup

```bash
cd backend
npm install

```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:5000/api/v1

```

Start the backend server:

```bash
npm run dev

```

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install

```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api/v1

```

Start the frontend server:

```bash
npm run dev

```

---

## 📈 Scalability & Future-Proofing Note

While this application is currently designed as a monolithic MVC architecture for rapid development and deployment, the codebase is fundamentally structured to scale horizontally:

1. **Microservices Readiness:** The modular route and controller structure (`auth.controller` vs `task.controller`) allows for easy decoupling. The Authentication module can be easily extracted into a standalone Identity Service.
2. **Database Sharding:** MongoDB (NoSQL) was chosen specifically to allow for horizontal sharding as the User and Task datasets grow independently.
3. **Caching Layer:** As read traffic increases, a **Redis caching layer** should be introduced specifically for the `GET /tasks` endpoint. User-specific queries can be cached with a TTL and invalidated upon new `POST/PUT` requests.
4. **Load Balancing:** The backend is completely stateless (JWTs instead of session cookies). It is deployment-ready for containerization via **Docker** and can be deployed across multiple instances behind a Load Balancer (like AWS ALB or NGINX).

---

*Designed and developed for PrimeTrade.ai Internship Evaluation.*