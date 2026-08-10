# Who Does What

## The Team

- **6 people build the app**, in 3 duos (2 people each)
- **1 person is the group leader**. They don't build one fixed part.
  Instead, they check everyone's work, help fix bugs, and make sure the
  3 parts connect properly.

## The 3 Parts

| Part | What it covers | Folder |
|---|---|---|
| Part 1 | Signing up, logging in, your profile, the header/footer that's on every page | `part-1-accounts-and-login/` |
| Part 2 | Looking at listings, searching, sorting by category | `part-2-listings-page/` |
| Part 3 | Commenting, liking/disliking, the business owner's dashboard, saving your data | `part-3-comments-and-likes/` |

Each folder has two files inside — one for each person in that duo.

## Files Shared Between Parts

A few files are touched by more than one part. If you need to change
one of these, tell the other part's duo first, so you don't undo each
other's work by accident.

| File | Who mainly uses it |
|---|---|
| `src/services/api.js` | Everyone — this is how the frontend talks to the backend |
| `src/App.jsx` | Everyone — this decides which page shows for which web address |
| `backend/routes/posts.js` | Part 2 owns most of it; Part 3 owns the like/dislike lines inside it |
| `backend/models/Post.js` | Part 2 owns most of it; Part 3 owns the like/dislike lines inside it |
| `backend/controllers/postsController.js` | Part 2 owns most of it; Part 3 owns the like/dislike functions inside it |
| `backend/controllers/usersController.js` | Part 1 owns most of it; Part 3 owns the export/import functions inside it |

## A Few Files Aren't Used Yet

Some files already exist in the project but nothing currently uses
them. This isn't a mistake — think of them as spare parts someone
prepared earlier. Part 3's duo is in charge of deciding what to do with
them (use them somewhere, or leave them alone) — see their files for
the list.

## Simple Rule for Everyone

Work only inside the files your part's document tells you to work in.
If you think you need to touch a file outside your part, ask the group
leader first.
