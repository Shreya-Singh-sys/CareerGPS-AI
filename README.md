# 🎯 CareerGPS-AI - Full Stack Application

## ✨ Key Features

* **User Authentication:** Secure JWT-based auth with bcrypt password hashing.
* **Skills Management:** Track current skills, measure proficiency (0-100), and manage certifications.
* **Job Portal:** Search listings, filter roles, and view AI-driven skill-match scores.
* **Career Paths:** Build personalized progression routes, set milestones, and track target roles.
* **Learning Resources:** Curated tutorials and courses aggregated from multiple platforms.

---

## 🏗️ Tech Stack

* **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion, Vite
* **Backend:** Flask, Python, SQLAlchemy ORM
* **Database:** SQLite (Development) / PostgreSQL (Production)

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Activate Virtual Environment
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

pip install -r requirements.txt
python init_db.py
python app.py
```
### 1. Frontend Setup

```bash
cd frontend
npm install
echo 'VITE_API_BASE_URL=http://localhost:5000/api' > .env.local
npm run dev
```
###🔌 API Overview (20 Endpoints)

* **/api/auth/** - Register, login, logout, and user session management (4 endpoints)

* **/api/profile/** - User profile fetching and updates (3 endpoints)

* **/api/skills/** - Skill catalogs and user proficiency tracking (4 endpoints)

* **/api/jobs/** - Job listings, search filters, and match-scoring (4 endpoints)

* **/api/career/** - Progression paths and learning resource aggregation (5 endpoints)

### 📁 Directory Structure

```
CareerGPS-AI/
├── frontend/             # React + TypeScript client
├── backend/              # Flask REST API & Models
└── README.md             # Project documentation
```
