# Part 3 — Comments and Likes: Person B (Frontend)

## What You're Building

You're building the **frontend side of Part 3**.

Your job is to add the user-interaction features that make listings more useful:

- comments
- like/dislike controls
- comment deletion where allowed
- reusable UI pieces
- hooks needed by the project
- the business owner's dashboard
- the data export/import interface assigned to Part 3

Your main files are:

```text
src/
├── components/
│   ├── ConfirmDialog.jsx
│   └── shared/
│       ├── Button.jsx
│       ├── Card.jsx
│       └── Input.jsx
├── hooks/
│   ├── useFetch.js
│   ├── useForm.js
│   ├── useLocalStorage.js
│   └── useToggle.js
└── pages/
    └── AdminDashboard.jsx
```

You also work on:

```text
src/pages/PostDetail.jsx
```

This file is shared with Part 2 Person B.

---

# 1. Before You Start

Read:

- `docs/PROJECT_OVERVIEW.md`
- `docs/TEAM_DIVISION.md`
- `docs/part-1-accounts-and-login/person-b-frontend.md`
- `docs/part-2-listings-page/person-b-frontend.md`
- This document from beginning to end.

Part 3's frontend work sits on top of the listing detail page created by Part 2.

Do not rebuild the listing page from scratch.

---

# 2. Add Comments to `PostDetail.jsx`

Part 2 creates the listing-detail experience.

Your job is to extend it with a comments section.

A useful layout is:

```text
PostDetail
│
├── Listing information
│
├── Like / dislike controls
│
└── Comments
    ├── Comment form
    ├── Comment
    ├── Comment
    └── ...
```

Keep the listing information that Part 2 created.

Add your interaction section without deleting their work.

---

# 3. Display Existing Comments

When a listing is opened, retrieve its comments from the backend.

Conceptually:

```text
GET /api/posts/:postId/comments
```

Use the endpoint that Part 3 Person A actually implements.

Each comment should show appropriate information such as:

```text
author
comment text
date
```

If the backend provides an author object, use the agreed field names.

---

# 4. Create a Comment

Authenticated users should be able to submit a comment.

A typical flow is:

```text
Input
  ↓
submit
  ↓
POST /api/posts/:postId/comments
  ↓
backend validates
  ↓
new comment
  ↓
update displayed comments
```

Do not refresh the entire browser just to show the newly created comment.

Update the relevant React state after the API succeeds.

---

# 5. Comment Form and `useForm.js`

Open:

```text
src/hooks/useForm.js
```

If this hook is suitable for the project's form patterns, use it for the comment form.

The goal of a reusable hook is to avoid repeating the same state-management logic across forms.

At minimum, the comment form should handle:

- input value
- change event
- submission
- clearing after success
- validation/error handling

Do not create another generic form hook if the existing one can reasonably handle the job.

---

# 6. Like and Dislike Controls

Add reaction controls to `PostDetail.jsx`.

A user should be able to see the current counts and their own reaction.

For example:

```text
👍 12    👎 3
```

If the API tells you the user has already liked the post, the UI should make that state clear.

Do not assume the user's reaction based only on the counts.

The backend needs to tell you the current user's reaction.

---

# 7. Reaction Behavior

Follow the backend contract.

For example:

```text
Like
  ↓
POST /api/posts/:id/like
```

and:

```text
Dislike
  ↓
POST /api/posts/:id/dislike
```

If the user wants to remove their reaction:

```text
DELETE /api/posts/:id/reaction
```

The exact endpoints may differ.

Use what Person A actually implements.

---

# 8. Do Not Allow Confusing UI States

If a user likes a post and then dislikes it, the UI should reflect the new state.

The expected behavior is:

```text
No reaction
    ↓
 Like
    ↓
 Dislike
```

and never:

```text
Like + Dislike simultaneously
```

The backend is responsible for enforcing the rule, but the frontend should also display the resulting state correctly.

---

# 9. Comment Deletion

If the backend allows users to delete their own comments, display a delete control only where appropriate.

But remember:

> The frontend button is not the security mechanism.

Even if the delete button is hidden, the backend must still check ownership.

After successful deletion, remove the comment from the local React state rather than requiring a full page reload.

---

# 10. `ConfirmDialog.jsx`

Open:

```text
src/components/ConfirmDialog.jsx
```

Use this for destructive actions such as deleting a comment.

A confirmation should make the action clear:

```text
Delete this comment?

[Cancel] [Delete]
```

Do not immediately delete something when the action is difficult to undo.

---

# 11. Shared UI Components

Part 3 owns:

```text
src/components/shared/
├── Button.jsx
├── Card.jsx
└── Input.jsx
```

These should be reusable components.

### `Button.jsx`

Use it for common button behavior and styling.

### `Card.jsx`

Use it for consistent content containers.

### `Input.jsx`

Use it for reusable form input behavior.

Do not make these components specific to comments only.

Part 1 and Part 2 may also need them.

---

# 12. `useFetch.js`

Open:

```text
src/hooks/useFetch.js
```

This hook can centralize repeated request state such as:

```text
loading
error
data
```

Use it where it actually makes the code cleaner.

Do not force every request into the hook if a mutation requires a different pattern.

---

# 13. `useToggle.js`

Open:

```text
src/hooks/useToggle.js
```

This is useful for boolean UI state such as:

```text
dialog open/closed
mobile menu open/closed
form visibility
```

Use it where appropriate instead of repeatedly writing:

```js
const [isOpen, setIsOpen] = useState(false);
```

The hook should remain generic.

---

# 14. `useLocalStorage.js`

Open:

```text
src/hooks/useLocalStorage.js
```

This hook can be used for client-side values that need to survive page refreshes.

Do not use local storage as a replacement for the backend database.

For example:

```text
Good:
UI preference → localStorage

Bad:
Comments → localStorage
Likes → localStorage
```

Comments and reactions must come from the server so all users see consistent data.

---

# 15. `AdminDashboard.jsx`

Open:

```text
src/pages/AdminDashboard.jsx
```

Follow the exact role and access requirements established by the project documentation.

This page should provide the business owner's dashboard functionality assigned to Part 3.

Possible responsibilities include:

- viewing the business user's listings
- managing listing-related data
- exporting data
- importing data

Do not assume "admin" means a completely separate administrator role unless the project explicitly defines one.

If the project calls this page `AdminDashboard.jsx` but the actual user role is `business`, follow the project's established terminology and coordinate with the group leader.

---

# 16. Export and Import UI

If the backend provides export/import functionality, the dashboard should provide a clear interface for it.

For example:

```text
Export my data
[Export]

Import data
[Choose File] [Import]
```

The frontend should:

1. send the request
2. handle loading
3. handle errors
4. tell the user when the operation succeeds

Do not silently fail.

For file uploads, use the backend's expected format and `multipart/form-data` if the endpoint requires it.

---

# 17. Authentication and Roles

Comments and reactions should follow the authentication rules.

If a user is not logged in:

- they can still see public comments/reactions if the project allows it
- they should not see an authenticated-only action as though it will work

For example:

```text
Not logged in:
"Log in to comment"

Logged in:
[Write a comment...]
[Post]
```

Follow the actual project authentication contract.

Business-only dashboard functionality should be protected by the application's route/auth logic.

---

# 18. `PostDetail.jsx` Is Shared With Part 2

This is one of the most important rules in this document.

Part 2 Person B owns the listing-detail portion.

You own the interaction portion.

Think of the page as:

```text
┌───────────────────────────────┐
│ Part 2: Listing information   │
│                               │
│ title                         │
│ images                        │
│ price                         │
│ description                   │
│ business                      │
│ status                        │
├───────────────────────────────┤
│ Part 3: Reactions             │
│ 👍 Like    👎 Dislike         │
├───────────────────────────────┤
│ Part 3: Comments              │
│ comment form                  │
│ comments                      │
└───────────────────────────────┘
```

Do not overwrite the Part 2 section.

Talk to Person 2 before merging your changes.

---

# 19. Use `src/services/api.js`

This file is shared by everyone:

```text
src/services/api.js
```

Add your API functions there if that is the team's chosen pattern.

For example:

```text
getComments(postId)
createComment(postId, data)
deleteComment(commentId)
likePost(postId)
dislikePost(postId)
removeReaction(postId)
```

The exact function names are up to the team.

Do not delete the authentication/listing functions already added by other developers.

---

# 20. Error and Loading States

Every interaction with the backend can fail.

Handle cases such as:

```text
Comment failed to send.
Unable to load comments.
Unable to update reaction.
You are not authorized to perform this action.
```

The user should know what happened.

Avoid leaving buttons permanently disabled because an error occurred.

---

# 21. Test the Comments

Test:

- [ ] Comments load.
- [ ] Logged-in user can submit.
- [ ] Empty comments are rejected.
- [ ] Newly created comments appear without a full refresh.
- [ ] Comment deletion works where allowed.
- [ ] Deleted comments disappear from the UI.
- [ ] Errors are displayed.

---

# 22. Test Likes and Dislikes

Test:

- [ ] Like works.
- [ ] Dislike works.
- [ ] Like → dislike updates correctly.
- [ ] Dislike → like updates correctly.
- [ ] Removing a reaction works.
- [ ] Counts update.
- [ ] Current user's reaction is visually clear.
- [ ] Authentication errors are handled.

---

# 23. Test the Dashboard

Test:

- [ ] Correct users can access it.
- [ ] Unauthorized users are prevented.
- [ ] Business listings/data display correctly.
- [ ] Export works.
- [ ] Import works if implemented.
- [ ] File-selection errors are handled.
- [ ] Server errors are displayed.

---

# Your Part 3 Frontend Checklist

- [ ] Comments display.
- [ ] Comment form works.
- [ ] Comment validation works.
- [ ] Comment deletion works.
- [ ] Like button works.
- [ ] Dislike button works.
- [ ] Reaction state is displayed correctly.
- [ ] Reaction counts update.
- [ ] `ConfirmDialog.jsx` works.
- [ ] Shared `Button`, `Card`, and `Input` components are reusable.
- [ ] Relevant hooks are implemented/reused.
- [ ] `AdminDashboard.jsx` works.
- [ ] Export/import UI works according to the backend contract.
- [ ] Authentication/role rules are respected.
- [ ] `PostDetail.jsx` changes do not remove Part 2's work.
- [ ] `src/services/api.js` changes do not remove other developers' functions.
- [ ] Part 2 and the group leader know about shared-file changes.

## What Person A Needs From You

Tell Person A:

1. Which comment fields your UI expects.
2. Which reaction response fields your UI expects.
3. Which API endpoints you are calling.
4. Which authentication errors you need to handle.
5. What the export/import endpoints expect.
6. Which author/user fields you need returned for comments.

Your frontend and Person A's backend should be tested together before Part 3 is considered complete.
