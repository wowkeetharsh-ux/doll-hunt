# Doll Hunt v32 — Stability & Bug Fix Pass

- Added deterministic cleanup for all in-flight weapon projectiles at round end, mode reset and restart; the equipped weapon is restored.
- Fixed AI line-of-sight when a Doll is attached directly to a wall/ceiling by excluding only the supporting surface. Other walls and furniture remain blocking.
- Fixed AI thrown-weapon collision against the Doll's supporting surface.
- Added alternate cabinet approach points and delayed reassignment when an Offline AI Seeker is blocked. A hidden Doll can no longer lose its assigned searcher permanently after a blocked route.
- Practice AI now temporarily skips cabinets it cannot reach and retries them after a cooldown rather than repeatedly walking into the same obstruction.
- Reset per-round AI timers and stale search/throw state when changing modes.

Validation: all inline JavaScript parsed with Node.js; HTML IDs checked for duplicates; asset paths and zip integrity checked. Android rendering, touch input, GPU/FPS and live multiplayer still need device/server testing.
