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

## Who Passes `children` to the Layout?

In `layout.tsx` the function receives `children` as a prop:
```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
```

**Next.js itself passes the children** — you never call `<RootLayout>` manually anywhere in your code.

When a request comes in, Next.js internally does something like this:

For the `/` route:
```tsx
<RootLayout>
  <HomePage />       {/* this is your page.tsx */}
</RootLayout>
```

For the `/tools/artifactory` route:
```tsx
<RootLayout>
  <ToolPage />       {/* this is your tools/[toolId]/page.tsx */}
</RootLayout>
```

Next.js looks at the URL, finds the matching `page.tsx` file, and automatically wraps it inside the nearest `layout.tsx` — passing that page as the `children` prop. You never write that wrapping yourself.

The folder structure is the instruction:
```
app/
├── layout.tsx          ← Next.js uses this as the wrapper
├── page.tsx            ← passed as children for "/"
└── tools/
    └── [toolId]/
        └── page.tsx    ← passed as children for "/tools/anything"
```

The file location tells Next.js everything. That is the whole idea behind the App Router — **your folder structure is your routing**.

---

## Understanding `layout.tsx` Line by Line

```ts
import type { Metadata } from "next";
```
Imports the `Metadata` type from Next.js. "Type" means it is only used for TypeScript checking — it tells TypeScript what shape the metadata object should have. It does not run any code.

```ts
import "./globals.css";
```
Loads your entire CSS file — the dark theme, CSS variables, body font. This is the only place you need to import it. Because this layout wraps every page, the styles apply everywhere automatically.

```ts
import { Sidebar } from "@/components/Sidebar";
```
Imports the Sidebar component. The `@/` is a shortcut that means "start from the project root" — equivalent to `../../components/Sidebar`. Next.js sets this up automatically.

```ts
export const metadata: Metadata = {
  title: "DevOps Tools Hub",
  description: "Internal reference portal for DevOps infrastructure tools",
};
```
Sets the browser tab title and the description search engines see. Next.js reads this and puts it in the `<head>` of the page — you never write `<title>` tags manually.

```tsx
<html lang="en">
```
The root HTML tag. `lang="en"` tells browsers and screen readers the page is in English.

```tsx
<body className="bg-background text-foreground h-screen flex overflow-hidden">
```
Four Tailwind classes on the body:
- `bg-background` — dark navy background from your CSS variable
- `text-foreground` — light text colour
- `h-screen` — body takes up exactly the full screen height
- `flex` — sidebar and main content sit side by side
- `overflow-hidden` — stops the whole page from scrolling (only the main content area scrolls)

```tsx
<Sidebar />
```
Renders the sidebar. It sits on the left because of the `flex` on the body above.

```tsx
<main className="flex-1 overflow-y-auto">
  {children}
</main>
```
The right-hand content area:
- `flex-1` — takes up all remaining space after the sidebar
- `overflow-y-auto` — this area scrolls vertically when content is long
- `{children}` — this is where `page.tsx` or `tools/[toolId]/page.tsx` renders

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

---

## Understanding `flex`, `overflow-hidden`, and `overflow-y-auto`

### `flex`

Makes the element a **flexbox container**. Its children line up in a row by default (side by side). That is why the Sidebar and `<main>` sit next to each other — they are both children of `<body className="flex">`.

```
<body flex>
  ├── <Sidebar />   ← sits on the left
  └── <main />      ← sits on the right
```

Without `flex`, they would stack vertically (one on top of the other).

### `overflow-hidden`

Hides anything that spills outside the element's boundaries. On the `<body>` it prevents the entire page from getting a scrollbar. Instead, only the inner content area scrolls.

Think of it like a picture frame — `overflow-hidden` clips anything that goes beyond the frame edges.

### `overflow-y-auto`

- `y` = vertical direction only
- `auto` = add a scrollbar only when the content is taller than the container

This is on the `<main>` element. So when a tool page has a lot of content, only that right-hand panel scrolls — the sidebar on the left stays completely fixed in place.

### How they work together as a pair

```
body (overflow-hidden)        ← the whole page never scrolls
  └── main (overflow-y-auto)  ← only this inner area scrolls
```

The result: the sidebar is always fully visible no matter how long the page content is.
