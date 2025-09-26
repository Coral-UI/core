# Releasing with semantic-release

This project uses [semantic-release](https://semantic-release.gitbook.io/semantic-release/) to automate versioning and package publishing. This ensures that releases are consistent, changelogs are generated, and packages are published based on commit messages.

## Prerequisites

- You must have push access to the repository.
- Ensure your local branch is up to date with `main`.
- All changes should be merged to `main` before releasing.
- CI/CD (GitHub Actions) must be configured with the following secrets:
  - `NPM_TOKEN` (for publishing to npm)
  - `GITHUB_TOKEN` (for creating GitHub releases)

## Release Workflow

### 1. Write Conventional Commits
semantic-release uses [Conventional Commits](https://www.conventionalcommits.org/) to determine the type of release (major, minor, patch). Example commit messages:

- `fix: correct minor bug`
- `feat: add new feature`
- `BREAKING CHANGE: completely change API`

### 2. Merge to `main`
All release-triggering commits must be merged to the `main` branch. Releases are only created from `main`.

### 3. Automated Quality Checks
Before any release is created, the following quality checks are automatically run:

- **Type checking** (`pnpm run typecheck`) - Ensures all TypeScript types are valid
- **Linting** (`pnpm run lint`) - Checks code style and catches potential issues
- **Format checking** (`pnpm run format`) - Verifies code formatting consistency
- **Workspace validation** (`pnpm run lint:ws`) - Ensures workspace dependencies are consistent

**If any quality check fails, the release will be blocked** until the issues are resolved.

### 4. CI/CD Runs semantic-release
On every push to `main`, the GitHub Actions workflow `.github/workflows/release.yml` will:

- Run quality checks (typecheck, lint, format, workspace validation)
- Run tests and build
- Run `semantic-release` to:
  - Analyze commits
  - Bump version(s) as needed
  - Generate/update changelogs
  - Create a GitHub release
  - Publish packages to npm (if configured)

### 5. Check the Release
- The new release will appear on the [GitHub Releases](../../releases) page.
- Packages will be published to npm if configured.
- Changelogs will be updated in the repository.

## How to Trigger Major, Minor, and Patch Releases

semantic-release determines the type of version bump based on your commit messages, following the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Patch Release
- **Use for:** Bug fixes, small changes that do not add features or break anything
- **Commit message:**
  - `fix: correct a typo in the docs`
  - `fix: resolve crash on login`
- **Result:** Increments the patch version (e.g., `1.2.3` → `1.2.4`)

### Minor Release
- **Use for:** Adding new features in a backwards-compatible way
- **Commit message:**
  - `feat: add user profile page`
  - `feat: support dark mode`
- **Result:** Increments the minor version (e.g., `1.2.3` → `1.3.0`)

### Major Release
- **Use for:** Breaking changes, incompatible API changes
- **Commit message:**
  - Add `BREAKING CHANGE:` in the commit body or footer
  - Example:
    ```
    feat: refactor authentication system

    BREAKING CHANGE: The login API has changed and is not backwards compatible.
    ```
- **Result:** Increments the major version (e.g., `1.2.3` → `2.0.0`)

> **Tip:** You can combine `feat:` or `fix:` with `BREAKING CHANGE:` to indicate a breaking feature or fix.

## Quality Checks on Pull Requests

The CI workflow (`.github/workflows/ci.yml`) also runs quality checks on:
- All pull requests to `main` or `next` branches
- Pushes to feature branches

This ensures issues are caught early in the development process.

## Manual Release (if needed)
If you need to trigger a release manually (e.g., after fixing a failed release):

1. Ensure your local `main` is up to date.
2. Run the quality checks locally first:
   ```sh
   pnpm run typecheck
   pnpm run lint
   pnpm run format
   pnpm run lint:ws
   ```
3. If all checks pass, run the release:
   ```sh
   pnpm install
   pnpm run build
   npx semantic-release
   ```
4. Push any changes if prompted.

## Troubleshooting
- **Quality checks fail:**
  - Run the failing command locally to see the specific issues
  - Fix the issues and commit the changes
  - The release will retry automatically on the next push to `main`
- **No release is created:**
  - Ensure your commits follow Conventional Commits.
  - Check that the GitHub Actions workflow ran successfully.
  - Make sure `NPM_TOKEN` and `GITHUB_TOKEN` are set in repository secrets.
- **Release fails on CI:**
  - Check the Actions logs for errors.
  - Make sure all tests and builds pass before releasing.
- **Changelog not updated:**
  - Only commits on `main` will update the changelog and trigger a release.

## Useful Links
- [semantic-release documentation](https://semantic-release.gitbook.io/semantic-release/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

For questions or help, contact the maintainers or open an issue.