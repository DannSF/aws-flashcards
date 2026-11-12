# CloudRecall

An interactive, local-first study companion for AWS Certified Cloud Practitioner (CLF-C02). Questions and AWS terminology are in English; explanations and study guidance are in Spanish. No account, API key, paid service, or backend is required.

## Run

Use Node.js 24 (see `.nvmrc`) and npm:

```sh
npm ci
npm run dev
```

Vite serves the application on port 5173. For a production build:

```sh
npm run build
npm run preview
```

## This first release

- Responsive dashboard with real activity, a configurable daily goal, streak, recall accuracy, upcoming reviews, and domain progress.
- **114 original bilingual flashcards**: 24 Cloud Concepts, 30 Security & Compliance, 44 Cloud Technology & Services, and 16 Billing, Pricing & Support. Exam domain weights are displayed separately from library counts.
- Learn mode introduces a concept and example before asking for recall. Flashcards hide the answer until revealed, then offer Again, Hard, Good, and Easy ratings.
- FSRS scheduling using `ts-fsrs` with 90% target retention and deterministic intervals. Due cards appear first, then new cards. Early manual reviews are not used to inflate progress.
- Domain, service/concept, difficulty, review status, and text filters in the library.
- Review analytics, weak concepts, and the next eight scheduled cards.
- LocalStorage persistence, JSON backups, strict import validation, confirmed replacement/reset, and protection against overwriting unreadable saved data.
- Light/dark themes, reduced-motion support, native modal focus handling, a skip link, mobile navigation, and keyboard controls.

In study mode, use **Space** to reveal/hide an answer and **1–4** to rate a revealed answer. Shortcuts do not intercept typing or native button keyboard behavior. Ratings persist immediately. Viewing answers in the library never changes scheduling.

“Mastered” is a learning heuristic: FSRS Review state, stability of at least 21 days, and not currently due. Recall accuracy is the percentage of self-ratings Good or Easy; it is **not** an exam score. A session is counted only after its first rating. Streaks use the browser's local calendar days and can include yesterday if you have not yet studied today.

## Validation

```sh
npm test                    # content, FSRS, analytics, and backup validation
npm run test:e2e             # Playwright functional and mobile checks
npm run build               # TypeScript and production bundle
```

Install Playwright Chromium once with `npx playwright install chromium`. To use an existing browser instead:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

In this managed environment, the system Chromium was used because browser downloads were denied by network policy. If npm's default cache is not writable, use `npm --cache /tmp/cloudrecall-npm ci`. Browser screenshots are saved in ignored `test-results/`.

## Architecture

- `src/data/cards.ts`: versioned learning content, independent of UI and user progress.
- `src/data/domains.ts`: exam domain metadata and weights.
- `src/types.ts`: content, review, session, progress, and future exam interfaces.
- `src/lib/progress.ts`: FSRS adapter, analytics utilities, backup validation, storage, and export.
- `src/components/ui/button.tsx`: shadcn/ui button pattern with Radix Slot and class-variance-authority.
- `src/components/StudyWidgets.tsx`: shared statistics, charts, and accessible native dialogs.
- `src/pages/Dashboard.tsx`: learning dashboard.
- `src/App.tsx`: application navigation and study/library/progress/settings workflows.
- `src/styles.css`: Tailwind CSS integration and responsive theme styling; no external fonts or runtime assets are required.

Progress is separate from the content library under `cloudrecall.progress.v1`. JSON imports rehydrate FSRS date fields, validate known card IDs and scheduling parameters, and reject invalid data before any write. The application does not transmit progress. Storage and scheduling are isolated behind functions so a database-backed repository can replace local persistence later.

## Content references and limitations

All cards are **original practice material, not official AWS exam questions**. AWS does not endorse this application. No leaked exam content is included.

Reference sources for continued editorial review:

- [Official CLF-C02 exam guide](https://docs.aws.amazon.com/aws-certification/latest/examguides/cloud-practitioner-02.html)
- [AWS service documentation](https://docs.aws.amazon.com/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)
- [AWS pricing](https://aws.amazon.com/pricing/)
- [AWS Support plans](https://aws.amazon.com/premiumsupport/plans/)

Official documentation retrieval returned HTTP 403 during implementation. Therefore this library has not been verified against the latest online AWS documentation. It avoids fixed price quotes and changing technical-support plan guarantees. Perform an official-source editorial review before using this as a sole certification study resource. The included tests verify content completeness and important distinctions, not authoritative validation of every AWS fact.

## Next phases

This is the requested first working MVP with FSRS and data protection added. The following are **not implemented** and have no placeholder navigation controls:

- Scenario-based multiple choice with per-option explanations.
- Side-by-side service comparisons with mini-quizzes.
- 10/20/65-question exam simulation, multiple responses, timer, exam analytics, and incorrect-answer export.
- Exam-date cram mode that leaves normal scheduling intact.

The exam interfaces are reserved for these later phases. This version rejects backups containing exam records rather than silently dropping unsupported data. Browser-local persistence does not sync across devices; export a backup before clearing browser data.
