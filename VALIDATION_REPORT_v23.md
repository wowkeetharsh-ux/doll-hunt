# Doll Hunt v23 — Validation Report

## Static checks performed
- Both client entry points (`index.html` and `Doll_Hunt_v23/index.html`) contain identical source.
- HTML IDs are unique.
- Inline classic JavaScript and ES module blocks pass Node syntax checks.
- CSS blocks pass `tinycss2` parsing.
- TypeScript source files pass TypeScript `transpileModule` syntax diagnostics.
- Literal DOM reference scan found one `dh-toasts` reference that is intentionally created dynamically by the v19/v20 effects initializer before its toast helper is used; no static missing DOM controls were found.
- ZIP archive passes `unzip -t` integrity test.

## Visual changes included
- Cream floral wallpaper with sage vine leaves and muted rose/gold flower detail.
- Pastel terracotta / rose accent brick walls.
- Cream wainscot raised panels and warm oak/gold rails on outer and inner walls.
- Warm honey-oak plank flooring, pale aqua/ivory tiles, ivory ceiling panels.
- Turquoise and lime paired window glass with warm wood frames.
- Brighter environmental lighting, lighter background/fog and increased exposure.
- Floral Wallpaper is available as a Paint Studio surface finish, and wallpaper surface sampling identifies the same pattern.

## Preserved project systems
- Existing Player ID / Firebase Firestore client sync (Google Auth remains disabled).
- Doll selection, paint studio, wall/ceiling attachment, climb, free camera and hide controls.
- Hider mastery, abilities, coins/XP/profile, practice modifiers and match effects.
- 5–8 player team balancing, real-player-first matchmaking and bot fill in the Colyseus project.
- Responsive HUD, graphics settings and server URL/health-check settings.

## Not verified in this environment
- Chromium preview was blocked by the execution environment's browser policy, so no claim is made that a rendered 3D screenshot was captured.
- No real Android WebView or Xiaomi Pad 6 visual/FPS/touch test has been run.
- No live Render deployment or 5–8 device multiplayer session has been run.
- TypeScript syntax parsing passed, but a full dependency-backed `npm run build` was not completed here.

Run the included device test checklist before public promotion.
