# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm run dev          # dev server with HMR (Vite)
npm run build        # type-check + production build
npm run type-check   # vue-tsc only
npm run lint         # oxlint then eslint (both --fix)
npm run format       # prettier on src/
```

Node requirement: `^20.19.0 || >=22.12.0`

## Architecture

**Stack:** Vue 3 (Composition API + `<script setup>`) · TypeScript · Vite · Tailwind CSS v4 · Vue Router v5

**Two layouts, two route groups** (`src/router/index.ts`):

| Layout | Routes |
|---|---|
| `AuthLayout` (bare wrapper) | `/login`, `/forgot-password`, `/send-mail` |
| `MainLayout` (sidebar + `<RouterView>`) | `/dashboard`, `/agenda`, `/pacientes`, `/servicios`, `/inventario`, `/pagos`, `/usuarios` |

All view imports are lazy (`() => import(...)`) so every module is code-split automatically.

**UI component layer** (`src/components/ui/`): shadcn-style components built on [Reka-UI](https://reka-ui.com/) headless primitives. Each component folder exports via `index.ts`. Use these over raw HTML elements when one exists (Button, Badge, Card, Dialog, Input, Label, Select, Table, Textarea, Checkbox).

**Styling conventions:**
- `cn()` from `src/lib/utils.ts` — combines `clsx` + `tailwind-merge`. Always use it when merging conditional classes.
- Button variants live in `src/components/ui/button/index.ts` (CVA). Use `variant` and `size` props rather than custom classes on `<Button>`.
- Icons from `lucide-vue-next`.
- Color palette: `blue-950` headings, `blue-500` primary actions, `slate-*` secondary text, `blue-200` borders/outlines on cards.
- Prettier: no semicolons, single quotes, 100-char print width.

**Data layer:** All data is currently mocked in `src/lib/mock-data.ts`. There is no real API integration yet.

**Path alias:** `@` maps to `src/` (configured in `vite.config.ts`).
