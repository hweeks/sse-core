import express, { Request, Response } from "express";
import { StreamRouter, holsterUpdateAndFetch } from "./events";

const appStartup = () => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(StreamRouter);
  app.get("/health", (req, res) => {
    res.send("ok");
  });
  app.get("/emit/:streamId", (req: Request<{ streamId: string }>, res: Response) => {
    const { streamId } = req.params;
    const foundSSE = holsterUpdateAndFetch(streamId);
    foundSSE.emit("message", { body: "sup" });
    res.send({ success: true, streamId });
  });
  return app.listen(4000, "0.0.0.0", () => {
    process.stdout.write("up on 4000 \n");
  });
};

const server = appStartup();

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  console.log("Closing http server.");
  server.close(() => {
    console.log("server closed, restarting");
  });
});
