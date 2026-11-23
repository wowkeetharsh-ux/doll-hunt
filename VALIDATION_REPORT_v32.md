# Doll Hunt v32 Validation Report

- Inline JavaScript syntax: PASS (12 blocks checked with Node.js).
- Duplicate HTML IDs: PASS (110 IDs checked).
- GLB/FBX asset files: PASS (11 referenced model files exist).
- Root and packaged app HTML copies: PASS (identical).
- Server TypeScript syntax transpile: PASS.
- Round/mode cleanup for projectiles and AI timers: PASS (source checks).
- Wall-mounted Doll visibility: PASS (only the supporting wall/ceiling is omitted from AI sight ray).
- AI thrown-weapon collision: PASS (supporting surface omitted; other obstacles retained).
- Offline AI blocked cabinet reassignment: PASS (alternate approach points and delayed retry).
- Practice AI blocked-spot retry: PASS (9.5 second skip cooldown).
- Projectile-loop safety after round-end cleanup: PASS (empty entries are guarded).
- ZIP integrity: PASS.
- Android rendering, touch input, FPS and live multiplayer: NOT DEVICE-TESTED.
- Full TypeScript type/build check: NOT VERIFIED; project dependencies are not installed in this working copy.
