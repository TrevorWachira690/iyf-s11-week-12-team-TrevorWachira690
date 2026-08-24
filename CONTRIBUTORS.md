# Contributors

## Team Members

| Name | GitHub | Role | Contributions |
|------|--------|------|---------------|
| Trevor Wachira | [@TrevorWachira690](https://github.com/TrevorWachira690) | Team Lead & Data Modeling | Database schemas, coordination, debugging, documentation, deployment |
| Gilbert | [@dream333wxrld-juice](https://github.com/dream333wxrld-juice) | Backend Authentication | Login protection and access control |
| Christine | [@kaywambui-1](https://github.com/kaywambui-1) | User Profiles | Viewing and editing profiles |
| Kaysir | [@itskaysir](https://github.com/itskaysir) | Backend Configuration & API Routing | Database connection setup and API endpoints |
| Jacob | [@jacobricktified](https://github.com/jacobricktified) | Authentication & Post Feed | Login, registration, and the post feed |
| Brian | [@brianirungu224-sys](https://github.com/brianirungu224-sys) | Landing Page & Messaging | Homepage and Direct Messaging |

## Contribution Breakdown

### Trevor Wachira — Team Lead & Data Modeling
- Defined the database schemas (`backend/models/`) that determine what information the app stores and how it's structured — for example, what a user account or a post actually contains
- Coordinated the team and reviewed contributions across the project
- Debugged issues across the app, including deployment and integration problems
- Wrote and maintained project documentation
- Deployed the application

### Gilbert — Backend Authentication
- Built the middleware that checks whether a request is coming from a logged-in user before allowing it through
- This is what prevents someone from accessing protected parts of the app (like posting or messaging) without being logged in
- Verifies login tokens on every protected request, rejecting anything invalid or expired

### Christine — User Profiles
- Built the page that displays a user's profile information
- Built the page that lets a user edit their own profile details
- Together, these let users see and manage how they appear to others in the app

### Kaysir — Backend Configuration & API Routing
- Set up the app's core configuration, including how the backend connects to the database
- Defined the API routes — the actual URLs the frontend calls to fetch or send data (e.g. getting posts, sending a message)
- This is the backbone that connects the frontend's requests to the right backend logic

### Jacob — Authentication & Post Feed
- Built the login page, where existing users sign in
- Built the registration page, where new users create an account
- Built the post feed page, where users can browse everyone's posts

### Brian — Landing Page & Messaging
- Built the homepage, the first page visitors see when they open the app
- Built the messaging page, where users can view and send direct messages to each other
