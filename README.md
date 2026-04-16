# 🍽️ Recipe App — React Native

A full-stack mobile recipe application built with **React Native (Expo)**, **Clerk authentication**, and a **Node.js + NeonDB (PostgreSQL)** backend. Browse recipes from TheMealDB, save your favourites, and manage your account — all from your phone.

---

## 📱 Features

- **Authentication** — Email/password sign-up & sign-in via Clerk (with email verification on sign-up)
- **Home Screen** — Browse a featured recipe + 12 random recipes with pull-to-refresh
- **Category Filter** — Filter recipes by meal category (Beef, Chicken, Seafood, etc.)
- **Recipe Detail** — Full ingredients list and step-by-step cooking instructions
- **Search** — Search any meal by name using TheMealDB API
- **Favourites** — Save/remove favourite recipes, persisted to a PostgreSQL database (NeonDB)
- **Backend Status Indicator** — Live indicator on the home screen showing backend connectivity

---

## 🗂️ Project Structure

```
Recipe_App_React_native/
├── backend/                  # Node.js + Express API server
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js         # Drizzle ORM + NeonDB connection
│   │   │   └── env.js        # Environment variable loader
│   │   ├── db/
│   │   │   ├── schema.js     # Drizzle schema (favorites table)
│   │   │   └── migrations/   # Auto-generated SQL migrations
│   │   └── server.js         # Express routes (favorites CRUD + health check)
│   ├── drizzle.config.js     # Drizzle Kit config
│   ├── .env                  # Backend environment variables (see below)
│   └── package.json
│
└── mobile/                   # Expo React Native app
    ├── app/
    │   ├── (auth)/
    │   │   ├── sign-in.jsx   # Sign-in screen
    │   │   ├── sign-up.jsx   # Sign-up screen
    │   │   ├── verify-email.jsx # Email verification (sign-up flow)
    │   │   └── _layout.jsx
    │   ├── (tabs)/
    │   │   ├── index.jsx     # Home screen
    │   │   ├── search.jsx    # Search screen
    │   │   ├── favorites.jsx # Favourites screen
    │   │   └── _layout.jsx
    │   ├── recipe/           # Recipe detail screen
    │   └── _layout.jsx       # Root layout (Clerk provider)
    ├── components/           # Reusable UI components
    ├── constants/            # Colors, API URL constants
    ├── services/
    │   └── mealAPI.js        # TheMealDB API integration
    ├── assets/               # Images, fonts, styles
    ├── .env                  # Mobile environment variables (see below)
    └── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Mobile Framework | React Native 0.81 + Expo SDK 54 |
| Routing | Expo Router (file-based) |
| Authentication | Clerk (`@clerk/clerk-expo`) |
| Recipe Data | [TheMealDB API](https://www.themealdb.com/api.php) (free, no key needed) |
| Backend | Node.js + Express 5 |
| Database | NeonDB (serverless PostgreSQL) |
| ORM | Drizzle ORM + Drizzle Kit |
| Deployment | Vercel (backend as serverless function) |

---

## ✅ Prerequisites

Make sure you have the following installed before starting:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- [Expo Go](https://expo.dev/go) app on your phone **or** an Android/iOS emulator
- A [Clerk](https://clerk.com/) account (free tier is sufficient)
- A [NeonDB](https://neon.tech/) account (free tier is sufficient)

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Recipe_App_React_native.git
cd Recipe_App_React_native
```

---

### 2. Backend Setup

#### 2a. Install dependencies

```bash
cd backend
npm install
```

#### 2b. Create the `.env` file

Create a file called `.env` inside the `backend/` folder:

```env
PORT=5001
DATABASE_URL="postgresql://<user>:<password>@<host>/<dbname>?sslmode=require"
NODE_ENV=development
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
```

> **Where to get these values:**
> - `DATABASE_URL` — From your [NeonDB dashboard](https://console.neon.tech/) → your project → **Connection string** (choose "Pooled connection")
> - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` — From your [Clerk dashboard](https://dashboard.clerk.com/) → your app → **API Keys**

#### 2c. Run database migrations

This creates the `favorites` table in your NeonDB database:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

#### 2d. Start the backend server

```bash
# Development (auto-restarts on file changes)
npm run dev

# OR production
npm start
```

The server will start at: `http://localhost:5001`

You can verify it's running by visiting: `http://localhost:5001/api/health`
It should return: `{ "status": true }`

---

### 3. Mobile Setup

#### 3a. Install dependencies

```bash
cd ../mobile
npm install
```

#### 3b. Create the `.env` file

Create a file called `.env` inside the `mobile/` folder:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
```

> Use the **same Clerk Publishable Key** from your Clerk dashboard.

#### 3c. Set the backend API URL

Open `mobile/constants/api.js` (or the file that exports `API_URL`) and update it to point to your running backend:

```js
// For running on a physical device via Expo Go:
export const API_URL = "http://YOUR_LOCAL_IP:5001/api";

// For Android Emulator:
export const API_URL = "http://10.0.2.2:5001/api";

// For iOS Simulator:
export const API_URL = "http://localhost:5001/api";
```

> **Finding your local IP (Windows):** Open a terminal and run `ipconfig`. Look for the **IPv4 Address** under your active Wi-Fi adapter (e.g., `192.168.1.5`).

> ⚠️ Your phone and computer must be on the **same Wi-Fi network**.

#### 3d. Start the Expo development server

```bash
npm start
```

This opens the **Expo Dev Tools** in your browser and shows a QR code.

---

## 📲 Running the App on Your Device

### Option A — Expo Go (Easiest, recommended for development)

1. Install **Expo Go** from the [App Store](https://apps.apple.com/app/expo-go/id982107779) or [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Scan the QR code shown after running `npm start` in the `mobile/` folder
3. The app will load on your phone

### Option B — Android Emulator

1. Install [Android Studio](https://developer.android.com/studio) and set up an AVD (Android Virtual Device)
2. Start the emulator
3. Run:
   ```bash
   npm run android
   ```

### Option C — iOS Simulator (macOS only)

1. Install Xcode from the Mac App Store
2. Run:
   ```bash
   npm run ios
   ```

---

## 🔑 Clerk Authentication Setup

1. Go to [https://dashboard.clerk.com/](https://dashboard.clerk.com/) and create a new application
2. Choose **Email** as the sign-in method
3. Copy your **Publishable Key** and paste it into both `.env` files
4. In Clerk Dashboard → **Email, Phone, Username** settings, make sure **Email address** is enabled
5. In Clerk Dashboard → **Email templates**, the verification email is sent automatically on sign-up — no extra config needed

---

## 🗄️ Database Schema

The only table used is `favorites`:

| Column | Type | Description |
|---|---|---|
| `id` | serial (PK) | Auto-increment primary key |
| `user_id` | text | Clerk user ID |
| `recipe_id` | integer | TheMealDB meal ID |
| `title` | text | Recipe title |
| `image` | text | Recipe thumbnail URL |
| `cook_time` | text | Estimated cook time |
| `servings` | text | Number of servings |
| `created_at` | timestamp | Timestamp (auto) |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/favorites/:userId` | Get all favourites for a user |
| `POST` | `/api/favorites` | Add a recipe to favourites |
| `DELETE` | `/api/favorites/:userId/:recipeId` | Remove a recipe from favourites |

---

## 🍱 TheMealDB API

Recipe data is fetched directly from the free [TheMealDB API](https://www.themealdb.com/api.php) — **no API key required**.

| Use | Endpoint |
|---|---|
| Random meal | `/random.php` |
| Search by name | `/search.php?s={name}` |
| Meal by ID | `/lookup.php?i={id}` |
| All categories | `/categories.php` |
| Filter by category | `/filter.php?c={category}` |

---

## 🧹 Common Issues

### ❌ "Network request failed" on device
- Make sure your phone and PC are on the **same Wi-Fi network**
- Double-check the `API_URL` uses your PC's **local IP address**, not `localhost`
- Temporarily disable your firewall or allow port `5001`

### ❌ Clerk errors on sign-in / sign-up
- Verify the `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in `mobile/.env` matches your Clerk dashboard
- Ensure Email is enabled as a sign-in method in Clerk

### ❌ Database connection errors
- Verify the `DATABASE_URL` in `backend/.env` is the **pooled** connection string from NeonDB
- Make sure you ran `npx drizzle-kit migrate` to create the `favorites` table

### ❌ Expo QR code not scanning
- Try running `npm start -- --tunnel` to get a tunnelled URL that works across different networks

---

## 📦 Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build for Android (.apk or .aab)
eas build --platform android

# Build for iOS (.ipa)
eas build --platform ios
```

EAS build config is already present in `mobile/eas.json`.

---

## 📄 License

This project is for educational/personal use. Recipe data is provided by [TheMealDB](https://www.themealdb.com/) under their free API terms.
