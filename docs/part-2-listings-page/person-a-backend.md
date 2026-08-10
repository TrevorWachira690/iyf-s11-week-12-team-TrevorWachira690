# Part 2 — Person A: The Backend for Listings

## What You're Building

You're building the backend for the listings page. A business user
needs a way to put something for sale into CommunityHub, and customers
need a way to retrieve those listings. Your job is to build the
server-side pieces that save listings in MongoDB and provide the API
endpoints the frontend can call.

You are not building the React pages. Person B in your duo builds
those.

## Files You Will Work In

Copy this exact folder path into your project. All paths start from
the top of the project (see the tree picture in `PROJECT_OVERVIEW.md`
if you're not sure).

```
backend/
├── models/
│   └── Post.js
├── controllers/
│   └── postsController.js
└── routes/
    └── posts.js
```

You also need to coordinate with Part 3 because Part 3 adds comments
and likes/dislikes to some of these same files.

## Step 1: The Post Model (`backend/models/Post.js`)

This file describes what MongoDB saves for each listing. Think of it
like a form with blank fields — this file decides what those fields
are.

Here is real, working code from this exact project you can look at and
learn from:

```js
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 120,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be 0 or greater'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  images: {
    type: [String],
    default: [],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published',
  },
});
```

Read this line by line:
- `title`, `description`, `price`, `category` — normal text/number
  fields, each with rules
- `image` and `images` — stores image URLs or base64 strings; the
  project supports both a single legacy image and an array of newer
  ones
- `author` — a MongoDB reference to the `User` who created the listing;
  this is how the app knows who owns the post
- `status` — either `"draft"`, `"published"`, or `"archived"`; nothing
  else is allowed

### Important

Part 3 will later add like/dislike information to this model.

Therefore:

> **Do not redesign or replace `Post.js` when Part 3 begins.**

Leave a clear section where Part 3 can add its reaction-related fields.
Tell the Part 3 backend developer what you have added before they
modify this file.

## Step 2: Building the Controller (`backend/controllers/postsController.js`)

This is where the actual listing operations happen. You need to
implement the main CRUD operations.

### Create a listing

A business user should be able to create a listing.

The controller should:
1. Receive the listing information from the request.
2. Get the authenticated user's identity from the JWT middleware.
3. Verify that the user is allowed to create a business listing.
4. Validate the required data.
5. Save the listing.
6. Return the created listing.

Do not accept the owner ID blindly from the browser when the
authenticated user information is already available from the token.

The server should determine who created the listing.

### Get listings

Customers need to retrieve listings.

Create a controller that can return a list of posts.

It should support:
- normal listing retrieval
- category filtering
- searching
- pagination

Keep the response structure predictable so Person B can consume it
easily.

For example, a response can follow a structure such as:

```js
{
  posts: [...],
  total: 24,
  page: 1,
  pages: 3
}
```

The exact structure is up to the duo, but **agree on it with Person B
before they build their API calls**.

### Get a single listing

Person B needs a `PostDetail.jsx` page.

Therefore, the backend needs an endpoint that retrieves one listing by
ID.

For example:

```
GET /api/posts/:id
```

The response should include the information needed to display the
listing detail page. If the business/user relationship is populated,
agree with Person B on the fields they can rely on.

### Updating a listing

A business owner should be able to update their own listing.

Before updating:
1. Find the listing.
2. Check that it exists.
3. Check that the authenticated user owns it.
4. Update the permitted fields.
5. Save/return the updated listing.

Do not allow one business user to edit another business user's listing.

This is an authorization check, not just a frontend restriction.

### Deleting a listing

Deleting follows the same ownership rule.

The server should:
1. Find the listing.
2. Confirm it exists.
3. Confirm the authenticated user owns it.
4. Delete it.
5. Return a clear success response.

Do not rely on hiding a delete button in React as the security
mechanism. The backend must enforce ownership.

## Step 3: Building Routes (`backend/routes/posts.js`)

Connect the URLs to the controller functions.

A sensible API design might look like:

```
GET    /api/posts
GET    /api/posts/:id
POST   /api/posts
PUT    /api/posts/:id
DELETE /api/posts/:id
```

Then support query parameters on the collection endpoint:

```
GET /api/posts?search=phone
GET /api/posts?category=electronics
GET /api/posts?page=1&limit=10
```

Creation, editing, and deletion should use the authentication
middleware where required. Public reading can remain public if that
matches the application's intended behavior.

## Step 4: Search, Filter, and Pagination

### Searching

The listings page needs a search feature.

The backend should accept a search term and use it to find matching
listings. A search can normally check fields such as:

```
title
description
category
```

The search should be handled on the server rather than downloading
every listing to the browser and searching there.

For example, the frontend might eventually call something conceptually
similar to:

```
GET /api/posts?search=phone
```

The exact route prefix should match the project's server setup.

### Filtering by category

The project specifically requires sorting/filtering by category.

The backend should support a category parameter.

Conceptually:

```
GET /api/posts?category=electronics
```

The controller should apply the category filter only when one was
supplied. If no category is supplied, return the normal listing
collection.

### Pagination

Do not return thousands of listings at once.

The backend should support pagination using values such as:

```
page
limit
```

For example:

```
GET /api/posts?page=2&limit=10
```

The controller should calculate the correct number of documents to
skip and return enough information for the frontend to know whether
another page exists.

## Step 5: API Contract With Person B

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

```
search
category
page
limit
```

Write the agreed contract somewhere the two of you can both reference.

The most common integration problem is not that either person's code
is individually wrong — it is that they use different names or response
shapes.

## Step 6: Shared-File Rules

Part 3 will modify:

```
backend/models/Post.js
backend/controllers/postsController.js
backend/routes/posts.js
```

You own most of these files. Part 3 owns the like/dislike sections.

Therefore:

> **Do not overwrite the entire file when adding Part 3 functionality.**

If you have:

```js
const postSchema = new mongoose.Schema({
  ...
});
```

Part 3 should add its reaction-related fields to the existing schema.

Similarly, reaction controller functions should be added alongside your
listing controller functions rather than replacing them.

Talk to the Part 3 backend developer before merging their work.

## Step 7: Test Your Backend

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

## Your Task

1. Read every file above before writing anything.
2. Build `Post.js` with the fields shown.
3. Build `postsController.js` with create, read-all, read-one, update,
   and delete.
4. Build `routes/posts.js` and connect the controller functions.
5. Add search, category filter, and pagination to the read-all
   endpoint.
6. Agree on the API contract with Person B — write it down.
7. Tell the Part 3 backend developer which sections of the shared
   files they may modify.
8. Test every endpoint yourself before handing your work over.
