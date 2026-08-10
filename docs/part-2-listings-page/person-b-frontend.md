# Part 2 — Person B: The Frontend for Listings

## What You're Building

You're building the pages a person actually sees and clicks on: the
home page with all listings, the category page, the business listings
page, and the single listing detail page.

Person A in your duo builds the backend API that supplies the data.

You should not invent a second data format. Agree with Person A on the
API contract before wiring everything together.

## Files You Will Work In

All paths start from the top of the project (see the tree picture in
`PROJECT_OVERVIEW.md` if you're not sure).

```
src/
├── components/
│   ├── PostCard.jsx
│   ├── SearchBar.jsx
│   └── StatusBadge.jsx
└── pages/
    ├── Home.jsx
    ├── CategoryPage.jsx
    ├── BusinessListings.jsx
    └── PostDetail.jsx
```

## Step 1: The Post Card (`src/components/PostCard.jsx`)

A post card is the reusable piece of UI that represents one listing in
a list or grid.

It should receive listing information through props instead of
fetching its own data.

A card might display:

```
Image
Title
Price
Category
Business name
Status
```

It should also provide a way to open the full listing.

Keep the card reusable. Do not hard-code one particular product into
it.

## Step 2: The Search Bar (`src/components/SearchBar.jsx`)

This component should allow a user to enter a search term.

The search bar should communicate the search value to its parent page.

Do not make the search bar responsible for rendering the entire
listings page.

A useful pattern is:

```
SearchBar
   └── sends search term
          ↓
       Home.jsx
          ↓
       API request
          ↓
    backend
```

The backend should perform the actual search.

## Step 3: The Status Badge (`src/components/StatusBadge.jsx`)

This is a small reusable component that visually communicates a
listing's status.

For example, depending on the project's agreed statuses:

```
Available
Sold
Unavailable
```

The component should receive the status as a prop.

Do not duplicate the same status styling in every page.

## Step 4: The Home Page (`src/pages/Home.jsx`)

This is the main listing/discovery page.

It should:
1. Load listings from the backend.
2. Display them using `PostCard`.
3. Provide search.
4. Provide category filtering.
5. Handle loading.
6. Handle errors.
7. Handle the case where there are no listings.
8. Support pagination if Person A's API provides it.

Conceptually:

```
Home
│
├── SearchBar
│
├── Category controls
│
└── Listings
    ├── PostCard
    ├── PostCard
    ├── PostCard
    └── ...
```

Keep the data-fetching logic in the page/service layer rather than
putting the entire API implementation inside `PostCard`.

## Step 5: Search

When the user searches, send the search term to the backend.

For example:

```
GET /api/posts?search=phone
```

The exact endpoint must match what Person A implements.

Do not download every listing and filter them only in React if the
backend already supports search. The backend should remain the source
of truth.

## Step 6: Category Page (`src/pages/CategoryPage.jsx`)

This page should display listings belonging to one category.

A URL might eventually look like:

```
/category/electronics
```

or another structure agreed with the group.

The page should read the selected category and request the
appropriate listings from the backend.

For example:

```
GET /api/posts?category=electronics
```

Do not hard-code a separate API function for every category.

## Step 7: Business Listings (`src/pages/BusinessListings.jsx`)

This page is for viewing listings associated with a business or user.

The exact access rules should follow the project's authentication
design.

If the page is intended to show the currently logged-in business's
listings, use the authenticated user information rather than asking
the user to type an arbitrary user ID.

If the backend exposes a business-specific endpoint, use that
endpoint. Coordinate with Person A before deciding the exact request.

## Step 8: Listing Detail (`src/pages/PostDetail.jsx`)

This page displays one complete listing.

It should retrieve the listing ID from the route and request the
corresponding post from the backend.

The page can display:

```
Title
Images
Description
Price
Category
Business information
Status
```

It should also handle:
- loading
- errors
- nonexistent listings

### Important Part 3 boundary

Part 3 will also use this page.

Part 3's frontend developer will add:
- comments
- like/dislike controls

Therefore:

> **Do not treat `PostDetail.jsx` as exclusively yours.**

Build the listing-detail portion cleanly and leave an obvious place for
Part 3's interaction section. Tell the Part 3 frontend developer what
structure you used before they modify the page.

## Step 9: Loading, Error, and Empty States

A page should not remain blank while waiting for the server.

Provide clear states such as:

```
Loading listings...
```

and:

```
Unable to load listings. Please try again.
```

If the request succeeds but there are no results:

```
No listings found.
```

The project already has:

```
src/components/EmptyState.jsx
```

If that component is part of the team's agreed design, reuse it
rather than creating another duplicate empty-state component.

## Step 10: Use `src/services/api.js`

The project identifies:

```
src/services/api.js
```

as a shared file. This is how the frontend talks to the backend.

Do not scatter raw `fetch()` calls throughout every component if the
team's API service is intended to centralize them.

For example, the service might expose functions conceptually like:

```js
getPosts()
getPost(id)
searchPosts(term)
getPostsByCategory(category)
```

The exact implementation should match the team's existing API-service
design.

### Shared-file warning

`src/services/api.js` is used by everyone.

If you need to add listing functions there:

> Tell the other team members before changing it.

Do not delete someone else's authentication functions or rewrite the
entire file.

## Step 11: Routing and `App.jsx`

The project uses:

```
src/App.jsx
```

to decide which page appears for each URL.

`App.jsx` is shared by everyone.

You may need to add routes such as:

```
/
/category/:category
/business/:id
/post/:id
```

but agree on the final paths with the group leader and Part 1
developer. Do not remove the routes belonging to Login, Register,
Profile, or other parts of the application.

## Step 12: Make the Components Reusable

Avoid creating one huge component containing the entire listings
system.

A good separation is:

```
Home
 ├── SearchBar
 ├── filters
 └── PostCard
       └── StatusBadge
```

Then:

```
PostDetail
 ├── listing information
 └── Part 3 interaction area
```

This makes the code easier for the other duo to extend.

## Step 13: Coordinate With Person A

Before you finish, confirm the backend contract.

You need to know:

### How to retrieve all posts

```
GET /api/posts
```

### How to retrieve one post

```
GET /api/posts/:id
```

### Search

```
GET /api/posts?search=...
```

### Category

```
GET /api/posts?category=...
```

### Pagination

```
GET /api/posts?page=1&limit=10
```

The exact URLs may differ. **Use the URLs Person A actually
implements.**

Also agree on the returned JSON fields.

Do not assume:

```js
post.name
```

when the backend actually returns:

```js
post.title
```

This kind of mismatch is one of the easiest ways for two
independently written parts to break during integration.

## Step 14: Part 3 Integration

Part 3 will extend:

```
src/pages/PostDetail.jsx
```

for comments and likes/dislikes. They may also use the shared UI
components and hooks.

Therefore:
- keep your listing-detail code readable
- don't overwrite their future interaction area
- tell them which section you own
- merge their changes carefully

If you both edit `PostDetail.jsx`, compare the changes before
replacing the file.

## Step 15: Test Your Frontend

Test the actual browser experience.

### Home
- [ ] Listings load.
- [ ] Cards display correctly.
- [ ] Search works.
- [ ] Category filtering works.
- [ ] Pagination works if implemented.
- [ ] Loading state appears.
- [ ] Error state appears.
- [ ] Empty state appears.

### Post detail
- [ ] Clicking a card opens the correct listing.
- [ ] Listing details load.
- [ ] Invalid IDs are handled.
- [ ] Images display correctly.
- [ ] Status displays correctly.

### Business listings
- [ ] Correct business listings are displayed.
- [ ] Authentication rules are respected.

### Integration
- [ ] Login/register routes still work.
- [ ] Existing header/footer still work.
- [ ] You did not remove another team's routes.
- [ ] Part 3 can extend `PostDetail.jsx`.

## Your Task

1. Read every file above before writing anything.
2. Build `PostCard.jsx`, `SearchBar.jsx`, and `StatusBadge.jsx`.
3. Build `Home.jsx` and connect it to Person A's backend.
4. Build `CategoryPage.jsx` and `BusinessListings.jsx`.
5. Build `PostDetail.jsx` and leave a clear space for Part 3.
6. Agree on the API contract with Person A — write it down.
7. Add any needed routes to `App.jsx` without breaking existing ones.
8. Test every page and component before declaring your part complete.
