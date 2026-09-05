# Contributing

This repository uses `main` as its integration and release branch. Every change
merged into `main` must be production-ready; publishing is controlled separately
by the version tag created by `pnpm release`.

## Branch roles

| Branch | Purpose | Deployment |
| --- | --- | --- |
| `feature/*`, `fix/*`, `docs/*` | Short-lived work branched from `main` | None |
| `main` | Integrated, production-ready source | CI only; release tag deploys Pages |
| `vX.Y.Z` tag | Exact npm release commit on `main` | GitHub Pages and npm publish |

## Day-to-day development

1. Update `main` and branch from it:

   ```bash
   git switch main
   git pull --ff-only origin main
   git switch -c feature/short-description
   ```

2. Make a focused change and run the relevant local checks.
3. Open a pull request from the feature branch to `main`.
4. Squash-merge after CI and review pass, then delete the feature branch.

Keep `main` releasable. Incomplete work should remain on a feature branch or be
hidden behind an explicit application-level feature flag.

## Producing a release

1. On a release branch created from `main`, update `package.json`, release
   notes, migrations, and other versioned documentation. Run the full
   validation suite.
2. Open a pull request from the release branch to `main` and merge it after
   validation and review. The resulting push to `main` runs CI; the release
   command below performs the deployment.
3. From that exact, up-to-date `main` commit, run the release command:

   ```bash
   git switch main
   git pull --ff-only origin main
   pnpm release
   ```

`pnpm release` requires a clean worktree and an exact match with `origin/main`.
It creates and pushes the annotated version tag; that tag workflow verifies the
version and branch ancestry, builds the playground, deploys GitHub Pages, and
publishes the package to npm.

The `pnpm version` lifecycle hook automatically refreshes the README release
marker and generated agent metadata. Only the changelog and release notes need
manual version-specific edits.

## Recommended GitHub branch rules (when available)

If the repository plan supports rulesets, protect `main` and disallow force
pushes and deletion.

- Set `main` as the repository default branch so new pull requests target the
  integration and release branch by default.
- `main`: require a pull request, one approval, resolved conversations, and the
  `validate` status check. Disallow direct pushes.
- Allow GitHub Actions to deploy Pages; do not configure a separate branch as a
  Pages source.

Repository administrators should be subject to the rules unless an emergency
procedure explicitly requires a bypass. Any emergency direct push to `main`
should be followed by a normal review and validation pass.

If branch protection is unavailable on the repository plan, use the workflow
and review process as the control instead:

- Keep `main` as the default branch and open normal pull requests into `main`.
- Keep `main` production-ready and manually confirm the `validate` check before
  merging.
- Never push directly to `main`; the workflow cannot prevent an authorized
  direct push, and direct pushes only run CI.
- Run `pnpm release` only from the reviewed `main` release commit.
