# Part 1 — Person B: The Pages People See for Accounts

## What You're Building

You're building the pages a person actually sees and clicks on: the
login page, the sign-up page, the profile page, and the header/footer
that shows on every page of the site.

## Files You Will Work In

All paths start from the top of the project (see the tree picture in
`PROJECT_OVERVIEW.md` if you're not sure).

```
src/
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Profile.jsx
├── components/
│   ├── ProtectedRoute.jsx
│   ├── HeroSection.jsx
│   ├── SEO.jsx
│   └── Layout/
│       ├── Header.jsx
│       ├── Footer.jsx
│       └── Sidebar.jsx
└── hooks/
    └── useDarkMode.js
```

## Step 1: Remembering Who's Logged In (`src/context/AuthContext.jsx`)

When someone logs in, the app needs to remember that — on every page,
not just the one they logged in on. This file's job is to hold that
information in one place that the whole app can check.

```js
async function register(name, email, password, role, businessType, businessName, whatsappNumber) {
  const data = await api.register({
    name,
    email,
    password,
    role,
    businessType,
    businessName: businessName || '',
    whatsappNumber: whatsappNumber || '',
  });
  localStorage.setItem('token', data.token);
  setUser(data.user);
  return data.user;
}
```

This function takes each piece of information as a separate item (name,
then email, then password, and so on — this is called a "positional
argument," meaning the order matters), packages them into one object,
and sends that to the backend. Once the backend replies with a token
(proof you're logged in), it's saved in `localStorage` — a small storage
space in the browser that survives even if you refresh the page.

**⚠️ Something to check and fix:** the object being sent uses the key
`name`, but Person A's backend code
(`backend/controllers/authController.js`) expects a field called
`username`. Right now, these don't match, which means the username
never actually gets saved correctly. Talk to Person A about this and
agree on one name to use everywhere — either change this file to send
`username`, or change the backend to accept `name`. Fix this together
before building more on top of it.

## Step 2: The Sign-Up Page (`src/pages/Register.jsx`)

```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  businessName: '',
  whatsappNumber: '',
});
const [role, setRole] = useState('customer');
```

Every input box on the page (name, email, password, and so on) has its
own little piece of memory, called "state." `useState('customer')` for
`role` means the page assumes "customer" until the person clicks a
different option — customer is the simpler path, so it's a sensible
default.

```jsx
await register(
  formData.name,
  formData.email,
  formData.password,
  role,
  businessType,
  role === 'business' ? formData.businessName : '',
  role === 'business' ? formData.whatsappNumber : ''
);
```

Notice the last two lines: `businessName` and `whatsappNumber` are only
actually sent if `role === 'business'`. If someone picked "customer,"
those get sent as empty text instead — because a customer account
doesn't need a business name.

## Step 3: Only Logged-In Users Can See Some Pages (`src/components/ProtectedRoute.jsx`)

Some pages (like the dashboard where a business manages their listings)
should only be visible if you're logged in. This component is a
wrapper — you put it around a page, and it checks first before showing
anything.

## Step 4: The Header and Dark Mode (`src/components/Layout/Header.jsx`, `src/hooks/useDarkMode.js`)

```js
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return [isDark, setIsDark];
}
```

This checks two things when the page first loads: did the person
already choose dark mode before (saved in `localStorage`)? If not, does
their device/browser already prefer dark mode? Either way, once
`isDark` is `true`, it adds a special label (`"dark"`) to the whole
page, which is what makes everything switch to dark colors at once.

This is already wired into `Header.jsx` — open that file to see exactly
where the toggle button calls this.

## Your Task

1. Read every file above before writing anything.
2. **Fix the `name`/`username` mismatch with Person A first** — this is
   currently a real bug that will stop every sign-up from working
   correctly.
3. Test signing up as both a business and a customer.
4. Check the header, footer, and both pages look right in dark mode,
   not just light mode.
5. Decide, with your part's group, whether `Sidebar.jsx` should be used
   somewhere — right now it exists but nothing shows it on the page.
