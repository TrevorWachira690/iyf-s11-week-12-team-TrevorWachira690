# What is CommunityHub?

## In One Sentence

CommunityHub is a website where a business can post things they sell,
and other people can look at those posts, search for them, and leave
comments on them.

## The Two Kinds of Accounts

When someone signs up, they pick one of two options:

- **Business** — can post things for sale (a "listing")
- **Customer** — can look at listings, search, and comment

## What We Are Building

Look at your course's Week 8, 9, 10, and 11 documents. Everything we
build here matches those documents exactly — the folder names, the file
names, and the patterns used in the code all come from what your course
already taught. This project does not invent a new way of doing things;
it just puts what you learned in Weeks 8–11 all in one real app.

## The Tools We Are Using

- **React** — for the part people see and click on (the frontend)
- **Node.js and Express** — for the part that runs on a server and
  handles requests (the backend)
- **MongoDB** — the database, where everything gets saved
- **JWT (JSON Web Token)** — how the app remembers you're logged in
- **bcrypt** — how we scramble passwords so nobody can read them

## How the Work is Split

There are 3 parts to this project. Each part is handled by 2 people (a
duo). One more person — the group leader — does not build one specific
part. Instead, they look over everyone's work, help fix bugs, and make
sure all 3 parts fit together correctly.

- **Part 1 — Accounts and Login** → see the `part-1-accounts-and-login`
  folder
- **Part 2 — Listings Page** → see the `part-2-listings-page` folder
- **Part 3 — Comments and Likes** → see the `part-3-comments-and-likes`
  folder

Open your part's folder. Inside, there are two files — one for each
person in your duo. Read the one with your name-style task on it first.

## Where Your Code Actually Goes

This is very important. Every file mentioned in your part's folder has
an exact home inside the real project. Here is the full picture of
where everything lives:

```
community-hub/
├── backend/
│   ├── config/
│   │   └── index.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── usersController.js
│   │   ├── postsController.js
│   │   └── commentsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   └── health.js
│   ├── scripts/
│   │   └── hashingExercise.js
│   └── server.js
│
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── shared/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Input.jsx
│   │   ├── HeroSection.jsx
│   │   ├── SEO.jsx
│   │   ├── EmptyState.jsx
│   │   ├── PostCard.jsx
│   │   ├── SearchBar.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── ConfirmDialog.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useDarkMode.js
│   │   ├── useLocalStorage.js
│   │   ├── useFetch.js
│   │   ├── useForm.js
│   │   └── useToggle.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── Home.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── BusinessListings.jsx
│   │   ├── PostDetail.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
│
└── docs/
    ├── PROJECT_OVERVIEW.md          (this file)
    ├── TEAM_DIVISION.md
    ├── part-1-accounts-and-login/
    ├── part-2-listings-page/
    └── part-3-comments-and-likes/
```

Whenever your part's file tells you to open a file like
`backend/models/User.js`, that path is counted from the very top of the
project — the `community-hub/` folder shown above. If you're ever
unsure where something goes, come back to this tree and find it.

## Rules Everyone Should Follow

1. Read your part's file fully before writing any code.
2. If you need to change a file that another duo also uses (these are
   marked "shared" in `TEAM_DIVISION.md`), tell them first.
3. If something breaks and you don't know why, tell the group leader —
   that's what they're there for.
4. Test what you build before saying it's done. Click through it
   yourself first.
