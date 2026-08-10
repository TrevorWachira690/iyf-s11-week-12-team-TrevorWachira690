# Part 3 — Person A: The Backend for Comments and Likes

## What You're Building

You're building the backend side of comments and likes. Your job is to
add the server-side functionality that allows users to leave comments
on listings, retrieve those comments, delete their own comments, and
like or dislike listings. You also need to support the business owner's
data-management requirements for Part 3.

You will also work with several files that Part 2 owns.

## Files You Will Work In

Copy this exact folder path into your project. All paths start from
the top of the project (see the tree picture in `PROJECT_OVERVIEW.md`
if you're not sure).

```
backend/
├── models/
│   └── Comment.js
└── controllers/
    └── commentsController.js
```

You also modify sections of:

```
backend/
├── models/Post.js
├── controllers/postsController.js
├── routes/posts.js
└── controllers/usersController.js
```

These are **shared files**. Read the shared-file rules below before
touching them.

## Step 1: The Comment Model (`backend/models/Comment.js`)

A comment needs at least:

```
text/content
author/user
post
createdAt
updatedAt
```

The exact field names must remain consistent with your controllers and
Person B's frontend.

The `author` should reference the authenticated user.

The `post` should reference the listing being commented on.

Use Mongoose references rather than storing unrelated IDs as plain
strings when a relationship is intended.

Here is real, working code from this exact project you can look at and
learn from:

```js
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
});
```

Read this line by line:
- `content` — the actual text of the comment, required and trimmed
- `author` — a MongoDB reference to the `User` who wrote the comment
- `post` — a MongoDB reference to the `Post` the comment belongs to

Mongoose will automatically add `createdAt` and `updatedAt` timestamps
if you include `{ timestamps: true }` in the schema options.

## Step 2: Validating Comments

A comment should not be empty.

At minimum:
- require comment text
- reject empty/whitespace-only comments
- require a valid user
- require a valid post

The controller should return a useful error response instead of
allowing invalid data into MongoDB.

## Step 3: The Comments Controller (`backend/controllers/commentsController.js`)

Implement the main comment operations.

### Create a comment

The flow should be:
1. Authenticate the user.
2. Get the post ID.
3. Get the user ID from the authentication middleware.
4. Validate the comment text.
5. Confirm the post exists.
6. Save the comment.
7. Return the created comment.

Do not trust a user ID sent by the browser if the authenticated
identity is already available from the JWT.

### Retrieve comments

A listing detail page needs to display comments.

Provide an endpoint that can retrieve comments belonging to a
particular post.

Conceptually:

```
GET /api/posts/:postId/comments
```

The returned objects should contain enough information for the
frontend to display:

```
comment text
author
created date
```

If you populate the author, agree with Person B on which author fields
are safe and necessary to return.

### Delete a comment

A user should not be able to delete another user's comment unless the
project explicitly gives them that permission.

The backend should:
1. Find the comment.
2. Confirm it exists.
3. Check ownership/authorization.
4. Delete it.
5. Return a success response.

Again, hiding a delete button in React is not enough. The server must
enforce the rule.

## Step 4: Like/Dislike Support in `Post.js`

Part 2 owns most of `backend/models/Post.js`. Part 3 adds the
reaction-related section.

Before modifying the file:

> **Tell Part 2 Person A that you are changing the Post model.**

Decide on one data design and keep it consistent.

One practical design is to store user IDs in separate arrays:

```
likes
dislikes
```

This allows the server to know who reacted and prevents one user from
being counted multiple times if you enforce uniqueness.

An alternative is a reaction subdocument structure. The important
requirement is that the server can determine:
- who reacted
- what their current reaction is
- how many likes exist
- how many dislikes exist

Do not store only a number such as `likeCount` if you also need to
prevent duplicate reactions by the same user.

## Step 5: Reaction Rules

Decide on these rules and document them clearly.

### Like

If the user has not reacted:

```
likes += user
```

If the user currently dislikes:

```
remove from dislikes
add to likes
```

If the user already likes:
- either leave it unchanged, or
- treat the action as an unlike

Choose one behavior and keep it consistent.

### Dislike

Use the equivalent logic:

```
remove from likes
add to dislikes
```

The important rule is:

> A user cannot be both a liker and a disliker of the same post at the same time.

## Step 6: Reaction Controller Functions

Part 2 owns most of `backend/controllers/postsController.js`. Part 3
adds the reaction functions.

For example, conceptually:

```
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

## Step 7: Reaction Routes

Part 2 owns most of `backend/routes/posts.js`. Part 3 adds reaction
routes inside that file.

Possible routes include:

```
POST   /api/posts/:id/like
POST   /api/posts/:id/dislike
DELETE /api/posts/:id/reaction
```

All reaction-changing operations should require authentication.

Do not create a completely separate unrelated route structure if the
project already treats reactions as operations on posts.

## Step 8: Prevent Duplicate Reactions

This is one of the most important parts.

Imagine a user clicks Like five times.

The database should not become:

```
likes = [userA, userA, userA, userA, userA]
```

The server should check the existing reaction before adding a user.

The same applies to dislikes.

Your API should behave predictably even if the browser sends the same
request repeatedly.

## Step 9: Comments and Reactions Must Belong to Real Posts

Before creating a comment or reaction:

```
post ID
   ↓
find Post
   ↓
does it exist?
   ├── yes → continue
   └── no  → return 404
```

Do not create orphaned comments or reactions referencing nonexistent
listings.

## Step 10: Export/Import Responsibilities

Part 3 also owns the export/import functionality inside:

```
backend/controllers/usersController.js
```

This is another shared boundary.

Part 1 owns most of the user controller.

Part 3 adds only the data-management functions assigned to Part 3.

Before changing this file:

> Tell the Part 1 backend developer and the group leader.

Do not replace the authentication/profile functionality already
implemented by Part 1.

The export/import design should follow the project's actual
requirements and should validate imported data before saving it.

If imported data contains user-owned records, do not allow the import
process to bypass normal authorization or validation rules.

## Step 11: Shared-File Rules

You are touching these files:

```
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

## Step 12: API Contract With Person B

Agree on:

### Comments

```
POST   /api/posts/:postId/comments
GET    /api/posts/:postId/comments
DELETE /api/comments/:id
```

### Reactions

```
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

## Step 13: Test Your Backend

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

## Your Task

1. Read every file above before writing anything.
2. Build `Comment.js` with the fields shown.
3. Build `commentsController.js` with create, retrieve, and delete.
4. Add like/dislike fields and logic to `Post.js`.
5. Add reaction controller functions to `postsController.js`.
6. Add reaction routes to `routes/posts.js`.
7. Add export/import functions to `usersController.js` if assigned.
8. Agree on the API contract with Person B — write it down.
9. Tell Part 2 and Part 1 developers which sections of the shared
   files you modified.
10. Test every endpoint yourself before handing your work over.
