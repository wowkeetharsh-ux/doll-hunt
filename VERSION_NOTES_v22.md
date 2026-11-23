# DOLL HUNT v22 — Camera Height, Paint Panel & HD Performance

## User-reported issues fixed

1. **Low viewpoint when Doll is small/crouched**
   - The third-person/orbit camera target no longer scales down with Doll height.
   - The attached/free-look spectator camera now enforces a minimum eye height of 1.72m.
   - Hide-spot camera starts below that height are lifted to the same minimum.
   - Doll mesh scale and world position are not changed by this camera fix.

2. **Paint Studio blocks other controls**
   - Added a red `×` close control in the Paint Studio header.
   - Closing the panel only hides the panel; it does not detach the Doll or leave the hiding spot.
   - Added a `🎨 PAINT` reopen button while the Doll remains attached during HIDE_PHASE.
   - Reopening restores the studio. Detach, round transition, elimination and game-over hide both controls.
   - Closing the studio safely disables brush/eraser/sample modes to prevent accidental paint input.

3. **Soft/blurry rendered image on mobile**
   - Auto resolution scaling no longer falls below 1.0x device pixel ratio.
   - LOW/MEDIUM/HIGH/ULTRA render ratios are clamped to at least 1.0x.
   - HIGH mobile preset uses a lighter shadow filter and a moderate render ratio; ULTRA is sharper but heavier.
   - Auto Performance reduces resolution gradually only down to 1.0x, then disables shadows temporarily if FPS remains low. Shadows are restored after sustained recovery.
   - Added anisotropic filtering for scene textures (up to 8x where supported) to improve floor/wall texture clarity at shallow viewing angles.
   - Reduced exponential fog density slightly so distant environment details remain clearer.

4. **Frame cost reduction**
   - Minimap redraw is throttled to 10Hz; the main scene render and movement loop remain on requestAnimationFrame.

## Files
- `index.html` — full client/game.
- `Doll_Hunt_v22/index.html` — same client source in version folder.
- `server/` — existing Colyseus multiplayer server (unchanged from v21).
- `render.yaml` and deployment docs — preserved.

## Testing limits
- HTML/CSS/JavaScript static checks were run on the packaged source.
- No actual Xiaomi Pad 6/Android WebView test was possible in this environment.
- No live WebGL/FPS benchmark or live multiplayer session was completed.
- HIGH is a sensible starting preset for tablet testing; choose MEDIUM if the device reports sustained low FPS. ULTRA may reduce performance.
