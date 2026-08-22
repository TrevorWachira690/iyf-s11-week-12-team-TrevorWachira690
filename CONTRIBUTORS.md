# Contributors

## Team Members

| Name | GitHub | Role | Contributions |
|------|--------|------|---------------|
| Trevor Wachira | [@TrevorWachira690](https://github.com/TrevorWachira690) | Group Lead | Project setup, documentation, integration, code review, conflict resolution |
| Brian Mwangi | [@brianirungu224-sys](https://github.com/brianirungu224-sys) | Part 3 Backend | Comment routes, like/dislike endpoints, backend Part 3 implementation |
| Gilbert  | [@dream333wxrld-juice](https://github.com/dream333wxrld-juice) | Part 1 Backend | User model, auth controller, JWT middleware, MongoDB setup, error handling |
| Christine Kamau | [@kaywambui-1](https://github.com/kaywambui-1) | Part 1 Frontend | Login/register pages, auth context, protected routes, dark mode, header/footer |
| Antony Juma | [@itskaysir](https://github.com/itskaysir) | Part 2 Backend | Post model, listings CRUD, search, category filter, pagination, authorization |
| Antony Junma | [@itskaysir](https://github.com/itskaysir) | Part 2 Frontend | Home page, listing cards, category page, post detail layout, search bar, status badges |
| Jacob Mbuco | [@jacobricktified](https://github.com/jacobricktified) | Part 3 Frontend | Comments UI, reactions, dashboard, shared components, hooks, API service |

## Contribution Breakdown

### Trevor Wachira — Group Lead
- Initialized the repository and configured the full project structure
- Created the documentation framework in `docs/` with Part 1, Part 2, and Part 3 guides
- Defined shared-file rules, API contracts, and team division standards
- Reviewed and merged all pull requests across all three parts
- Resolved merge conflicts in shared files (`server.js`, `postsController.js`)
- Coordinated API contracts between duos to ensure frontend and backend compatibility
- Set up Git workflow with branches, PR templates, and protected main branch
- Verified that all committed backend code integrated correctly with the Express server

### Brian Mwangi — Part 3 Backend
- Implemented `routes/comments.js` with endpoints for fetching, creating, and deleting comments
- Added like and dislike route handlers to the backend
- Configured comments and likes routes to work with the existing Express server
- Merged Part 3 backend work into main via pull request #4
- Participated in integrating Part 3 routes with the existing MongoDB and Mongoose setup

### [Part 1 Backend] — Part 1 Backend
- Built the `User` Mongoose model with username, email, password, role, and business profile fields
- Implemented bcrypt password hashing and the `comparePassword` authentication method
- Created `authController.js` with register, login, and getMe endpoints
- Built `requireAuth` middleware to verify JWT tokens and attach the authenticated user to `req.user`
- Set up Express server configuration and MongoDB connection in `server.js`
- Added `.env` to `.gitignore` and configured local development environment variables
- Implemented `errorHandler` middleware for validation errors and duplicate key handling
- Debugged initial model configuration issues to ensure MongoDB compatibility

### Christine Kamau — Part 1 Frontend
- Scaffolded login and registration pages (`Login.jsx`, `Register.jsx`) with form structures
- Set up `AuthContext` for global authentication state management
- Created `ProtectedRoute.jsx` wrapper to guard authenticated pages
- Configured dark mode infrastructure with `useLocalStorage` persistence
- Styled header and footer components with responsive Tailwind CSS classes
- Wired frontend auth forms to backend API endpoints

### Amntony Juma — Part 2 Backend
- Designed the `Post` Mongoose model with title, description, price, category, images, author, and status fields
- Implemented full CRUD operations in `postsController.js` (create, read, update, delete)
- Added search functionality with case-insensitive regex matching across title, description, and category
- Built category filtering and pagination with skip/limit logic and total page counts
- Implemented authorization checks so users can only modify their own listings
- Populated author data in API responses for consistent frontend consumption
- Configured listing status workflow (active, published, archived)

### Antony Juma — Part 2 Frontend
- Built the `Home.jsx` listings page with grid layout structure
- Created `PostCard.jsx` as a reusable component for listing previews
- Implemented `CategoryPage.jsx` for filtered browsing by category
- Added `SearchBar.jsx` with keyword input component
- Built `PostDetail.jsx` layout for individual listing views
- Added `StatusBadge.jsx` for listing status indicators
- Implemented `SEO.jsx` for meta tag management
- Set up `HeroSection.jsx` for the landing page
- Configured `Layout` components for consistent page structure

### Jacob Mbuco — Part 3 Frontend
- Extended `PostDetail.jsx` with comments section and comment creation form
- Added like and dislike reaction controls with visual state feedback
- Built `ConfirmDialog.jsx` for destructive action confirmations
- Created reusable `Button.jsx`, `Card.jsx`, and `Input.jsx` shared components
- Implemented `useFetch.js`, `useForm.js`, `useToggle.js`, and `useLocalStorage.js` custom hooks
- Built `AdminDashboard.jsx` for business owner listing management
- Added export and import UI with file upload handling and error states
- Wrote API service functions in `src/services/api.js`
- Ensuring loading and error states are handled across all interactive features
