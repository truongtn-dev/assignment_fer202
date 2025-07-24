# 🎓 Group 5 EdTech Learning Platform

A modern EdTech platform built with **React.js**, **Tailwind CSS**, and **JSON Server** for students to explore, enroll, and track learning progress. Admins can manage courses, users, reviews, and schedules via a secure dashboard.

---

## 🚀 Features

### 👩‍🎓 For Students

- Responsive landing page with scroll navigation  
- Browse all available courses  
- View course details with overview, curriculum, testimonials, and pricing  
- Enroll in courses and track progress (My Courses)  
- Submit reviews and star ratings  
- Modal form booking for trial/counselor  

### 🛠️ For Admins

- Dashboard overview  
- Manage courses (add/edit/delete)  
- Manage users (filter, paginate, driver license upgrade)  
- Manage ratings and reviews  
- Calendar view of course schedules  
- Route protection for admin-only pages  

---

## 🧱 Tech Stack

| Technology         | Usage                                |
|--------------------|----------------------------------------|
| React.js           | Frontend framework                     |
| TailwindCSS        | Styling and layout                     |
| React Router DOM   | Routing pages (public/admin)           |
| Lucide-react       | Icon set for UI                        |
| React Toastify     | Notification system (success/error)    |
| React Icons        | Icons for extra decoration             |
| React FullCalendar | Calendar view for admin                |
| SweetAlert2        | Beautiful modals (confirm alerts)      |
| React Datepicker   | Date filter in statistics              |
| JSON Server        | Mock backend API with `db.json`        |

---

## 📁 Project Structure

- `src/`
  - `components/`
    - Navbar.jsx, Footer.jsx, HeroSection.jsx, Curriculum.jsx, etc.
    - SubjectsGrid.jsx, SubjectDetail.jsx, ModalForm.jsx, MyCourses.jsx
    - `Admin/`
      - AdminDashboard.jsx, AdminUsers.jsx, AdminSubjects.jsx
      - AdminCalendar.jsx, AdminRatings.jsx, AdminReviews.jsx
  - `App.js`
  - `index.js`
- `public/`
  - logo.png, favicon, background images

---

## ⚙️ Getting Started

### 1. Clone Project

```bash
git clone https://github.com/your-username/edtech-group5.git
cd edtech-group5
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start React Frontend

```bash
npm start
```

➡️ App available at: [http://localhost:3000](http://localhost:3000)

---

## 🗃️ Start JSON Server (Mock API)

### Install JSON Server globally

```bash
npm install -g json-server
```

### Start the server

```bash
json-server --watch db.json --port 5000
```

➡️ API available at: [http://localhost:5000](http://localhost:5000)

---

## 🔐 Admin Login (Sample)

```json
{
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

### Admin-only routes:

- `/admin/dashboard`
- `/admin/subjects`
- `/admin/users`
- `/admin/reviews`
- `/admin/calendar`
- `/admin/ratings`

---

## 🖥️ Splash Screen

- Animated splash screen with SVG icon bounce  
- Gradient glow + smooth text fade-in  
- Auto dismiss after 3 seconds on load  

---

## 📊 Admin Dashboard Includes

- Manage Subjects (add/edit/remove)  
- Manage Users (filter, paginate, license upgrades)  
- Manage Ratings & Reviews  
- Calendar View of course schedules  
- Course statistics and summaries (optional extensions)

---

## 📦 Deployment

### ✅ Deploy with Vercel (Recommended)

1. Push project to GitHub  
2. Visit [https://vercel.com](https://vercel.com)  
3. Import your GitHub repository  
4. Set:
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`  
5. Deploy and go live 🎉

---

## 📌 To-Do / Future Improvements

- ✅ Custom splash intro with animation  
- 🔒 JWT Authentication (replace `localStorage`)  
- 📦 Replace JSON Server with Node.js/Express backend  
- 💳 Stripe payment gateway integration  
- 🔔 In-app notification and messaging system  
- 🎓 Personalized learning paths & recommendations  
- 📈 Dashboard analytics (e.g., Recharts, Chart.js)

---

## 👨‍💻 Credits

Developed by **Group 5 – Advanced Web Development (2025)**

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.
