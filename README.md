# 📚 Smart Attendance System  

A **full-stack attendance management system** where teachers and students can register/login, CRUD on classes, and mark/view attendance.  
Built using **MERN stack** with authentication, cookies-based JWT, and a clean frontend flow.  

---

## ⚡ Features  

### 👩‍🏫 Teacher Side
- Register/Login with authentication  
- View teachers dashboard  
- Create and manage classes (CRUD operation)  
- View attendance reports by selected date  

### 🎓 Student Side
- Register/Login with authentication  
- Access student dashboard  
- Check attendance records by classes  

### 📊 Attendance Management
- Teacher can mark attendance and view by date  
- Students can view their status by each class  
- Stored in MongoDB with date-based records  

---

## 🛠️ Tech Stack  

### Frontend  
- React (with React Router DOM)  
- Context API for global layout  
- Axios for API calls  
- TailwindCSS / Custom styling  

### Backend  
- Node.js + Express.js  
- MongoDB + Mongoose  
- JWT Authentication (stored in **HTTP-only cookies**)  
- CORS with credentials  
- Custom Error Handling  

---

## 📂 Project Structure  

```
├── frontend/           # React App
│   ├── pages/          # Teacher & Student Pages
│   ├── components/     # UI Components
│   ├── context/        # Layout & State
│   ├── api/            # Axios API calls
│   └── App.jsx         # Routes + Auth handling
│
├── backend/            # Express Server
│   ├── models/             # MongoDB Schemas
│   ├── middleware/     # Middleware for auth   
│   ├── routes/         # Teacher, Student, Class, Attendance APIs
│   ├── utils/          # Helpers (e.g., date formatter)
│   ├── errorHandler.js # Global error middleware
│   └── server.js       # Main entrypoint
│
└── README.md
```

---

## ⚙️ Setup & Installation  

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/coder-swarnadip/ChronoMark.git
cd ChronoMark
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside **backend/**:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run server:
```bash
npm run dev
```
Backend runs on: **http://localhost:5000**

---

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: **http://localhost:5173**

---

## 🔑 API Routes  

### Teacher Routes (`/api/teachers`)
- `POST /register` → Register teacher  
- `POST /login` → Teacher login  
- `GET /profile` → Get teacher profile  

### Student Routes (`/api/students`)
- `POST /studentRegister` → Register student  
- `POST /studentLogin` → Student login  
- `GET /profile` → Get student profile  

### Class Routes (`/api/classes`)
- `POST /` → Create class  
- `GET /:id` → Get class details  

### Attendance Routes (`/api/attendance`)
- `POST /` → Mark attendance  
- `GET /view` → View attendance records  

---

## 🚀 Future Enhancements  
- 📱 QR code-based attendance with ESP32-CAM integration  
- 📊 Analytics dashboard for attendance insights  
- 🔔 Notifications for absent students  

---

## 📜 License  
MIT License © 2025  
