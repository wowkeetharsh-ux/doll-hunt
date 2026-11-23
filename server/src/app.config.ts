import { defineServer, defineRoom } from "colyseus";
import { DollHuntRoom } from "./rooms/DollHuntRoom.js";

export const server = defineServer({
  rooms: {
    doll_hunt: defineRoom(DollHuntRoom),
  },
  devMode: process.env.NODE_ENV !== "production",
  express: (app) => {
    app.get("/health", (_req, res) => {
      res.status(200).json({ ok: true, service: "doll-hunt", time: new Date().toISOString() });
    });
  },
});
