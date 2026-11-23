# Doll Hunt v30 — Seeker AI + Wall Camouflage Edition

## v30 updates
- CHOOSE SEEKER now opens the same real 3D swipe carousel used by CHOOSE DOLL. Browse Dwarf Knight, Orc Berserker, Human Assassin and Farmer with touch swipe or arrow buttons. The chosen character and matching weapon class are saved.
- Offline Seeker AI moves faster and converges on a Doll attached to a wall instead of endlessly patrolling far away.
- Practice teammate Seekers check hiding spots faster at every difficulty.
- Offline and Practice bots use obstacle-aware steering, diagonal slide/turn attempts and retargeting to reduce wall/furniture stalls. A stuck cabinet inspector can hand the search to another nearby bot.
- WALL CAMO POWER samples the attached surface and tints the visible GLB Doll model as well as the paint canvas. Camouflage still lowers AI detection range.

## Existing game systems retained
The existing Doll roster, rooms, hiding spots, climbing, paint controls, offline/practice modes, weapon handling, player profile, Hider Mastery, multiplayer matchmaking, Colyseus server and Render deployment files are retained.

## Run
Open `index.html` using a local web server/WebView environment. Online multiplayer requires deploying the included `server/` and setting the public HTTPS server URL in game settings.

## Validation
Inline JavaScript syntax and ZIP integrity were checked. Android touch/render/FPS and live multiplayer server behavior still require device/server testing; these have not been claimed as completed.
