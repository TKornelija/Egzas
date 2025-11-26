# Freak Or Treat --- Halloween Costume Rental E-shop

Full-stack project (React + Node.js + Express + MongoDB)

Freak Or Treat is a full-stack Halloween costume rental platform built
as part of the VCS Full-Stack course.\
The project allows users to browse costumes, rent them for selected
dates, manage reservations, and includes a complete admin panel for
managing costumes, FAQ content, users, and orders.

## 🚀 Tech Stack

### Frontend

-   React (Hooks)
-   React Router
-   Context API (Auth + I18n)
-   CSS (custom design system)
-   Responsive UI
-   Hero slider, product grid, filters

### Backend

-   Node.js\
-   Express\
-   MongoDB (Mongoose)\
-   REST API (GET/POST/PUT/DELETE)\
-   Authentication (JWT)\
-   Admin protected routes

### User Features

-   Browse costumes (grid layout)
-   Costume details page (sizes, description, gallery, availability)
-   Reservation system with date selection
-   Shopping cart preview
-   Checkout flow
-   User profile (reservation history)
-   Multi-language support (LT / EN / RU)

### Admin Features

-   Admin authentication
-   Admin panel with CRUD modules:
    -   Manage costumes (add/edit/delete)
    -   Reservation list + filtering
    -   Orders panel
    -   FAQ management
-   Dashboard UI with protected routes

## 🗂️ Project Structure

    /client
      /src
        /components
        /pages
        /context
        /hooks
        /assets
        /i18n
        App.jsx
        main.jsx

    /server
      /models
      /routes
      /controllers
      /middleware (auth, admin)
      server.js

## 🧪 API Endpoints (short version)

### Costumes

    GET     /api/costumes
    GET     /api/costumes/:id
    POST    /api/costumes        (admin)
    PUT     /api/costumes/:id    (admin)
    DELETE  /api/costumes/:id    (admin)

### Reservations

    POST    /api/reservations
    GET     /api/reservations

### Auth

    POST    /api/login
    POST    /api/register
    GET     /api/profile

### FAQ

    GET     /api/faq
    POST    /api/faq             (admin)
    PUT     /api/faq/:id         (admin)
    DELETE  /api/faq/:id         (admin)

## How to Run the Project

### 1️⃣ Clone the repository

``` sh
git clone https://github.com/TKornelija/Egzas
cd freakortreat
```

### 2️⃣ Install dependencies

Frontend:

``` sh
cd client
npm install
```

Backend:

``` sh
cd ../server
npm install
```

### 3️⃣ Create `.env` in /server:

    MONGODB_URI=mongodb+srv://TOF:egzaminas2025@prekes.qewruix.mongodb.net/
    JWT_SECRET=labai_slapta_reiksme
    JWT_EXPIRES=7d
    PORT=4000

### 4️⃣ Start the app

Backend:

``` sh
npm run dev
```

Frontend:

``` sh
npm run dev
```

Frontend runs on: **http://localhost:4000**\
Backend runs on: **http://localhost:3000**

##  Sprint Breakdown (VCS Course)

1.  Project setup & planning\
2.  Frontend base\
3.  Backend API\
4.  Reservation system\
5.  Authentication + Admin panel\
6.  Testing, UI polishing, README, project presentation

##  Final Result

-   Fully working multi-language e-shop\
-   Rental calendar & availability system\
-   Admin panel with full CRUD\
-   Clean UI with dark theme\
-   Functional REST API\
-   Authentication & authorization completed
