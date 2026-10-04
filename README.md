# ☁️🌻 Cloud-Based StudyVault: Notes & Resource Management System

A cloud-based web app where students can register, log in, and manage their study notes and resource links by subject. All data is stored in the cloud using Supabase, so it is available from any device.

🔗 **Live Demo:** [https://danyaramesh1647-lang.github.io/Cloud-Based-StudyVault/](https://danyaramesh1647-lang.github.io/Cloud-Based-StudyVault/)

## ✨ Features
- User registration and login (Supabase Authentication)
- Create, edit and delete notes
- Subject categories (DBMS, AI, Web, Cloud, General)
- Search notes by title or content
- Save and manage resource links
- Private data per user using Row Level Security (RLS)
- Cute, responsive sticky-note UI

## 🛠️ Technologies
| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Authentication | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| Hosting | GitHub Pages |
| Version control | Git and GitHub |

## ☁️ Cloud Architecture
```
User → HTML + CSS + JavaScript → Supabase JS Client
        → Supabase Authentication → Supabase Cloud Database (notes, resources)
```
There is no separate backend server. Supabase provides authentication, database and APIs.

## 🗄️ Database Schema
**notes:** id, user_id, title, content, subject, created_at
**resources:** id, user_id, title, url, subject, created_at

Row Level Security policies make sure each user can only read and modify their own rows.

## 📁 Project Structure
```
Cloud-Based-StudyVault/
├── index.html
├── login.html
├── register.html
├── css/style.css
├── js/
│   ├── supabase.js
│   ├── auth.js
│   └── app.js
└── README.md
```

## 🚀 Run Locally
1. Clone the repo
2. Create a Supabase project and run the SQL for the `notes` and `resources` tables with RLS
3. Add your Project URL and publishable key in `js/supabase.js`
4. Open `login.html` with VS Code Live Server

## 👩‍💻 Author
Danya