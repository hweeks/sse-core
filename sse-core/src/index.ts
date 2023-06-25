import { EventEmitter } from "node:events";
import { IncomingMessage, ServerResponse } from "node:http";
import { Http2ServerRequest } from "node:http2";
import { randomUUID } from "node:crypto";

export type EventShape = string | string[] | number | number[] | object | object[];

export interface ServerSentEventConfiguration {
  isSerialized?: boolean;
  isCompressed?: boolean;
  initialEvent?: string;
}

const isHttp2Request = (req: IncomingMessage | Http2ServerRequest): req is Http2ServerRequest => {
  return "stream" in req;
};

const idHandler = () => {
  return randomUUID();
};

const dataHandler = (res: ServerResponse, data: { id?: string | number; event?: EventShape; data?: EventShape }) => {
  if (data.id) {
    res.write(`id: ${data.id}\n`);
  } else {
    res.write(`id: ${idHandler()}\n`);
  }
  if (data.event) {
    res.write(`event: ${data.event}\n`);
  }
  res.write(`data: ${JSON.stringify(data.data)}\n\n`);
};

const serializeHandler = (res: ServerResponse, data: unknown[]) => {
  const serializeSend = data.reduce((all, msg) => {
    all += `id: ${idHandler()}\ndata: ${JSON.stringify(msg)}\n\n`;
    return all;
  }, "");
  res.write(serializeSend);
};

export class ServerSentEvent extends EventEmitter {
  initial: EventShape[];
  options: ServerSentEventConfiguration;
  constructor(initial = [], options = { isSerialized: true }) {
    super();
    this.initial = Array.isArray(initial) ? initial : [initial];
    this.options = options;
  }
  sseHandler = (req: IncomingMessage, res: ServerResponse) => {
    if (req.socket) {
      req.socket?.setTimeout(0);
      req.socket?.setNoDelay(true);
      req.socket?.setKeepAlive(true);
    }
    res.statusCode = 200;
    this.bindRequestHeaders(req, res);
    // add those listeners
    this.bindRequestListeners(req, res);

    if (this.options.isSerialized) {
      this.serialize(this.initial);
    } else if (this.initial.length > 0) {
      this.send(this.initial, this.options.initialEvent);
    }
  };
  bindRequestListeners(req: IncomingMessage, res: ServerResponse) {
    this.setMaxListeners(this.getMaxListeners() + 2);
    const dataListener = dataHandler.bind(null, res);
    const serializeListener = serializeHandler.bind(null, res);
    this.on("data", dataListener);
    this.on("serialize", serializeListener);
    req.on("close", () => {
      this.removeListener("data", dataListener);
      this.removeListener("serialize", serializeListener);
      this.setMaxListeners(this.getMaxListeners() - 2);
    });
  }
  bindRequestHeaders(req: IncomingMessage, res: ServerResponse) {
    // headers to enable the open stream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Accel-Buffering", "no");
    // if it isn't http you must explicitly leave it open
    if (!isHttp2Request(req)) {
      res.setHeader("Connection", "keep-alive");
    }
    if (this.options.isCompressed) {
      res.setHeader("Content-Encoding", "deflate");
    }
  }
  updateInit(data: EventShape) {
    this.initial = Array.isArray(data) ? data : [data];
  }
  dropInit() {
    this.initial = [];
  }
  send(data: EventShape, event?: string, id?: string | number) {
    this.emit("data", { data, event, id });
  }
  serialize(data: EventShape) {
    if (Array.isArray(data)) {
      this.emit("serialize", data);
    } else {
      this.send(data);
    }
  }
}
