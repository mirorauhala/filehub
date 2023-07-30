export const decode = (dirpath: string) =>
  Buffer.from(dirpath, "base64").toString("utf-8");

export const encode = (dirpath: string) =>
  urlSafe(Buffer.from(dirpath).toString("base64"));

export const isEncoded = (str: string) => encode(decode(str)) === str;

export const decodeClient = (string: string) => window.atob(string);
export const encodeClient = (string: string) => urlSafe(window.btoa(string));

const urlSafe = (string: string) =>
  string.replace("+", "-").replace("/", "_").replace(/=+$/, "");
