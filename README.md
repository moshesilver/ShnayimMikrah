# ShnayimMikrah

ShnayimMikrah is a mobile-first application prototype intended to help users perform the traditional practice of Shnayim Mikrah (reading the weekly Torah portion twice, with a translation read once). The project was designed to be a highly customizable platform so that each user could configure the app to match their personal or communal customs for how Shnayim Mikrah is performed.

Important: this repository is an incomplete, experimental prototype. Development stopped with unresolved errors and unfinished features. The codebase is provided as-is for reference, learning, or further development.

## Project purpose and vision

The app's goal is to make it easy to follow Shnayim Mikrah consistently while supporting diverse minhagim (customs). Rather than a single rigid workflow, the design emphasizes configurable reading flows so users can:

- Choose how to divide the weekly portion (by aliyah, by verse ranges, or custom splits).
- Define repetition and ordering rules (e.g., two Hebrew readings + one translation).
- Decide whether to read the just the text, or include translations and/or commentaries.
- Configure reminders, scheduling preferences, and progress tracking to match personal routines.
- Use localized translations and toggle presentation options (font size, right-to-left support, verse highlighting) to match comfort and custom.

## What’s in this repo

- A React Native / Expo app scaffold (TypeScript) with an app directory following file-based routing.
- UI components and early data models for parsha navigation, reading segments, and user preferences.
- Early work toward scheduling and offline-friendly reading.

Because the project is incomplete, several screens, data flows, and error-handling paths are either missing or unstable.

## Current status & limitations

- Prototype / incomplete — not production-ready.
- Several runtime errors and incomplete flows prevent full usage.
- Customization was not fully implemented.
- No stable backend or sync service included; state persistence is partial.
- Tests, accessibility work, and many screens are unfinished.

If you plan to run the app locally, expect to encounter issues.

## Intended features (planned)

- Per-user customizable reading workflows (division of parsha, repeat rules, reading order)
- Fine-grained presentation controls (fonts, line spacing, RTL/LTR)
- Reminders and calendar integration
- Offline-first data model with optional cloud sync
- Export/import of custom workflows and reading progress

Note: Because the project is unfinished, running it may produce errors.
