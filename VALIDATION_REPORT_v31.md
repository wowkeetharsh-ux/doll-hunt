# Doll Hunt v31 Validation Report

- Inline JavaScript syntax: PASS (12 blocks checked with Node.js).
- Static HTML IDs: PASS (no duplicate IDs).
- Root and packaged app HTML copies: PASS (identical).
- Offline AI balance: PASS at source level (removed direct Doll-coordinate tracking; slower patrol, start delay, longer cabinet inspection and visual detection hold).
- AI weapon throw: PASS at source level (AI throws a visible projectile with small aim error and 8–10.5 second cooldown; collision can tag the visible Doll).
- Player Seeker weapon throw: PASS at source level (selected weapon clone, light gravity arc to stay close to online aim validation, room collision, Practice hit registration).
- Online server throw validation: TypeScript syntax transpile PASS; server range is 17 metres and uses pitch for high/vertical aiming.
- Full TypeScript type/build check: NOT VERIFIED because `colyseus`, `@colyseus/schema` and Node type dependencies are not installed in this working copy.
- Android rendering, touch aiming, FPS and live multiplayer: NOT DEVICE-TESTED.
