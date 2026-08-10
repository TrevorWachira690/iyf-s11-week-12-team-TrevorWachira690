# Part 1 — Person A: The Backend for Accounts

## What You're Building

You're building the part of the app that runs on the server and handles
accounts: creating a new account, logging in, checking passwords
safely, and remembering who's logged in.

## Files You Will Work In

Copy this exact folder path into your project. All paths start from the
top of the project (see the tree picture in `PROJECT_OVERVIEW.md` if
you're not sure).

```
backend/
├── models/
│   └── User.js
├── controllers/
│   └── authController.js
├── routes/
│   └── auth.js
├── middleware/
│   └── auth.js
└── scripts/
    └── hashingExercise.js
```

## Step 1: The User Model (`backend/models/User.js`)

This file describes what information gets saved about a user. Think of
it like a form with blank fields — this file decides what those fields
are.

Here is real, working code from this exact project you can look at and
learn from:

```js
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['business', 'customer'],
    default: 'customer',
  },
});
```

Read this line by line:
- `username`, `email`, `password` — normal text fields, each one has
  rules (like "must have at least 3 letters")
- `select: false` on password — this means when we ask the database for
  a user, it will NOT include their password by default. This is a
  safety habit, so passwords don't accidentally get sent somewhere they
  shouldn't.
- `role` — this is either `"business"` or `"customer"`. Nothing else is
  allowed. This is what decides if someone can post listings or not.

## Step 2: Scrambling Passwords Safely

We never save a password as plain text. If we did, and someone broke
into the database, they'd see everyone's real password. Instead, we
scramble it into something unreadable, called a "hash."

Practice this first in `backend/scripts/hashingExercise.js` — it's a
safe file that doesn't affect the real app, so you can experiment
without breaking anything.

Once you're comfortable, this is how it works for real, inside
`User.js`:

```js
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

In plain words: right before a user gets saved to the database, this
automatically scrambles their password first. You don't have to
remember to do this yourself every time — it just happens.

To check a password later (like when someone logs in), we use:

```js
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

This compares the password someone just typed against the scrambled one
we saved — without ever un-scrambling it. It just answers yes or no.

## Step 3: Registering a New Account (`backend/controllers/authController.js`)

```js
const register = async (req, res, next) => {
  try {
    const { username, email, password, role, businessName } = req.body;

    if (role && !['business', 'customer'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "business" or "customer"' });
    }

    if (role === 'business' && !businessName) {
      return res.status(400).json({ error: 'Business accounts must provide a business name' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    const user = new User({ username, email, password, role });
    await user.save();
    // ... then we create a token and send it back
  } catch (err) {
    next(err);
  }
};
```

Walk through what this does, in order:
1. Check the role is actually `"business"` or `"customer"` — reject
   anything else
2. If they picked `"business"`, make sure they also gave a business
   name
3. Check nobody else already has that email or username
4. Only then, actually create the account

## Step 4: Checking Who's Logged In (`backend/middleware/auth.js`)

```js
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const decoded = jwt.verify(token, config.jwtSecret);
  const user = await User.findById(decoded.id);

  req.user = user;
  next();
}
```

Every time someone tries to do something that requires being logged in
(like posting a listing), this code runs first. It checks: is there a
token? Is it valid? If yes, it looks up that user and attaches them to
the request so the rest of the code knows who's asking.

## Your Task

1. Read every file above before writing anything.
2. Practice password hashing in `hashingExercise.js` first.
3. Test registering both a business account and a customer account —
   make sure the business one is rejected if you leave the business
   name blank.
4. Talk to Person B in your duo about what the login/register response
   looks like — they need that exact shape on the frontend side.
