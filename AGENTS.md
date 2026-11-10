# AGENTS.md — Rules for the AI agent (Antigravity)

Read this file first, then everything in `docs/`: PRD, ARCHITECTURE, DESIGN, DATA, TASKS, AI_WORKFLOW.

## Project
Offline Quran Reading App for Android (phone), built in **React Native**. First APK is an MVP for Q9 Technologies. Deadline: Sunday night, 8 Nov 2026.

## Stack (fixed — do not change)
- React Native + **Expo** (latest stable SDK), **TypeScript** (strict)
- Expo Router (file-based navigation)
- Zustand (state) + AsyncStorage (persist settings, last read, bookmarks)
- `expo-font` for the Quran font, `expo-splash-screen`, `react-native-reanimated`, `react-native-svg`
- Quran text: bundled JSON in `src/features/quran/data/` (see `docs/DATA.md`)
- No backend, no network libraries, no analytics, no ads, no paywall (these come in later versions)

## Design rules (see docs/DESIGN.md — follow exactly)
- Very little text, no extra buttons. Only the elements listed in DESIGN.md exist on each screen.
- Colours ONLY from `src/shared/theme/colors.ts` (emerald green + white family). No gold, gradients, purple/blue, blur, emoji.
- Light animations are mandatory (list in DESIGN.md) using `react-native-reanimated`.
- If screenshots exist in `docs/design/` (from Stitch), match their layout; tokens still decide colours.

## Hard rules
1. **Never type, generate, edit, or "fix" Quran text.** Arabic and translation come ONLY from files produced by `tools/convert_quran.py` from Tanzil data.
2. **Offline.** The app must make zero network calls.
3. **MVP scope only.** Do NOT build: Juz navigation, audio, extra translations, translation search, notifications, prayer times, Qibla, tasbeeh, duas, notes, sharing.
4. **Do not copy the reference app** (name, logo, icons, screens, text, artwork, audio). Placeholder name "Noor Reader" and a simple self-made icon.
5. Only use assets with open/royalty-free licences. Record every source in `README.md`.
6. Arabic text: RTL, proper Quran font, generous line height so diacritics never clip. Check on a real Android device.
7. The final APK must have the JS bundle **embedded** (preview/release build). A dev build that needs Metro is NOT acceptable for submission.

## Working style
- Follow `docs/TASKS.md` step by step. After each step the app must run.
- Small commits with clear messages (`feat: surah list screen`, `fix: reader scroll restore`).
- Feature-based modular structure: `src/features/<feature>/` (quran, reader, surahs, bookmarks, home) with public APIs via `index.ts`, `src/shared/` (shared components, store, theme), and `app/` (screens only). No data logic inside screens. Features only import shared/ and other features through their `index.ts`.
- TypeScript types for all data. No `any`.
- Tick the checkbox in `docs/TASKS.md` when a step is done.
- If the same error repeats 3 times, stop and follow `docs/AI_WORKFLOW.md` (do not keep retrying the same fix).
- If something is unclear, ask the developer instead of guessing.
