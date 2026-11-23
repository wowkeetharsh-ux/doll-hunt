# Doll Hunt v34 — Complete UI Redesign

A visual refresh of the complete game interface. Existing gameplay systems, character model assets, screen IDs and button handlers are preserved.

## Scope
- Main menu: cinematic title panel + clear mode deck, responsive on phone/tablet/landscape.
- Login/player ID screen: modern identity card.
- Character carousel: enlarged 3D stage and cleaner controls.
- Online lobby: readable Hider/Seeker panels and matchmaking progress.
- Practice setup: clear player count and difficulty options.
- How to Play and Game Over: cleaner card-based layouts.
- HUD: redesigned information rail and thumb-friendly control appearance.

## Validation
- 11 inline JavaScript blocks pass `node --check`.
- CSS parsing reports no errors.
- 150 HTML IDs scanned; no duplicates.
- Both HTML entry points synchronized.
- ZIP archive integrity passes.

Actual device gameplay, WebGL rendering and touch-control ergonomics still require Android testing.
