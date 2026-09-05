# Contributing

This repository uses `dev` as its integration branch and `main` as its release
branch. Normal development must not be merged directly to `main`.

## Branch roles

| Branch | Purpose | Deployment |
| --- | --- | --- |
| `feature/*`, `fix/*`, `docs/*` | Short-lived work branched from `dev` | None |
| `dev` | Integrated, releasable development | CI only |
| `main` | Released source only | GitHub Pages after every merge |
| `vX.Y.Z` tag | Exact npm release commit on `main` | npm publish |

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
   push to `main` publishes the current playground to GitHub Pages.
4. Tag that exact commit and push the tag:

   ```bash
   git switch main
   git pull --ff-only origin main
   git tag -a vVERSION -m "Release vVERSION"
   git push origin vVERSION
   ```

The tag workflow verifies that the tag matches `package.json` and points to a
commit on `main` before publishing to npm.

## Recommended GitHub branch rules

Protect both long-lived branches and disallow force pushes and deletion.

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
