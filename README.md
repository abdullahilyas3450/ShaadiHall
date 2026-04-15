# 🏛️ ShaadiHall.com

An AI-powered event hall booking marketplace where customers chat with a smart bot to find and book the perfect hall for their event.

## 💡 What It Does
- Customer describes their needs (city, guests, event type, budget)
- AI chatbot matches and recommends the best halls
- Customer books directly through the chat
- Confirmation email sent automatically

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js + Tailwind CSS |
| Backend | Python + FastAPI |
| AI | LangChain + LangGraph + Claude API |
| Database | CSV (MVP) → Supabase (PostgreSQL) |
| Email | SendGrid |
| Deployment | Vercel (frontend) + Render (backend) |

## 📁 Folder Structure


ShaadiHall/
├── frontend/         → Next.js app
├── backend/
│   └── app/
│       ├── agent/    → LangGraph chatbot logic
│       ├── chains/   → LangChain chains
│       ├── api/      → FastAPI routes
│       └── data/     → CSV dummy data
├── docs/             → Planning & API specs
└── README.md


## 🗺️ Build Phases

| Phase | Goal |
|-------|------|
| 1 | GitHub setup + folder structure ✅ |
| 2 | CSV dummy hall data |
| 3 | LangChain + LangGraph AI engine |
| 4 | FastAPI wrapper |
| 5 | Test via Postman |
| 6 | Next.js frontend + Chatbot UI |
| 7 | Connect frontend ↔ FastAPI |
| 8 | CSV → Supabase migration |
| 9 | SendGrid email confirmation |

## 🚀 Getting Started
Coming soon as each phase is completed.