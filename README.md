# DOOM Tracker

A standalone, local-first Marvel fan hub built with React 19, TypeScript, and
Vite 7. Everything needed to develop and build the app lives in this folder.
It does not depend on an office repository, a backend, or a Git checkout.

Source repository: [JagadeeshKJ/marvel-doomsday](https://github.com/JagadeeshKJ/marvel-doomsday).

## Start the app

Open this folder in VS Code. In a PowerShell terminal:

```powershell
npm ci
npm run dev
```

Open <http://127.0.0.1:5173/>. This standalone setup uses local HTTP, with no
certificate configuration or backend proxy.

Node.js 24 is selected in `package.json` and was used to verify this project. npm is the
package manager; exact installed dependencies are recorded in
`package-lock.json`. No environment variables or credentials are required.
The project-level [.npmrc](./.npmrc) uses the public npm registry so installs
do not depend on a work machine's company package feed.
The portable lockfile retains exact versions and integrity hashes while omitting
registry-specific download URLs using npm's `omit-lockfile-registry-resolved`
setting. npm resolves those versions through the registry in `.npmrc`.

## Verify and build

```powershell
npm run verify
```

This runs the existing component and utility tests, strict TypeScript checking
(including tests and configuration files), and a Vite production build.
All 34 tests and the production build passed locally. Direct access to public npm
failed with a TLS handshake error on the preparation machine, so a fresh install
against the public registry could not be exercised there. Public deployment still
requires your own GitHub/Vercel accounts and a successful Vercel build.
Individual commands are also available:

```powershell
npm test
npm run typecheck
npm run build
npm run preview
```

The build output goes to [dist](./dist). The production preview normally uses
<http://127.0.0.1:4173/>. If another app already occupies a port, choose a free
one explicitly with `npm run dev -- --port 5174` or
`npm run preview -- --port 4174`.

## Deploy to Vercel

The deployment is a static website; no paid backend or secret keys are needed.
This repository contains only the standalone DOOM Tracker source and deployment
configuration. Vercel must be connected separately using your personal account.

### Import the personal repository

1. Sign in to your personal Vercel account at <https://vercel.com/new>.
2. Connect your personal GitHub account and import **JagadeeshKJ/marvel-doomsday**.
   Grant access only to the repository you intend to deploy.
3. Confirm these build settings:

   | Setting | Value |
   | --- | --- |
   | Framework preset | Vite |
   | Root directory | Repository root (`.`) |
   | Node.js version | 24.x |
   | Install command | `npm ci` |
   | Build command | `npm run build` |
   | Output directory | `dist` |
   | Environment variables | None |

   [vercel.json](./vercel.json) supplies the framework and build settings, and
   [package.json](./package.json) selects Node 24.

4. Click **Deploy**. When it finishes, open the production domain Vercel assigns,
   such as `your-project-name.vercel.app`. The actual address is assigned by
   Vercel; it is not a link that has already been created for this project.
5. Test the production URL in a signed-out/private browser before sharing it
   with friends. If Vercel asks visitors to sign in, review that personal
   project's **Deployment Protection** settings for the production environment.
6. Share the production domain, not the local `127.0.0.1` preview address.

Navigation uses URL fragments such as `/#watchlist` and `/#characters`, so
refreshing a shared page works on static hosting without server rewrites.
Subsequent updates to the connected production branch can redeploy automatically.
Each friend's watchlist and reminders stay in their own browser; they are not
shared accounts or shared server data.

For future source updates, work in this standalone repository. The included
`.gitignore` excludes installed dependencies, build output, local environment
files, Vercel metadata, and the local source ZIP from commits.

Official reference: [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).

## Included

- A cinematic countdown to the scheduled December 18, 2026 US Doomsday release,
  anchored to midnight US Eastern. Release dates may change.
- Original fan briefings, category filters, bookmarks, official-source links,
  and search across news, characters, and titles (`Ctrl+K` or `Cmd+K`).
- A starter watchlist with add/remove, watched status, filtering, and search.
- Spoiler-free character profiles and a spoiler shield that also protects search.
  Revealing one article does not disable the global shield.
- Local reminders, completion tracking, and `.ics` calendar export with a
  15-minute alarm. Import exported files into a calendar app for notifications
  while DOOM Tracker is closed.
- Regional links to real ticket providers, who handle availability, payment,
  booking, and seat selection.
- A local explorer profile, mobile layouts, keyboard-accessible dialogs,
  reduced-motion support, and visible storage-error messages.

## Local-first boundaries

Preferences are stored in this browser under `doom-tracker:v1`. Profile reset
affects only that key. Browser data is specific to its origin, so a watchlist
saved at port 4173 is separate from a watchlist saved at port 5173.

There is no account system, cloud sync, payment processing, automated live news
feed, or background push service. The ticket hub links to providers rather than
pretending to complete a purchase.

The hero and first-family graphics are original fan illustrations. Film posters
are externally linked from Wikipedia for identification and display an explicit
fallback if unavailable. Fonts use Google Fonts with system fallbacks; those
external assets need an internet connection.

This is an independent, unofficial fan project, not affiliated with or endorsed
by Marvel or Disney. Character names belong to their respective owners.

## Project structure

- [src/doom-main.tsx](./src/doom-main.tsx): application entry point.
- [src/components/DoomTracker](./src/components/DoomTracker): screens, styling,
  content, dialogs, and component tests.
- [src/contexts/DoomTrackerContext.tsx](./src/contexts/DoomTrackerContext.tsx):
  shared application state.
- [src/hooks/useDoomTrackerState.ts](./src/hooks/useDoomTrackerState.ts):
  browser persistence and storage errors.
- [src/utils/doomTracker.ts](./src/utils/doomTracker.ts): countdown, validation,
  and calendar export, with adjacent tests.
- [public/doom](./public/doom): local artwork and favicon.
