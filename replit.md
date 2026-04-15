# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### DevOps Tools Hub (`artifacts/devops-hub`)
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 + tw-animate-css
- **Routing**: Next.js file-based routing (`app/` directory)
- **Animations**: Framer Motion
- **Icons**: Lucide React + React Icons (brand icons)
- **Data**: Static data in `data/tools.ts` — update this file to change tool content
- **Dev**: `pnpm --filter @workspace/devops-hub run dev`
- **Build**: `pnpm --filter @workspace/devops-hub run build`
- **Key files**:
  - `data/tools.ts` — all tool data (instances, guides, metrics)
  - `app/page.tsx` — home dashboard
  - `app/tools/[toolId]/page.tsx` — individual tool page
  - `components/Sidebar.tsx` — navigation sidebar
  - `app/globals.css` — global styles and CSS theme variables

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
