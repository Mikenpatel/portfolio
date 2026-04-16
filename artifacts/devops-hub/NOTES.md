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

## Build Log

| Step | What was built |
|---|---|
| Setup | Created Next.js project, fixed corporate network issues |
| Cleanup | Removed default Next.js page, cleared globals.css |
| Dark base | Added dark background and text to page.tsx using Tailwind |

*(This table will be updated as we build each component)*
