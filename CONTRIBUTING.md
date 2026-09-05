# Contributing

This repository uses `dev` as its integration branch and `main` as its release
branch. Normal development must not be merged directly to `main`.

## Branch roles

| Branch | Purpose | Deployment |
| --- | --- | --- |
| `feature/*`, `fix/*`, `docs/*` | Short-lived work branched from `dev` | None |
| `dev` | Integrated, releasable development | CI only |
| `main` | Released source only | CI only; release tag deploys Pages |
| `vX.Y.Z` tag | Exact npm release commit on `main` | GitHub Pages and npm publish |

## Day-to-day development

1. Update `dev` and branch from it:

   ```bash
   git switch dev
   git pull --ff-only origin dev
   git switch -c feature/short-description
   ```

2. Make a focused change and run the relevant local checks.
3. Open a pull request from the feature branch to `dev`.
4. Squash-merge after CI and review pass, then delete the feature branch.

Keep `dev` releasable. Incomplete work should remain on a feature branch or be
hidden behind an explicit application-level feature flag.

## Producing a release

1. On a release branch created from `dev`, update `package.json`, release notes,
   migrations, and other versioned documentation. Run the full validation
   suite and merge the release preparation back into `dev`.
2. Open a pull request from `dev` to `main`. CI rejects pull requests to `main`
   from any other branch.
3. Merge the release pull request after validation and review. The resulting
   push to `main` runs CI; the release command below performs the deployment.
4. From that exact, up-to-date `main` commit, run the release command:

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

If the repository plan supports rulesets, protect both long-lived branches and
disallow force pushes and deletion.

- Set `dev` as the repository default branch so new pull requests target the
  integration branch by default.
- `dev`: require a pull request, one approval, resolved conversations, and the
  `validate` status check. Disallow direct pushes.
- `main`: require a pull request, one approval, resolved conversations, and the
  `validate` and `release-policy` status checks. Disallow direct pushes.
- Allow GitHub Actions to deploy Pages; do not configure a separate branch as a
  Pages source.

Repository administrators should be subject to the rules unless an emergency
procedure explicitly requires a bypass. If an emergency change lands on
`main`, immediately merge or cherry-pick it back into `dev`.

If branch protection is unavailable on the repository plan, use the workflow
and review process as the control instead:

- Keep `dev` as the default branch and open normal pull requests into `dev`.
- Merge `dev` into `main` only for a release, after manually confirming the
  `validate` and `release-policy` checks.
- Never push directly to `main`; the workflow cannot prevent an authorized
  direct push, and direct pushes only run CI.
- Run `pnpm release` only from the reviewed `main` release commit.
