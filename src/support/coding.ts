export const decode = (dirpath: string) =>
  Buffer.from(dirpath, "base64").toString("utf-8");

export const encode = (dirpath: string) =>
  Buffer.from(dirpath).toString("base64");

export const isEncoded = (str: string) => encode(decode(str)) === str;
