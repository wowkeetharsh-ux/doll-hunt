# Doll Hunt v30 — Seeker AI, 3D Seeker Picker & Wall Camouflage

- The existing 3D swipe carousel now switches between Doll and Seeker rosters. Choose Seeker opens 4 real GLB models (Dwarf Knight, Orc Berserker, Human Assassin, Farmer), with swipe and arrow navigation; the selected class updates its weapon and is saved.
- Offline AI Seekers move faster, converge on a Doll attached to a wall, and retain the furniture inspection behavior.
- Practice bot Seekers use quicker search timing and obstacle-aware steering.
- AI movement now tries multiple steering/slide directions around colliders and retargets when blocked, reducing long pauses against walls.
- WALL CAMO POWER samples the currently attached surface, applies its colour/pattern, and now tints the visible GLB Doll model as well as the original paint texture.
- Camouflage continues to reduce Seeker detection range and increase the time required to identify a well-hidden Doll.

Validation: JavaScript syntax checks and ZIP integrity checks are performed for this release. Android device rendering, real-time touch behavior, FPS, and live multiplayer require device/server tests.
