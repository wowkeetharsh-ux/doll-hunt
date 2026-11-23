# Doll Hunt v20 — Hider Mastery, Graphics Presets and AI-Fill Matchmaking

## Added
- Hider Mastery progression 1–10, local persistence, level-based passive camouflage, unlockable active abilities and profile panel.
- Seven abilities with server-validated unlock levels, durations and cooldowns: Silent Hold, Miniature Shift, Decoy Echo, Shadow Veil, Wall Grip, Master Blend, Phantom Blend.
- Multiplayer footstep noise cues; Silent Hold suppresses cues and Decoy Echo generates approximate false cues.
- Human-first matchmaking with an 18-second priority window; server bots fill missing seats after at least one human joins.
- Final 8-player match (5 Hiders / 3 Seekers), preserving the expected human splits before bots fill vacancies.
- Human-like bot behavior: patrol, imperfect accuracy, reaction delay, pauses, approximate sound investigation and divider-wall line-of-sight.
- Four graphics presets: LOW, MEDIUM, HIGH, ULTRA. Re-applies quality after map lighting/shadow casters are built.
- Server validation for vertical climb speed, with a limited boost while Wall Grip is active.

## Preserved
- v17 gameplay and Practice AI/difficulty, 5–8 Practice roster counts, Doll selection, surface paint/camouflage, hiding spots, high walls/ceiling, wall climb and mobile controls.
- v18 Settings, health check, server URL, pause/resume, Play Again, match summary and adaptive resolution.
- v19 Profile/Coins/XP, modifiers, hit feedback, toast effects, flickering lights and dust.

## Known limitations
- Hider Mastery and profile data are localStorage based; not yet cloud-synced or secure against client modification.
- AI bots are heuristic and cannot be claimed indistinguishable from humans.
- Full Rapier rigid-body physics is not yet integrated; existing static collider movement plus server bounds/speed/line-of-sight checks remain.
- Dependency-backed TypeScript build, Android WebView test, Xiaomi Pad 6 test and live multiplayer tests remain pending in this environment.
