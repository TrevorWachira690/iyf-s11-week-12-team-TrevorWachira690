# CommunityHub

CommunityHub is a full-stack social platform built by a team of students, where members can create posts, comment, and message each other directly. It features JWT-based authentication, user profiles, a post feed, and one-to-one messaging.

## Live Demo

- Frontend: https://iyf-s11-week-12-team-trevor-wachira-tau.vercel.app
- API: https://community-hub-api-nxqa.onrender.com/api

## Features

- User registration and authentication
- User profiles, with the ability to edit your own profile
- Create and browse posts
- Direct messaging between users
- Responsive design

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/TrevorWachira690/iyf-s11-week-12-team-TrevorWachira690.git
   cd iyf-s11-week-12-team-TrevorWachira690
   ```

2. Install backend dependencies

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies

   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables

   ```bash
   # backend/.env
   cp .env.example .env
   # Edit with your values (MONGO_URI, JWT_SECRET, CLIENT_ORIGIN)
   ```

5. Run development servers

   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

Open `http://localhost:5173` in your browser.

## Project Structure

```
iyf-s11-week-12-team-TrevorWachira690/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       └── context/
├── README.md
└── CONTRIBUTORS.md
```

## License

MIT
