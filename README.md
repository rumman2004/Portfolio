
# Portfolio– Full Stack MERN Project

A modern **full‑stack portfolio web application** built using the **MERN stack** (MongoDB, Express, React, Node.js).  
It includes a **public portfolio website** and a **secure admin dashboard** to manage content dynamically.

---

## 🚀 Features

### 🌐 Public Website
- Home, About, Skills, Projects, Experience, Certificates, Contact pages
- Responsive modern UI
- Dark/Light theme support
- Contact form with backend integration

### 🔐 Admin Panel
- Secure authentication (Login)
- Dashboard overview
- Manage:
  - About section
  - Skills
  - Projects
  - Experiences
  - Certificates
  - Social links
  - Contacts (view messages)
- Profile management

### ⚙️ Backend API
- RESTful APIs
- JWT-based authentication
- Role-based authorization
- MongoDB Atlas support
- Cloudinary image uploads
- Environment-based configuration

---

## 🗂️ Project Structure

```
portfolio/
│
├── backend/
│   
│   ├── api/
│   │   └── index.js
│   │
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── about.controller.js
│   │   ├── auth.controller.js
│   │   ├── certificate.controller.js
│   │   ├── contact.controller.js
│   │   ├── experience.controller.js
│   │   ├── project.controller.js
│   │   ├── skill.controller.js
│   │   └── social.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── upload.middleware.js
│   │   └── validation.middleware.js
│   │
│   ├── models/
│   │   ├── About.model.js
│   │   ├── Admin.model.js
│   │   ├── Certificate.model.js
│   │   ├── Contact.model.js
│   │   ├── Experience.model.js
│   │   ├── Project.model.js
│   │   ├── Skill.model.js
│   │   └── Social.model.js
│   │
│   │── routes/
│   │   ├── about.routes.js
│   │   ├── auth.routes.js
│   │   ├── certificate.routes.js
│   │   ├── contact.routes.js
│   │   ├── experience.routes.js
│   │   ├── project.routes.js
│   │   ├── skill.routes.js
│   │   └── social.routes.js
│   │
│   │── services/
│   │   ├── email.service.js
│   │   └── cloudinary.service.js
│   │
│   │── utils/
│   │   ├── helpers.js
│   │   ├── seedAdmin.js
│   │   └── seedAbout.js
│   │
│   │── app.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│   └── vercel.json
├── frontend/
│   ├── public/
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── styles/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useFetch.js
│   │   │   └── useTheme.js
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── EditAbout.jsx
│   │   │   │   ├── ManageSkills.jsx
│   │   │   │   ├── ManageProjects.jsx
│   │   │   │   ├── ManageExperiences.jsx
│   │   │   │   ├── ManageCertificates.jsx
│   │   │   │   ├── ViewContacts.jsx
│   │   │   │   └── Profile.jsx
│   │   │   │
│   │   │   ├── public/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── About.jsx
│   │   │   │   ├── Projects.jsx
│   │   │   │   ├── Contact.jsx
│   │   │   │   ├── Work.jsx
│   │   │   │   └── NotFound.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── auth.service.js
│   │   │
│   │   ├── utils/
│   │   │   └── constants.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── README.md


```

---

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Context API
- Axios
- Modern CSS / UI components

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (Image uploads)

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Project Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/portfolio-2026.git
cd portfolio-2026
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Test Admin Seeder (Optional)
```bash
node utils/seedAdmin.js
```

---

## 🚀 Deployment
- Backend: Render / Railway / VPS
- Frontend: Vercel / Netlify
- Database: MongoDB Atlas

---

## 📌 Future Improvements
- Image optimization
- Role-based admin levels
- Analytics dashboard
- SEO enhancements

---

## 👤 Author
**Rumman Ahmed (Ryuu)**  
BCA Student | Full‑Stack Developer

---

## 📄 License
This project is licensed under the **MIT License**.
