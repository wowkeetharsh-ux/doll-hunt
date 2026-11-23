# v19 integration notes

The uploaded `Doll_Hunt_v19_APP_READY.zip` was used as the source for the v19 client. The previous complete project package's Colyseus server and Render deployment files were retained.

## Integrated v18 layer
- Settings panel: sensitivity, invert Y, sound, graphics, auto performance, FPS.
- URL entry and `/health` test.
- Pause/resume, offline freeze, online informational pause.
- Play Again and game summary.
- Responsive dark overlay/button styling.

## Integrated v19 layer
- Persistent local profile with coins, XP, level, matches, wins, Hiders found and best Practice time.
- Reward calculation after game completion.
- Optional random Practice modifiers: BLACKOUT, HEAVY FOG, TIME RUSH.
- Toasts, hit marker, last-10-second danger vignette.
- Flickering point lights and floating dust motes.

## Preserved game features
- Base client source retained from prior project; the v19 client has all 91 original HTML IDs and adds the Settings/Profile/feedback UI.
- Practice player count 5–8 and team split.
- Hider/Seeker AI difficulty and hiding spots.
- Doll skins, Paint Studio and camouflage materials.
- Wall/ceiling attach, free camera and vertical climbing.
- Colyseus multiplayer server source, `/health` endpoint and Render configuration.

## Important limitations
- The supplied v19 APP_READY archive contained only `index.html` and `README_READY.txt`; server source was not in that uploaded archive.
- The full package was therefore assembled by merging that client with the existing full server project in the conversation.
- `npm install --include=dev && npm run build` timed out in this environment. Server TypeScript source passed compiler parser syntax checks, but dependency-backed compilation is not confirmed.
- Chromium launch was blocked in this environment, so no actual browser rendering test is claimed.
- Android WebView, Xiaomi Pad 6 FPS, and live 5–8 device multiplayer tests remain pending.
