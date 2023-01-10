export const toReadablePath = (dirpath: string) =>
  Buffer.from(dirpath, "base64").toString("utf-8");

export const toEncodedPath = (dirpath: string) =>
  Buffer.from(dirpath).toString("base64");
