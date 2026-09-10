# FutureAfricaMinds Web

## Mobile adventure prototype

The learner mission flow now includes a mobile-first game experience:

- FAM robot mission briefing
- mission route and available XP preview
- lives, progress and answer streak HUD
- instant animated answer feedback
- final boss challenge
- mission results, reward chest and unlocked item
- lightweight game sounds with a persistent sound on/off control

The adventure pages reuse the existing mission content, access rules and learner-progress APIs.

Mobile-first web scaffold for the FAM Grade 12 learning platform.

## Included

- Responsive mobile-first FAM landing page
- Grade 12 subject catalogue
- Subject → topic → mission flow
- Free vs premium mission UI
- Working quiz flow with answer explanations and results
- Past Papers route ready for the existing FAM content feed
- Account route ready for authentication/progress
- Cloudflare content base URL environment variable
- Desktop responsive layout without losing mobile-first behaviour

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`.

## Validate

```bash
npm run typecheck
npm run build
```

## Existing FAM content service

The scaffold expects:

```env
VITE_CONTENT_BASE_URL=https://fam-matric-content.pages.dev
```

`src/lib/content.ts` is the integration boundary. It currently checks the existing manifest and falls back to scaffold data. The next production step is to map the mobile app content manifest into the web `Subject`, `Topic`, `Mission`, and `Question` types.

## Recommended next implementation order

1. Wire the real FAM subject/mission content feed.
2. Replace sample Geography questions with the live mission JSON.
3. Connect `past-papers.json`.
4. Add authentication and learner progress.
5. Add web premium entitlement/payment flow.
6. Add PWA manifest/service worker.
7. Deploy to Cloudflare Pages.
