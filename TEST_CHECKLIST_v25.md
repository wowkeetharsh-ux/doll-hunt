# v25 Device Test Checklist

## First visual pass
- [ ] Launch Offline Doll Mode and Practice Room.
- [ ] Look at the main room wall at normal eye height: floral wallpaper should be clearly visible, not washed out.
- [ ] Inspect lower wall: separate raised cream panels, inset borders, baseboard and chair rail should be visible.
- [ ] Inspect stained-glass windows: cyan/teal/lime panes and diagonal frame details should be visible.
- [ ] Inspect floor: oak planks should be visible in the main room; tile should remain only in the smaller kitchen patch.
- [ ] Confirm sofa, coffee table, sideboard, console and plant are present.
- [ ] Check colours in both bright and shadowed parts of the room.

## Gameplay regression
- [ ] Doll can move around the new furniture without getting stuck.
- [ ] New furniture collisions do not overlap player spawn.
- [ ] Existing wardrobes, lockers and trunks still open and can be searched.
- [ ] Wall attach, wall climb, ceiling attach and detach still work.
- [ ] Match Surface can sample the updated floral wallpaper and wood floor.
- [ ] Practice 5–8 player splits and difficulty modes still work.
- [ ] Hider powers, XP, coins, profile, paint and HUD controls still work.

## Performance
- [ ] Run HIGH for 10 minutes and record average FPS.
- [ ] Run ULTRA for 10 minutes and record average FPS.
- [ ] Check heat, battery use, stutter and memory use on Xiaomi Pad 6.
- [ ] If frames drop, reduce shadow map quality and local light count before lowering resolution below 1x.

## Online checks
- [ ] Build server with `npm install` then `npm run build`.
- [ ] Deploy server and configure the public HTTPS URL in app settings.
- [ ] Verify 5–8 real-player matches, bot fill, reconnect and team assignment.
