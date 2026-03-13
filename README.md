# Jotish Employee Insights Dashboard

A 4-screen employee management dashboard built with React + Vite, featuring custom virtualization, camera-based identity verification, and data visualization.

## Tech Stack

- React 18 + Vite
- React Router v6
- Tailwind CSS v3
- Leaflet + react-leaflet
- Native Browser APIs (Camera, Canvas, Web Storage)

## Screens

| Route | Description |
|---|---|
| `/login` | Auth with Context API + localStorage persistence |
| `/list` | Virtualized employee grid fetched from API |
| `/details/:id` | Camera capture + canvas signature + image merge |
| `/result` | Merged audit image + SVG salary chart + city map |

## Custom Virtualization Math

The list page renders only the rows visible in the viewport plus a small buffer, instead of all rows at once.
```
ROW_HEIGHT = 60px

totalHeight    = totalRows * ROW_HEIGHT
startIndex     = Math.floor(scrollTop / ROW_HEIGHT)
visibleCount   = Math.ceil(viewportHeight / ROW_HEIGHT)
endIndex       = startIndex + visibleCount + BUFFER
offsetY        = startIndex * ROW_HEIGHT
```

- `totalHeight` sets the full scrollable height so the scrollbar behaves correctly
- `startIndex` tells us which row sits at the current scroll position
- `offsetY` pushes the rendered rows down via CSS `translateY` so they appear at the correct visual position
- Only `visibleCount + BUFFER` rows exist in the DOM at any time

## Image Merging Logic

1. When the user captures a photo, it is drawn onto a hidden `<canvas>` via `ctx.drawImage(video, 0, 0)`
2. The signature canvas sits absolutely on top of the photo using CSS positioning
3. On confirm, a new offscreen canvas is created at the same dimensions
4. Both canvases are drawn onto it sequentially: first the photo canvas, then the signature canvas
5. `finalCanvas.toDataURL('image/png')` produces a Base64 string of the merged image
6. This is stored in localStorage and displayed on the Result page

## Geospatial Mapping

City-to-coordinate mapping is handled via a static lookup table in `src/utils/cityCoordinates.js`. Each city name from the API is matched against this table to get lat/lng values for Leaflet markers. Cities not found in the table are filtered out.

## Intentional Bug

**Location:** `src/pages/List.jsx` — the `handleScroll` function

**Code:**
```jsx
const handleScroll = useCallback(() => {
  setScrollTop(containerRef.current.scrollTop)
}, [])
```

**What it is:** A stale closure caused by an empty dependency array in `useCallback`.

**Why it is a bug:** `useCallback` with `[]` memoizes the callback on the first render and never recreates it. If `containerRef.current` changes between renders (e.g. on remount or fast navigation), the closure holds a reference to the old DOM node. Under normal usage the app works, but under rapid component remounting or concurrent rendering this can silently read stale scroll values and cause the virtualization to render the wrong rows.

**Why I chose it:** It is a subtle, realistic bug that appears in production React codebases. It demonstrates understanding of closure semantics, React's rendering lifecycle, and how `useCallback` interacts with mutable refs.

## Running Locally
```bash
npm install
npm run dev
```

## Environment

No environment variables required. API credentials are hardcoded as per assignment spec.
```

---

**Git commit message:**
```
docs: add README with intentional bug documentation and virtualization math explanation