import mime from "mime/lite";
import fs from "fs/promises";
import path from "path";
import { toEncodedPath } from "@/support/fs";

const config = {
  root: "./tmp/storage/",
  trash: "./tmp/.trash/",
};

export type DirectoryListing = {
  base64: string;
  filepath: string;
  name: string;
  mime?: string;
  type: "file" | "directory" | "unknown";
  stats: {
    createdAt: Date;
    modifiedAt: Date;
    accessTime: Date;
    size: number;
  };
};

const makePathSafe = (dirpath: string) =>
  path.normalize(dirpath).replace(/^(\.\.(\/|\\|$))+/, "");

const stripRoot = (dirpath: string) => {
  const root = path.normalize(config.root);
  const safePath = path.normalize(dirpath);

  return safePath.replace(root, "");
};

const getDirectoryListing = async (dir: string) => {
  const safePath = makePathSafe(dir);

  const files = await fs.readdir(path.join(config.root, safePath), {
    withFileTypes: true,
  });

  const listing = files.map((file) => {
    const actualPath = path.join(config.root, dir, file.name);

    return _fileMetadata(actualPath);
  });

  return Promise.all(listing);
};

const getRawFile = async (filepath: string) => {
  const safePath = config.root + makePathSafe(filepath);

  return await fs.readFile(safePath);
};

const _fileMetadata = async (filepath: string): Promise<DirectoryListing> => {
  const stats = await fs.stat(filepath);

  const neutralFilepath = stripRoot(filepath);

  return {
    base64: toEncodedPath(neutralFilepath),
    filepath: neutralFilepath,
    name: path.basename(neutralFilepath),
    mime: stats.isFile()
      ? mime.getType(path.basename(neutralFilepath)) ||
        "application/octet-stream"
      : undefined,
    type: stats.isFile() ? "file" : "directory",
    stats: {
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
      accessTime: stats.atime,
      size: stats.size,
    },
  };
};

const getFileMetadata = async (filepath: string) => {
  const safePath = config.root + makePathSafe(filepath);

  return _fileMetadata(safePath);
};

export const FileSystemService = {
  getDirectoryListing,
  getRawFile,
  getFileMetadata,
};
