# Doll Hunt v27 — Validation Report
## Checked here
- 12 inline script blocks (incl. the new add-on) pass `node --check`; HTML ids 142, all unique.
- Server `DollHuntRoom.ts` transpiles with 0 syntax diagnostics (full `npm` build not run).
- Mock-THREE smoke test running the REAL `attachKnightVisual`, `installFirstPersonMaul`, `hitBox` code extracted from index.html: 33/33 checks pass (4 AI classes + scales, class cycling and persistence, weapon auto-orientation head/tip up, local/remote/practice hider skins, online skin sync, seeker class message, Tavern placement/colliders).
- GLB inspection: all 7 characters share the Dwarf Knight rig names and Idle/Walk/Run clips; weapon meshes `mace`, `stiletto`, farm tool analysed (wide head / narrow tip ends).
## Not verified
- Real Android WebView / Xiaomi Pad rendering, FPS and the visual position of first-person weapons (values are estimates).
- Real three.js r128 runtime (mock used), live multiplayer, Colyseus server build.
