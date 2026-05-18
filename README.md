# ⚡ Employee Analytics — AI Performance System

Full-stack MERN application for HR teams to track employee performance and generate AI-powered recommendations.

## 🗂 Project Structure

```
employee-analytics/
├── backend/                  # Node.js + Express API
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT middleware
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Employee.js       # Employee schema
│   │   └── User.js           # User schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── aiRoutes.js
│   ├── server.js
│   └── .env.example
└── frontend/                 # React + Vite
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── EmployeeListPage.jsx
    │   │   ├── AddEmployeePage.jsx
    │   │   ├── EmployeeDetailPage.jsx
    │   │   └── AIRecommendationsPage.jsx
    │   └── utils/api.js
    └── .env.example
```

## 🚀 Local Setup (VS Code)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free at mongodb.com)
- OpenRouter API key (free at openrouter.ai)

### Step 1 — Clone and open in VS Code
```bash
cd employee-analytics
code .
```

### Step 2 — Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see below)
npm run dev
```

Backend runs at: http://localhost:5000

### Step 3 — Setup Frontend (new terminal)
```bash
cd frontend
npm install
cp .env.example .env
# .env already has correct value for local dev
npm run dev
```

Frontend runs at: http://localhost:5173

---

## ⚙️ Environment Variables

### backend/.env
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/employee-analytics
JWT_SECRET=any_random_long_string_here
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxx
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=openai/gpt-3.5-turbo
FRONTEND_URL=http://localhost:5173
```

### frontend/.env
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/signup | Register user | ❌ |
| POST | /api/auth/login | Login | ❌ |
| GET | /api/auth/me | Get current user | ✅ |
| POST | /api/employees | Add employee | ✅ |
| GET | /api/employees | Get all employees | ✅ |
| GET | /api/employees/search | Search employees | ✅ |
| GET | /api/employees/rankings | Ranked list | ✅ |
| GET | /api/employees/:id | Get by ID | ✅ |
| PUT | /api/employees/:id | Update employee | ✅ |
| DELETE | /api/employees/:id | Delete employee | ✅ |
| POST | /api/ai/recommend | AI recommendation | ✅ |
| POST | /api/ai/rank-all | Team AI analysis | ✅ |
| POST | /api/ai/training-suggestions | Training plan | ✅ |

---

## 🌐 Deploy on Render

### Backend
1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add Environment Variables (same as .env but with production FRONTEND_URL)
5. Deploy → Copy the backend URL

### Frontend
1. Go to Render → New → Static Site
2. Connect same repo
3. Settings:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
5. Deploy

---

## 🔗 Getting API Keys

### OpenRouter (free)
1. Go to https://openrouter.ai
2. Sign up → API Keys → Create key
3. Free credits available on signup

### MongoDB Atlas (free)
1. Go to https://mongodb.com/atlas
2. Create free M0 cluster
3. Database Access → Add user
4. Network Access → Allow 0.0.0.0/0
5. Connect → Drivers → Copy connection string
