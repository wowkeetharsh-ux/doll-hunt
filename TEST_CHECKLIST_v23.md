# Doll Hunt v23 — Device Test Checklist

## Bright colourful room look
- [ ] Start the game and confirm cream floral wallpaper is visible.
- [ ] Confirm lower cream raised wall panels and warm trim are visible on outer and inner dividers.
- [ ] Confirm windows show turquoise and lime panes.
- [ ] Confirm the wood floor is warm honey oak, not near-black.
- [ ] Confirm brick accent walls are pastel terracotta / rose.
- [ ] Check surface colours stay readable for camouflage.

## Paint Studio
- [ ] Use Sample / Match Surface on wallpaper.
- [ ] Confirm the Paint Studio selects Floral Wallpaper pattern.
- [ ] Apply finish and inspect the Doll pattern.
- [ ] Check the pattern remains after closing and reopening Paint Studio.

## Existing gameplay regression checks
- [ ] Doll selection and Confirm work.
- [ ] Practice player count 5–8 has the correct Hider/Seeker split.
- [ ] Easy / Hard / Extreme / Impossible still start correctly.
- [ ] Attach, free-look, paint close/reopen, eyes, detach and climb controls work.
- [ ] Hider Mastery and power cooldown remain functional.
- [ ] HUD buttons do not overlap in tablet landscape and phone portrait.
- [ ] HIGH graphics remains readable without stutter; compare MEDIUM if device heats up.

## Online smoke tests
- [ ] Deploy the included Colyseus server and set its HTTPS URL in Settings.
- [ ] Verify `/health` succeeds.
- [ ] Test 5, 6, 7 and 8 real clients.
- [ ] Test real-player priority and AI fill after the wait period.
- [ ] Test reconnect and round win conditions.
