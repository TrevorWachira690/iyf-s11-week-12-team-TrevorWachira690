# The Board — Student Community Hub

A community hub where registered students can create posts, read posts, and
comment on them. Auth uses JWT; data is stored in MongoDB.

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt — deploys to **Vercel**
- **Frontend:** React (Vite), React Router, responsive CSS — deploys to **Render**

## Project structure

```
community-hub/
├── backend/
│   ├── app.js              # Express app (routes, middleware) - no app.listen() here
│   ├── server.js            # Local dev only: imports app.js and calls app.listen()
│   ├── api/index.js         # Vercel serverless entry point: imports app.js
│   ├── vercel.json          # Routes all requests to api/index.js
│   ├── config/db.js         # MongoDB connection (reused across warm serverless calls)
│   ├── models/               # User, Post, Comment (Mongoose schemas)
│   ├── middleware/auth.js   # JWT verification middleware
│   ├── routes/                # auth.js, posts.js, comments.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── main.jsx, App.jsx
    │   ├── api.js              # fetch wrapper (reads VITE_API_BASE)
    │   ├── context/AuthContext.jsx
    │   ├── components/Navbar.jsx, ProtectedRoute.jsx
    │   ├── pages/Home, Login, Register, Posts, PostDetail
    │   └── styles/index.css     # responsive, mobile-first
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .env.example
```

## 1. MongoDB

Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier is fine) so
your deployed backend on Vercel can reach it — a local MongoDB won't be
reachable from Vercel's servers. Create a cluster, a database user, allow
network access from anywhere (`0.0.0.0/0`, since Vercel's IPs aren't static),
and copy the connection string.

## 2. Backend — local dev

```bash
cd backend
npm install
cp .env.example .env
# edit .env: MONGO_URI (Atlas string), a random JWT_SECRET, CLIENT_ORIGIN
npm run dev     # http://localhost:5000  (needs "dev": "nodemon server.js" — see package.json)
```

Add this script to `backend/package.json` if you don't already have it:
```json
"scripts": { "dev": "nodemon server.js", "start": "node server.js" }
```

Check `http://localhost:5000/api/health` → `{"status":"ok"}`.

## 3. Backend — deploy to Vercel

Vercel runs Node servers as serverless functions, so instead of a long-running
`app.listen()`, requests are routed into `api/index.js`, which exports the
same Express `app` from `app.js`. `vercel.json` sends every request there.

1. Push the `backend/` folder to a Git repo (or push the whole project and set
   Vercel's **Root Directory** to `backend`).
2. On [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Set **Root Directory** to `backend`.
4. Add Environment Variables (Project Settings → Environment Variables):
   - `MONGO_URI` — your Atlas connection string
   - `JWT_SECRET` — a long random string
   - `JWT_EXPIRES_IN` — e.g. `7d`
   - `CLIENT_ORIGIN` — your Render frontend URL (add this after step 4 below,
     then redeploy)
5. Deploy. Your API will be live at `https://<your-project>.vercel.app/api/...`

## 4. Frontend — local dev

```bash
cd frontend
npm install
cp .env.example .env
# edit .env: VITE_API_BASE=http://localhost:5000/api
npm run dev     # http://localhost:5173
```

## 5. Frontend — deploy to Render

1. Push `frontend/` to Git (or set Render's root directory to `frontend`).
2. On [render.com](https://render.com) → **New** → **Static Site**.
3. Connect the repo, set:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add an Environment Variable: `VITE_API_BASE` = `https://<your-project>.vercel.app/api`
5. Because this is a single-page app using React Router, add a rewrite rule
   so client-side routes (like `/posts/123`) don't 404 on refresh:
   Render → your site → **Redirects/Rewrites** → add
   `Source: /*` → `Destination: /index.html` → **Rewrite**.
6. Deploy. Then go back to Vercel and set `CLIENT_ORIGIN` to this Render URL,
   and redeploy the backend so CORS allows it.

## How auth works

1. `POST /api/auth/register` / `POST /api/auth/login` return a JWT.
2. React's `AuthContext` (`src/context/AuthContext.jsx`) stores the token and
   user in state + `localStorage`.
3. `src/api.js`'s `apiFetch()` attaches `Authorization: Bearer <token>` when a
   `token` is passed in.
4. The backend's `middleware/auth.js` verifies the token on protected routes
   and attaches the user's id to `req.user`.
5. Posts/comments store an `author` reference, so only the author can
   edit/delete their own posts or comments — enforced server-side, not just
   hidden in the UI.

## API reference

| Method | Route | Auth? | Description |
|---|---|---|---|
| POST | `/api/auth/register` | no | Create an account |
| POST | `/api/auth/login` | no | Log in, get a token |
| GET | `/api/posts` | optional | List all posts (with `likedByMe` if logged in) |
| GET | `/api/posts/:id` | optional | Get one post |
| POST | `/api/posts` | yes | Create a post (`title`, `content`, optional base64 `image`) |
| PUT | `/api/posts/:id` | yes (author only) | Edit a post |
| DELETE | `/api/posts/:id` | yes (author only) | Delete a post |
| POST | `/api/posts/:id/like` | yes | Toggle like/unlike |
| GET | `/api/posts/:postId/comments` | no | List comments on a post |
| POST | `/api/posts/:postId/comments` | yes | Add a comment |
| DELETE | `/api/posts/:postId/comments/:commentId` | yes (author only) | Delete a comment |
| GET | `/api/users` | yes | List other users (for starting a DM) |
| GET | `/api/users/:id` | no | Public profile + that user's posts |
| PUT | `/api/users/me` | yes | Update your own name/bio/avatar |
| GET | `/api/messages/conversations` | yes | Your conversation list (last message, unread count) |
| GET | `/api/messages/:userId` | yes | Full thread with one user (marks their messages read) |
| POST | `/api/messages/:userId` | yes | Send a message to a user |

### Images

Post photos and avatars are uploaded as base64 and stored directly as string
fields on the `Post`/`User` documents in MongoDB — no separate file storage
or CDN. The frontend (`src/imageUtils.js`) resizes images to a max dimension
and compresses them to JPEG before upload to keep documents small. This is
the simplest option for a class project; if the app grows, moving image
storage to something like Cloudinary or S3 and storing just a URL is the
standard next step (MongoDB documents are capped at 16MB, and large base64
blobs bloat every query that touches them).

### Messaging

Direct messages use polling, not WebSockets — the open conversation re-fetches
every 4 seconds (`frontend/src/pages/Conversation.jsx`). This keeps things
simple and works fine on Vercel's serverless functions, which can't hold a
persistent WebSocket connection open. It's not instant like a "typing…"
real-time chat, but new messages show up within a few seconds.

## Responsive design notes

- Mobile-first CSS (`frontend/src/styles/index.css`): base styles target small
  screens, `@media (min-width: ...)` widens spacing/type for tablet+/desktop.
- The nav collapses into a hamburger menu below 600px (`Navbar.jsx` +
  `.nav-toggle` / `.site-nav.open` in the CSS).
- Inputs use `font-size: 1rem` (16px) to avoid iOS Safari auto-zooming on
  focus.
- Test responsiveness with your browser's device toolbar (Chrome DevTools →
  toggle device toolbar) at common widths: 360px (phone), 768px (tablet),
  1200px (desktop).

## Suggested way to split the work across 6 people

1. **Backend — auth:** `models/User.js`, `routes/auth.js`, `middleware/auth.js`
2. **Backend — posts/comments:** `models/Post.js`, `models/Comment.js`, `routes/posts.js`, `routes/comments.js`
3. **Backend — deployment:** Vercel config, Atlas setup, env vars, CORS
4. **Frontend — auth pages:** `Login.jsx`, `Register.jsx`, `AuthContext.jsx`
5. **Frontend — posts feed & detail:** `Posts.jsx`, `PostDetail.jsx`, `Navbar.jsx`
6. **Frontend — responsive styling + deployment + QA:** `index.css` polish,
   Render setup, full register → post → comment flow testing, demo prep

## Notes for your report / presentation

- Passwords are hashed with bcrypt before being saved — never stored plain text.
- JWTs expire after 7 days by default (`JWT_EXPIRES_IN`).
- MongoDB connections are cached across warm Vercel invocations (`config/db.js`)
  to avoid reconnecting on every request, which is a common serverless pitfall.
- Before going further than a class project: add pagination on the posts
  list, email verification, refresh tokens, and image uploads.
