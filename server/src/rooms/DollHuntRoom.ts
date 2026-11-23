import { Room, type Client } from "colyseus";
import { DollHuntState, Player } from "./DollHuntState.js";

// Public online matchmaking: 15-second real-player window; vacant slots are filled with server-controlled AI.
// Full match role target is 3 Dolls + 5 Seekers (8 total).
const MAX_PLAYERS = 8;
const MIN_HUMANS_TO_START = 1;
const HIDE_SECONDS = 30;
const SEEK_SECONDS = 180;
const FILL_GRACE_SECONDS = 15;
const TARGET_HIDERS = 3;
const TARGET_SEEKERS = 5;
const HIDER_SPAWNS = [
  { x: -19, y: 0, z: -7 }, { x: 19, y: 0, z: -7 },
  { x: -19, y: 0, z: 9 }, { x: 19, y: 0, z: 9 },
  { x: -8, y: 0, z: 8 },
];
const SEEKER_SPAWNS = [
  { x: -7, y: 1.8, z: 7 }, { x: 7, y: 1.8, z: 7 }, { x: 0, y: 1.8, z: 3 },
];
const BOT_HIDE_POSES = [
  { x: -21.35, y: 2.7, z: -8.0, ry: Math.PI / 2, color: "#293a43", pattern: "fabric" },
  { x: 21.35, y: 4.1, z: 8.0, ry: -Math.PI / 2, color: "#493b38", pattern: "brick" },
  { x: -8.0, y: 5.3, z: 21.35, ry: 0, color: "#493b38", pattern: "brick" },
  { x: 8.0, y: 6.0, z: -21.35, ry: Math.PI, color: "#293a43", pattern: "fabric" },
  { x: -12.45, y: 3.6, z: 8.2, ry: Math.PI / 2, color: "#293a43", pattern: "concrete" },
];
const BOT_NAMES = [
  "Aarav", "Maya", "Noah", "Aisha", "Ethan", "Zoya", "Leo", "Ishaan",
  "Mira", "Arjun", "Lena", "Kabir", "Sana", "Oliver", "Anaya", "Rohan",
  "Nina", "Rehan", "Ava", "Dev", "Ira", "Kai", "Tara", "Sam",
];
const VALID_SKINS = new Set(["porcelain", "blocky", "plush", "shadow", "kite", "puffy", "star", "choir"]);
const VALID_SEEKER_CHARS = new Set(["dwarf", "orc", "assassin", "farmer"]);
const VALID_PATTERNS = new Set(["solid", "woodgrain", "brick", "concrete", "fabric", "speckle", "camouflage", "brushed-metal"]);
const POWER_RULES: Record<string, { level: number; duration: number; cooldown: number; hitFactor: number }> = {
  silent: { level: 2, duration: 5200, cooldown: 35000, hitFactor: 0.92 },
  mini: { level: 3, duration: 6000, cooldown: 45000, hitFactor: 0.88 },
  decoy: { level: 4, duration: 4500, cooldown: 50000, hitFactor: 0.92 },
  veil: { level: 5, duration: 3500, cooldown: 60000, hitFactor: 0.76 },
  grip: { level: 7, duration: 7000, cooldown: 70000, hitFactor: 0.86 },
  blend: { level: 8, duration: 6000, cooldown: 90000, hitFactor: 0.64 },
  phantom: { level: 10, duration: 6000, cooldown: 110000, hitFactor: 0.54 },
};
const PATROL_ZONES = [
  { minX: -20, maxX: -4.6, minZ: -20, maxZ: -4.6 },
  { minX: 4.6, maxX: 20, minZ: -20, maxZ: -4.6 },
  { minX: 4.6, maxX: 20, minZ: 4.6, maxZ: 20 },
  { minX: -20, maxX: -4.6, minZ: 4.6, maxZ: 20 },
];

type Pose = { x: number; y: number; z: number; ry: number; pitch: number };
type BotBrain = {
  targetX: number; targetZ: number; thinkAt: number; reactionAt: number;
  nextShotAt: number; skill: number; zone: number; movePauseUntil: number;
  hideIndex: number;
};

function clamp(value: unknown, min: number, max: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : min;
}
function shuffled<T>(items: T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function isBlockedByRoomWalls(x: number, z: number): boolean {
  if (Math.abs(x) > 21 || Math.abs(z) > 21) return true;
  // Match the four interior divider walls built by the Three.js map.
  if (Math.abs(z) < 0.48 && (x < -4 || x > 4)) return true;
  if (Math.abs(x) < 0.48 && (z < -4 || z > 4)) return true;
  return false;
}
function hasLineOfSight2D(x1: number, z1: number, x2: number, z2: number): boolean {
  const distance = Math.hypot(x2 - x1, z2 - z1);
  const steps = Math.max(2, Math.ceil(distance / 0.3));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (isBlockedByRoomWalls(x1 + (x2 - x1) * t, z1 + (z2 - z1) * t)) return false;
  }
  return true;
}

export class DollHuntRoom extends Room<{ state: DollHuntState }> {
  maxClients = MAX_PLAYERS;
  state = new DollHuntState();

  private phaseTimer: ReturnType<typeof setInterval> | null = null;
  private countdownTimer: ReturnType<typeof setInterval> | null = null;
  private botTimer: ReturnType<typeof setInterval> | null = null;
  private lobbyCountdown = 0;
  private started = false;
  private hiddenHiderPoses = new Map<string, Pose>();
  private lastShotAt = new Map<string, number>();
  private lastStateAt = new Map<string, number>();
  private lastPaintAt = new Map<string, number>();
  private lastPowerAt = new Map<string, number>();
  private lastNoiseAt = new Map<string, number>();
  private noiseCues: Array<{ x: number; z: number; expiresAt: number }> = [];
  private botBrains = new Map<string, BotBrain>();
  private botSequence = 0;

  onCreate() {
    this.state.phase = "waiting";
    this.botTimer = setInterval(() => this.updateBotBrains(), 120);

    this.onMessage("state", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (!player || player.isBot || !player.alive || this.state.phase === "ended" || this.state.phase === "waiting") return;
      const now = Date.now();
      const previousAt = this.lastStateAt.get(client.sessionId) || now - 50;
      if (now - previousAt < 35) return;
      this.lastStateAt.set(client.sessionId, now);

      const pose: Pose = {
        x: clamp(data?.x, -21, 21), y: clamp(data?.y, 0, 9.3), z: clamp(data?.z, -21, 21),
        ry: clamp(data?.ry, -Math.PI * 4, Math.PI * 4), pitch: clamp(data?.pitch, -1.5, 1.5),
      };
      const elapsed = Math.max(0.035, Math.min(0.5, (now - previousAt) / 1000));
      const from = this.state.phase === "hiding" && player.role === "doll"
        ? this.hiddenHiderPoses.get(client.sessionId) || { x: player.x, y: player.y, z: player.z, ry: player.ry, pitch: player.pitch }
        : { x: player.x, y: player.y, z: player.z, ry: player.ry, pitch: player.pitch };
      const horizontalDistance = Math.hypot(pose.x - from.x, pose.z - from.z);
      const verticalDistance = Math.abs(pose.y - from.y);
      // Reject implausible teleports; wall grip allows a little faster vertical travel, not instant climbing.
      const gripActive = player.activePower === "grip" && player.powerUntil > now;
      const maxVerticalSpeed = player.role === "doll" && player.attached ? (gripActive ? 5.6 : 3.8) : 8.5;
      if (horizontalDistance > elapsed * 10.5 + 0.65) return;
      if (verticalDistance > elapsed * maxVerticalSpeed + 0.55) return;
      if (player.role === "seeker" && isBlockedByRoomWalls(pose.x, pose.z)) return;
      if (player.role === "doll" && !data?.attached && isBlockedByRoomWalls(pose.x, pose.z)) return;

      if (player.role === "doll") {
        if (this.state.phase === "hiding") this.hiddenHiderPoses.set(client.sessionId, pose);
        else { player.x = pose.x; player.y = pose.y; player.z = pose.z; player.ry = pose.ry; player.pitch = pose.pitch; }
        player.attached = !!data?.attached;
        player.surfaceType = player.attached && data?.surfaceType === "ceiling" ? "ceiling" : (player.attached ? "wall" : "");
        player.eyesClosed = !!data?.eyesClosed;
        player.heightScale = clamp(data?.heightScale ?? 1, 0.25, 1.25);
        if (typeof data?.color === "string" && /^#[0-9a-f]{6}$/i.test(data.color)) player.color = data.color;
        player.metalness = clamp(data?.metalness ?? player.metalness, 0, 1);
        player.roughness = clamp(data?.roughness ?? player.roughness, 0.05, 1);
        if (typeof data?.pattern === "string" && VALID_PATTERNS.has(data.pattern)) player.pattern = data.pattern;
        if (typeof data?.skinId === "string" && VALID_SKINS.has(data.skinId)) player.skinId = data.skinId;
      } else {
        player.x = pose.x; player.y = pose.y; player.z = pose.z; player.ry = pose.ry; player.pitch = pose.pitch;
      }
    });

    this.onMessage("attach", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (player?.role === "doll" && this.state.phase === "hiding") player.attached = !!data?.attached;
    });
    this.onMessage("color", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (player?.role === "doll" && typeof data?.color === "string" && /^#[0-9a-f]{6}$/i.test(data.color)) { player.color = data.color; player.pattern = "solid"; }
    });
    this.onMessage("skin", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (typeof data?.skinId === "string") {
        if (player?.role === "doll" && VALID_SKINS.has(data.skinId)) player.skinId = data.skinId;
        else if (player?.role === "seeker" && VALID_SEEKER_CHARS.has(data.skinId)) player.skinId = data.skinId;
      }
    });
    this.onMessage("eyes", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (player?.role === "doll" && this.state.phase === "hiding") player.eyesClosed = !!data?.closed;
    });
    this.onMessage("paint", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (!player || player.role !== "doll" || this.state.phase !== "hiding") return;
      const now = Date.now();
      if (now - (this.lastPaintAt.get(client.sessionId) || 0) < 28) return;
      this.lastPaintAt.set(client.sessionId, now);
      const color = typeof data?.color === "string" && /^#[0-9a-f]{6}$/i.test(data.color) ? data.color : null;
      if (!color) return;
      this.broadcast("paint", { playerId: client.sessionId, u: clamp(data?.u, 0, 1), v: clamp(data?.v, 0, 1), size: clamp(data?.size, 2, 48), color, pattern: typeof data?.pattern === "string" && VALID_PATTERNS.has(data.pattern) ? data.pattern : "solid" });
    });
    this.onMessage("power", (client, data) => this.activateHiderPower(client.sessionId, String(data?.power || "")));
    this.onMessage("footstep", (client) => {
      const player = this.state.players.get(client.sessionId);
      const now = Date.now();
      if (!player || player.isBot || player.role !== "doll" || !player.alive || this.state.phase !== "seeking") return;
      if (player.activePower === "silent" && player.powerUntil > now) return;
      if (now - (this.lastNoiseAt.get(client.sessionId) || 0) < 420) return;
      this.lastNoiseAt.set(client.sessionId, now);
      this.addNoiseCue(player.x, player.z, 1900);
      this.broadcast("noise", { kind: "footstep", expiresAt: now + 1300 });
    });
    this.onMessage("shoot", (client, data) => {
      const shooter = this.state.players.get(client.sessionId);
      if (!shooter || shooter.isBot || shooter.role !== "seeker" || this.state.phase !== "seeking" || !shooter.alive) return;
      const now = Date.now();
      if (now - (this.lastShotAt.get(client.sessionId) || 0) < 600) return;
      this.lastShotAt.set(client.sessionId, now);
      this.broadcast("swing", { playerId: client.sessionId });
      const yaw = clamp(data?.yaw, -Math.PI * 4, Math.PI * 4);
      const pitch = clamp(data?.pitch, -1.5, 1.5);
      const fx = -Math.sin(yaw) * Math.cos(pitch), fy = Math.sin(pitch), fz = -Math.cos(yaw) * Math.cos(pitch);
      let best: { id: string; player: Player; distance: number } | null = null;
      for (const [id, hider] of this.state.players.entries()) {
        if (hider.role !== "doll" || !hider.alive) continue;
        const dx = hider.x - shooter.x, h = hider.heightScale || 1;
        const verticalOffset = 0.9 * h;
        const targetY = hider.surfaceType === "ceiling" ? hider.y - verticalOffset : hider.y + verticalOffset;
        const dy = targetY - shooter.y, dz = hider.z - shooter.z;
        const distance = Math.hypot(dx, dy, dz);
        const power = POWER_RULES[hider.activePower];
        const powerActive = !!power && hider.powerUntil > now;
        const passive = Math.min(0.12, Math.max(0, hider.hiderLevel - 1) * 0.013);
        // Seeker weapons are thrown projectiles now, with a fair mid-range reach.
        // Pitch is part of the server-side aim check, so wall/beam Dolls can be hit too.
        const throwRange = 17.0;
        const maxRange = throwRange * (powerActive ? power.hitFactor : 1) * (1 - passive * 0.55);
        if (distance > maxRange || distance < 0.01) continue;
        if (!hasLineOfSight2D(shooter.x, shooter.z, hider.x, hider.z)) continue;
        const dot = (dx * fx + dy * fy + dz * fz) / distance;
        const neededDot = Math.min(0.982, 0.80 + (distance / throwRange) * 0.13 + passive * 0.18 + (powerActive ? (1 - power.hitFactor) * 0.12 : 0));
        if (dot > Math.max(neededDot, 1.0 - distance * 0.006) && (!best || distance < best.distance)) best = { id, player: hider, distance };
      }
      if (best) this.registerHit(best.id, client.sessionId);
    });
  }

  private activateHiderPower(sessionId: string, powerId: string) {
    const player = this.state.players.get(sessionId);
    const rule = POWER_RULES[powerId];
    if (!player || player.isBot || player.role !== "doll" || !player.alive || !rule) return;
    if (this.state.phase !== "hiding" && this.state.phase !== "seeking") return;
    if (player.hiderLevel < rule.level) return;
    const now = Date.now();
    if (now - (this.lastPowerAt.get(sessionId) || 0) < rule.cooldown) return;
    this.lastPowerAt.set(sessionId, now);
    player.activePower = powerId;
    player.powerUntil = now + rule.duration;
    this.broadcast("power", { playerId: sessionId, power: powerId, until: player.powerUntil });
    if (powerId === "decoy") {
      const angle = Math.random() * Math.PI * 2;
      const distance = 4.5 + Math.random() * 2.5;
      const x = clamp(player.x + Math.cos(angle) * distance, -20, 20);
      const z = clamp(player.z + Math.sin(angle) * distance, -20, 20);
      this.addNoiseCue(x, z, 2200);
      this.broadcast("noise", { kind: "decoy", expiresAt: now + 1800 });
    }
  }

  private addNoiseCue(x: number, z: number, ttl: number) {
    const angle = Math.random() * Math.PI * 2;
    const offset = 0.8 + Math.random() * 2.2;
    this.noiseCues.push({
      x: clamp(x + Math.cos(angle) * offset, -20, 20),
      z: clamp(z + Math.sin(angle) * offset, -20, 20),
      expiresAt: Date.now() + ttl,
    });
    if (this.noiseCues.length > 16) this.noiseCues.splice(0, this.noiseCues.length - 16);
  }

  private registerHit(targetId: string, shooterId: string) {
    const target = this.state.players.get(targetId);
    if (!target || !target.alive || target.role !== "doll") return;
    target.alive = false;
    target.activePower = ""; target.powerUntil = 0;
    this.broadcast("hit", { targetId, shooterId });
    const remainingHiders = [...this.state.players.values()].filter(p => p.role === "doll" && p.alive).length;
    this.broadcast("round", { type: "hidersRemaining", count: remainingHiders });
    if (remainingHiders === 0 && this.state.phase !== "ended") {
      this.state.winner = "seekers";
      this.broadcast("round", { type: "winner", winner: "SEEKERS" });
      this.endRound();
    }
  }

  onJoin(client: Client, options: any) {
    if (this.started || this.clients.length >= MAX_PLAYERS) {
      client.leave(4001, "Room is full or already started");
      return;
    }
    const player = new Player();
    player.playerId = String(options?.playerId || client.sessionId).slice(0, 80);
    player.name = String(options?.name || "Player").slice(0, 32);
    player.skinId = typeof options?.skinId === "string" && VALID_SKINS.has(options.skinId) ? options.skinId : "porcelain";
    player.hiderLevel = Math.floor(clamp(options?.hiderLevel ?? 1, 1, 10));
    player.isBot = false;
    const skinMaterials: Record<string, { metalness: number; roughness: number }> = {
      porcelain: { metalness: 0.025, roughness: 0.28 }, blocky: { metalness: 0.08, roughness: 0.38 }, plush: { metalness: 0, roughness: 0.94 }, shadow: { metalness: 0.22, roughness: 0.56 },
      kite: { metalness: 0.025, roughness: 0.5 }, puffy: { metalness: 0.025, roughness: 0.5 }, star: { metalness: 0.025, roughness: 0.5 }, choir: { metalness: 0.025, roughness: 0.5 },
    };
    player.metalness = skinMaterials[player.skinId].metalness;
    player.roughness = skinMaterials[player.skinId].roughness;
    player.alive = true;
    this.state.players.set(client.sessionId, player);
    this.rebalanceWaitingTeams();
    this.broadcastLobby();
    this.broadcast("chat", `${player.name} joined the hunt.`);
    if (this.state.players.size >= MIN_HUMANS_TO_START && !this.countdownTimer) this.startLobbyCountdown();
    if (this.clients.length >= MAX_PLAYERS) this.startRound();
  }

  onLeave(client: Client) {
    const leaving = this.state.players.get(client.sessionId);
    this.state.players.delete(client.sessionId);
    this.hiddenHiderPoses.delete(client.sessionId);
    this.lastShotAt.delete(client.sessionId); this.lastStateAt.delete(client.sessionId);
    this.lastPaintAt.delete(client.sessionId); this.lastPowerAt.delete(client.sessionId); this.lastNoiseAt.delete(client.sessionId);
    if (!leaving) return;
    if (!this.started) {
      this.rebalanceWaitingTeams();
      if (this.state.players.size < MIN_HUMANS_TO_START) this.stopLobbyCountdown();
      this.broadcastLobby();
      return;
    }
    const aliveHiders = [...this.state.players.values()].filter(p => p.role === "doll" && p.alive).length;
    const aliveSeekers = [...this.state.players.values()].filter(p => p.role === "seeker" && p.alive).length;
    if (aliveHiders === 0 && this.state.phase !== "ended") {
      this.state.winner = "seekers"; this.broadcast("round", { type: "winner", winner: "SEEKERS" }); this.endRound();
    } else if (aliveSeekers === 0 && this.state.phase !== "ended") {
      this.state.winner = "doll"; this.broadcast("round", { type: "winner", winner: "DOLL" }); this.endRound();
    }
  }

  private rebalanceWaitingTeams() {
    const entries = [...this.state.players.entries()].filter(([, p]) => !p.isBot);
    const n = entries.length;
    const targetHiders = Math.min(TARGET_HIDERS, Math.max(0, Math.round(n * TARGET_HIDERS / MAX_PLAYERS)));
    let hiderIndex = 0, seekerIndex = 0;
    entries.forEach(([sessionId, player], index) => {
      const desiredRole = index < targetHiders ? "doll" : "seeker";
      const roleChanged = player.role !== desiredRole;
      player.role = desiredRole;
      const spawn = desiredRole === "doll" ? HIDER_SPAWNS[hiderIndex++ % HIDER_SPAWNS.length] : SEEKER_SPAWNS[seekerIndex++ % SEEKER_SPAWNS.length];
      player.x = spawn.x; player.y = spawn.y; player.z = spawn.z;
      if (roleChanged || index === n - 1) this.broadcast("round", { type: "role", sessionId, role: desiredRole, name: player.name });
    });
  }

  private broadcastLobby() {
    const count = this.state.players.size;
    const hiders = [...this.state.players.values()].filter(p => p.role === "doll").length;
    const seekers = count - hiders;
    this.state.remaining = this.lobbyCountdown;
    this.broadcast("round", { type: "waiting", players: count, humans: count, hiders, seekers, maxPlayers: MAX_PLAYERS, countdown: this.lobbyCountdown, aiFill: true });
  }

  private startLobbyCountdown() {
    this.lobbyCountdown = FILL_GRACE_SECONDS;
    this.broadcastLobby();
    this.countdownTimer = setInterval(() => {
      if (this.started) { this.stopLobbyCountdown(); return; }
      if (this.state.players.size < MIN_HUMANS_TO_START) { this.stopLobbyCountdown(); this.broadcastLobby(); return; }
      if (this.clients.length >= MAX_PLAYERS) { this.startRound(); return; }
      this.lobbyCountdown = Math.max(0, this.lobbyCountdown - 1);
      this.broadcastLobby();
      if (this.lobbyCountdown <= 0) this.startRound();
    }, 1000);
  }

  private stopLobbyCountdown() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.countdownTimer = null; this.lobbyCountdown = 0;
  }

  private fillWithBotsAndAssignTeams() {
    const humans = shuffled([...this.state.players.entries()].filter(([, p]) => !p.isBot));
    if (!humans.length) return false;
    const humanCount = humans.length;
    let humanHiders = humanCount === 1 ? (Math.random() < 0.5 ? 1 : 0) : Math.round(humanCount * TARGET_HIDERS / MAX_PLAYERS);
    humanHiders = Math.max(Math.max(0, humanCount - TARGET_SEEKERS), Math.min(TARGET_HIDERS, humanHiders));
    const humanHiderIds = new Set(humans.slice(0, humanHiders).map(([id]) => id));
    humans.forEach(([id, player]) => { player.role = humanHiderIds.has(id) ? "doll" : "seeker"; });

    const botsNeededHiders = TARGET_HIDERS - humanHiders;
    const botsNeededSeekers = TARGET_SEEKERS - (humanCount - humanHiders);
    const botRoles = [...Array(botsNeededHiders).fill("doll"), ...Array(botsNeededSeekers).fill("seeker")];
    const names = shuffled(BOT_NAMES);
    let hiderBotIndex = 0, seekerBotIndex = 0;
    botRoles.forEach((role: string, i: number) => {
      const id = `ai_${++this.botSequence}_${Math.random().toString(36).slice(2, 7)}`;
      const bot = new Player();
      bot.playerId = id; bot.name = names[i % names.length]; bot.isBot = true;
      bot.role = role; bot.alive = true;
      const botSkinPool = role === "doll" ? ["porcelain", "blocky", "plush", "shadow", "kite", "puffy", "star", "choir"] : ["dwarf", "orc", "assassin", "farmer"];
      bot.skinId = botSkinPool[Math.floor(Math.random() * botSkinPool.length)];
      bot.hiderLevel = 1 + Math.floor(Math.random() * 8);
      if (role === "doll") {
        const spotIndex = hiderBotIndex++ % BOT_HIDE_POSES.length;
        const spot = BOT_HIDE_POSES[spotIndex];
        bot.x = HIDER_SPAWNS[hiderBotIndex % HIDER_SPAWNS.length].x;
        bot.y = 0; bot.z = HIDER_SPAWNS[hiderBotIndex % HIDER_SPAWNS.length].z;
        bot.attached = true; bot.surfaceType = "wall"; bot.eyesClosed = Math.random() > 0.2;
        bot.heightScale = 0.45 + Math.random() * 0.42; bot.color = spot.color; bot.pattern = spot.pattern;
        bot.metalness = spot.pattern === "brushed-metal" ? 0.45 : 0.03; bot.roughness = spot.pattern === "brushed-metal" ? 0.42 : 0.78;
        this.hiddenHiderPoses.set(id, { x: spot.x, y: spot.y, z: spot.z, ry: spot.ry, pitch: 0 });
        this.botBrains.set(id, { targetX: spot.x, targetZ: spot.z, thinkAt: 0, reactionAt: 0, nextShotAt: 0, skill: 0.35 + Math.random() * 0.45, zone: spotIndex % 4, movePauseUntil: 0, hideIndex: spotIndex });
      } else {
        const spawn = SEEKER_SPAWNS[seekerBotIndex % SEEKER_SPAWNS.length];
        bot.x = spawn.x + (Math.random() - 0.5) * 1.4; bot.y = spawn.y; bot.z = spawn.z + (Math.random() - 0.5) * 1.4;
        const zone = bot.x < -2 ? 3 : (bot.x > 2 ? 2 : (Math.random() < 0.5 ? 0 : 1));
        this.botBrains.set(id, { targetX: bot.x, targetZ: bot.z, thinkAt: Date.now() + 500 + Math.random() * 1800, reactionAt: 0, nextShotAt: 0, skill: 0.25 + Math.random() * 0.48, zone, movePauseUntil: 0, hideIndex: -1 });
        seekerBotIndex++;
      }
      this.state.players.set(id, bot);
    });
    // Reset human spawn positions now that final roles are known.
    let hi = 0, si = 0;
    humans.forEach(([id, player]) => {
      const spawn = player.role === "doll" ? HIDER_SPAWNS[hi++ % HIDER_SPAWNS.length] : SEEKER_SPAWNS[si++ % SEEKER_SPAWNS.length];
      player.x = spawn.x; player.y = spawn.y; player.z = spawn.z;
    });
    this.broadcast("round", { type: "matchFilled", players: MAX_PLAYERS, realPlayers: humanCount, aiPlayers: MAX_PLAYERS - humanCount, hiders: TARGET_HIDERS, seekers: TARGET_SEEKERS });
    this.state.players.forEach((player, sessionId) => {
      if (!player.isBot) this.broadcast("round", { type: "role", sessionId, role: player.role, name: player.name });
    });
    return true;
  }

  private startRound() {
    if (this.started || this.state.players.size < MIN_HUMANS_TO_START) return;
    this.stopLobbyCountdown();
    if (!this.fillWithBotsAndAssignTeams()) return;
    this.started = true;
    this.lock(); // New humans now enter a fresh room from joinOrCreate.
    this.setPhase("hiding", HIDE_SECONDS);
  }

  private setPhase(phase: string, seconds: number) {
    this.state.phase = phase; this.state.remaining = seconds;
    if (phase === "seeking") {
      this.hiddenHiderPoses.forEach((pose, id) => {
        const hider = this.state.players.get(id);
        if (!hider || !hider.alive || hider.role !== "doll") return;
        hider.x = pose.x; hider.y = pose.y; hider.z = pose.z; hider.ry = pose.ry; hider.pitch = pose.pitch;
      });
      this.hiddenHiderPoses.clear();
      this.botBrains.forEach((brain, id) => { if (this.state.players.get(id)?.role === "seeker") { brain.thinkAt = Date.now() + 900 + Math.random() * 2200; brain.movePauseUntil = Date.now() + Math.random() * 1000; } });
    }
    this.broadcast("round", { type: "phase", phase, remaining: seconds });
    if (this.phaseTimer) clearInterval(this.phaseTimer);
    this.phaseTimer = setInterval(() => {
      if (this.state.phase !== phase) return;
      this.state.remaining = Math.max(0, this.state.remaining - 1);
      if (this.state.remaining <= 0) {
        if (this.state.phase === "hiding") this.setPhase("seeking", SEEK_SECONDS);
        else if (this.state.phase === "seeking") {
          this.state.winner = "doll"; this.broadcast("round", { type: "winner", winner: "DOLL" }); this.endRound();
        }
      } else this.broadcast("round", { type: "phase", phase: this.state.phase, remaining: this.state.remaining });
    }, 1000);
  }

  private updateBotBrains() {
    if (!this.started || this.state.phase === "waiting" || this.state.phase === "ended") return;
    const now = Date.now();
    for (const [id, bot] of this.state.players.entries()) {
      if (!bot.isBot || !bot.alive) continue;
      const brain = this.botBrains.get(id);
      if (!brain) continue;
      if (bot.powerUntil <= now) { bot.activePower = ""; bot.powerUntil = 0; }
      if (bot.role === "doll") {
        if (this.state.phase === "seeking" && bot.hiderLevel >= 2 && now > brain.thinkAt) {
          const options = Object.entries(POWER_RULES).filter(([, rule]) => rule.level <= bot.hiderLevel);
          if (options.length && Math.random() < 0.48) {
            const [power, rule] = options[Math.floor(Math.random() * options.length)];
            bot.activePower = power; bot.powerUntil = now + Math.min(rule.duration, 3500 + Math.random() * 1800);
          }
          brain.thinkAt = now + 8000 + Math.random() * 18000;
        }
        continue;
      }
      if (this.state.phase !== "seeking") continue;
      if (now > brain.thinkAt) {
        this.noiseCues = this.noiseCues.filter(cue => cue.expiresAt > now);
        const audible = this.noiseCues.map(cue => ({ cue, d: Math.hypot(cue.x - bot.x, cue.z - bot.z) }))
          .filter(v => v.d < 10 && hasLineOfSight2D(bot.x, bot.z, v.cue.x, v.cue.z))
          .sort((a, b) => a.d - b.d)[0];
        const candidates = [...this.state.players.entries()].filter(([, p]) => p.role === "doll" && p.alive);
        const nearby = candidates.map(([hid, hider]) => ({ id: hid, p: hider, d: Math.hypot(hider.x - bot.x, hider.z - bot.z) }))
          .filter(v => v.d < 8.5 && hasLineOfSight2D(bot.x, bot.z, v.p.x, v.p.z))
          .sort((a, b) => a.d - b.d)[0];
        if (audible && Math.random() < 0.62) {
          // Sound leads the bot toward an approximate cue, never the exact Doll coordinate.
          const jitter = 0.8 + Math.random() * 1.8;
          brain.targetX = clamp(audible.cue.x + (Math.random() - 0.5) * jitter, -19.5, 19.5);
          brain.targetZ = clamp(audible.cue.z + (Math.random() - 0.5) * jitter, -19.5, 19.5);
          brain.reactionAt = now + 800 + Math.random() * 2100;
        } else if (nearby && Math.random() < 0.42 + brain.skill * 0.28) {
          // Bots react after a human-like delay and approach an approximate sighting.
          const jitter = 1.1 + Math.random() * 2.2;
          brain.targetX = clamp(nearby.p.x + (Math.random() - 0.5) * jitter, -19.5, 19.5);
          brain.targetZ = clamp(nearby.p.z + (Math.random() - 0.5) * jitter, -19.5, 19.5);
          brain.reactionAt = now + 850 + Math.random() * 2200;
        } else {
          const zone = PATROL_ZONES[brain.zone] || PATROL_ZONES[0];
          brain.targetX = zone.minX + Math.random() * (zone.maxX - zone.minX);
          brain.targetZ = zone.minZ + Math.random() * (zone.maxZ - zone.minZ);
          brain.reactionAt = 0;
        }
        brain.thinkAt = now + 1800 + Math.random() * 2800;
        if (Math.random() < 0.16) brain.movePauseUntil = now + 500 + Math.random() * 1200;
      }
      if (now < brain.movePauseUntil) continue;
      const dx = brain.targetX - bot.x, dz = brain.targetZ - bot.z, dist = Math.hypot(dx, dz);
      if (dist > 0.45) {
        const step = Math.min(dist, (1.25 + brain.skill * 1.25) * 0.12);
        const nx = bot.x + dx / dist * step, nz = bot.z + dz / dist * step;
        if (!isBlockedByRoomWalls(nx, bot.z)) bot.x = nx;
        if (!isBlockedByRoomWalls(bot.x, nz)) bot.z = nz;
        bot.ry = Math.atan2(-dx, -dz);
      } else if (Math.random() < 0.25) {
        brain.thinkAt = now;
      }
      // Limited, imperfect bot accuracy; hider levels and active powers reduce hit chance.
      if (brain.reactionAt && now >= brain.reactionAt && now >= brain.nextShotAt) {
        const target = [...this.state.players.entries()].map(([hid, p]) => ({ id: hid, p, d: Math.hypot(p.x - bot.x, p.z - bot.z) }))
          .filter(v => v.p.role === "doll" && v.p.alive && v.d < 3.7 && hasLineOfSight2D(bot.x, bot.z, v.p.x, v.p.z))
          .sort((a, b) => a.d - b.d)[0];
        if (target) {
          this.broadcast("swing", { playerId: id, targetId: target.id });
          const tx = target.p.x - bot.x, tz = target.p.z - bot.z;
          const len = Math.max(0.001, Math.hypot(tx, tz));
          const facingX = -Math.sin(bot.ry), facingZ = -Math.cos(bot.ry);
          const aimDot = (tx * facingX + tz * facingZ) / len;
          const active = target.p.powerUntil > now ? (POWER_RULES[target.p.activePower]?.hitFactor || 1) : 1;
          const passive = 1 - Math.min(0.12, Math.max(0, target.p.hiderLevel - 1) * 0.013);
          const chance = Math.max(0.025, Math.min(0.26, brain.skill * 0.24 * active * passive));
          if (aimDot > 0.72 && Math.random() < chance) this.registerHit(target.id, id);
        }
        brain.nextShotAt = now + 1050 + Math.random() * 850;
        brain.reactionAt = now + 900 + Math.random() * 1500;
      }
    }
  }

  private endRound() {
    if (this.phaseTimer) clearInterval(this.phaseTimer);
    this.phaseTimer = null; this.state.phase = "ended"; this.lock();
  }

  onDispose() {
    if (this.phaseTimer) clearInterval(this.phaseTimer);
    if (this.botTimer) clearInterval(this.botTimer);
    this.stopLobbyCountdown();
  }
}
