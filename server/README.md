# DOLL HUNT v20 Multiplayer Server

Node.js + Colyseus 0.18 authoritative server.

## Matchmaking
- Up to 8 seats per room.
- The room starts a fill countdown when the first human arrives.
- Real humans get an 18-second priority window. If the room reaches 8 humans first, it starts immediately.
- At the end of the priority window, at least one human is required; vacant seats are filled with server bots.
- Final match roster is 5 Hiders + 3 Seekers. Real users are assigned first; AI fills remaining team slots.
- Example human counts: 5 real → 3H/2S + 2 bot Hiders/1 bot Seeker; 6 real → 4H/2S + 1 bot Hider/1 bot Seeker; 7 real → 4H/3S + 1 bot Hider; 8 real → all human 5H/3S.
- The room locks once started, so subsequent `joinOrCreate("doll_hunt")` calls go to another room.

## Bot behavior
- AI Seekers use patrol zones, variable reaction delays, pauses, imperfect aiming and approximate sound cues.
- Sound cues are rate-limited and offset from the Hider's real position. Silent Hold suppresses footstep cues; Decoy Echo adds a false cue.
- Bot detection and hit attempts require a clear line across the room's divider-wall layout. Bots do not receive exact hiding positions during the Hiding phase.
- Bots are ordinary state players with `isBot=true`; no special bot label is added to the game lobby.

## Hider Mastery
- Join option `hiderLevel` is clamped to integer 1–10.
- Active power message is server-validated for Hider role, alive state, Hiding/Seeking phase, unlock level and cooldown.
- Power durations and hit mitigation are capped; no ability grants invulnerability.
- Client progression is currently stored locally; secure account-linked progression requires an authenticated persistence backend before a competitive ranked release.

## Server validation
- Player positions are clamped to the room bounds.
- Horizontal and vertical movement deltas are checked against elapsed time, with a limited Wall Grip vertical allowance.
- Shooting has cooldown, server-side aim/range checks and divider-wall line-of-sight validation.
- Hider coordinates remain private in the Hiding phase.
- Noise/paint/state/power messages have rate limits or validation.

## Local run / production
```bash
npm install --include=dev
npm run dev
npm run build
npm run start:prod
```

The server listens on `PORT` (default `2567`) and exposes `GET /health`.

The server is not yet deployed. Configure the public HTTPS URL in the game Settings after hosting.
