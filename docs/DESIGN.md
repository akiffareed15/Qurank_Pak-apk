# Design — "Noor Reader" (placeholder name)

## Principles (follow strictly)
1. **Calm and spacious.** Very little text. Icons instead of labels wherever clear. No clutter, no extra buttons, no tips, no banners.
2. **Arabic is the hero.** Big, beautiful, well-spaced Quran text.
3. **Only green + white.** Classic Quran-app feel: one refined emerald green, white/soft-white surfaces. No gold, no gradients, no purple/blue, no glass/blur, no neon, no emoji, no stock illustrations.
4. **Light animations everywhere (mandatory).** Soft, short, never distracting (see Animations).
5. If Stitch screenshots exist in `docs/design/`, match their layout. **Colours always come from the tokens below.**

## Colour tokens (`src/theme/colors.ts`)
| Token | Light | Dark |
|-------|-------|------|
| primary (emerald) | #0B6B4C | #3DB88A |
| primaryDeep (hero, splash, pressed) | #084F38 | #0F3D2C |
| primarySoft (tints, highlight, selected) | #E6F2EC | #173A2D |
| onPrimary | #FFFFFF | #FFFFFF |
| onPrimaryMuted | rgba(255,255,255,0.72) | rgba(255,255,255,0.72) |
| background | #F7FAF8 | #0A1612 |
| card | #FFFFFF | #11241C |
| text | #10261D | #E8F2ED |
| textMuted | #5F7369 | #8FA79B |
| border | #DCE8E1 | #1F3A2E |
| danger | #B3261E | #F2B8B5 |

Rules: green is used for hero, Arabic accents (Bismillah, ayah end-marker, Surah name), icons, active states. Everything else is white/soft-white with dark-green text. No other hues anywhere.

## Typography
- **Arabic:** Quran font (Amiri Quran or similar, check licence). Default 28, range 20–44. `lineHeight = 1.95 × size`, `writingDirection: 'rtl'`, right-aligned.
- **Translation:** system font, default 16, range 12–26, `lineHeight = 1.5 × size`, colour `textMuted`.
- **UI:** system font. Screen title 20/semibold, row title 16/medium, caption 13.
- Ayah end-marker: `﴿١﴾` with Arabic-Indic digits, in `primary`, inline after the Arabic text.

## Shape and spacing
8px grid. Screen padding 20. Card radius 20. Min touch target 48. Soft shadow only on the Continue card (very light, green-tinted, elevation 2). Everything else flat with 1px `border`.

## Ornament (the only decoration)
- **StarBadge:** 8-point star (two overlapping squares, `react-native-svg`) holding a number. Used for Surah numbers and bookmark rows.
- **GeometricPattern:** subtle repeating 8-point-star line pattern (SVG), white at 8–10% opacity, only inside the Home hero and Surah banner.

## Screens (text allowed on screen is listed — nothing more)

### Splash
Native splash: `primaryDeep` background, centred star ornament. Same colour as the Home hero so the transition feels seamless.

### Home (the beautiful one)
- **Hero** (top ~42% of screen, `primaryDeep`, bottom corners radius 32, GeometricPattern behind): settings icon (top-right, white line icon). Centre: Arabic **القرآن الكريم** (Quran font, 40, white). Under it tiny app name (13, letter-spaced, `onPrimaryMuted`). A large faint star ornament behind the title slowly "breathes".
- **Continue card:** white card overlapping the hero's bottom edge by ~40px, light shadow. Left: StarBadge with Surah number. Middle: English Surah name + "Ayah 25" (muted). Right: chevron. If nothing read yet: only "Start reading" (opens Surah 1).
- **Two tiles** below, side by side: **Surahs** (book icon) and **Bookmarks** (bookmark icon), label under icon. White, radius 20, 1px border.
- Text on screen: app name, Surah name, "Ayah N", "Surahs", "Bookmarks". That's it.

### Surah list
- Top: back icon + search field (search icon, placeholder "Search").
- Row (72px): StarBadge with number (left) · English name (16 medium) with small muted "Makki · 7" below · Arabic name large in `primary` on the right. Hairline separators. Pressed row = `primarySoft`.

### Reader (the screen where Ayahs are read)
- **Header:** back icon (left), Surah Arabic name centred (Quran font 24), translation toggle icon (right; filled = on). No other buttons. Hairline border fades in after scrolling.
- **Surah banner** (first item): thin `primary` border, GeometricPattern at very low opacity, Surah Arabic name centred large, tiny English name under it.
- **Bismillah** (second item, except Surah 1 and 9): centred, Quran font 30, `primary`.
- **Ayah block:** padding 20/16. Arabic text right-aligned, large, with `﴿n﴾` end-marker inline. Translation below in `textMuted` (left-aligned for English; RTL for Urdu). Hairline separator between Ayahs (inset). **One small bookmark icon** at the top-left of the block (outline, 50% opacity; filled `primary` when saved).
- No Ayah numbers in badges, no per-Ayah menus, no share/copy/play buttons, no floating buttons.
- Opening from Continue/Bookmark: scroll to the Ayah and flash it with `primarySoft` fading out over ~1.5s.

### Bookmarks
- Title "Bookmarks". Row: StarBadge with Ayah number · Surah English name · one-line Arabic preview (Quran font, right) · small trash icon. Removing animates the row out.
- Empty: large muted bookmark icon + one line "No bookmarks yet".

### Settings
- Three groups, minimal labels: **Arabic** (slider), **Translation** (slider), **Theme** (3-icon segmented control: sun / moon / phone).
- Live preview card: Bismillah + one translation line, reacts to sliders.
- Footer, tiny muted: "Quran text: Tanzil Project (tanzil.net)" (link).

## Animations (react-native-reanimated; all 200–450ms, ease-out, no bounce except bookmark pop)
| Where | Animation |
|-------|-----------|
| Navigation | Stack slide-from-right (short); Home ↔ others uses fade |
| Home hero | Star ornament breathes (scale 1 → 1.05, ~6s loop); title fades in + slides up 12px |
| Home cards | Continue card, then the two tiles: fade + slide up 24px, staggered 100ms |
| Any pressable card/tile/row | Press scale to 0.97 with spring release |
| Surah list | First ~10 rows fade in staggered (once per mount) |
| Reader | Surah banner + Bismillah fade in; target Ayah highlight flash |
| Bookmark icon | Small spring "pop" (scale 1 → 1.25 → 1) when saved |
| Translation toggle | Translation text cross-fades / layout animates smoothly |
| Bookmarks | Row removal fades + collapses |
| Theme change | Colours switch smoothly (short fade) |
Respect system "reduce motion": disable loops and shorten transitions.

## Components
ContinueCard, HomeTile, GeometricPattern, StarBadge, AnimatedPressable, FadeInView(delay), SurahRow, SearchBar, SurahBanner, BismillahHeader, AyahItem, EmptyState.

## App icon
Deep emerald background + white 8-point star outline (or crescent + star), self-made vector. No reference-app art.
