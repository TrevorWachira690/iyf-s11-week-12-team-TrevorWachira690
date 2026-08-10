# Part 3 — Comments and Likes: Person A (Backend)

## What You're Building

You're building the **backend side of Part 3**.

Your job is to add the server-side functionality that allows users to:

- leave comments on listings
- retrieve comments
- delete comments when allowed
- like or dislike listings
- change/remove their reaction
- support the business owner's data-management requirements assigned to Part 3

You will also work with several files that Part 2 owns.

Your main files are:

```text
backend/
├── models/
│   └── Comment.js
└── controllers/
    └── commentsController.js
```

You also modify sections of:

```text
backend/
├── models/Post.js
├── controllers/postsController.js
├── routes/posts.js
└── controllers/usersController.js
```

These are **shared files**. Read the shared-file rules below before touching them.

---

# 1. Before You Start

Read:

- `docs/PROJECT_OVERVIEW.md`
- `docs/TEAM_DIVISION.md`
- `docs/part-1-accounts-and-login/person-a-backend.md`
- `docs/part-2-listings-page/person-a-backend.md`
- This document from beginning to end.

Part 3 depends on Part 1 authentication and Part 2 listings.

A comment belongs to a user and a post. A reaction also belongs to a user and a post.

Conceptually:

```text
User
 │
 ├── creates ──> Post
 │
 └── writes ──> Comment ──> belongs to Post
 │
 └── reacts ──> Post
```

---

# 2. Build `Comment.js`

Open:

```text
backend/models/Comment.js
```

A comment needs at least:

```text
text/content
author/user
post
createdAt
updatedAt
```

The exact field names must remain consistent with your controllers and Person B's frontend.

The `author` should reference the authenticated user.

The `post` should reference the listing being commented on.

Use Mongoose references rather than storing unrelated IDs as plain strings when a relationship is intended.

---

# 3. Validate Comments

A comment should not be empty.

At minimum:

- require comment text
- reject empty/whitespace-only comments
- require a valid user
- require a valid post

The controller should return a useful error response instead of allowing invalid data into MongoDB.

---

# 4. Build `commentsController.js`

Open:

```text
backend/controllers/commentsController.js
```

Implement the main comment operations.

## Create a comment

The flow should be:

```text
1. Authenticate the user.
2. Get the post ID.
3. Get the user ID from the authentication middleware.
4. Validate the comment text.
5. Confirm the post exists.
6. Save the comment.
7. Return the created comment.
```

Do not trust a user ID sent by the browser if the authenticated identity is already available from the JWT.

---

# 5. Retrieve Comments

A listing detail page needs to display comments.

Provide an endpoint that can retrieve comments belonging to a particular post.

Conceptually:

```text
GET /api/posts/:postId/comments
```

The returned objects should contain enough information for the frontend to display:

```text
comment text
author
created date
```

If you populate the author, agree with Person B on which author fields are safe and necessary to return.

---

# 6. Delete Comments

A user should not be able to delete another user's comment unless the project explicitly gives them that permission.

The backend should:

1. Find the comment.
2. Confirm it exists.
3. Check ownership/authorization.
4. Delete it.
5. Return a success response.

Again, hiding a delete button in React is not enough.

The server must enforce the rule.

---

# 7. Add Like/Dislike Support to `Post.js`

Part 2 owns most of:

```text
backend/models/Post.js
```

Part 3 adds the reaction-related section.

Before modifying the file:

> **Tell Part 2 Person A that you are changing the Post model.**

Decide on one data design and keep it consistent.

One practical design is to store user IDs in separate arrays:

```text
likes
dislikes
```

This allows the server to know who reacted and prevents one user from being counted multiple times if you enforce uniqueness.

An alternative is a reaction subdocument structure. The important requirement is that the server can determine:

- who reacted
- what their current reaction is
- how many likes exist
- how many dislikes exist

Do not store only a number such as `likeCount` if you also need to prevent duplicate reactions by the same user.

---

# 8. Reaction Rules

Decide on these rules and document them clearly:

### Like

If the user has not reacted:

```text
likes += user
```

If the user currently dislikes:

```text
remove from dislikes
add to likes
```

If the user already likes:

Either:
- leave it unchanged, or
- treat the action as an unlike.

Choose one behavior and keep it consistent.

### Dislike

Use the equivalent logic:

```text
remove from likes
add to dislikes
```

The important rule is:

> A user cannot be both a liker and a disliker of the same post at the same time.

---

# 9. Add Reaction Controller Functions

Part 2 owns most of:

```text
backend/controllers/postsController.js
```

Part 3 adds the reaction functions.

For example, conceptually:

```text
likePost
dislikePost
removeReaction
```

The exact function names are up to the duo, but they should be clear.

Each operation should:

1. authenticate the user
2. find the post
3. determine the user's current reaction
4. update the reaction
5. return the new reaction state/counts

A useful response could contain:

```js
{
  likes: 10,
  dislikes: 2,
  userReaction: "like"
}
```

Again, agree on the exact response with Person B.

---

# 10. Add Reaction Routes

Part 2 owns most of:

```text
backend/routes/posts.js
```

Part 3 adds reaction routes inside that file.

Possible routes include:

```text
POST   /api/posts/:id/like
POST   /api/posts/:id/dislike
DELETE /api/posts/:id/reaction
```

All reaction-changing operations should require authentication.

Do not create a completely separate unrelated route structure if the project already treats reactions as operations on posts.

---

# 11. Prevent Duplicate Reactions

This is one of the most important parts.

Imagine a user clicks Like five times.

The database should not become:

```text
likes = [userA, userA, userA, userA, userA]
```

The server should check the existing reaction before adding a user.

The same applies to dislikes.

Your API should behave predictably even if the browser sends the same request repeatedly.

---

# 12. Comments and Reactions Must Belong to Real Posts

Before creating a comment or reaction:

```text
post ID
   ↓
find Post
   ↓
does it exist?
   ├── yes → continue
   └── no  → return 404
```

Do not create orphaned comments or reactions referencing nonexistent listings.

---

# 13. Export/Import Responsibilities

Part 3 also owns the export/import functionality inside:

```text
backend/controllers/usersController.js
```

This is another shared boundary.

Part 1 owns most of the user controller.

Part 3 adds only the data-management functions assigned to Part 3.

Before changing this file:

> Tell the Part 1 backend developer and the group leader.

Do not replace the authentication/profile functionality already implemented by Part 1.

The export/import design should follow the project's actual requirements and should validate imported data before saving it.

If imported data contains user-owned records, do not allow the import process to bypass normal authorization or validation rules.

---

# 14. Shared-File Rules

You are touching these files:

```text
backend/models/Post.js
backend/controllers/postsController.js
backend/routes/posts.js
backend/controllers/usersController.js
```

They already contain work belonging to other parts.

Therefore:

### Do

- make small, focused additions
- tell the owner before editing
- keep existing functions intact
- test after merging
- compare changes before committing

### Do not

- replace the entire file
- rename someone else's functions without discussing it
- remove existing routes
- change existing response formats without telling the other developer

---

# 15. API Contract With Person B

Agree on:

### Comments

```text
POST   /api/posts/:postId/comments
GET    /api/posts/:postId/comments
DELETE /api/comments/:id
```

### Reactions

```text
POST   /api/posts/:id/like
POST   /api/posts/:id/dislike
DELETE /api/posts/:id/reaction
```

The exact paths may differ, but they must be agreed upon.

Also agree on response shapes.

For example:

```js
{
  comments: [...]
}
```

and:

```js
{
  likes: 12,
  dislikes: 3,
  userReaction: "like"
}
```

Do not leave Person B guessing what the API returns.

---

# 16. Test Your Backend

Test comments:

- [ ] authenticated user can comment
- [ ] unauthenticated user is rejected
- [ ] empty comment is rejected
- [ ] nonexistent post is rejected
- [ ] comments can be retrieved
- [ ] owner can delete their comment
- [ ] another user cannot delete it

Test reactions:

- [ ] user can like
- [ ] user can dislike
- [ ] liking removes an existing dislike
- [ ] disliking removes an existing like
- [ ] duplicate reactions are prevented
- [ ] reaction can be removed
- [ ] unauthenticated reactions are rejected
- [ ] nonexistent posts are rejected

Test export/import according to the agreed project requirements.

---

# Your Part 3 Backend Checklist

- [ ] `Comment.js` implemented.
- [ ] Comment validation works.
- [ ] Comment creation works.
- [ ] Comment retrieval works.
- [ ] Comment deletion checks ownership.
- [ ] Post reaction storage implemented.
- [ ] Like works.
- [ ] Dislike works.
- [ ] Reaction switching works.
- [ ] Duplicate reactions are prevented.
- [ ] Reaction removal works.
- [ ] Reaction routes are protected.
- [ ] Export/import functionality implemented according to requirements.
- [ ] Shared files were modified carefully.
- [ ] Part 2 and Part 1 developers were informed about shared-file changes.
- [ ] Person B has the exact API contract.
- [ ] Endpoints have been tested.
