# Doll Hunt v35 — Kill/Found Freeze Fix

- Added a round-resolved/game-over guard to the thrown-weapon update loop.
- Removes invalid projectile entries instead of leaving stale null entries in the update array.
- Stops projectile iteration immediately if a hider-hit callback resolves the round and clears the projectile list synchronously.
- Applied to both HTML entry points in the package.

Validation: ZIP integrity and JavaScript syntax checks. Actual Android gameplay/rendering still requires device testing.
