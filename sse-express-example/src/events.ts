import { Request, Response, Router } from "express";
import { randomUUID } from "crypto";
import { ServerSentEvent } from "node-server-sent-events";

const streamHolster: Record<string, ServerSentEvent> = {};

export const holsterUpdateAndFetch = (id?: string) => {
  const finalId = id || randomUUID();
  if (!streamHolster[finalId]) {
    streamHolster[finalId] = new ServerSentEvent();
  }
  return streamHolster[finalId];
};

export const openStream = (req: Request<{ streamId: string }>, res: Response) => {
  const { streamId } = req.params;
  const foundSSE = holsterUpdateAndFetch(streamId);
  foundSSE.sseHandler(req, res);
};

export const StreamRouter = Router();

StreamRouter.get("/streams/:streamId", openStream);
