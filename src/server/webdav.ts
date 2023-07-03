import { env } from "@/env/server.mjs";
import { createClient } from "webdav";

export const wd = createClient(env.WEBDAV_ENDPOINT, {
  username: "admin",
  password: "cat123",
});
