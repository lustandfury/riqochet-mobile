# AGENTS.md

## Cursor Cloud specific instructions

**Product**: Riqochet — a padel tournament and auction platform (React SPA with mock data, no backend).

**Tech stack**: Vite 6, React 19, TypeScript 5.8, Tailwind CSS 3.4, Framer Motion, GSAP, Three.js.

**Package manager**: npm (lockfile: `package-lock.json`).

**Key commands** (all defined in `package.json`):
- `npm run dev` — starts Vite dev server on port 5173
- `npm run build` — production build (also serves as type-check since Vite invokes tsc)
- `npm run preview` — preview production build

**No lint or test scripts** are configured in the project. Use `npx tsc --noEmit` for standalone type-checking.

**No backend dependencies**: all data is hardcoded mock data in `src/data/mockData.ts`. No database, Docker, or external services needed.

**Auth flow**: the app has a mock email + OTP flow; any email/code works to get past the welcome screen.

**Dev server note**: pass `--host 0.0.0.0` to `npm run dev` if you need the server accessible from outside localhost (e.g. `npm run dev -- --host 0.0.0.0`).
