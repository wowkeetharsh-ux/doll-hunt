import { schema, t, type SchemaType } from "@colyseus/schema";

export const Player = schema({
  playerId: t.string().default(""),
  name: t.string().default("Player"),
  role: t.string().default("seeker"),
  skinId: t.string().default("porcelain"),
  isBot: t.boolean().default(false),
  hiderLevel: t.number().default(1),
  activePower: t.string().default(""),
  powerUntil: t.number().default(0),
  x: t.number().default(0),
  y: t.number().default(0),
  z: t.number().default(0),
  ry: t.number().default(0),
  pitch: t.number().default(0),
  color: t.string().default("#c9c7bf"),
  metalness: t.number().default(0.025),
  roughness: t.number().default(0.28),
  pattern: t.string().default("solid"),
  attached: t.boolean().default(false),
  surfaceType: t.string().default(""),
  eyesClosed: t.boolean().default(false),
  heightScale: t.number().default(1),
  alive: t.boolean().default(true),
}, "Player");

export type Player = SchemaType<typeof Player>;

export const DollHuntState = schema({
  phase: t.string().default("waiting"),
  remaining: t.number().default(0),
  winner: t.string().default(""),
  players: t.map(Player),
}, "DollHuntState");

export type DollHuntState = SchemaType<typeof DollHuntState>;
