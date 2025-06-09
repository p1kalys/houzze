# 🏡 Houzze – Full-Stack Property Listing Web App

Houzze is a responsive full-stack web application designed to simplify the process of discovering, listing, and managing rental and sale properties. Built with a focus on clean design, secure authentication, and user experience, Houzze allows users to explore properties with ease, access Google Maps locations, and manage listings efficiently.

## 🚀 Live Demo
[Visit Houzze](https://houzze.vercel.app/)

---

## 🔍 Problem Statement

Flat Hunters/Students needed a user-friendly platform to explore listings by category, location, and price, while owners required a secure system to post, manage, and remove listings. Existing platforms were often cluttered or lacked personalization and reliability.

---

## ✅ Key Features

- 🔐 **Authentication** using JWT for Sign Up, Login, Logout
- 🧭 **Google Maps integration** for better location context
- 🎯 **Filterable search** by location, price, type, etc.
- 📦 **Automated listing cleanup** to remove outdated listings
- 📱 **Responsive design** with Tailwind CSS and Material UI
- 🌐 **RESTful API** architecture for frontend-backend separation

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Material UI

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Tokens)

**Tools:**
- Git & GitHub
- Postman
- Vercel (Deployment)
- Render 
---

## 📈 Results

- Attracted over **300 active users** in the first **2 months**
- Increased listing credibility through **automated cleanup**
- Enhanced UX with smooth onboarding and fast search experience

---

## 📂 Setup Instructions

```bash
# Clone the repo
git clone https://github.com/p1kalys/houzze.git

# Navigate into frontend and install dependencies
cd client
npm install

# Navigate into backend and install dependencies
cd ../server
npm install

# Create a .env file in the server with the following keys:
# MONGO_URI=
# JWT_SECRET=

# Run the backend
npm run dev

# In another terminal, run the frontend
cd ../client
npm start
