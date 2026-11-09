# Tasks (tick as you go)

## Before coding (tonight / first thing)
- [x] Message Technical Lead: confirm React Native (Expo) + translation choice and its commercial licence
- [x] Download the 3 Tanzil files into `tools/source/`
- [x] Download a Quran font (.ttf) and check its licence (`AmiriQuran-Regular.ttf` SIL OFL 1.1)
- [x] Create Git repo, first commit with these docs
- [ ] Finish Stitch designs; export screenshots into `docs/design/` (Home, Surah list, Reader, Bookmarks, Settings; light + dark)

## Day 1 — Saturday 7 Nov: foundation + reading
- [x] 1. `npx create-expo-app` (TypeScript, Expo Router), run on emulator, commit
- [x] 2. Theme: colors, typography, ThemeProvider (light/dark/system)
- [x] 3. Run `convert_quran.js`, validate data, files in `src/data/quran/`
- [x] 4. Types + `quranRepository`
- [x] 5. Root layout: load fonts, hydrate stores, splash, navigation
- [x] 6. Home screen exactly per DESIGN.md (hero, pattern, Continue card, 2 tiles) with its animations
- [x] 7. Surah list + search
- [x] 8. Reader (header, Bismillah, Ayah items, Quran font, RTL), translation toggle
- [ ] 9. Test Surah 1, 2, 36 on a REAL device (diacritics), commit

## Day 2 — Sunday 8 Nov: persistence + polish + submit
- [x] 10. Zustand stores with AsyncStorage persist (settings, last read, bookmarks)
- [x] 11. Continue reading (save while scrolling, restore from Home)
- [x] 12. Bookmark toggle in reader + Bookmarks screen
- [x] 13. Settings screen wired to reader + app theme
- [x] 14. Placeholder icon + splash (same green as hero)
- [x] 14b. Animation pass: go through the DESIGN.md animation table, tick every row; test reduce-motion
- [ ] 15. Test: real device + emulator, portrait + dark mode, airplane mode, kill/reopen app
- [x] 16. Open all 114 Surahs, fix crashes (verified via `tools/verify_data.js`)
- [x] 17. Finish README (done/pending/sources), final commit
- [x] 18. Build APK with embedded JS (EAS preview or assembleRelease), install on device, check it runs WITHOUT Metro
- [ ] 19. Share APK + repo access with Technical Lead
