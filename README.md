# Jotish Employee Insights Dashboard

This is my submission for the Jotish frontend internship assignment. I built a 4-screen employee dashboard using React + Vite. The app has login, an employee list with custom scroll virtualization, an identity verification screen using the browser camera, and a results page with charts and a map.

---

## Tech Stack

React 18, Vite, React Router v6, Tailwind CSS v3, Context API, Leaflet — no UI component libraries, no virtualization libraries.

---

## Screens

| Route | Description |
|---|---|
| `/login` | Auth with Context API + localStorage persistence |
| `/list` | Virtualized employee grid |
| `/details/:id` | Camera capture, signature drawing, image merge |
| `/result` | Audit image + SVG salary chart + city map |

---

## Running Locally

```bash
npm install
npm run dev
```

Login: `testuser` / `Test123`

Feel free to let me know if you run into any issues getting it running.

---

## How the Virtualization Works

Imagine you have a notebook with 1000 pages. Instead of carrying all 1000 pages everywhere, you only keep the 10 pages you're currently reading in your hand — and swap them out as you turn pages. That's exactly what virtualization does for a list on a webpage.

If you render all employees in the DOM at once the browser has to paint every single row which gets slow. So instead I only put the rows you can actually see on screen into the DOM, plus a few extra above and below as a safety buffer. As you scroll, old rows get swapped out and new ones come in.

Here's the math that makes it work — every row is exactly 60px tall, which is the key assumption:

- A big invisible wrapper div is set to `total rows × 60px` in height — this makes the scrollbar look like all rows exist even though most of them aren't actually on the page
- `startIndex = scrollTop ÷ 60` — when you scroll down 300px, this tells me row 5 is at the top (300 ÷ 60 = 5)
- I only render from `startIndex` to `startIndex + visible rows + 5 buffer`
- `offsetY = startIndex × 60` — since I'm only rendering from row 5 onwards, I push them down 300px using CSS `translateY` so they appear in the right place on screen

End result: only about 15 rows exist in the DOM at any time no matter how many employees there are. You can verify this by opening DevTools → Elements tab and scrolling the list.

---

## Image Merging

The photo is captured from the video feed onto a hidden canvas. A transparent signature canvas sits on top of it. On confirm, both canvases are drawn onto a third offscreen canvas — photo first, signature on top — and exported as a single Base64 PNG via `toDataURL`. Saved to localStorage per employee under `verified_{id}`.

---

## Geospatial Mapping

Leaflet doesn't get coordinates from the API so I wrote a static city-to-coordinate lookup table in `src/utils/cityCoordinates.js`. Each city name is matched against it to place markers. Unmatched cities are filtered out.

---

## Intentional Bug — Security Vulnerability

**Type:** Client-Side Authentication Bypass

**Location:** `src/context/AuthContext.jsx` + `src/App.jsx`

The auth system runs entirely in the browser. Login just saves a username string to localStorage and reads it back — no backend, no token, no signature. Anyone can open the console, run `localStorage.setItem('auth_user', 'testuser')` and navigate to `/list` — fully authenticated without a password.

**Why I chose it:** It's a realistic mistake that shows up in real projects. The client should never be the source of truth for access control.

---

## How to Fix It

The fix is JWT-based auth with httpOnly cookies.

- **Backend** (`/login` route): validate credentials, sign a JWT with a secret key, set it as an httpOnly cookie with an expiry
- **Backend** (auth middleware): verify the JWT on every protected request — reject if missing or expired
- **Frontend** (`src/context/AuthContext.jsx`): stop storing auth state in localStorage entirely — the httpOnly cookie is sent automatically by the browser and cannot be read or forged by JavaScript

This way the server is the only thing that decides if a session is valid, not the client.