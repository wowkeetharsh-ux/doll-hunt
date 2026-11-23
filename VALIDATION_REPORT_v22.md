# Validation Report — DOLL HUNT v22

## Static checks
- HTML IDs: 101; duplicates: 0.
- Literal `getElementById()` references: 91; unresolved: 0 (dynamic `dh-toasts` node is created at runtime).
- Inline JavaScript blocks: 9 checked with Node.js syntax parser; all passed.
- CSS style blocks: 6 parsed; 0 parse errors.
- Paint Studio close button: present exactly once.
- Paint Studio reopen button: present exactly once.
- Camera eye-height guard: present (1.72m minimum).
- Auto-resolution scaler: minimum 1.0x confirmed.
- Anisotropic texture sampling: present.
- Style block is inside document body before `</body>`.
- Server and deployment files preserved from v21 package.

## Not verified in this environment
- Android WebView rendering and touch hit-testing.
- Xiaomi Pad 6 frame rate, thermal behaviour and long-session performance.
- Real WebGL image sharpness under device-specific DPR/OS scaling.
- Live server deployment and 5–8-device multiplayer.
- Full npm dependency installation/build.

## Manual device test checklist
1. Open v22 on the tablet in landscape and select HIGH graphics.
2. Attach the Doll to a wall and set Doll height to 25%.
3. Confirm the camera remains at a natural human viewing height; Doll body remains fixed.
4. Open Paint Studio. Tap the red `×`. Confirm the Doll stays attached and the panel closes.
5. Tap `🎨 PAINT` to reopen the panel; confirm paint settings remain selected.
6. Close the panel, use wall-climb up/down controls, then reopen Paint Studio.
7. Run for at least 10 minutes. Watch FPS and input response. If it repeatedly falls below 30 FPS, switch to MEDIUM and report the FPS display.
8. Test both portrait and landscape layouts and verify no control overlap.
