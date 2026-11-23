# Doll Hunt v27 — Character Roster

Built on v26. All supplied GLBs are integrated; every character got a role.

| GLB | Role | Notes |
|---|---|---|
| dwarf-knight-base.glb | Seeker — HAMMER | unchanged v26 behaviour |
| orc-berserker-base.glb | Seeker — MACE | scale 1.0 (tallest hunter); FP weapon = `mace` mesh |
| human-assassin-base.glb | Seeker — DAGGER | scale 1.1; FP weapon = `stiletto` mesh |
| farmer-base.glb | Seeker — TOOL | scale 1.15; FP weapon = held farm-tool mesh |
| kite-kid-base.glb | Hider skin `kite` | |
| kid-in-a-puffy-coat-base.glb | Hider skin `puffy` | |
| choral-star-girl-base.glb | Hider skin `star` | |
| choir-singer-base.glb | Hider skin `choir` | |
| taverna-table-set-6b4bc1.glb | Tavern Corner prop | auto-placed on a free floor spot, invisible AABB collider |
| hand-crossbow-77a4c7.glb | Tavern Corner prop | lies on the table top (y 0.761), scale 1.6 |
| standing-percussionist-base.glb | Tavern Corner NPC | idle drummer beside the table, collider |

## Implementation
- Client: self-contained add-on `<script id="dh-v27-roster-js">` at the end of `index.html` (v18/v19/v20 style). It wraps `attachKnightVisual`, `installFirstPersonMaul`, `applyDollSkin`, `createRemotePlayer`, `applyLocalRole` on the live game instance.
- All rigs share the same bone names and Idle/Walk/Run clips, so the existing knight animation/swing code drives every class.
- First-person weapons are baked from the GLB weapon mesh and auto-oriented (long axis to +Y, head/tip up).
- GLBs load lazily; any failure keeps the v26 visuals.
- Server (`server/src/rooms/DollHuntRoom.ts`): `VALID_SKINS` gains `kite, puffy, star, choir`; new `VALID_SEEKER_CHARS` (`dwarf, orc, assassin, farmer`) accepted through the `skin` message for seekers; bots get matching skin pools. Gameplay rules (hammer reach, validation) unchanged.
- Hit range, speed and AI behaviour are identical for all Seeker classes (cosmetic roles; balance can be tuned later).
