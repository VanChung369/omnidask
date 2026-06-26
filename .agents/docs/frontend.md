# Frontend Rules

## Location

The frontend app lives in `web/`.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form
- Zod
- npm
- Oxlint

## Commands

Run frontend commands from `web/`:

```powershell
npm install
npm run dev
npm run build
npm run lint
```

## Rules

- Do not move the Vite app out of `web/`.
- Do not commit `node_modules`, logs, or `dist`.
- Keep the default scaffold simple until the user asks for real UI or app features.
- Use `.ts` and `.tsx` for frontend source files. Do not add new `.js` or `.jsx` app source files.
- Organize app components with Atomic Design under `src/components/atoms`, `molecules`, `organisms`, `templates`, and `pages`.
- Keep shadcn-generated primitives in `src/components/ui`; wrap or re-export them through atoms for app-level usage.
- Prefer direct imports from specific component files instead of broad barrel exports.
- Use shadcn/ui components from `src/components/ui/` before building custom primitives.
- Use TanStack Query for server state and Zustand for small client UI state.
- Use React Hook Form with Zod schemas for forms.
- For meaningful UI changes, verify with `npm run build`.
