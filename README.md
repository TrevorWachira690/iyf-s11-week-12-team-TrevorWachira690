# CommunityHub

CommunityHub is a full-stack small-business marketplace platform built by a 7-person team using React, Express, and MongoDB. It enables businesses to manage listings with images while customers browse, search, filter, and engage through comments and reactions. The app also includes a business dashboard, JWT authentication, dark mode, and a responsive design.

## Live Demo

- Frontend: https://iyf-s11-week-12-team-trevorwachira690.onrender.com/
- API: https://iyf-s11-week-12-team-trevorwachira690.onrender.com/api

## Features

- User registration and authentication
- Create, edit, delete listings (with images)
- Search and filter listings by category
- Comment on listings
- Like and dislike reactions on listings
- Business dashboard with export/import
- Dark mode
- Responsive design

## Tech Stack

- **Frontend:** React, Vite, React Router, Tailwind CSS
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
   git clone https://github.com/TrevorWachira690/community-hub.git
   cd community-hub
   ```

2. Install backend dependencies

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies

   ```bash
   cd ..
   npm install
   ```

4. Set up environment variables

   ```bash
   # backend/.env
   cp backend/.env.example backend/.env
   # Edit with your values

   # frontend (.env in root)
   cp .env.example .env
   ```

5. Run development servers

   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

Open `http://localhost:5173` in your browser.

## Project Structure

```
community-hub/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── server.js
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── docs/
├── public/
├── package.json
├── vite.config.js
└── README.md
```

## License

MIT
