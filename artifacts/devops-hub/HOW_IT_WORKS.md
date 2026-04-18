# How the App Works — What Happens When Someone Opens It

Here is the full journey, step by step:

---

## 1. Browser makes a request to `/`

The user types the URL and hits enter. The request goes to the Next.js server.

---

## 2. Next.js finds the right files

It looks at the `app/` folder and matches the URL to files:
- `/` → runs `app/layout.tsx` + `app/page.tsx`

---

## 3. `layout.tsx` runs first (on the server)

- Sets up the `<html lang="en">` and `<body>` tags
- Loads `globals.css` (dark theme, CSS variables)
- Loads the Inter font
- Renders the `<Sidebar />` component on the left
- Has a `{children}` slot on the right — this is where the page content will go

---

## 4. `page.tsx` runs and fills the `{children}` slot

- Reads all tools from `data/tools.ts`
- Renders the stat cards at the top (total tools, instances, guides count)
- Loops through the tools with `.map()` and renders a card grid

---

## 5. Server sends finished HTML to the browser

The browser receives a fully built HTML page — not a blank page waiting for JavaScript. This is called **Server Side Rendering (SSR)** and is one of Next.js's main features. The page appears instantly.

---

## 6. React "hydrates" the page

JavaScript loads in the background and quietly attaches to the already-visible HTML. Now interactive things work — hover effects, the search bar in the sidebar, Framer Motion animations kick in.

---

## 7. User clicks a tool in the sidebar

Next.js intercepts the click — it does **not** do a full page reload. It only fetches the new page content (`tools/[toolId]/page.tsx`) and swaps it into the `{children}` slot. The sidebar stays completely untouched. This feels instant.

---

## Summary

That whole process from step 1 to step 6 typically takes under a second.

```
Browser request to "/"
        │
        ▼
  layout.tsx (runs first)
  ├── loads globals.css       ← dark theme
  ├── loads Inter font
  ├── renders <Sidebar />     ← left panel, never reloads
  └── {children} slot
            │
            ▼
       page.tsx               ← fills the slot for "/"
       ├── reads data/tools.ts
       ├── renders stat cards
       └── renders tool grid (.map())

User clicks a tool link
        │
        ▼
  tools/[toolId]/page.tsx    ← swaps into {children} slot
  layout.tsx stays mounted   ← sidebar does not flicker
```
