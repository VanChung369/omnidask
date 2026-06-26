# Component Architecture

Components follow Atomic Design. Import from the most specific component file instead of creating broad barrel exports.

## Layers

- `ui/`: shadcn/ui generated primitives. Keep this path for the shadcn CLI.
- `atoms/`: smallest app-level building blocks, usually wrapping or re-exporting `ui/` primitives.
- `molecules/`: small combinations of atoms with local behavior.
- `organisms/`: larger feature sections composed from atoms and molecules.
- `templates/`: page layouts without route-specific data.
- `pages/`: complete page-level components used by the app shell.

## Rules

- Do not edit shadcn-generated `ui/` files for app-specific behavior.
- Prefer direct imports such as `@/components/atoms/button`.
- Keep data fetching and state wiring near pages or feature organisms, not inside atoms.
