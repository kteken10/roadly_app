# Roadly

<p align="center"><img src="docs/banner.png" alt="Roadly: premium hourly car rental app built with React Native" width="100%"></p>

![React Native](https://img.shields.io/badge/React%20Native-0.86-20232A?logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Platforms](https://img.shields.io/badge/platforms-iOS%20%7C%20Android-0A2540)

A premium hourly car-rental app: browse a small luxury fleet, see how far each car is parked, book it and unlock it from your phone.

## Screens

<p align="center"><img src="docs/tour.gif" width="260" alt="Tour of the app: onboarding, explore, car, nearby, trips, account"></p>

| Onboarding | Explore | Car |
|:---:|:---:|:---:|
| <img src="docs/screens/onboarding.png" width="160" alt="Onboarding"> | <img src="docs/screens/explore.png" width="160" alt="Explore"> | <img src="docs/screens/car.png" width="160" alt="Car detail"> |

| Nearby | Trips | Account |
|:---:|:---:|:---:|
| <img src="docs/screens/nearby.png" width="160" alt="Nearby map"> | <img src="docs/screens/trips.png" width="160" alt="Trips"> | <img src="docs/screens/account.png" width="160" alt="Account"> |

## Features

- **Onboarding**: three slides with parallax car visuals.
- **Explore**: greeting, nearest car first, brand filters that really filter, map and wallet tiles, saved filters.
- **Car detail**: specs (power, 0–100, CO₂, consumption), features, where it is parked and the walk to it, booking bar.
- **Nearby**: map with priced pins and the selected car's card.
- **Trips**: rental history with totals, refunds and saved cars.
- **Account**: profile, payment card with wallet balance, recent transactions.
- **Booking flow** and filters as modal screens.

## Tech stack

- React Native 0.86, Expo 57 (New Architecture), Expo Router, TypeScript
- Reanimated 4, Gesture Handler, expo-image, expo-blur, react-native-svg
- Zustand for app state, Plus Jakarta Sans

```
app/            screens (Expo Router): onboarding, tabs (explore, nearby,
                trips, account), car/[id], book, filters, rental
src/
├── components/ cars, home, map, navigation, ui kit
├── domain/     catalogue and types
├── store/      Zustand stores
├── theme/      design tokens
└── lib/        formatting, haptics, layout helpers
```

## Getting started

Expo Go does not support SDK 57: use a development build.

```bash
npm install
npm run android     # or: npm run ios (EAS development build)
npm start
npm run typecheck
```

The app runs on a local demo catalogue.

## History

This repository started as a Flutter prototype (last present at commit `e7468d9`). Roadly is a full redesign in React Native: same idea, rebuilt screens and a real domain model.

## Author

**Dissang Kevin** · Mobile AI Engineer
[Portfolio](https://dissangkevin.work) · [GitHub](https://github.com/kteken10)
