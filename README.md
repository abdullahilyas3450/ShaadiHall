# 🏛️ ShaadiHall.com

An AI-powered event hall booking marketplace where customers interact with a sophisticated AI agent to find, verify, and book the perfect venue for their special occasions.

![ShaadiHall Preview](https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green?style=for-the-badge&logo=fastapi)
![LangGraph](https://img.shields.io/badge/LangGraph-Agent-blue?style=for-the-badge)

## 💡 Overview

ShaadiHall simplifies the complex process of venue booking in Pakistan (starting with Lahore). Instead of browsing endless static lists, users can simply chat with our "Shaadi Agent" who understands natural language, filters halls based on real-time availability, budget, and capacity, and handles the booking process from start to finish.

## ✨ Key Features

### 👤 For Customers
- **AI Chat Agent**: Natural language conversation (English/Urdu/Hinglish) to find halls.
- **Real-time Availability**: The agent cross-references booking schedules before recommending.
- **Smart Filtering**: Filter by location (DHA, Gulberg, etc.), guest count, and budget.
- **Instant Booking**: Secure your date directly through the chat interface.
- **Booking History**: Track your current and past hall bookings.
- **Email Confirmations**: Automated receipts and booking details via SendGrid.

### 🛠️ For Admins
- **Dashboard**: Overview of total bookings, revenue, and active halls.
- **Hall Management**: Add, edit, or deactivate halls in the marketplace.
- **Live Booking Feed**: Real-time updates on new bookings via WebSockets.
- **Analytics**: Statistics on popular locations and event types.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 + Framer Motion (for animations)
- **Icons**: Lucide React
- **State Management**: Zustand (Auth & UI state)
- **Client**: Axios with Interceptors for JWT management

### Backend
- **Framework**: FastAPI (Python 3.12)
- **AI Engine**: LangGraph + LangChain (Stateful Agent)
- **LLM**: Claude 3.5 Sonnet (via Anthropic API)
- **Database**: Supabase (PostgreSQL)
- **ORM**: SQLAlchemy (Async)
- **Real-time**: WebSockets for admin live feeds
- **Auth**: JWT (Access + Refresh tokens) with BCrypt hashing

## 📁 Project Structure

```text
ShaadiHall/
├── frontend/                # Next.js Application
│   ├── src/
│   │   ├── app/            # App Router (Auth, Admin, User routes)
│   │   ├── components/     # UI Components (Admin, Chat, Halls)
│   │   ├── hooks/          # Custom React hooks (useChat, useAuth, etc.)
│   │   ├── lib/            # API client & Utility functions
│   │   └── store/          # Zustand stores
├── backend/                 # FastAPI Application
│   ├── app/
│   │   ├── agent/          # LangGraph Agent logic (Nodes, Tools, Graph)
│   │   ├── models/         # SQLAlchemy DB Models
│   │   ├── routers/        # API Endpoints (Auth, Halls, Bookings, Chat)
│   │   ├── services/       # Business logic layer
│   │   ├── schemas/        # Pydantic validation models
│   │   └── ws_manager.py   # WebSocket connection management
└── supabase/                # Migrations & Database seeds
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- Python 3.12+
- Supabase Account
- Anthropic API Key

### 2. Backend Setup
1. Navigate to backend: `cd backend`
2. Create virtual environment: `python -m venv venv`
3. Activate venv: `source venv/bin/activate` (Linux) or `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Configure `.env`:
   ```env
   DATABASE_URL=postgresql+asyncpg://...
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   JWT_SECRET_KEY=...
   ANTHROPIC_API_KEY=...
   ```
6. Run migrations (if applicable): `alembic upgrade head`
7. Start server: `uvicorn app.main:app --reload`

### 3. Frontend Setup
1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Configure `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Start development server: `npm run dev`

## 🤖 AI Agent Workflow

The "Shaadi Agent" uses **LangGraph** to maintain conversation state. It has access to several tools:
1. `search_available_halls`: Queries PostgreSQL with filters.
2. `check_hall_availability`: Specific date/hall validation.
3. `confirm_booking`: Securely writes booking record and triggers email.

The agent is designed to be proactive, asking for missing information (like guest count or date) if the user hasn't provided it.

## 📄 License
This project is for demonstration purposes. All rights reserved.