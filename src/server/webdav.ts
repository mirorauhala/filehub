import { createClient } from "webdav";

export const wd = createClient("http://localhost:8889/", {
  username: "admin",
  password: "cat123",
});
