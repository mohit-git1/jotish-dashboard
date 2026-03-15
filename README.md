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

Imagine you have a notebook with 1000 pages. Instead of carrying all 1000 pages everywhere, you only keep the 10 pages you're currently reading — and swap them out as you turn pages. That's exactly what virtualization does for a list on a webpage.

If you render all employees in the DOM at once the browser has to paint every single row which gets slow. So instead I only put the rows you can actually see on screen into the DOM, plus a few extra as a buffer. As you scroll, old rows swap out and new ones come in.

The math — every row is exactly 60px tall:

- A wrapper div is set to `total rows × 60px` so the scrollbar looks correct even though most rows aren't in the DOM
- `startIndex = scrollTop ÷ 60` — when you scroll 300px down, row 5 is at the top (300 ÷ 60 = 5)
- I only render from `startIndex` to `startIndex + visible rows + 5 buffer`
- `offsetY = startIndex × 60` — I push the rendered rows down using `translateY` so they appear in the right place on screen

Only about 15 rows exist in the DOM at any time. Verifiable via DevTools → Elements tab while scrolling.

---

## Image Merging

The photo is captured from the video feed onto a hidden canvas. A transparent signature canvas sits on top of it. On confirm, both canvases are drawn onto a third offscreen canvas — photo first, signature on top — and exported as a single Base64 PNG via `toDataURL`. Saved to localStorage per employee under `verified_{id}`.

---

## Geospatial Mapping

Leaflet doesn't get coordinates from the API so I wrote a static city-to-coordinate lookup table in `src/utils/cityCoordinates.js`. Each city name is matched against it to place markers. Unmatched cities are filtered out.

---

## Intentional Bug — Stale Closure (Performance / Logic)

**Type:** Stale Closure in useEffect

**Location:** `src/pages/List.jsx`

**The code:**
```js
useEffect(() => {
  const interval = setInterval(() => {
    console.log('visible row count:', rowCount)
  }, 5000)
  return () => clearInterval(interval)
}, [])
```

**What it is:**

Think of a closure like a photograph. When `useEffect` runs with an empty `[]` dependency array, it takes a photo of all the variables it uses — in this case `rowCount`. That photo is taken on the very first render when `rowCount` is still `0`.

Even after the data loads and `rowCount` changes, the interval inside the effect is still looking at that old photo. So every 5 seconds it logs `0` no matter what the actual value is. The effect never gets updated because we told React "don't re-run this" with the empty array.

**Why it is a bug:**

The `rowCount` value inside the interval is permanently frozen at `0`. If you were using this to track something important — like auto-saving scroll position or syncing state — it would silently give you wrong data every time. The app appears to work fine on the surface which makes this kind of bug particularly hard to catch.

**Why I chose it:**

This is one of the most common real-world React bugs. A lot of developers write `useEffect` with `[]` without thinking about which variables they're closing over. It looks correct, it doesn't throw any errors, but the logic is broken. It shows understanding of how React's rendering and closure model actually works under the hood.

**The fix:**

Add `rowCount` to the dependency array so the effect re-runs whenever it changes:
```js
}, [rowCount])
```

---

## Security Vulnerability (Bonus)

**Type:** Client-Side Authentication Bypass

**Location:** `src/context/AuthContext.jsx` + `src/App.jsx`

The auth system runs entirely in the browser. Login just saves a username string to localStorage — no backend, no token, no signature. Anyone can open the console, run `localStorage.setItem('auth_user', 'testuser')` and navigate to `/list` — fully authenticated without a password.

**Why I noted it:** The client should never be the source of truth for access control. This is a realistic vulnerability that appears in many beginner React apps.

**The fix:** JWT-based auth with httpOnly cookies — backend signs a token on login, validates it on every protected request, frontend stops storing auth state in localStorage entirely.