# Conscia Design System Playground

Executable visual reference for the Conscia Design System. The static build is
published at <https://conscia-labs.github.io/design-system/>.

Run from the repository root:

```bash
pnpm dev:playground
```

The app runs at `http://localhost:3020`.

Create the GitHub Pages-compatible static export:

```bash
pnpm build:playground:static
```

The export is written to `playground/out` with the `/design-system` base path.
The build also refreshes `public/agent-guide.md`, `public/agent-manifest.json`,
and `public/llms.txt` from the package guide and component inventory.

Before the first deployment, set the repository's Pages source to **GitHub
Actions** under **Settings → Pages**. After that, pushes to `main` deploy through
`.github/workflows/pages.yml`.

Reusable primitives, tokens, and patterns belong in the package root `src`
directory. The `playground` directory contains documentation presentation,
static fixtures, reference pages, and development-only controls.
