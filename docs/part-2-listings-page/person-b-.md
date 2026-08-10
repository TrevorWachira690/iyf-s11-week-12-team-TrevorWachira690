# Part 2 — Listings Page: Person B (Frontend)

## What You're Building

You're building the **frontend side of the listings feature**.

Your job is to make it possible for a customer to see listings, search for something, filter by category, open a listing, and understand the listing's current status.

Your main files are:

```text
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

Person A in your duo builds the backend API that supplies the data.

You should not invent a second data format. Agree with Person A on the API contract before wiring everything together.

---

## Before You Start

Read:

- `docs/PROJECT_OVERVIEW.md`
- `docs/TEAM_DIVISION.md`
- `docs/part-1-accounts-and-login/person-b-frontend.md`
- This document from beginning to end.

You should understand how authentication works before building pages that show information belonging to a logged-in business user.

---

# 1. Start With `PostCard.jsx`

Open:

```text
src/components/PostCard.jsx
```

A post card is the reusable piece of UI that represents one listing in a list/grid.

It should receive listing information through props instead of fetching its own data.

A card might display:

```text
Image
Title
Price
Category
Business name
Status
```

It should also provide a way to open the full listing.

Keep the card reusable. Do not hard-code one particular product into it.

---

# 2. Build `SearchBar.jsx`

Open:

```text
src/components/SearchBar.jsx
```

This component should allow a user to enter a search term.

The search bar should communicate the search value to its parent page.

Do not make the search bar responsible for rendering the entire listings page.

A useful pattern is:

```text
SearchBar
   │
   └── sends search term
          ↓
       Home.jsx
          ↓
       API request
          ↓
       backend
```

The backend should perform the actual search.

---

# 3. Build `StatusBadge.jsx`

Open:

```text
src/components/StatusBadge.jsx
```

This is a small reusable component that visually communicates a listing's status.

For example, depending on the project's agreed statuses:

```text
Available
Sold
Unavailable
```

The component should receive the status as a prop.

Do not duplicate the same status styling in every page.

---

# 4. Build `Home.jsx`

Open:

```text
src/pages/Home.jsx
```

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

```text
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

Keep the data-fetching logic in the page/service layer rather than putting the entire API implementation inside `PostCard`.

---

# 5. Search

When the user searches, send the search term to the backend.

For example:

```text
GET /api/posts?search=phone
```

The exact endpoint must match what Person A implements.

Do not download every listing and filter them only in React if the backend already supports search.

The backend should remain the source of truth.

---

# 6. CategoryPage.jsx

Open:

```text
src/pages/CategoryPage.jsx
```

This page should display listings belonging to one category.

A URL might eventually look like:

```text
/category/electronics
```

or another structure agreed with the group.

The page should read the selected category and request the appropriate listings from the backend.

For example:

```text
GET /api/posts?category=electronics
```

Do not hard-code a separate API function for every category.

---

# 7. BusinessListings.jsx

Open:

```text
src/pages/BusinessListings.jsx
```

This page is for viewing listings associated with a business/user.

The exact access rules should follow the project's authentication design.

If the page is intended to show the currently logged-in business's listings, use the authenticated user information rather than asking the user to type an arbitrary user ID.

If the backend exposes a business-specific endpoint, use that endpoint.

Coordinate with Person A before deciding the exact request.

---

# 8. PostDetail.jsx

Open:

```text
src/pages/PostDetail.jsx
```

This page displays one complete listing.

It should retrieve the listing ID from the route and request the corresponding post from the backend.

The page can display:

```text
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

Build the listing-detail portion cleanly and leave an obvious place for Part 3's interaction section.

Tell the Part 3 frontend developer what structure you used before they modify the page.

---

# 9. Loading, Error, and Empty States

A page should not remain blank while waiting for the server.

Provide clear states such as:

```text
Loading listings...
```

and:

```text
Unable to load listings. Please try again.
```

If the request succeeds but there are no results:

```text
No listings found.
```

The project already has:

```text
src/components/EmptyState.jsx
```

If that component is part of the team's agreed design, reuse it rather than creating another duplicate empty-state component.

---

# 10. Use `src/services/api.js`

The project identifies:

```text
src/services/api.js
```

as a shared file.

This is how the frontend talks to the backend.

Do not scatter raw `fetch()` calls throughout every component if the team's API service is intended to centralize them.

For example, the service might expose functions conceptually like:

```js
getPosts()
getPost(id)
searchPosts(term)
getPostsByCategory(category)
```

The exact implementation should match the team's existing API-service design.

### Shared-file warning

`src/services/api.js` is used by everyone.

If you need to add listing functions there:

> Tell the other team members before changing it.

Do not delete someone else's authentication functions or rewrite the entire file.

---

# 11. Routing and `App.jsx`

The project uses:

```text
src/App.jsx
```

to decide which page appears for each URL.

`App.jsx` is shared by everyone.

You may need to add routes such as:

```text
/
/category/:category
/business/:id
/post/:id
```

but agree on the final paths with the group leader and Part 1 developer.

Do not remove the routes belonging to Login, Register, Profile, or other parts of the application.

---

# 12. Make the Components Reusable

Avoid creating one huge component containing the entire listings system.

A good separation is:

```text
Home
 ├── SearchBar
 ├── filters
 └── PostCard
       └── StatusBadge
```

Then:

```text
PostDetail
 ├── listing information
 └── Part 3 interaction area
```

This makes the code easier for the other duo to extend.

---

# 13. Coordinate With Person A

Before you finish, confirm the backend contract.

You need to know:

### How to retrieve all posts

```text
GET /api/posts
```

### How to retrieve one post

```text
GET /api/posts/:id
```

### Search

```text
GET /api/posts?search=...
```

### Category

```text
GET /api/posts?category=...
```

### Pagination

```text
GET /api/posts?page=1&limit=10
```

The exact URLs may differ. **Use the URLs Person A actually implements.**

Also agree on the returned JSON fields.

Do not assume:

```js
post.name
```

when the backend actually returns:

```js
post.title
```

This kind of mismatch is one of the easiest ways for two independently written parts to break during integration.

---

# 14. Part 3 Integration

Part 3 will extend:

```text
src/pages/PostDetail.jsx
```

for comments and likes/dislikes.

They may also use the shared UI components and hooks.

Therefore:

- keep your listing-detail code readable
- don't overwrite their future interaction area
- tell them which section you own
- merge their changes carefully

If you both edit `PostDetail.jsx`, compare the changes before replacing the file.

---

# 15. Test Your Frontend

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

---

# Your Part 2 Frontend Checklist

Before handing your work over:

- [ ] `PostCard.jsx` works.
- [ ] `SearchBar.jsx` works.
- [ ] `StatusBadge.jsx` works.
- [ ] `Home.jsx` loads listings.
- [ ] Search works through the backend.
- [ ] Category filtering works.
- [ ] `CategoryPage.jsx` works.
- [ ] `BusinessListings.jsx` works.
- [ ] `PostDetail.jsx` works.
- [ ] Loading/error/empty states are handled.
- [ ] API calls match Person A's backend contract.
- [ ] Existing Part 1 routes have not been broken.
- [ ] Part 3 knows which section of `PostDetail.jsx` they can extend.

## What Person A Needs From You

Tell Person A:

1. Which response fields your components expect.
2. Which query parameters your search/filter UI sends.
3. Which endpoint you are using for business listings.
4. Which listing status values `StatusBadge` expects.
5. Which image format/URL the UI expects.

The two of you should test the frontend and backend together before declaring Part 2 complete.
