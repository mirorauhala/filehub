import { type NextApiRequest, type NextApiResponse } from "next";
import {
  FileSystemService,
  toReadablePath,
} from "@/services/FileSystemService";
import mime from "mime/lite";

const raw = async (req: NextApiRequest, res: NextApiResponse) => {
  const path = req.query.path as string;

  const readablePath = toReadablePath(path);
  const file = await FileSystemService.getRawFile(readablePath);

  res.setHeader("Content-Type", mime.getType(readablePath) || "text/plain");
  res.setHeader("Content-Length", file.length);
  res.send(file);
  res.end();
};

export default raw;
