# Doll Hunt v21 — Responsive HUD / Touch Layout Repair

## Why this update
The supplied Xiaomi Pad 6 landscape screenshot showed three right-side interface groups overlapping: Wall Climb controls, Doll Height controls, and the Hider Mastery power card. This made controls difficult or impossible to tap.

## Layout changes
- Wall Climb Up/Down is now a fixed right-side dock group below the minimap/fullscreen zone.
- Doll Height Up/Down is placed in its own dock group immediately below Wall Climb, with a defined gap.
- Fire/Jump stays in a separate bottom-right action zone.
- Hider Mastery moved to the upper-left HUD rail below the status card, rather than covering the right-side controls.
- Safe-area insets are used for left/right edges.
- Portrait, tablet landscape, and short-landscape CSS breakpoints compact the controls separately.
- Touch targets keep minimum 44–48px dimensions, pointer events, visible focus outline, and appropriate touch-action rules.
- Hider Power panel is scrollable within a maximum height so it does not occupy the full play screen.

## Intended control map
- Top-right: minimap and fullscreen.
- Right-middle, first group: CLIMB WALL ▲ / ▼ (only when Doll is attached to a wall).
- Right-middle, second group: DOLL HEIGHT ▲ / ▼ (when Doll controls are available).
- Bottom-right: FIRE / JUMP action controls.
- Upper-left under player status: HIDER MASTERY power selector and activation.
- Bottom-left: movement joystick.
- Left edge: pause control.

## Validation
- 98 HTML IDs, no duplicates.
- CSS parsing: 5 style blocks, no syntax parse errors.
- 9 inline JavaScript blocks passed `node --check`.
- Core right-side controls retain their existing IDs and gameplay event handlers.
- `hud_preview.html` was created for layout inspection, but Chromium screenshot rendering timed out in this environment. Therefore no real browser visual screenshot or device tap test is claimed.
- Android WebView/Xiaomi Pad 6, orientation changes, and simultaneous touch behavior still require on-device verification.

## Scope
Only the HUD layout / touch presentation is changed in v21. Existing v20 gameplay, Hider powers, matchmaking and server sources are preserved unchanged.
