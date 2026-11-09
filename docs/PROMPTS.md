# Prompts for Antigravity (copy one by one, in order)

Always start a task with: "Read AGENTS.md and the relevant docs first. Give me a short plan before changing code."
If Stitch screenshots are in docs/design/, add: "Match the layout of the screenshots in docs/design/; colours must come from docs/DESIGN.md tokens."

**Prompt 0 — setup**
> Read AGENTS.md and all docs. Create an Expo + TypeScript project with Expo Router in this folder using the structure in docs/ARCHITECTURE.md (empty placeholder files where needed). Install the listed dependencies (including react-native-reanimated and react-native-svg). Make sure `npx expo start` runs and the app opens on the Android emulator. Commit.

**Prompt 1 — theme + building blocks**
> Implement src/theme (colors.ts with the exact tokens in docs/DESIGN.md, typography.ts, ThemeProvider with useTheme(); light/dark/system with a smooth colour transition). Then build the reusable components: AnimatedPressable (press scale 0.97 with spring), FadeInView (fade + slide up, delay prop), StarBadge and GeometricPattern (react-native-svg, as described in DESIGN.md → Ornament).

**Prompt 2 — data**
> Implement src/types/quran.ts and src/data/quranRepository.ts using the generated files in src/data/quran (format in docs/DATA.md): getSurahs() and getSurah(n) via lazy loaders. Never create or modify Quran text. Add a small script that loads all 114 Surahs and checks the total is 6236 Ayahs.

**Prompt 3 — root layout + Home**
> Implement app/_layout.tsx: load the Quran font, wait for store hydration, keep the splash until ready, ThemeProvider, stack navigation with short slide/fade transitions. Then build the Home screen exactly per docs/DESIGN.md → Home (hero with pattern and breathing star, Arabic title, Continue card overlapping the hero, two tiles) including the entrance animations. Keep text to the minimum listed.

**Prompt 4 — surah list + search**
> Implement app/surahs.tsx per DESIGN.md: SearchBar, SurahRow (StarBadge, English name + "Makki · 7", Arabic name in primary), staggered fade-in for the first ~10 rows, press highlight. Search filters by English name, transliteration, Arabic name or number.

**Prompt 5 — reader**
> Implement app/reader/[surah].tsx per DESIGN.md → Reader and ARCHITECTURE.md → Reader behaviour. Header with only back icon, Surah Arabic name and translation toggle. FlatList with SurahBanner, Bismillah (when flagged) and memoized AyahItem (large RTL Arabic with inline ﴿n﴾ end-marker, translation below, one small bookmark icon top-left). No other buttons. Open at the `ayah` param with scrollToIndex + onScrollToIndexFailed handling + highlight flash. Smooth translation toggle.

**Prompt 6 — persistence**
> Implement settingsStore, lastReadStore, bookmarksStore (Zustand persist + AsyncStorage). Save last read (debounced) from the reader and feed the Continue card on Home ("Start reading" if empty).

**Prompt 7 — bookmarks**
> Wire the bookmark icon (spring pop animation when saved) and implement app/bookmarks.tsx per DESIGN.md: rows with StarBadge, Surah name, Arabic preview, trash icon with animated removal, and the minimal empty state.

**Prompt 8 — settings**
> Implement app/settings.tsx per DESIGN.md: Arabic and translation sliders, 3-icon theme segmented control, live preview card, tiny Tanzil credit footer with link. Changes apply instantly and persist.

**Prompt 9 — animation + polish pass**
> Go through the animation table in docs/DESIGN.md and make sure every row is implemented and smooth; respect reduce-motion. Check dark-mode contrast, clipped Arabic marks, and that no text or buttons exist beyond what DESIGN.md lists. Do not add features.

**Prompt 10 — QA + README**
> Review against docs/PRD.md "Definition of Done". Check there are no network calls. Update README.md (done/pending/sources).

**Prompt 11 — APK**
> Help me build an Android APK with the JS bundle embedded (EAS preview profile with buildType apk, or local assembleRelease). Explain each step and how to verify it runs without Metro.
