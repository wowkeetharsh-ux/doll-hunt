# v27 Test Checklist (device)
1. Start screen: SEEKER button cycles Dwarf Knight → Orc Berserker → Human Assassin → Farmer.
2. Practice Room: first-person weapon + action button label match the class (HAMMER / MACE / DAGGER / TOOL); weapon is visible, not clipped, tip/head up.
3. Offline Doll Mode: the 4 AI seekers look like Dwarf, Orc, Assassin, Farmer, walk/run/idle and swing.
4. CHOOSE DOLL: 8 skins in two rows; Kite/Puffy/Star/Choir show as animated characters (Idle when still, Walk/Run when moving); half-height, wall attach and hiding in almirahs still work.
5. Practice Room: HIDER 2/4 appear as kid characters when found.
6. Tavern Corner: table + chairs + crossbow on top + idle drummer exist, cannot be walked through, and AI seekers do not get stuck on it.
7. Online (after redeploying `server/`): other players see your chosen Seeker class / Doll skin; with the old server the game still works.
8. Check FPS on Xiaomi Pad 6 (LOW/MEDIUM first). If low, tell me and I will drop the per-class models to fewer meshes.
9. Rename/remove any GLB in assets/: the game must still run with v26 fallback visuals.
