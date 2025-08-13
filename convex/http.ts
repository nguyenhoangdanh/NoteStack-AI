import { httpRouter } from "convex/server";
import { auth } from "./auth.config";
import { stream, complete } from "./chat";

const http = httpRouter();

// Auth routes
auth.addHttpRoutes(http);

// Chat routes
http.route({
  path: "/api/chat/stream",
  method: "POST",
  handler: stream,
});

http.route({
  path: "/api/chat/complete",
  method: "POST",
  handler: complete,
});

export default http;
