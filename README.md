# CommunityHub (New) — Team Assignments (GitHub Structure)

This folder matches the exact folder tree used in
[iyf-s11-week-12-team-TrevorWachira690](https://github.com/TrevorWachira690/iyf-s11-week-12-team-TrevorWachira690)
— `src/` and `backend/` sitting side by side at the repo root — but
every application code file is **empty**, with a comment at the top
telling you exactly which person owns it and what it should do.

This is meant to be pushed to GitHub as-is, so the folder structure is
correct from day one. Each team member then fills in their own files
directly in this repo.

## Team split

| Person | Role | Domain |
|---|---|---|
| **Trevor** | Backend | Accounts & Profiles |
| **Kaysir** | Backend | Posts, Comments & Likes |
| **Gilbert** | Backend | Messaging |
| **Christine** | Frontend | Accounts & Profiles |
| **Jacob** | Frontend | Posts, Comments & Likes |
| **Brian** | Frontend | Messaging |
| **Group Leader** | Shared | Wiring everything together (`App.jsx`, `Home.jsx`, `Navbar.jsx`, `Avatar.jsx`, `ProtectedRoute.jsx`, `main.jsx`, `api.js`, `imageUtils.js`, `index.css`, `server.js`, `app.js`, `db.js`, `api/index.js`) |

## How to fill in your files

1. Find the files with your name in the comment at the top (see the
   table above for which pages/routes/models are yours)
2. Each file's comment tells you what that file should do
3. Paste your working code below the comment line
4. Commit and push — since the folder structure already matches the
   final layout, no restructuring is needed later

## Config files left untouched

`package.json`, `backend/package.json`, `vite.config.js`,
`index.html`, `.gitignore`, and `.env.example` are already filled in
correctly and don't need anyone to "own" them — they're shared
project scaffolding, not a single person's feature work.

## Note on `.env`

`backend/.env` is not included and should never be committed — it's
already covered by `.gitignore`. Whoever runs the backend locally
needs to create their own using `.env.example` as a template, with
their own `MONGO_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN` values.
