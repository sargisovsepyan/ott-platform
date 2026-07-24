# Codex Project Rules

## Project scope

This repository contains:

- `ott-backend/` — an existing backend application.
- `ott-frontend/` — the frontend application currently under development.
- `docs/` — project documentation, when created.

The current development scope is frontend work.

## Protected backend

- Treat `ott-backend/` as read-only.
- Do not modify, delete, rename, move, format, or reorganize anything inside `ott-backend/`.
- Do not install or update backend dependencies.
- Do not run backend database migrations or seed scripts.
- Do not attempt to fix backend issues automatically.
- Backend changes require separate and explicit permission from the user.

## File safety

- Do not delete existing files.
- Do not move files between `ott-backend/` and `ott-frontend/`.
- Do not overwrite files without first inspecting their current contents.
- Make small, focused changes.
- Stop and ask before making broad architectural changes.

## Git safety

Do not run:

- `git commit`
- `git push`
- `git pull`
- `git reset`
- `git clean`
- `git checkout`
- `git switch`
- `git merge`
- `git rebase`
- `git cherry-pick`
- commands that change branches, remotes, tags, or Git configuration

The user controls all Git history and remote operations.

## Secrets and environment files

- Do not modify `.env` files without explicit permission.
- Do not print, expose, copy, or commit secrets.
- Do not place API keys, passwords, tokens, database credentials, or private URLs in source code.
- Use `.env.example` with placeholder values when environment documentation is needed.

## Dependencies and commands

- Explain every new dependency before installing it.
- Do not install dependencies without explicit approval.
- Do not use global package installation.
- Do not execute destructive shell or PowerShell commands.
- Do not request full filesystem access.
- Stay inside the current repository workspace.

## Working process

Before changing files:

1. Inspect the relevant files.
2. Explain the intended plan.
3. List the files expected to change.
4. Stop for confirmation when the task is broad, ambiguous, or risky.

After changing files:

1. List every created or modified file.
2. Summarize the exact changes.
3. Report every command executed.
4. Run relevant checks such as lint and build when available.
5. Report errors honestly.
6. Do not hide failed checks or incomplete work.

## Frontend rules

- Frontend work belongs inside `ott-frontend/`.
- Do not create a complete application in a single task.
- Implement features in small, reviewable stages.
- Prefer clear and maintainable code over unnecessary complexity.
- Do not copy Netflix branding, logos, copyrighted artwork, or exact page designs.
- A dark cinematic streaming aesthetic may be used as inspiration, but the product must remain original.
