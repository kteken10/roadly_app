# Rove

A premium hourly car-rental app for iOS, rebuilt from the ground up in React Native + Expo.

This repository previously held a Flutter prototype. Rove is not a port of it — it is a product
refonte, and the Flutter sources have been removed: the repo is now 100% React Native. The old
build's intent (browse a small luxury fleet, filter by brand, open a car, book it) is kept; almost
everything else is redesigned around iOS conventions and the art direction in `design-references/`.

The Flutter code remains recoverable from git history — it was last present at commit `e7468d9`.

```
npm install
npm run ios             # one-off: builds a dev client for your iPhone via EAS
npm start               # daily: Metro, then scan the QR with that dev client
npm run typecheck
```

**Expo Go will not run this project.** It is pinned to whichever single SDK the App Store build
ships, and Rove targets SDK 57 — hence `Project is incompatible with this version of Expo Go`.
The fix is a development build, which is also what the sibling `reactnative_qrcode_app` does
(`"ios": "eas build --profile development --platform ios"`). You install it once; afterwards
`npm start` and a QR scan is the whole loop, and it keeps working across native dependency changes
that Expo Go could never load.

---

## What the Flutter app was, and where it went

| Piece | Flutter | Status in Rove |
| --- | --- | --- |
| `home_screen.dart` | Greeting, brand chips, 4 stacked car cards | Rebuilt as **Explore** |
| `header.dart` | Location + two circular buttons | Rebuilt as `LocationBar` |
| `tab_car_model.dart` | Brand chips that **did not filter anything** | Rebuilt as `BrandRow`, wired to real filtering |
| `car_detail_screen.dart` | Map screenshot, white-on-white text, dead buttons | Rebuilt as **Car detail** |
| `card_list.dart` (`CarItems`) | Four-column spec row | Rebuilt as the detail spec grid |
| `model/car.dart` | 6 fields | Expanded to a real domain model |
| `onboarding.dart` | Empty file | Built: 3-slide parallax intro |

Known defects in the original that are fixed here: the detail screen loaded `Images/map.png` and
`Images/driver.png` while the assets ship under `assets/` (guaranteed crash on open); "Call" and
"Book Now" rendered white text on white pills; `CarItems` used white text on a white card; the brand
filter had no effect on the list; and there was no state after booking at all.

---

## Architecture

```
app/                        # expo-router file routes — navigation only, no business logic
  _layout.tsx               # fonts, splash, root native Stack, sheet presentations
  index.tsx                 # onboarded? → tabs : onboarding
  onboarding.tsx
  (tabs)/
    _layout.tsx             # Tabs + custom floating glass tab bar + live-rental dock
    explore.tsx  nearby.tsx  trips.tsx  account.tsx
  car/[id].tsx              # detail, native push
  book/[id].tsx             # native form sheet
  filters.tsx               # native form sheet, 2 detents
  rental.tsx                # native form sheet, live rental controls
src/
  theme/                    # tokens + type scale. Every literal colour lives here
  domain/                   # types + catalog. Pure data, no React
  store/                    # zustand: fleet/filters, rental, session
  lib/                      # formatting, haptic vocabulary, ticker
  components/
    ui/                     # primitives: Text, Touchable, Button, Chip, PriceTag, RangeSlider…
    cars/  home/  map/  navigation/
```

Rules that keep it maintainable:

- **Screens compose, components render.** No screen contains a `StyleSheet` colour literal.
- **One pressable primitive.** Everything tappable routes through `Touchable`, so press physics and
  haptics are identical app-wide.
- **The store never knows about React Navigation**, and routes never contain filtering logic —
  `selectCars(filters)` is a pure function that is trivially testable.
- **Domain data is typed to the design.** `Car.pigment` is a design token, not a hex value, so the
  catalog can never introduce an off-palette colour.

## What makes it feel like an iOS app

| Area | What is used |
| --- | --- |
| Navigation | `expo-router` on native stack — real UIKit push, real interactive back-swipe |
| Sheets | `presentation: 'formSheet'` → genuine `UISheetPresentationController` with detents and grabber |
| Icons | SF Symbols via `expo-symbols`, with a hand-mapped Ionicons fallback off-Apple |
| Materials | `expo-glass-effect` (iOS 26 liquid glass) on the tab bar, `expo-blur` fallback below that |
| Haptics | A five-verb vocabulary in `lib/haptics.ts` — the same sensation always means the same thing |
| Gestures | `react-native-gesture-handler` for the dual-thumb price slider and slide-to-unlock, both driven on the UI thread |
| Motion | Three springs, defined once in `theme/tokens.ts`. Nothing animates on a bespoke curve |
| Type | Plus Jakarta Sans with optical tracking per size; tabular numerals on the rental meter |

## Design direction

Taken from the three reference boards in `design-references/`:

- Paper-white canvas (`#F4F4F5`), white cards, ink-black (`#0E0F11`) for every action.
- Four desaturated pigments — blush, sand, mist, sage — each assigned to a car so a card is
  recognisable before you read it.
- Money is a component, not a string: dollar sign, integer, cents and unit at four optical sizes.
- The Flutter yellow (`#FFCD04`) is retired as a brand colour and survives only as the live-rental
  pulse, where its single job is to say "something is running".

Brand marks are typographic monograms rather than manufacturer logos. Mixing real logos of wildly
different weights was the weakest part of the original filter row, and monograms also sidestep the
trademark question.

### The closed scales

`src/theme/tokens.ts` is not a suggestion box. Every scale in it is closed — a value that is not in
one of these objects does not belong in a stylesheet. That single constraint is what stops an
interface from reading as an assembly of parts.

| Scale | Rungs | Rule |
| --- | --- | --- |
| `control` | 28 · 36 · 44 · 52 · 60 | 44 is Apple's touch minimum. Anything smaller carries `hitSlop` to reach it. |
| `icon` | 11 · 13 · 16 · 20 · 24 | Paired to a text variant via `iconFor`, so glyph and label share an optical weight. |
| `space` | 2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 32 · 44 · 64 | The low rungs exist so intra-component gaps never need a raw number. |
| `radius` | 8 · 12 · 16 · 20 · 28 · 36 | Nested corners stay concentric: inner = outer − padding. |
| `border` | hairline · 1 · 2 | Divide, outline, ring. Nothing else. |
| `shadow` | card · lifted | Two elevations. More and the surfaces compete. |
| `type` | 11 variants | Tracking is a function of size, leading a function of role. |

Surface depth is three tiers and they are never mixed: `radius.xl` for a card sitting on the canvas,
`radius.lg` for a card inside one, `radius.md` for a row inside that.

## Building with EAS

`eas.json` ships three profiles.

```
npm i -g eas-cli
eas login
eas init                       # writes the real projectId into app.json
eas build --profile development --platform ios   # dev client for your iPhone
eas build --profile preview --platform ios       # internal distribution
eas build --profile production --platform ios
eas submit --platform ios
```

Set `ios.bundleIdentifier` in `app.json` to something you own before the first production build; it
is currently `com.rove.app`. `eas init` also writes the real `extra.eas.projectId`, which is not yet
set.

Native `ios/` and `android/` folders are intentionally absent and git-ignored — this is the managed
workflow, and EAS generates them at build time. Run `npx expo prebuild` only if you need to drop
into Xcode directly.

## Known limitations

- **Car photography is the ceiling on fidelity.** The four PNGs are inherited from the Flutter
  project at ~200×110 px. They are transparent cutouts, which is what the design needs, but they are
  roughly 1× for the sizes they are drawn at — expect softness on a 3× iPhone. Replacing them with
  ~1200 px-wide cutouts is the single highest-leverage visual upgrade and requires no code change.
- **The map is drawn, not real.** `components/map/CityMap.tsx` renders a stylised vector city. It
  matches the reference boards exactly and costs nothing, but it is not geographic. Swapping in
  `react-native-maps` with a custom light style is a contained change behind that one component.
- **State is in-memory.** Stores are plain zustand with no persistence layer; add
  `zustand/middleware`'s `persist` with `expo-secure-store`/`AsyncStorage` when there is a real
  account behind it.
- **No backend.** `domain/catalog.ts` is the seam — replace it with a fetch layer and the screens do
  not change.
