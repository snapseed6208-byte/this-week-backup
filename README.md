# This Week / 本周主题

A **theme-week life reset tool** — pick a weekly theme, check in daily, reflect on Sunday.

Instead of vague new-year resolutions, you choose one focused theme each week (e.g. "早睡周", "阅读周", "运动周") and follow a simple daily action. Seven days, one theme, a small step toward the life you want.

## Core Features

- **96 theme templates** across 13 categories — study, fitness, English, AI skills, decluttering, low-energy recovery, and more
- **Mood-based recommendations** — tell the app how you feel, get matching themes
- **Search & filter** — browse themes by category or keyword
- **7-day check-in tracking** — mark each day as full, light, or missed; log notes and numeric values
- **End-of-week review** — capture your biggest gain, struggle, and decide whether to continue
- **History** — browse past weeks with expandable stats and review notes
- **Fully offline** — all data stored in localStorage, no account or backend required

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Styling | TailwindCSS v4 |
| Icons | lucide-react |
| Routing | wouter |
| Utilities | clsx, tailwind-merge |
| Storage | localStorage (no backend) |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5174)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Deployment

The app is a fully static frontend. After `npm run build`, deploy the `dist/` folder to any static host:

- **Cloudflare Pages**: connect repo, build command `npm run build`, output dir `dist`
- **Vercel**: import repo, framework preset Vite, output dir `dist`
- **Netlify**: drag `dist/` or connect repo with build command `npm run build`

No server, no database, no environment variables needed.
