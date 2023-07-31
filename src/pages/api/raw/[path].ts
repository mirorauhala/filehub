import { type NextApiRequest, type NextApiResponse } from "next";
import mime from "mime/lite";
import { decode } from "@/support/coding";
import { wd } from "@/server/webdav";
import { getFileStat } from "@/utils/webdav";
import type { CreateReadStreamOptions } from "webdav";

export const config = {
  api: {
    responseLimit: false,
  },
};

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const path = req.query.path as string;
  const readablePath = decode(path);

  if (getFileStat(await wd.stat(readablePath)).type === "directory") {
    res.status(400).send("Cannot get directory");
    return;
  }

  const getRange = (): CreateReadStreamOptions["range"] => {
    const rangeHeader = req.headers.range?.split("=")[1];
    if (!rangeHeader) return undefined;

    const start = rangeHeader.split("-")[0];
    const end = rangeHeader.split("-")[1];
    if (!start) return undefined;

    if (!end) return { start: parseInt(start) || 0 };

    return {
      start: rangeHeader ? parseInt(start) || 0 : 0,
      end: rangeHeader ? parseInt(end) || undefined : undefined,
    };
  };

  const fileStat = getFileStat(await wd.stat(readablePath));
  res.setHeader("Accept-Ranges", "bytes");

  const range = getRange();
  const file = wd.createReadStream(readablePath, {
    range,
  });

  if (range) {
    res.setHeader(
      "Content-Range",
      `bytes ${range.start}-${range.end ?? 0}/${fileStat.size}`
    );
    res.status(206);
  } else {
    res.setHeader("Content-Type", mime.getType(readablePath) || "text/plain");
    res.setHeader("Content-Length", fileStat.size);
    res.status(200);
  }

  res.setHeader("Cache-Control", "no-store");
  file.pipe(res);
};

const HEAD = async (req: NextApiRequest, res: NextApiResponse) => {
  const path = req.query.path as string;
  const readablePath = decode(path);
  const fileStat = getFileStat(await wd.stat(readablePath));

  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Type", mime.getType(readablePath) || "text/plain");
  res.setHeader("Content-Length", fileStat.size);
  res.status(200);
};

const raw = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return GET(req, res);
  if (req.method === "HEAD") return HEAD(req, res);
  res.status(405).send("Method Not Allowed");
};

export default raw;
