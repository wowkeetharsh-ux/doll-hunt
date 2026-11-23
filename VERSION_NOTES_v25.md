# Doll Hunt v25 — Reference Room Rebuild

## Why v25 exists
The previous room looked almost the same as the reference only in colour. The user's screenshot showed that it was still washed out, the floral wall treatment was barely visible, the window style was too plain, and there was not enough furniture at the normal gameplay view.

## Changes
1. Canvas-created colour maps now use sRGB encoding where supported.
2. Renderer exposure reduced from 1.10 to 0.84.
3. Ambient, hemisphere, directional and practical lights reduced to avoid clipped whites.
4. Indoor fog reduced from 0.0012 to 0.00022.
5. Floral wallpaper contrast increased and repeat scale adjusted for ordinary gameplay distance.
6. Main room walls changed to floral wallpaper rather than using brick on most sides.
7. Wainscot panels rebuilt with separate backing, inset fill, four raised rails, fine inner bead, skirting and chair rail.
8. Critical wall-face offset corrected: perimeter wall panels use 0.4m wall half-depth, and inner divider panels use 0.3m. Panels are now positioned on the room-facing side of the wall mesh.
9. New eye-level segmented cyan / teal / lime windows added to the main room dividers and feature wall.
10. Kitchen tile zone reduced to 10m x 10m; the rest of the central floor remains oak plank texture.
11. Central sofa, coffee table, sideboard, console and plant added around the initial play area.

## Preserved
No multiplayer server source was intentionally modified in this visual update. Existing game systems and prior features remain in the client and server package.

## Known limitations
- Browser/Chromium render preview did not complete in this environment, so the exact on-device appearance is not confirmed here.
- Android WebView rendering, Xiaomi Pad 6 FPS, and live multiplayer need to be tested on device / deployed server.
- Server dependency installation/build is not re-certified by this visual-only update.
