# Developer Guide (for junior developers)

Purpose: a concise, practical guide to help new team members understand the project structure, find reusable components, run the app locally, and follow team conventions.

Who is this for
- Junior developers joining the project or new hires who need a quick orientation and runnable examples.

Getting started (local setup)
1. Install Node.js 16+ and npm.
2. Install dependencies:
```bash
npm install
```
3. Copy env example and update keys:
```bash
cp .env.example .env
```
4. Start dev server:
```bash
npm run dev
```

Where things live (quick map)
- Shared UI components: `src/components/ui` (buttons, cards, pagination, headers)
- Layout components: `src/components/layout` (header, footer, root layout, sidebar)
- Page-specific components: `src/pages/.../components` (components scoped to a page)
- State & store: `src/features` (slices + `store.js`)
- Services & API: `src/services` and `src/services/axiosInstance.js`
- Utilities: `src/utils`

Adding or updating a shared component
1. Prefer `src/components/ui` for truly reusable components.
2. Keep components small and prop-driven. Provide clear prop names and defaults.
3. Add a simple story/example or a small usage snippet in the component file or docs.
4. Update `docs/COMPONENTS.md` with a one-line description and example usage.

Page-scoped components
- If a component is used in only one page or feature, keep it inside that page folder under `components/`.

Code style & linters
- ESLint and Prettier are configured. Run `npm run lint` and `npm run format` before committing.
- Follow existing patterns for hooks, context, and slice structure.

Testing
- Add unit tests for new logic. Run tests with `npm test` if available.

PR workflow (team internal)
1. Create a branch from `main` named `feature/<short-description>`.
2. Keep PRs focused; include a short description and screenshots for UI changes.
3. Request peer review and address feedback.

Common gotchas
- Environment variables: ensure `.env` is set for API endpoints.
- Shared state changes: update reducers and tests when adding new slices.

Need help?
- Open an issue or mention a team lead in Slack/Teams. Add a short summary and steps to reproduce if relevant.
