# React Native (Mobile) Guide for Salah Counter

Your app is currently **Next.js (web)**. To have a **React Native (iOS/Android)** version that uses the same data, you run a **separate React Native app** that talks to your **existing deployed API** (e.g. Vercel).

---

## Overview

```
┌─────────────────────┐         ┌──────────────────────────────┐
│  Next.js (Web)      │         │  React Native (Expo)         │
│  - Vercel           │   API   │  - iOS / Android             │
│  - Login + Table    │ ◄─────► │  - Same API (completions,    │
│  - API routes       │         │    qaza, auth)               │
└──────────┬──────────┘         └──────────────────────────────┘
           │
           ▼
   ┌───────────────┐
   │  Neon Postgres │  (shared database)
   └───────────────┘
```

- **Web:** Stays as-is (Next.js on Vercel).
- **Mobile:** New Expo app that calls `https://your-app.vercel.app/api/...`.
- **Database:** Same Neon DB; both apps read/write via your API.

---

## Step 1: Create the React Native (Expo) app

In a **sibling folder** (or inside this repo in a folder like `mobile/`):

```bash
# From your projects folder (e.g. Documents/Programming)
npx create-expo-app@latest SalahCounterMobile --template blank-typescript
cd SalahCounterMobile
```

Install dependencies you’ll need:

```bash
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
```

---

## Step 2: API base URL and auth

Your mobile app will call the **same API** as the web app.

1. **Base URL**  
   Use your deployed URL, e.g.  
   `https://salah-counter.vercel.app`  
   (no trailing slash).

2. **Auth on mobile**  
   NextAuth is cookie-based and built for web. For React Native you have two options:

   - **Option A (simplest for now):** In the mobile app, open your **web login page in a WebView**; after login, the web app sets the session cookie. Then use a **cookie-aware** HTTP client (or the same WebView) to call the API. This is a bit clunky but works without backend changes.

   - **Option B (better UX):** Add a **token-based login** to your Next.js app:
     - New route: `POST /api/auth/token` with `{ username, password }`.
     - On success, return a JWT (or opaque token) and store it in Neon or in memory (e.g. with a short TTL).
     - In `POST /api/completions` (and any other protected route), accept an `Authorization: Bearer <token>` header and validate the token instead of (or in addition to) the session cookie.
     - In the mobile app, store the token (e.g. in AsyncStorage) and send it on every request.

If you want, we can add Option B (token endpoint + auth middleware) to your existing Next.js app next.

---

## Step 3: What to build in the mobile app

Reuse the **same logic** as the web app, but with React Native components:

| Web (current)        | React Native equivalent              |
|----------------------|--------------------------------------|
| `<table>` + rows     | `FlatList` or `ScrollView` + `View`  |
| Fajar…Isha columns  | Row of touchables or buttons         |
| Qaza dropdown       | Picker or modal with 0–5             |
| Month navigation    | Same state; buttons “Prev” / “Next”  |
| Donut charts        | `react-native-svg` or a simple chart |
| `fetch('/api/...')`  | `fetch(API_BASE + '/api/...')`       |
| localStorage        | `AsyncStorage`                       |

- **Screens:** e.g. Login (or WebView to your login page) → Main (table + month selector) → same monthly report (totals, fines, qaza).
- **State:** Same as web: `completions`, `qaza`, `year`, `month`; load from API on mount, persist to API on toggle/change.
- **Types:** Copy or share the same TypeScript types (completions map, qaza map, API request/response shapes).

---

## Step 4: Shared types / API contract

So web and mobile stay in sync, keep the API contract in one place:

- **GET** ` /api/completions`  
  - Response: `{ completions: Record<string, boolean>, qaza: Record<string, number> }`
- **POST** ` /api/completions`  
  - Body: `{ key, completed }` (prayer toggle) or `{ date, qaza }` (qaza update)  
  - Auth: session cookie (web) or `Authorization: Bearer <token>` (mobile, if you add token auth).

You can put shared types in a small `packages/shared` or duplicate a single `api-types.ts` in both repos.

---

## Step 5: Run the mobile app

```bash
cd SalahCounterMobile
npx expo start
```

- Press `i` for iOS simulator or `a` for Android emulator, or scan the QR code with Expo Go on a device.
- Point the app at `https://your-app.vercel.app` (or your real URL) for all `fetch` calls.

---

## Checklist

- [ ] Create Expo app (Step 1).
- [ ] Decide auth: WebView login (A) or token endpoint (B).
- [ ] Implement API client (base URL + fetch for GET/POST completions and, if needed, login/token).
- [ ] Build main screen: month selector, table (list of days, row = date + 5 prayers + qaza).
- [ ] Persist to API on toggle and qaza change; load from API on mount and when changing month.
- [ ] Add monthly report (totals, fines, qaza) using same formulas as web.
- [ ] (Optional) Share types between web and mobile (monorepo or copy).

If you tell me whether you prefer **WebView login** or **token-based login**, I can outline the exact API changes and a minimal React Native screen layout (with code) for your repo.
