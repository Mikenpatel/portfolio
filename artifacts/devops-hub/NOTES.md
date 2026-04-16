# DevOps Hub — Build Notes

A running reference as we build the project. Updated at each step.

---

## Project Setup

### Tools Required
| Tool | Purpose | Install |
|---|---|---|
| Node.js (LTS) | Runs the app | https://nodejs.org |
| VS Code | Code editor | https://code.visualstudio.com |
| npm | Package manager | Comes with Node.js |

### VS Code Extensions
- **ES7+ React/Redux/React-Native snippets** — shortcuts for writing React code
- **Tailwind CSS IntelliSense** — shows what Tailwind classes do as you type

### Create the Project
```bash
cd C:\projects
npx create-next-app@latest devops-hub
```
Answers to prompts:
- TypeScript → Yes
- ESLint → Yes
- Tailwind CSS → Yes
- `src/` directory → No
- App Router → Yes
- Customize import alias → No

### Corporate Network Fixes
**Google Fonts error** — Replace the contents of `app/layout.tsx` with a version that has no Google Fonts import (see layout.tsx section below).

**allowedDevOrigins error** — Add this to `next.config.ts`:
```ts
const nextConfig: NextConfig = {
  allowedDevOrigins: ["*"],
};
```

**Tailwind not resolving** — Run `npm install` from inside the project folder. If network blocks it, ask IT for the internal npm registry URL and run:
```bash
npm config set registry https://your-artifactory-instance/artifactory/npm-repo/
```

---

## Project Structure

```
devops-hub/
├── app/
│   ├── layout.tsx         ← Outer frame — wraps every page (sidebar goes here)
│   ├── page.tsx           ← Homepage (what shows at /)
│   └── globals.css        ← Styles that apply to the whole site
├── public/                ← Static files (images, icons)
├── package.json           ← Project dependencies list
└── next.config.ts         ← Next.js settings
```

### The Key Next.js Rules

**1. File = Page**
The folder structure IS the URL — no manual routing needed:
```
app/page.tsx                  →  yoursite.com/
app/tools/[toolId]/page.tsx   →  yoursite.com/tools/artifactory
```

**2. Two types of components**
- **Server Component** — the default. Runs on the server. Fast.
- **Client Component** — add `"use client"` at the top when you need interactivity (clicks, animations, typing). If you get a hooks error, this is usually why.

**3. Link between pages**
Always use Next.js `<Link>`, not a plain HTML `<a>` tag:
```tsx
import Link from "next/link"
<Link href="/tools/artifactory">Go to Artifactory</Link>
```

---

## Tailwind CSS Reference

Tailwind works by adding class names directly to HTML elements — no separate CSS file needed.

### Spacing
| Class | Effect |
|---|---|
| `p-4` | Padding on all sides (1rem) |
| `px-4` | Padding left and right only |
| `py-4` | Padding top and bottom only |
| `mt-2` | Margin top (small) |
| `mb-4` | Margin bottom |
| `gap-4` | Gap between flex/grid items |

### Colors
| Class | Effect |
|---|---|
| `bg-gray-900` | Very dark grey background |
| `bg-gray-800` | Dark grey background (slightly lighter) |
| `text-white` | White text |
| `text-gray-400` | Lighter grey text (for subtitles) |
| `text-blue-400` | Blue text (for links/accents) |
| `border-gray-700` | Dark grey border |

### Typography
| Class | Effect |
|---|---|
| `text-sm` | Small text |
| `text-base` | Normal text size |
| `text-xl` | Large text |
| `text-3xl` | Heading size |
| `font-bold` | Bold text |
| `font-semibold` | Semi-bold text |

### Layout
| Class | Effect |
|---|---|
| `flex` | Flexbox container (side by side) |
| `flex-col` | Flex column (stacked vertically) |
| `grid` | Grid container |
| `grid-cols-3` | 3 column grid |
| `min-h-screen` | At least as tall as the screen |
| `w-64` | Fixed width (16rem) |
| `flex-1` | Take up remaining space |

### Responsive Prefixes
Add these before any class to apply it only at that screen size and above:
- `md:grid-cols-2` — 2 columns on medium screens and up
- `xl:grid-cols-3` — 3 columns on extra-large screens and up

---

## Git — Saving Your Work

```bash
# First time only — turns the folder into a Git repo
git init

# Stage all changed files
git add .

# Save a snapshot with a description
git commit -m "your message here"
```

Run the last two commands after finishing any meaningful piece of work.

---

## Building the Sidebar

### The Thinking Process — Always Outside → In

Before writing any code, look at the final result and break it into sections:

```
┌─────────────────┐
│  Logo / Title   │  ← Section 1: Brand/header area
│─────────────────│
│  REPOSITORY     │  ← Section 2: Nav group label
│  - Artifactory  │     Nav links inside
│  - Bitbucket    │
│─────────────────│
│  CI/CD          │  ← Section 3: Another nav group
│  - Jenkins      │
│  - TeamCity     │
└─────────────────┘
```

### Semantic HTML — Meaningful Elements

`<aside>` is just a `<div>` with meaning. HTML has several elements that all create a box, but each one tells the browser what that box is *for*:

| Element | What it means | When to use it |
|---|---|---|
| `<div>` | Generic box — no meaning | When nothing else fits |
| `<main>` | The main content of the page | The central area |
| `<nav>` | Navigation links | Menus, sidebars |
| `<aside>` | Content beside the main area | Sidebars, panels |
| `<header>` | Top of a page or section | Logo, top nav |
| `<footer>` | Bottom of a page | Copyright, links |
| `<section>` | A distinct section of content | Grouped content |

You could replace `<aside>` with `<div>` and it would look identical. The reason we use `<aside>` is **semantic HTML** — using the right element for the right purpose. It helps screen readers, search engines, and other developers understand the layout instantly.

---

**The golden rule: Structure first → then style. Never the other way around.**

### Step 1 — Outer wrapper first

The sidebar needs to be a fixed-width column, full height, dark background:

```tsx
<aside className="w-64 min-h-screen bg-gray-800">
  {/* everything goes inside here */}
</aside>
```

### Step 2 — Fill sections top to bottom (structure only, no styling yet)

```tsx
<aside>
  <div>        {/* Brand header */}
    <h2>DevOps Hub</h2>
  </div>

  <nav>        {/* Navigation */}
    <div>      {/* Group 1 */}
      <p>REPOSITORY</p>
      <a>Artifactory</a>
      <a>Bitbucket</a>
    </div>
  </nav>
</aside>
```

### Step 3 — Add Tailwind classes to style each piece

Only after structure is clear, add colours, spacing, font sizes.

### The Complete Sidebar Component

The sidebar groups tools into categories. Each category is a `<div>` with a label and a list of links underneath. The `<nav>` uses `space-y-6` to put a gap between each group.

Create a new folder `components/` in your project root, then create `components/Sidebar.tsx`:

```tsx
export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-800 border-r border-gray-700 p-4">

      {/* Brand header */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">DevOps Hub</h2>
        <p className="text-gray-400 text-sm mt-1">Tools Reference</p>
      </div>

      {/* Navigation — space-y-6 puts a gap between each category group */}
      <nav className="space-y-6">

        {/* Group 1 */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Repository Management</p>
          <ul className="space-y-1">
            <li><a href="/tools/artifactory" className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">Artifactory</a></li>
            <li><a href="/tools/bitbucket" className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">Bitbucket</a></li>
          </ul>
        </div>

        {/* Group 2 */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">CI/CD</p>
          <ul className="space-y-1">
            <li><a href="/tools/jenkins" className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">Jenkins</a></li>
            <li><a href="/tools/teamcity" className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">TeamCity</a></li>
          </ul>
        </div>

        {/* Group 3 */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Security</p>
          <ul className="space-y-1">
            <li><a href="/tools/fortify" className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">Fortify</a></li>
            <li><a href="/tools/nexusiq" className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">NexusIQ</a></li>
          </ul>
        </div>

        {/* Group 4 */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Infrastructure</p>
          <ul className="space-y-1">
            <li><a href="/tools/devops-gateway" className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">DevOps Gateway</a></li>
          </ul>
        </div>

        {/* Group 5 */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">GitOps</p>
          <ul className="space-y-1">
            <li><a href="/tools/argocd" className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">Argo CD</a></li>
            <li><a href="/tools/argo-workflows" className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">Argo Workflows</a></li>
          </ul>
        </div>

      </nav>
    </aside>
  );
}
```

**What each class does:**
| Class | Effect |
|---|---|
| `w-64` | Fixed width — sidebar stays 16rem wide |
| `min-h-screen` | Sidebar runs full height of the screen |
| `bg-gray-800` | Slightly lighter dark than the main content area |
| `border-r border-gray-700` | Right border to visually separate sidebar from content |
| `p-4` | Padding inside the sidebar |
| `mb-8` | Space below the brand header |
| `space-y-1` | Small vertical gap between each nav link |
| `block` | Makes the link fill the full width of its row |
| `px-3 py-2` | Padding inside each link (left/right, top/bottom) |
| `rounded-lg` | Rounded corners on the link background |
| `hover:bg-gray-700` | Dark background appears when you hover over a link |
| `hover:text-white` | Text turns white on hover |
| `uppercase tracking-wider` | All caps + spaced letters for the section label |

### Step 4 — Export the Component

For a component to be usable anywhere in the project, it must be exported. Always start your component with `export default`:

```tsx
export default function Sidebar() {
  return (
    <aside>
      {/* your content */}
    </aside>
  );
}
```

Without `export default`, the component exists but nothing can use it.

### Step 5 — Add the Sidebar to the Layout

Open `app/layout.tsx` and update it so the sidebar appears on every page:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "DevOps Hub",
  description: "Internal DevOps Tools Reference",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex bg-gray-900 text-white">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </body>
    </html>
  );
}
```

**What changed in layout.tsx:**
| Part | What it does |
|---|---|
| `import Sidebar` | Brings in the sidebar component we just created |
| `className="flex"` on body | Makes sidebar and main content sit side by side |
| `<Sidebar />` | Places the sidebar on the left |
| `<main className="flex-1 p-8">` | Main content fills remaining space with padding |
| `{children}` | This is where each page's content gets inserted |

> `@/components/Sidebar` — the `@/` is a shortcut for the project root. It means "start from the top of the project". So this import always works no matter which file you're in.

---

---

## CSS Grid

Grid creates multi-column layouts. You define how many columns, and items fill in automatically left to right.

### The two things you always need

**1. A container with `grid`:**
```tsx
<div className="grid grid-cols-3">
```
Any children inside automatically line up in 3 equal columns.

**2. Children just go inside — no extra work:**
```tsx
<div className="grid grid-cols-3">
  <div>Card 1</div>   {/* column 1 */}
  <div>Card 2</div>   {/* column 2 */}
  <div>Card 3</div>   {/* column 3 */}
  <div>Card 4</div>   {/* wraps to next row automatically */}
</div>
```

### Adding gaps between cards
```tsx
<div className="grid grid-cols-3 gap-6">
```
`gap-6` puts equal spacing between every card, both horizontally and vertically.

### Making it responsive
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
```
| Prefix | When it applies |
|---|---|
| *(none)* | All screen sizes (mobile first) |
| `md:` | Medium screens and up |
| `xl:` | Extra-large screens and up |

### Flexbox vs Grid — when to use which
| Use `flex` when... | Use `grid` when... |
|---|---|
| Items sit in a single row or column | Items form rows AND columns |
| Items can have different sizes | Items should be equal width |
| Example: sidebar + main content | Example: card layouts |

---

## Building the Home Page

### Structure (always plan before coding)

```
┌─────────────────────────────────────────┐
│  Stat Cards (3 across)                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Status  │ │Incidents│ │  RITMs  │   │
│  └─────────┘ └─────────┘ └─────────┘   │
├─────────────────────────────────────────┤
│  Tool Cards Grid (3 columns)            │
│  ┌───────┐ ┌───────┐ ┌───────┐         │
│  │Artif. │ │Bitbuc.│ │Jenkin.│         │
│  └───────┘ └───────┘ └───────┘         │
└─────────────────────────────────────────┘
```

- Outer wrapper → `<div>` with vertical spacing
- Stat cards → `grid grid-cols-3` — 3 equal columns
- Tool cards → `grid grid-cols-3` — same, below the stat cards

---

## Build Log

| Step | What was built |
|---|---|
| Setup | Created Next.js project, fixed corporate network issues |
| Cleanup | Removed default Next.js page, cleared globals.css |
| Dark base | Added dark background and text to `page.tsx` using Tailwind |
| Sidebar | Created `components/Sidebar.tsx` with grouped categories, added to `app/layout.tsx` |
| **Next** | **Home page — stat cards and tool grid** |

*(This table will be updated as we build each component)*
