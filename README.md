<div align="center">

# 🚀 Anvarjon Khojimatov — Developer Portfolio & Platform

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Django](https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![Telegram](https://img.shields.io/badge/Telegram-Notifier-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/khojimatov)
[![Status](https://img.shields.io/badge/Live-khojimatov.uz-success?style=for-the-badge&logo=google-chrome&logoColor=white)](https://khojimatov.uz)

An advanced, modern, production-grade personal portfolio and engineering blog platform built with Python, Django, Docker, and cutting-edge UI aesthetics.

[🌐 View Live Site](https://khojimatov.uz) • [📧 Contact Me](mailto:khojimatov14@gmail.com) • [💬 Telegram](https://t.me/khojimatov)

</div>

---

## 🌟 Overview

This repository contains the complete source code for **[khojimatov.uz](https://khojimatov.uz)** — a full-featured personal developer portfolio and engineering blog platform. Built with a focus on reliability, architecture, performance, security, and elegant UI/UX design.

### Key Features
- **⚡ Custom Project Ordering:** Real-world projects with admin-configurable display order (`order` field) for complete positioning control on the home page.
- **📝 Technical Engineering Blog:** Full Markdown-supported article publishing with custom slugs, categories, and tags.
- **📩 Real-time Telegram Notifications:** Instant notification delivery to Telegram whenever a visitor submits a message through the contact form.
- **🌐 Multi-Language i18n:** Full support for Uzbek (UZ), English (EN), and Russian (RU).
- **📊 Visitor Analytics Middleware:** Automatic tracking of IP address, Country, City, Referrer, and User Agent logs.
- **🎨 Glassmorphic Dark UI:** Modern responsive design with micro-animations, theme toggling, and interactive project cards.
- **🐳 Production Ready Containerization:** Dockerized setup optimized for 1-click CI/CD deployment with Dokploy.

---

## 🛠 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Language** | Python 3.12 | Modern Python runtime |
| **Framework** | Django 6.0 | Web framework & Admin panel |
| **WSGI Server** | Gunicorn | Production HTTP server |
| **Static Files** | WhiteNoise | Efficient static asset compression & serving |
| **Database** | SQLite3 / PostgreSQL | Relational database storage |
| **Notifications** | Telegram Bot API | Real-time lead notifications |
| **Frontend** | HTML5, Vanilla CSS, JS | Glassmorphic responsive UI design |
| **DevOps** | Docker, Dokploy | Production containerization & deployment |

---

## 📂 Project Architecture

```
Portfolio/
├── config/                 # Django core configuration package
│   ├── settings.py         # App settings & environment resolution
│   ├── urls.py             # Global URL routing
│   └── wsgi.py             # WSGI application entry point
├── portfolio/              # Main portfolio application
│   ├── models.py           # Database models (Project, Skill, BlogPost, VisitorLog)
│   ├── views.py            # Business logic & AJAX contact handler
│   ├── admin.py            # Custom Django Admin panel interfaces
│   ├── telegram_notifier.py # Telegram notification integration
│   ├── middleware.py       # Visitor analytics middleware
│   ├── templates/          # Jinja/Django HTML templates
│   └── static/             # CSS, JS, Locales (uz, en, ru)
├── Dockerfile              # Production Docker build configuration
├── docker-compose.yml      # Local dev & stack orchestration
├── requirements.txt        # Python dependency specifications
└── manage.py               # Django management CLI tool
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Khojimatov14/Portfolio.git
cd Portfolio
```

### 2. Set up virtual environment
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Environment Variables setup
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Fill in your configuration:
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### 4. Run Migrations & Start Server
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
Open `http://127.0.0.1:8000/` in your browser.

---

## 🐳 Production Deployment (Dokploy & Docker)

### Deploying on VPS with Dokploy:
1. Connect your GitHub repository to **Dokploy**.
2. Set Environment Variables in Dokploy (`SECRET_KEY`, `ALLOWED_HOSTS`, etc.).
3. Add a **Bind Mount Volume** for persistent SQLite storage:
   - **Host Path:** `/home/admin/volumes/portfolio/db.sqlite3`
   - **Container Path:** `/app/db.sqlite3`
4. Click **Deploy**. Dokploy automatically builds the Docker image and executes migrations on startup.

---

## 👨‍💻 Author

**Anvarjon Khojimatov** — Python Backend Engineer & System Integrator

- **Website:** [khojimatov.uz](https://khojimatov.uz)
- **GitHub:** [@Khojimatov14](https://github.com/Khojimatov14)
- **LinkedIn:** [Anvarjon Khojimatov](https://www.linkedin.com/in/anvarjon-khojimatov-395b00218/)
- **Telegram:** [@khojimatov14](https://t.me/khojimatov14)

---

<div align="center">
⭐ Star this repository if you find it helpful!
</div>
