import type { ResponseDataDetailed } from "webdav";

export function isResponseDataDetailed<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any
): obj is ResponseDataDetailed<T> {
  return obj && obj.data;
}

export function getFileStat<T>(file: T | ResponseDataDetailed<T>): T {
  if (isResponseDataDetailed<T>(file)) {
    return file.data;
  }
  return file;
}
