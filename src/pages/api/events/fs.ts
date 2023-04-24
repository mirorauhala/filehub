import { wd } from "@/server/webdav";
import { type NextApiRequest, type NextApiResponse } from "next";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const raw = async (req: NextApiRequest, res: NextApiResponse) => {
  const start = Date.now();
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Encoding": "none",
    "Cache-Control": "no-cache, no-transform",
    "Content-Type": "text/event-stream;charset=utf-8",
    "X-Accel-Buffering": "no",
  });

  const files = wd.getDirectoryContents("/");

  const filesToJson = JSON.stringify(files);

  // a minute from now
  const end = new Date(start + 1 * 60000);

  while (new Date() < end) {
    res.write(`data: ${filesToJson}\n\n`);
    res.write(`data: ${new Date()}\n\n`);
    await sleep(1000);
  }
};

export default raw;
