# Doll Hunt v20 — Test Checklist

## Client / UI
- [ ] Load `index.html` over HTTP(S), not `file://`.
- [ ] Player ID Continue and Firebase profile sync.
- [ ] Doll selection preview and Confirm.
- [ ] Settings: sensitivity, invert-Y, sound, auto-performance, FPS and LOW/MEDIUM/HIGH/ULTRA graphics.
- [ ] Verify quality presets after level lights/shadows are built; monitor FPS and device temperature.
- [ ] Practice player counts 5/6/7/8 and team splits 3/2, 4/2, 4/3, 5/3.
- [ ] Easy/Hard/Extreme/Impossible Practice AI behavior.
- [ ] Wall attach, climb up/down, ceiling attach, detach and independent camera.
- [ ] Hide spots, cabinet doors, decoys, inspect/search interaction.
- [ ] Paint wheel, brush, eraser, sample, patterns, Metal/Roughness and Apply Finish.
- [ ] Doll size, eyes, skin selection and profile.
- [ ] Daily Practice modifiers, pause/resume, Play Again and match summary.

## Hider Mastery
- [ ] Start at Hider Level 1; verify abilities unlock at levels 2,3,4,5,7,8,10.
- [ ] Complete online or Offline Doll Mode match as Hider; verify XP reward once only.
- [ ] Verify Hider level passive detection cap and active cooldowns.
- [ ] Silent Hold suppresses footsteps and server noise cue.
- [ ] Normal footsteps produce only approximate sound cue during Seek.
- [ ] Decoy Echo sends a false cue away from the Hider.
- [ ] Miniature Shift restores original height after duration/reset.
- [ ] Shadow Veil restores original material opacity.
- [ ] Wall Grip speed boost resets after expiry/game reset.
- [ ] Master Blend / Phantom Blend improve hit difficulty but do not grant invulnerability.

## Online matchmaking / server
- [ ] `npm install --include=dev` and `npm run build`.
- [ ] Deploy and test `/health`.
- [ ] One human waits 18 sec; server fills with 7 bots; game starts 5H/3S.
- [ ] 5 real humans wait; final roster 5H/3S with bots filling 3 seats.
- [ ] 6 real humans; bot fill produces 5H/3S.
- [ ] 7 real humans; one bot Hider fills final seat.
- [ ] 8 real humans start without bots.
- [ ] Two or more rooms can run at once under host resource limits.
- [ ] Real human joins before countdown expiry and gets priority over bots.
- [ ] Bots patrol, pause, react with delays, investigate approximate sound and do not see through divider walls.
- [ ] Silent Hold suppresses footstep cue; decoy cue is approximate.
- [ ] Test power unlock/cooldown validation, hit validation, movement speed limits and disconnects.
- [ ] Hider coordinates remain private until Seeking; all Hiders must be caught for Seekers to win.

## Device / performance / physics
- [ ] Android Chrome and target Android WebView.
- [ ] Xiaomi Pad 6 landscape test at HIGH; compare LOW/MEDIUM/HIGH/ULTRA.
- [ ] Check UI overlap, joystick and camera simultaneously.
- [ ] Check wall/furniture collision, falling, attach/detach and room boundary.
- [ ] Full physics stress test with moving props is pending; current build does not include full rigid-body physics.
- [ ] Live 5–8 real-phone match and multi-room load test.
