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

---

## Understanding `cn()` — The Class Name Helper

### The problem it solves

In React, you add styles via `className`. Simple cases are easy:
```tsx
<div className="p-4 rounded-lg bg-card">
```

But what if you want to conditionally add a class? Like "make it blue if active, grey if not"?

Without `cn` you would have to write something like this:
```tsx
<div className={"p-4 rounded-lg " + (isActive ? "bg-primary text-white" : "bg-card text-muted-foreground")}>
```

That gets messy fast. With `cn` you write it cleanly:
```tsx
<div className={cn(
  "p-4 rounded-lg",
  isActive ? "bg-primary text-white" : "bg-card text-muted-foreground"
)}>
```

---

### What `cn` actually is — two packages working together

`cn` is a tiny function that combines two packages:

**Package 1 — `clsx`**

Handles the logic. It takes any mix of strings, conditions, and objects and combines them into one class string:
```ts
clsx("p-4", true && "rounded", false && "hidden")
// result: "p-4 rounded"
// false conditions are ignored automatically
```

**Package 2 — `tailwind-merge`**

Solves a Tailwind-specific problem. If you accidentally have two conflicting classes, Tailwind applies both but only the last one wins — which can cause unexpected results:
```ts
// Without tailwind-merge — both classes exist, unpredictable
"p-2 p-4"

// With tailwind-merge — keeps only the last one
twMerge("p-2 p-4")  // → "p-4"
```

This matters when you pass extra classes into a component from outside. If a component has `p-2` by default and you pass in `p-4`, without `tailwind-merge` both would be there fighting each other.

---

### The `cn` function itself

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- `...inputs` — accepts any number of arguments (the `...` means "spread" — collect everything into an array)
- `clsx(inputs)` — processes the logic (conditions, arrays, objects) into one string
- `twMerge(...)` — cleans up any conflicting Tailwind classes

So `cn` = clsx + tailwind-merge wrapped in one convenient function.

---

### Real examples from the Sidebar

```tsx
// Example 1 — width switches based on collapsed state
cn(
  "border-r bg-sidebar flex flex-col h-full",
  collapsed ? "w-16" : "w-64"
)
// if collapsed=true  → "border-r bg-sidebar flex flex-col h-full w-16"
// if collapsed=false → "border-r bg-sidebar flex flex-col h-full w-64"

// Example 2 — active link highlighting
cn(
  "flex items-center gap-3 px-2 py-1.5 rounded-md text-sm",
  isActive
    ? "bg-primary/10 text-primary font-medium"
    : "text-muted-foreground hover:bg-accent",
  collapsed && "justify-center"
)
// if isActive=true and collapsed=false:
// → "flex items-center gap-3 px-2 py-1.5 rounded-md text-sm bg-primary/10 text-primary font-medium"
// if isActive=false and collapsed=true:
// → "flex items-center gap-3 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent justify-center"
```

Without `cn` all of that would be one giant unreadable string concatenation.

---

## Sidebar — Every Class Explained

### The outer `<aside>` — the sidebar container

```tsx
className={cn(
  "border-r border-border bg-sidebar flex flex-col h-full overflow-y-auto transition-all duration-300 relative shrink-0",
  collapsed ? "w-16" : "w-64"
)}
```

| Class | What it does |
|---|---|
| `border-r` | adds a line on the RIGHT edge only (separates sidebar from content) |
| `border-border` | uses your custom border colour from globals.css |
| `bg-sidebar` | dark background, slightly different shade from the main page |
| `flex` | makes this container a flexbox — its children stack vertically |
| `flex-col` | changes direction to vertical (top to bottom) — header, then nav links, stacked |
| `h-full` | takes up 100% of the parent height (the full screen) |
| `overflow-y-auto` | if nav links are too many to fit, show a scrollbar |
| `transition-all` | animate any property that changes |
| `duration-300` | animation takes 300 milliseconds |
| `relative` | needed so the toggle button can be positioned absolutely relative to this |
| `shrink-0` | tells flexbox "never shrink this sidebar, keep its width fixed" |
| `w-16` or `w-64` | 64px wide when collapsed, 256px wide when expanded |

---

### The header `<div>`

```tsx
className="p-4 border-b border-border sticky top-0 bg-sidebar z-10 flex items-center justify-between"
```

| Class | What it does |
|---|---|
| `p-4` | padding on all 4 sides (16px gap inside) |
| `border-b` | line on the BOTTOM edge (separates header from nav links) |
| `border-border` | your custom border colour |
| `sticky top-0` | sticks to the top when you scroll — the logo never disappears |
| `bg-sidebar` | same dark background (needed so sticky header covers content underneath) |
| `z-10` | sits above other elements when overlapping |
| `flex` | puts logo icon and text side by side |
| `items-center` | vertically centres them in the middle |
| `justify-between` | pushes logo to the left and toggle button to the right |

---

### The logo `<Link>`

```tsx
className="flex items-center gap-2 text-primary font-semibold tracking-tight hover:opacity-80 transition-opacity whitespace-nowrap overflow-hidden"
```

| Class | What it does |
|---|---|
| `flex items-center` | icon and text sit side by side, vertically centred |
| `gap-2` | 8px space between icon and text |
| `text-primary` | blue colour (your `--primary` CSS variable) |
| `font-semibold` | slightly bold text |
| `tracking-tight` | letters are slightly closer together |
| `hover:opacity-80` | goes 80% opacity on hover (subtle fade effect) |
| `transition-opacity` | fades smoothly instead of snapping |
| `whitespace-nowrap` | stops "DevOps Hub" from wrapping to two lines |
| `overflow-hidden` | hides any text that spills out |

---

### The icon box

```tsx
className="bg-primary/10 p-1.5 rounded-md shrink-0"
```

| Class | What it does |
|---|---|
| `bg-primary/10` | blue background at 10% opacity — very subtle tint |
| `p-1.5` | small padding around the icon |
| `rounded-md` | slightly rounded corners |
| `shrink-0` | never shrink the icon box, keep it square |

---

### The toggle button

```tsx
className="absolute top-4 -right-3 z-20 bg-border text-muted-foreground hover:text-foreground rounded-full p-1"
```

| Class | What it does |
|---|---|
| `absolute` | pulled out of the normal flow, positioned relative to the `<aside>` |
| `top-4` | 16px from the top |
| `-right-3` | 12px OUTSIDE the right edge (negative value — floats the button on the border) |
| `z-20` | sits above everything including the sticky header |
| `bg-border` | uses border colour as the button background |
| `rounded-full` | makes it a circle |
| `p-1` | small padding so the circle is not too tight |

---

### Each tool `<Link>`

```tsx
className={cn(
  "flex items-center gap-3 px-2 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap overflow-hidden",
  isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent",
  collapsed && "justify-center"
)}
```

| Class | What it does |
|---|---|
| `flex items-center` | icon and label sit side by side |
| `gap-3` | 12px space between icon and label |
| `px-2 py-1.5` | horizontal 8px, vertical 6px padding |
| `rounded-md` | rounded corners on hover/active state |
| `text-sm` | smaller font size for the nav links |
| `transition-colors` | colour changes animate smoothly |
| `whitespace-nowrap` | tool name never wraps to two lines |
| `overflow-hidden` | hides overflow when sidebar is animating |
| `bg-primary/10 text-primary` | active state: blue tinted background + blue text |
| `hover:bg-accent` | inactive state: subtle background on hover |
| `justify-center` | when collapsed, centres the icon horizontally |

---

## Understanding the Category Rendering in the Sidebar

### The scrollable nav wrapper

```tsx
<div className="flex-1 py-4 overflow-x-hidden">
```

| Class | What it does |
|---|---|
| `flex-1` | takes all remaining vertical space below the header |
| `py-4` | 16px padding top and bottom |
| `overflow-x-hidden` | hides any content peeking out sideways during the collapse animation |

### Looping through categories

```tsx
{CATEGORIES.map((category) => {
  const categoryTools = TOOLS.filter((t) => t.category === category);
```

- `CATEGORIES.map(...)` — loops through each unique category name
- `TOOLS.filter(...)` — from the full tools list, picks only tools where `category` matches the current loop value
- So if the loop is on `"CI/CD"`, `categoryTools` will only contain Jenkins and TeamCity

### Each category group

```tsx
<div key={category} className="mb-6 px-3">
```

| Class | What it does |
|---|---|
| `key={category}` | not a style — React needs a unique key on every `.map()` item to track them |
| `mb-6` | 24px gap below each category group |
| `px-3` | 12px horizontal padding |

### The category heading — shown when expanded

```tsx
<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 whitespace-nowrap overflow-hidden">
  {category}
</h4>
```

| Class | What it does |
|---|---|
| `text-xs` | very small font |
| `font-semibold` | slightly bold |
| `text-muted-foreground` | dim grey — less prominent than tool names |
| `uppercase` | converts text to ALL CAPS automatically (no need to type it in caps) |
| `tracking-wider` | wider letter spacing — common style for category labels |
| `mb-2` | 8px gap between heading and links below |
| `px-2` | aligns with the tool links below it |
| `whitespace-nowrap overflow-hidden` | prevents wrapping during the collapse animation |

### The divider line — shown when collapsed

```tsx
<div className="h-px bg-border/50 my-4 mx-2" />
```

When collapsed there is no room for text so the heading is replaced by a thin line:

| Class | What it does |
|---|---|
| `h-px` | exactly 1 pixel tall — a hairline |
| `bg-border/50` | border colour at 50% opacity — very subtle |
| `my-4` | 16px gap above and below |
| `mx-2` | small horizontal margin so it does not touch the edges |

### The condition controlling which one shows

```tsx
{!collapsed ? (
  <h4>...</h4>     // show full heading when expanded
) : (
  <div />          // show divider line when collapsed
)}
```

`!collapsed` means "if NOT collapsed" — heading shows when sidebar is wide, line shows when narrow.

---

## `import { TOOLS, CATEGORIES } from "@/data/tools"` — Explained

This line brings the tool data into the Sidebar. It has three parts:

### `import { TOOLS, CATEGORIES }`

The curly braces mean you are doing a **named import** — picking specific things out of the file by their exact name.

- `TOOLS` — the full array of all 9 tools with all their data
- `CATEGORIES` — the auto-generated array of unique category names

If you only needed tools you could write `import { TOOLS }` — you do not have to take everything.

### `from "@/data/tools"`

- `@/` — shortcut for the project root
- `data/tools` — the file at `data/tools.ts` (no need to write `.ts`, TypeScript finds it automatically)

### Why can you import it?

Because in `data/tools.ts` those two things are exported:
```ts
export const TOOLS: Tool[] = [...]
export const CATEGORIES = Array.from(...)
```

`export` = "make this available to other files"
`import` = "bring it into this file"

They are always a pair — you can only import something that was explicitly exported.

---

## `export const CATEGORIES = Array.from(new Set(TOOLS.map(t => t.category)))` — Explained

This line automatically generates the categories list from the tools data. Unwrap it from the inside out:

### Step 1 — `TOOLS.map(t => t.category)`

Loops through every tool and grabs just the `category` field from each:
```ts
["Repository Management", "Repository Management", "CI/CD", "Security", "Security", "Infrastructure", "GitOps", "GitOps", "CI/CD"]
```
The `t` is just a shorthand variable for "each tool as we loop". You could call it `tool`, `item`, or anything — it does not matter.

### Step 2 — `new Set(...)`

A `Set` is a special JavaScript type that only keeps unique values — it silently drops duplicates:
```ts
Set { "Repository Management", "CI/CD", "Security", "Infrastructure", "GitOps" }
```

### Step 3 — `Array.from(...)`

A `Set` looks like an array but is not one — you cannot use `.map()` on it directly. `Array.from()` converts it back into a proper array:
```ts
["Repository Management", "CI/CD", "Security", "Infrastructure", "GitOps"]
```

### Step 4 — `export const CATEGORIES =`

Saves the result into a constant called `CATEGORIES` and exports it so other files can import and use it.

### The full picture

```
TOOLS.map(t => t.category)   → grab all categories (with duplicates)
new Set(...)                  → remove duplicates
Array.from(...)               → convert back to a usable array
export const CATEGORIES =     → save and share it
```

### What to keep in mind about categories

1. **Categories come from the tools** — there is no separate list to maintain
2. **Spelling must be exact** — `"CI/CD"` and `"ci/cd"` would create two separate groups
3. **Adding a new category is automatic** — just add a tool with a new category value and it appears in the sidebar
4. **Order follows the tools array** — the first category seen in the tools list appears first in the sidebar
5. **TypeScript enforces valid values** — the `ToolCategory` type at the top of `tools.ts` will show an error immediately if you use a category name that is not in the allowed list

---

## `usePathname()` — Knowing Which Page You Are On

```ts
const pathname = usePathname();
```

`usePathname()` is a Next.js hook that tells you the **current URL path** in the browser.

If the user is on the Artifactory page, `pathname` equals:
```
"/tools/artifactory"
```

If they are on the home page:
```
"/"
```

### Why the Sidebar needs it

The sidebar uses `pathname` to know which tool link to highlight as active:
```ts
const isActive = pathname === `/tools/${tool.id}`;
```

This compares the current URL against each tool's link. If they match, `isActive` is `true` and the link gets the blue highlight styling. Without `usePathname`, the sidebar would have no idea where the user currently is — every link would look the same with no active state.

### Why it needs `"use client"`

`usePathname()` reads from the browser's address bar — that only exists in the browser, not on the server. That is one of the reasons the Sidebar has `"use client"` at the top. Without it, `usePathname` would throw an error.

---

## Props — The Full Concept

**Props** (short for "properties") are how you pass information **into** a component.

Think of a component like a function and props like its arguments:

```tsx
function Greeting({ name }) {
  return <h1>Hello {name}</h1>
}

<Greeting name="Ahmed" />  // renders: Hello Ahmed
<Greeting name="Sara" />   // renders: Hello Sara
```

The component stays the same. The data changes based on what you pass in.

### Props as an object

When React calls your component, it collects everything you passed and bundles it into one object:

```tsx
// You write this:
<Greeting name="Ahmed" age={30} />

// React sees this internally:
{ name: "Ahmed", age: 30 }
```

That object is the props. You can destructure it (pick out specific values) in the function signature:

```tsx
function Greeting({ name, age }) {
  return <h1>Hello {name}, you are {age}</h1>
}
```

### The spread operator `{...props}`

If you have an object:
```ts
const props = { className: "w-4 h-4", color: "blue" }
```

Instead of passing each property one by one:
```tsx
<SiJenkins className={props.className} color={props.color} />
```

You can spread the whole object at once:
```tsx
<SiJenkins {...props} />
```

They do exactly the same thing. `{...props}` says "unpack everything in this object and pass it all as individual props".

---

## `getIconForTool` — Full Explanation

```ts
export const getIconForTool = (iconName: string, className?: string) => {
  const props = { className: cn("w-4 h-4", className) };
  switch (iconName) {
    case "SiJfrog":     return <SiJfrog {...props} />;
    case "SiBitbucket": return <SiBitbucket {...props} />;
    case "SiJenkins":   return <SiJenkins {...props} />;
    case "SiArgo":      return <SiArgo {...props} />;
    case "SiJetbrains": return <SiJetbrains {...props} />;
    case "SiShield":    return <SiShield {...props} />;
    case "SiServerless":return <SiServerless {...props} />;
    case "SiNexus":     return <SiJfrog {...props} />;
    default:            return <Layers {...props} />;
  }
};
```

### The function signature
- `iconName: string` — a string like `"SiJenkins"` that comes from each tool in `data/tools.ts`
- `className?: string` — optional extra CSS classes you can pass in (the `?` means not required)
- `export` — makes it available to other files like the tool detail page

### Building the props
```ts
const props = { className: cn("w-4 h-4", className) };
```
Creates one object with one property — `className`. Uses `cn()` to combine the default size with any extra classes. All 8 icons share this same `props` object — that is why every icon is the same size by default.

### The switch statement
- Checks the `iconName` string against each case
- When it finds a match, returns the actual icon component
- `{...props}` passes the className into the icon
- `default` — if no case matches, returns a generic `<Layers />` icon as fallback

### Why this pattern?
The icon name is stored as a plain string in `data/tools.ts`:
```ts
{ id: "jenkins", iconName: "SiJenkins", ... }
```
You cannot do `<"SiJenkins" />` — JSX needs the actual component, not a string. This function is the bridge that converts the string into the real component.

### The `SiNexus` special case
```ts
case "SiNexus": return <SiJfrog {...props} />;
```
NexusIQ does not have its own icon in react-icons, so it falls back to the JFrog icon as the closest match.

---

## Why `cn("w-4 h-4", className)` Has No Condition

You might expect a condition here since `cn()` is usually used with true/false logic. But `className` is an **optional parameter** — it is either a string or `undefined`.

`cn()` (via clsx) silently ignores any falsy value like `undefined`:
```ts
cn("w-4 h-4", undefined)       // → "w-4 h-4"
cn("w-4 h-4", "text-blue-500") // → "w-4 h-4 text-blue-500"
```

So when nothing is passed, `cn()` returns just `"w-4 h-4"` and ignores the `undefined` quietly. No condition needed — the optional parameter handles it naturally.

### Where a larger className gets passed in

On the tool detail page, the icon is shown bigger:
```tsx
{getIconForTool(tool.iconName, "w-6 h-6")}
```
Result: `cn("w-4 h-4", "w-6 h-6")` → `tailwind-merge` resolves the conflict and keeps `"w-6 h-6"`.

In the sidebar, nothing is passed:
```tsx
{getIconForTool(tool.iconName)}
```
Result: `cn("w-4 h-4", undefined)` → just `"w-4 h-4"`.
