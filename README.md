# Jotish Employee Insights Dashboard

A 4-screen employee dashboard built with React + Vite for the Jotish internship assignment. Has login, a virtualized employee list, identity verification with camera + signature, and a results page with charts and a map.

---

## Tech Stack

React 18, Vite, React Router v6, Tailwind CSS v3, Context API, Leaflet — all vanilla, no UI component libraries, no virtualization libraries.

---

## Screens

| Route | Description |
|---|---|
| `/login` | Auth with Context API + localStorage persistence |
| `/list` | Virtualized employee grid |
| `/details/:id` | Camera capture, signature, image merge |
| `/result` | Audit image + SVG salary chart + city map |

---

## Running Locally

```bash
npm install
npm run dev
```

Login: `testuser` / `Test123`

---

## How the Virtualization Works

Instead of rendering all rows at once, only the visible rows plus a small buffer are in the DOM.

```
startIndex = Math.floor(scrollTop / ROW_HEIGHT)
endIndex   = startIndex + visibleCount + BUFFER
offsetY    = startIndex * ROW_HEIGHT
```

A full-height wrapper div keeps the scrollbar accurate. `translateY(offsetY)` pushes the rendered rows to their correct visual position. At any point only ~15 rows exist in the DOM.

---

## Image Merging

The photo is captured from the video feed onto a hidden canvas. A transparent signature canvas sits on top of it. On confirm, both canvases are drawn onto a third offscreen canvas sequentially — photo first, signature on top — and exported as a single Base64 PNG via `toDataURL`. Saved to localStorage per employee under `verified_{id}`.

---

## Geospatial Mapping

Leaflet doesn't get coordinates from the API so I wrote a static city-to-coordinate lookup table in `src/utils/cityCoordinates.js`. Each city name is matched against it to place markers. Unmatched cities are filtered out.

---

## Intentional Bug — Security Vulnerability

**Type:** Client-Side Authentication Bypass

**Location:** `src/context/AuthContext.jsx` + `src/App.jsx`

The auth system runs entirely in the browser. Login just saves a username string to localStorage and reads it back — no server, no token, no signature. Anyone can open the console, run `localStorage.setItem('auth_user', 'testuser')` and navigate to `/list` — fully authenticated without a password.

**Why I chose it:** It's a realistic mistake that shows up in real projects. The client should never be the source of truth for access control.

---

## How to Fix It

The fix is JWT-based auth with httpOnly cookies.

- **Backend** (`/login` route): validate credentials, sign a JWT with a secret key, set it as an httpOnly cookie with an expiry
- **Backend** (middleware): verify the JWT on every protected request — reject if missing or expired
- **Frontend** (`src/context/AuthContext.jsx`): stop storing auth state in localStorage entirely — the httpOnly cookie is sent automatically by the browser and cannot be read or forged by JavaScript

This way the server is the only thing that decides if a session is valid, not the client.