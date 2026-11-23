Doll Hunt v36 — Practice hit detection and kill stability

Changes:
- Practice hider projectiles no longer get blocked by the open cabinet's own shelf, side, or back collision panels.
- Added a bounded hit-volume fallback for revealed practice hiders when the model's mesh raycast misses by a small amount.
- The round is marked GAMEOVER before projectile cleanup, preventing a hit callback from continuing against a live round after finishGame starts.
- Preserved the existing game assets, character models, room layout, UI elements, and input handlers.

Validation performed:
- JavaScript syntax check for every inline script in both HTML entry points.
- ZIP integrity check.
- No live Android/WebGL gameplay test was performed.
