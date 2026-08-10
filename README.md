# CommunityHub — Collaborative Practice Project

**IYF Weekend Academy — Season 11**

> **This project is incomplete by design.**
> It is a practice repository where **7 group members** collaboratively
> build a full-stack small-business community platform. The work is
> split into 3 parts, each handled by a duo (2 people), plus 1 group
> leader who coordinates and integrates everything.
>
> **👉 Start by reading the guides in [`docs/`](docs/) — they tell you
> exactly what to build and where to put it.**

---

## What We Are Building

CommunityHub is a full-stack small-business community platform where:

- A **business** can register, log in, create listings, and manage their
  products
- A **customer** can browse listings, search/filter, view details, and
  leave comments
- Both can react to listings with **likes** and **dislikes**
- Business owners get a **dashboard** to manage their listings and
  export/import data
- The app supports **dark mode**, **responsive design**, and **SEO**

By the end, this should be a working marketplace web app with
authentication, listings, comments, reactions, and a business dashboard.

---

## The 3 Parts

| Part | Folder | What It Covers |
|---|---|---|
| **Part 1** — Accounts & Login | [`docs/part-1-accounts-and-login/`](docs/part-1-accounts-and-login/) | Registration, login, JWT auth, protected routes, header/footer, dark mode |
| **Part 2** — Listings Page | [`docs/part-2-listings-page/`](docs/part-2-listings-page/) | Create/read/update/delete listings, search, category filter, pagination |
| **Part 3** — Comments & Likes | [`docs/part-3-comments-and-likes/`](docs/part-3-comments-and-likes/) | Comments, like/dislike reactions, business dashboard, export/import |

Each part has **two files** inside — one for **Person A (Backend)** and
one for **Person B (Frontend)**.

---

## Team Structure (7 Members)

| Role | Members | Responsibility |
|---|---|---|
| **Group Leader** | 1 person | Reviews all work, resolves conflicts, ensures parts integrate, helps debug |
| **Part 1 Duo** | 2 people | Backend auth + Frontend login/register/profile |
| **Part 2 Duo** | 2 people | Backend listings API + Frontend listings pages |
| **Part 3 Duo** | 2 people | Backend comments/likes + Frontend interactions/dashboard |

**Total: 7 people**

---

## How to Contribute

### 1. Find Your Part

Open the [`docs/`](docs/) folder and navigate to the folder matching
your part:

- `docs/part-1-accounts-and-login/` → read `person-a-backend.md` or
  `person-b-frontend.md`
- `docs/part-2-listings-page/` → read `person-a-backend.md` or
  `person-b-frontend.md`
- `docs/part-3-comments-and-likes/` → read `person-a-backend.md` or
  `person-b-frontend.md`

### 2. Read Your Document Fully

**Do not skip sections.** Each guide walks you through:
- What you're building
- Which files to edit
- Step-by-step implementation
- How to test
- What your teammate needs from you

### 3. Work Only on Your Assigned Files

Check [`docs/TEAM_DIVISION.md`](docs/TEAM_DIVISION.md) to see which
files belong to your part. If you need to edit a **shared file** (like
`src/services/api.js` or `backend/models/Post.js`), **tell the other
team first**.

### 4. Follow the Teaching Method

Every doc uses the same teaching pattern:
1. **What You're Building** — the goal in plain language
2. **Files You Will Work In** — exact paths so there is no confusion
3. **Step-by-step breakdown** — one small piece at a time
4. **Code examples** — real code from this project you can learn from
5. **Your Task** — what to build and test

### 5. Coordinate With Your Duo

- Person A (Backend) and Person B (Frontend) must agree on the **API
  contract** before building
- Test together before declaring your part complete
- Use the checklist at the end of your document

### 6. Revisit the Docs

**The docs are your single source of truth.** If you're unsure:
- Re-read your part's document
- Check `PROJECT_OVERVIEW.md` for the full file tree
- Check `TEAM_DIVISION.md` for file ownership
- Ask the group leader if something is unclear

---

## Current Project State

This repository is **intentionally incomplete**. Here is what exists
and what needs to be built:

### Already Implemented (The Foundation)

| Feature | Status |
|---|---|
| React + Vite frontend setup | Done |
| Express + MongoDB backend | Done |
| JWT authentication with bcrypt | Done |
| User registration & login | Done |
| Role selection (business/customer) | Done |
| Protected routes (frontend + backend) | Done |
| User model with business fields | Done |
| Post model with images | Done |
| Basic CRUD for listings | Done |
| Search & category filtering | Done |
| Comments API | Done |
| Like/dislike API | Done |
| Dark mode toggle | Done |
| Responsive design with Tailwind | Done |
| WhatsApp contact button | Done |
| Image gallery navigation | Done |

### Incomplete — Needs Your Contribution

| Feature | Assigned To | Where to Start |
|---|---|---|
| Pagination on listings | Part 2 Backend | `docs/part-2-listings-page/person-a-backend.md` |
| Frontend search bar | Part 2 Frontend | `docs/part-2-listings-page/person-b-frontend.md` |
| Status badges | Part 2 Frontend | `docs/part-2-listings-page/person-b-frontend.md` |
| Empty states | Part 2 Frontend | `docs/part-2-listings-page/person-b-frontend.md` |
| Comments UI | Part 3 Frontend | `docs/part-3-comments-and-likes/person-b-frontend.md` |
| Like/dislike UI | Part 3 Frontend | `docs/part-3-comments-and-likes/person-b-frontend.md` |
| Business dashboard | Part 3 Frontend | `docs/part-3-comments-and-likes/person-b-frontend.md` |
| Export/import UI | Part 3 Frontend | `docs/part-3-comments-and-likes/person-b-frontend.md` |
| Shared UI components | Part 3 Frontend | `docs/part-3-comments-and-likes/person-b-frontend.md` |
| Password hashing exercise | Part 1 Backend | `docs/part-1-accounts-and-login/person-a-backend.md` |

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router, Tailwind CSS |
| **Backend** | Node.js, Express |
| **Database** | MongoDB (Mongoose) |
| **Auth** | JWT (JSON Web Tokens), bcrypt |
| **Real-time** | Not yet implemented |
| **Deployment** | Render (backend) + Vercel (frontend) |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Git

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd community-hub-practice

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Environment Setup

```bash
# Frontend (.env in root)
cp .env.example .env

# Backend (.env in backend/)
cp backend/.env.example backend/.env
# Edit backend/.env and add your MONGO_URI and JWT_SECRET
```

### Running the App

```bash
# Terminal 1 — Start backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Start frontend (port 5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Project Structure

```
community-hub-practice/
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
│   ├── PROJECT_OVERVIEW.md
│   ├── TEAM_DIVISION.md
│   ├── part-1-accounts-and-login/
│   ├── part-2-listings-page/
│   └── part-3-comments-and-likes/
├── package.json
├── vite.config.js
└── README.md
```

---

## Important Reminders

### For All Contributors

1. **Read your part's doc fully before writing code.**
2. **Do not edit files outside your part without asking.**
3. **If you touch a shared file, tell the other team first.**
4. **Test before merging.**
5. **Keep commits small and focused.**

### For Duos (Person A + Person B)

1. **Agree on the API contract together** — request/response shapes,
   field names, endpoints
2. **Write the contract down** — both of you will reference it
3. **Test together** — frontend + backend should work before moving on

### For the Group Leader

1. Review all PRs for breaking changes
2. Ensure shared-file changes are coordinated
3. Help resolve merge conflicts
4. Test the integrated app regularly
5. Keep the docs updated if something changes

---

## What the End Result Should Look Like

When all 7 members have completed their work, CommunityHub should be a
**fully functional marketplace web app** where:

1. **Users** can register as either a business or a customer
2. **Businesses** can create, edit, and delete product listings with
   images
3. **Customers** can browse listings, search by keyword, filter by
   category, and view paginated results
4. **Anyone** can view listing details, see the business info, and
   contact the business via WhatsApp
5. **Logged-in users** can leave comments on listings and like/dislike
   listings
6. **Business owners** have a dashboard to manage their listings and
   export/import their data
7. **Everyone** enjoys a responsive design that works on mobile,
   tablet, and desktop
8. **Dark mode** persists across page reloads
9. **SEO** meta tags are present on public pages
10. **The app is deployed** and accessible via a public URL

---

## Need Help?

1. **Re-read your part's document** in `docs/`
2. **Check `PROJECT_OVERVIEW.md`** for the full file tree
3. **Check `TEAM_DIVISION.md`** for file ownership
4. **Ask the group leader** if something is still unclear

---

**Remember: The docs in `docs/` are your map. Follow them, and you'll
build something real together.**
