# Doll Hunt v31 — Balanced Offline AI + Thrown Seeker Weapons

- Offline AI Seekers no longer receive the attached Doll's exact wall position as a target; they patrol and rely on line-of-sight, field-of-view and detection time.
- Offline Seeker patrol speed lowered, start-of-search thinking pauses added, and cabinet opening/inspection takes longer.
- Camouflage, closed eyes and half-height posture provide more time before an AI finds a wall-mounted Doll.
- Offline AI Seekers also throw a visible, slightly imperfect weapon projectile at a spotted wall-mounted Doll, with an 8–10.5 second throw cooldown. High wall targets receive a small visual awareness allowance.
- All player Seeker classes now throw their selected weapon. The thrown weapon is visibly cloned from the equipped first-person weapon, travels up to about 18 metres locally, follows a gravity arc, collides with room geometry and can tag revealed Practice Hiders.
- Online server shot validation now supports a 17-metre throw range and uses pitch for aiming at Dolls on high walls/structures.

Validation: HTML inline JavaScript syntax, TypeScript build (when dependencies are installed), duplicate IDs and ZIP integrity are checked. Device FPS, touch aiming and live multiplayer still require a real device/server session.
