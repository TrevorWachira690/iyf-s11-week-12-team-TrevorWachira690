# Part 3 — Person B: The Frontend for Comments and Likes

## What You're Building

You're building the frontend side of comments and likes. Your job is
to add the user-interaction features that make listings more useful:
comments, like/dislike controls, comment deletion where allowed,
reusable UI pieces, hooks needed by the project, the business owner's
dashboard, and the data export/import interface assigned to Part 3.

Your main files are:

```
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

```
src/pages/PostDetail.jsx
```

This file is shared with Part 2 Person B.

## Step 1: Comments in `PostDetail.jsx`

Part 2 creates the listing-detail experience.

Your job is to extend it with a comments section.

A useful layout is:

```
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

Keep the listing information that Part 2 created. Add your
interaction section without deleting their work.

## Step 2: Display Existing Comments

When a listing is opened, retrieve its comments from the backend.

Conceptually:

```
GET /api/posts/:postId/comments
```

Use the endpoint that Part 3 Person A actually implements.

Each comment should show appropriate information such as:

```
author
comment text
date
```

If the backend provides an author object, use the agreed field names.

## Step 3: Create a Comment

Authenticated users should be able to submit a comment.

A typical flow is:

```
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

Do not refresh the entire browser just to show the newly created
comment. Update the relevant React state after the API succeeds.

## Step 4: Comment Form and `useForm.js`

Open:

```
src/hooks/useForm.js
```

If this hook is suitable for the project's form patterns, use it for
the comment form.

The goal of a reusable hook is to avoid repeating the same
state-management logic across forms.

At minimum, the comment form should handle:
- input value
- change event
- submission
- clearing after success
- validation/error handling

Do not create another generic form hook if the existing one can
reasonably handle the job.

## Step 5: Like and Dislike Controls

Add reaction controls to `PostDetail.jsx`.

A user should be able to see the current counts and their own
reaction.

For example:

```
👍 12    👎 3
```

If the API tells you the user has already liked the post, the UI
should make that state clear.

Do not assume the user's reaction based only on the counts. The
backend needs to tell you the current user's reaction.

## Step 6: Reaction Behavior

Follow the backend contract.

For example:

```
Like
  ↓
POST /api/posts/:id/like
```

and:

```
Dislike
  ↓
POST /api/posts/:id/dislike
```

If the user wants to remove their reaction:

```
DELETE /api/posts/:id/reaction
```

The exact endpoints may differ. Use what Person A actually implements.

## Step 7: Do Not Allow Confusing UI States

If a user likes a post and then dislikes it, the UI should reflect
the new state.

The expected behavior is:

```
No reaction
    ↓
 Like
    ↓
 Dislike
```

and never:

```
Like + Dislike simultaneously
```

The backend is responsible for enforcing the rule, but the frontend
should also display the resulting state correctly.

## Step 8: Comment Deletion

If the backend allows users to delete their own comments, display a
delete control only where appropriate.

But remember:

> The frontend button is not the security mechanism.

Even if the delete button is hidden, the backend must still check
ownership.

After successful deletion, remove the comment from the local React
state rather than requiring a full page reload.

## Step 9: `ConfirmDialog.jsx`

Open:

```
src/components/ConfirmDialog.jsx
```

Use this for destructive actions such as deleting a comment.

A confirmation should make the action clear:

```
Delete this comment?

[Cancel] [Delete]
```

Do not immediately delete something when the action is difficult to
undo.

## Step 10: Shared UI Components

Part 3 owns:

```
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

Do not make these components specific to comments only. Part 1 and
Part 2 may also need them.

## Step 11: `useFetch.js`

Open:

```
src/hooks/useFetch.js
```

This hook can centralize repeated request state such as:

```
loading
error
data
```

Use it where it actually makes the code cleaner. Do not force every
request into the hook if a mutation requires a different pattern.

## Step 12: `useToggle.js`

Open:

```
src/hooks/useToggle.js
```

This is useful for boolean UI state such as:

```
dialog open/closed
mobile menu open/closed
form visibility
```

Use it where appropriate instead of repeatedly writing:

```js
const [isOpen, setIsOpen] = useState(false);
```

The hook should remain generic.

## Step 13: `useLocalStorage.js`

Open:

```
src/hooks/useLocalStorage.js
```

This hook can be used for client-side values that need to survive
page refreshes.

Do not use local storage as a replacement for the backend database.

For example:

```
Good:
UI preference → localStorage

Bad:
Comments → localStorage
Likes → localStorage
```

Comments and reactions must come from the server so all users see
consistent data.

## Step 14: `AdminDashboard.jsx`

Open:

```
src/pages/AdminDashboard.jsx
```

Follow the exact role and access requirements established by the
project documentation.

This page should provide the business owner's dashboard functionality
assigned to Part 3.

Possible responsibilities include:
- viewing the business user's listings
- managing listing-related data
- exporting data
- importing data

Do not assume "admin" means a completely separate administrator role
unless the project explicitly defines one.

If the project calls this page `AdminDashboard.jsx` but the actual
user role is `business`, follow the project's established terminology
and coordinate with the group leader.

## Step 15: Export and Import UI

If the backend provides export/import functionality, the dashboard
should provide a clear interface for it.

For example:

```
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

For file uploads, use the backend's expected format and
`multipart/form-data` if the endpoint requires it.

## Step 16: Authentication and Roles

Comments and reactions should follow the authentication rules.

If a user is not logged in:
- they can still see public comments/reactions if the project allows it
- they should not see an authenticated-only action as though it will work

For example:

```
Not logged in:
"Log in to comment"

Logged in:
[Write a comment...]
[Post]
```

Follow the actual project authentication contract. Business-only
dashboard functionality should be protected by the application's
route/auth logic.

## Step 17: `PostDetail.jsx` Is Shared With Part 2

This is one of the most important rules in this document.

Part 2 Person B owns the listing-detail portion. You own the
interaction portion.

Think of the page as:

```
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

Do not overwrite the Part 2 section. Talk to Person 2 before merging
your changes.

## Step 18: Use `src/services/api.js`

This file is shared by everyone:

```
src/services/api.js
```

Add your API functions there if that is the team's chosen pattern.

For example:

```
getComments(postId)
createComment(postId, data)
deleteComment(commentId)
likePost(postId)
dislikePost(postId)
removeReaction(postId)
```

The exact function names are up to the team.

Do not delete the authentication/listing functions already added by
other developers.

## Step 19: Error and Loading States

Every interaction with the backend can fail.

Handle cases such as:

```
Comment failed to send.
Unable to load comments.
Unable to update reaction.
You are not authorized to perform this action.
```

The user should know what happened. Avoid leaving buttons permanently
disabled because an error occurred.

## Step 20: Test Your Frontend

Test the actual browser experience.

### Comments
- [ ] Comments load.
- [ ] Logged-in user can submit.
- [ ] Empty comments are rejected.
- [ ] Newly created comments appear without a full refresh.
- [ ] Comment deletion works where allowed.
- [ ] Deleted comments disappear from the UI.
- [ ] Errors are displayed.

### Likes and dislikes
- [ ] Like works.
- [ ] Dislike works.
- [ ] Like → dislike updates correctly.
- [ ] Dislike → like updates correctly.
- [ ] Removing a reaction works.
- [ ] Counts update.
- [ ] Current user's reaction is visually clear.
- [ ] Authentication errors are handled.

### Dashboard
- [ ] Correct users can access it.
- [ ] Unauthorized users are prevented.
- [ ] Business listings/data display correctly.
- [ ] Export works.
- [ ] Import works if implemented.
- [ ] File-selection errors are handled.
- [ ] Server errors are displayed.

## Your Task

1. Read every file above before writing anything.
2. Add comments display and form to `PostDetail.jsx` without removing
   Part 2's listing information.
3. Add like/dislike controls to `PostDetail.jsx`.
4. Build `ConfirmDialog.jsx` and use it for comment deletion.
5. Make sure `Button.jsx`, `Card.jsx`, and `Input.jsx` are reusable.
6. Implement or reuse `useFetch.js`, `useForm.js`, `useToggle.js`,
   and `useLocalStorage.js` where appropriate.
7. Build `AdminDashboard.jsx` with export/import UI.
8. Add your API functions to `src/services/api.js` without deleting
   existing ones.
9. Agree on the API contract with Person A — write it down.
10. Test every feature before declaring your part complete.
