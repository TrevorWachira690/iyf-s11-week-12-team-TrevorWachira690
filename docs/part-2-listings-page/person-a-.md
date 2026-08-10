# Part 2 — Listings Page: Person A (Backend)

## What You're Building

You're building the **backend side of the listings feature**.

A business user needs a way to put something for sale into CommunityHub, and customers need a way to retrieve those listings. Your job is to build the server-side pieces that save listings in MongoDB and provide the API endpoints the frontend can call.

You are not building the React pages. Person B in your duo builds those.

Your main files are:

```text
backend/
├── models/
│   └── Post.js
├── controllers/
│   └── postsController.js
└── routes/
    └── posts.js
```

You also need to coordinate with Part 3 because Part 3 adds comments and likes/dislikes to some of these same files.

---

## Before You Start

Read these files first:

- `docs/PROJECT_OVERVIEW.md`
- `docs/TEAM_DIVISION.md`
- `docs/part-1-accounts-and-login/person-a-backend.md`
- This document from beginning to end.

You should understand the authentication work from Part 1 before building listings because listings belong to a logged-in business user.

You should also look at `backend/models/User.js` and the authentication middleware when they are available. Your listing records need to be connected to the user who created them.

---

# 1. Understand What a Listing Is

In CommunityHub, a listing is a post created by a business.

At minimum, a listing needs enough information for a customer to understand what is being sold.

A useful listing contains:

```text
title
description
price
category
images
business/owner
status
createdAt
updatedAt
```

The exact names should stay consistent throughout the model, controller, routes, and frontend.

Do not invent different names in different files. If the model calls something `title`, the frontend should also send `title`.

---

# 2. Build `Post.js`

Open:

```text
backend/models/Post.js
```

This file describes what MongoDB saves for each listing.

Use Mongoose, following the same schema style used in `User.js`.

A listing should have:

- `title` — required text
- `description` — required text
- `price` — required number
- `category` — required text
- `images` — an array of image/file references if the project is using uploads
- `business` or the agreed owner reference — the user who created the listing
- `status` — the listing's current state
- timestamps

The owner should be a MongoDB reference to the user rather than just an unrelated text field.

For example, the relationship conceptually looks like:

```text
User
  │
  └── creates ──> Post
                    │
                    ├── title
                    ├── description
                    ├── price
                    ├── category
                    └── status
```

### Important

Part 3 will later add like/dislike information to this model.

Therefore:

> **Do not redesign or replace `Post.js` when Part 3 begins.**

Leave a clear section where Part 3 can add its reaction-related fields.

Tell the Part 3 backend developer what you have added before they modify this file.

---

# 3. Think About Validation

A database model should not accept obviously bad listings.

For example:

- A title should not be empty.
- A description should not be empty.
- Price should be a number and should not be negative.
- Category should not be empty.
- The owner should be a valid user reference.

Validation belongs in the model where appropriate, but the controller should also handle bad input gracefully.

Remember that validation protects the database; controller checks help produce useful API responses.

---

# 4. Build `postsController.js`

Open:

```text
backend/controllers/postsController.js
```

This is where the actual listing operations happen.

You need to implement the main CRUD operations.

## Create a listing

A business user should be able to create a listing.

The controller should:

1. Receive the listing information from the request.
2. Get the authenticated user's identity from the JWT middleware.
3. Verify that the user is allowed to create a business listing.
4. Validate the required data.
5. Save the listing.
6. Return the created listing.

Do not accept the owner ID blindly from the browser when the authenticated user information is already available from the token.

The server should determine who created the listing.

---

## Get listings

Customers need to retrieve listings.

Create a controller that can return a list of posts.

It should support the requirements described by the project:

- normal listing retrieval
- category filtering
- searching
- pagination

Keep the response structure predictable so Person B can consume it easily.

For example, a response can follow a structure such as:

```js
{
  posts: [...],
  total: 24,
  page: 1,
  pages: 3
}
```

The exact structure is up to the duo, but **agree on it with Person B before they build their API calls**.

---

# 5. Searching Listings

The listings page needs a search feature.

The backend should accept a search term and use it to find matching listings.

A search can normally check fields such as:

```text
title
description
category
```

The search should be handled on the server rather than downloading every listing to the browser and searching there.

For example, the frontend might eventually call something conceptually similar to:

```text
GET /api/posts?search=phone
```

The exact route prefix should match the project's server setup.

---

# 6. Filtering by Category

The project specifically requires sorting/filtering by category.

The backend should support a category parameter.

Conceptually:

```text
GET /api/posts?category=electronics
```

The controller should apply the category filter only when one was supplied.

If no category is supplied, return the normal listing collection.

---

# 7. Pagination

Do not return thousands of listings at once.

The backend should support pagination using values such as:

```text
page
limit
```

For example:

```text
GET /api/posts?page=2&limit=10
```

The controller should calculate the correct number of documents to skip and return enough information for the frontend to know whether another page exists.

---

# 8. Updating a Listing

A business owner should be able to update their own listing.

Before updating:

1. Find the listing.
2. Check that it exists.
3. Check that the authenticated user owns it.
4. Update the permitted fields.
5. Save/return the updated listing.

Do not allow one business user to edit another business user's listing.

This is an authorization check, not just a frontend restriction.

---

# 9. Deleting a Listing

Deleting follows the same ownership rule.

The server should:

1. Find the listing.
2. Confirm it exists.
3. Confirm the authenticated user owns it.
4. Delete it.
5. Return a clear success response.

Do not rely on hiding a delete button in React as the security mechanism.

The backend must enforce ownership.

---

# 10. Build `routes/posts.js`

Open:

```text
backend/routes/posts.js
```

Connect the URLs to the controller functions.

A sensible API design might look like:

```text
GET    /api/posts
GET    /api/posts/:id
POST   /api/posts
PUT    /api/posts/:id
DELETE /api/posts/:id
```

Then support query parameters on the collection endpoint:

```text
GET /api/posts?search=phone
GET /api/posts?category=electronics
GET /api/posts?page=1&limit=10
```

Creation, editing, and deletion should use the authentication middleware where required.

Public reading can remain public if that matches the application's intended behavior.

---

# 11. Get the Single Listing

Person B needs a `PostDetail.jsx` page.

Therefore, the backend needs an endpoint that retrieves one listing by ID.

For example:

```text
GET /api/posts/:id
```

The response should include the information needed to display the listing detail page.

If the business/user relationship is populated, agree with Person B on the fields they can rely on.

---

# 12. Work With Uploaded Images Carefully

The project includes `multer` in the backend dependencies.

If image uploads are part of the implementation, use the project's upload setup rather than accepting arbitrary file data in a normal JSON field.

The listing should store references to uploaded files/URLs, not huge binary files directly inside the normal Post document.

Coordinate with the group leader if the upload storage approach has not yet been decided.

Do not invent a cloud-storage system unless the project specifically requires one.

---

# 13. API Contract With Person B

Before Person B finishes the frontend, agree on:

### Request fields

For example:

```js
{
  title,
  description,
  price,
  category,
  images
}
```

### Response fields

For example:

```js
{
  _id,
  title,
  description,
  price,
  category,
  images,
  business,
  status,
  createdAt
}
```

### Query parameters

```text
search
category
page
limit
```

Write the agreed contract somewhere the two of you can both reference.

The most common integration problem is not that either person's code is individually wrong — it is that they use different names or response shapes.

---

# 14. Part 3 Integration — Very Important

Part 3 will modify:

```text
backend/models/Post.js
backend/controllers/postsController.js
backend/routes/posts.js
```

Part 2 owns most of these files.

Part 3 owns the like/dislike sections.

Therefore:

> **Do not overwrite the entire file when adding Part 3 functionality.**

If you have:

```js
const postSchema = new mongoose.Schema({
  ...
});
```

Part 3 should add its reaction-related fields to the existing schema.

Similarly, reaction controller functions should be added alongside your listing controller functions rather than replacing them.

Talk to the Part 3 backend developer before merging their work.

---

# 15. Test Your Backend

Before saying your part is finished, test the API.

At minimum test:

### Create

- Valid listing
- Missing title
- Invalid price
- Unauthenticated request
- Customer attempting to create a business listing

### Read

- All listings
- One listing
- Search
- Category filter
- Pagination
- Invalid/nonexistent ID

### Update

- Owner updating their own listing
- Another user attempting to update it
- Nonexistent listing

### Delete

- Owner deleting their own listing
- Another user attempting to delete it
- Nonexistent listing

---

# Your Part 2 Backend Checklist

Before handing your work over:

- [ ] `Post.js` is implemented.
- [ ] Listing validation works.
- [ ] Listings are connected to their owner.
- [ ] Create endpoint works.
- [ ] Read-all endpoint works.
- [ ] Read-one endpoint works.
- [ ] Search works.
- [ ] Category filtering works.
- [ ] Pagination works.
- [ ] Update checks ownership.
- [ ] Delete checks ownership.
- [ ] Routes point to the correct controllers.
- [ ] Protected operations use authentication.
- [ ] API request/response names have been agreed with Person B.
- [ ] Part 3 has been told which sections of the shared files they may modify.
- [ ] You have tested the endpoints yourself.

## What Person B Needs From You

Give Person B:

1. The API base URL.
2. The listing endpoints.
3. The request field names.
4. The response field names.
5. The search/category/pagination query parameters.
6. Which endpoints require authentication.
7. Any image-upload behavior they need to know about.

Your backend is not finished until Person B can actually consume it.
