# Doll Hunt v26 — Validation Report

## Static checks performed
- 11 inline script tags found; 9 non-empty inline blocks checked (1 ES module + 8 classic scripts) with Node syntax checker: PASS.
- 6 CSS blocks parsed with tinycss2: 0 parse errors.
- HTML IDs: 142, all unique.
- Literal getElementById references: 91, no missing elements.
- Root and nested game entry files are byte-identical.
- Renderer exposure no longer rises to 1.08–1.11 in HIGH/ULTRA presets; all presets use controlled exposure 0.78 (ULTRA 0.80).
- ZIP archive test: PASS.

## Not verified in this environment
- Actual Android WebView / Xiaomi Pad 6 render and FPS.
- Actual on-device visual look of the new materials and wall treatment.
- Full npm dependency installation / Colyseus production build.
- Deployed online multiplayer.

The visual update only changes client materials, room visuals, lighting and paint surface classification. Server files are preserved from v25 and were not modified.
