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

---

## Understanding `bg-background` — Where Does It Come From?

In `layout.tsx` you see:
```tsx
<body className="bg-background text-foreground h-screen flex overflow-hidden">
```

`bg-background` is **not** a built-in Tailwind class. It is a custom one we created. Here is the full chain:

**Step 1 — Raw colour value defined in `:root` inside `globals.css`**
```css
:root {
  --background: 222 47% 7%;
}
```
This creates a CSS variable called `--background` with a dark navy colour value.

**Step 2 — Tailwind is told to create a utility class from it in `@theme`**
```css
@theme inline {
  --color-background: hsl(var(--background));
}
```
This says: "Tailwind, whenever someone writes `bg-background`, use the colour `hsl(222, 47%, 7%)`."

**Step 3 — Tailwind generates the class automatically**

Because of that `@theme` block, Tailwind creates a class called `bg-background` behind the scenes. You never write it yourself — Tailwind just knows it exists.

The full chain:
```
globals.css (:root)          → defines --background as a raw HSL value
globals.css (@theme inline)  → maps it to a Tailwind class name
layout.tsx                   → uses bg-background as a class
Browser                      → sees: background-color: hsl(222, 47%, 7%)
```

---

## Why `bg-` ? — Tailwind's Prefix System

The `bg-` prefix tells Tailwind **which CSS property** to apply the colour to:

| You write | Tailwind applies |
|---|---|
| `bg-background` | `background-color: ...` |
| `text-foreground` | `color: ...` |
| `border-border` | `border-color: ...` |
| `ring-ring` | `outline-color: ...` |

The pattern is always: **prefix + colour name**
```
bg   -   background
^^^      ^^^^^^^^^^
which    which colour
property (from your @theme block)
```

---

## Standard Built-in Tailwind Colour Classes

Without any custom setup, Tailwind's built-in colour classes look like this:
```html
bg-white
bg-black
bg-gray-900
bg-blue-500
bg-red-400
```

The pattern is `bg-{colour}-{shade}`. The shade is a number from `50` (lightest) to `950` (darkest):

```html
bg-gray-50    ← almost white
bg-gray-100
bg-gray-200
bg-gray-300
bg-gray-400
bg-gray-500   ← middle
bg-gray-600
bg-gray-700
bg-gray-800
bg-gray-900   ← very dark
bg-gray-950   ← almost black
```

Our custom `bg-background` is roughly equivalent to `bg-gray-950` but with a slight blue tint. We gave it a semantic name (`background`) instead of a shade number so it is easier to understand what it is used for across the whole project.
