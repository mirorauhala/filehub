import mime from "mime/lite";
import fs from "fs/promises";
import path from "path";

const config = {
  root: "./tmp/",
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

const makePathSafe = (dirpath: string) => {
  return path.normalize(dirpath).replace(/^(\.\.(\/|\\|$))+/, "");
};

export const parentDirectory = (dirpath: string) => path.dirname(dirpath);

export const toReadablePath = (dirpath: string) =>
  Buffer.from(dirpath, "base64url").toString("utf-8");

const toEncodedPath = (dirpath: string) =>
  Buffer.from(dirpath).toString("base64url");

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
      ? mime.getType(path.basename(neutralFilepath))
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
