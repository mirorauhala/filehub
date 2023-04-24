import { type NextApiRequest, type NextApiResponse } from "next";
import mime from "mime/lite";
import { decode } from "@/support/coding";
import { wd } from "@/server/webdav";
import { getFileStat } from "@/utils/webdav";

const raw = async (req: NextApiRequest, res: NextApiResponse) => {
  const path = req.query.path as string;
  const readablePath = decode(path);

  if (getFileStat(await wd.stat(readablePath)).type === "directory") {
    res.status(400).send("Cannot get directory");
    return;
  }

  const file = wd.createReadStream(readablePath);

  res.setHeader("Content-Type", mime.getType(readablePath) || "text/plain");
  res.status(200);
  file.pipe(res);
};

export default raw;
