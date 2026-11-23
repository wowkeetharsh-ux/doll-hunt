# Deploy Doll Hunt v23 multiplayer server to Render

## Repository layout
Keep `server/` and `render.yaml` at the repository root. The browser game is available as root `index.html` and `Doll_Hunt_v23/index.html`.

## Render setup
- New → Web Service.
- Connect the GitHub repository.
- Root Directory: `server`.
- Build Command: `npm install --include=dev && npm run build`.
- Start Command: `npm run start:prod`.
- Plan: Free for initial smoke tests; use a paid instance for public promotion and sustained traffic.

The Render config sets `/health` as the health check. Server opens WebSocket connections through the public HTTPS service URL.

## Connect the game
1. Deploy the service and wait for it to become Live.
2. Copy its HTTPS URL, for example `https://your-service.onrender.com`.
3. Open Doll Hunt → Settings → Server URL.
4. Paste the URL and Save.
5. Run the health check. It should show a successful `/health` response.

The client defaults to `http://localhost:2567` only for local development. That address is not a public server and will not work inside an APK unless a server runs on the same phone.

## Matchmaking behavior
- A room waits 18 seconds to prioritize real users.
- If 8 real users arrive during that window, it starts immediately.
- After the window, at least one human is required; server AI fills vacant seats to 8 (5 Hiders / 3 Seekers).
- The AI does not start a room with zero human users.
- Each started room locks, allowing later users to form another room. Actual concurrent room capacity depends on server CPU, memory, network and hosting plan.

## Important
- Render Free may sleep while inactive; a first connection after idle can take longer.
- Do not publicly promote until the server build, health endpoint, 5–8 human-client tests and reconnect tests pass.
- This ZIP does not deploy the server automatically. A live Render URL must be created and entered in the game settings.
