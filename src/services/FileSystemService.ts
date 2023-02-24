import mime from "mime/lite";
import fs from "fs/promises";
import path from "path";
import { encode } from "@/support/coding";
import { move } from "fs-extra/esm";
import { urnApi } from "@/support/urn";
import { config } from "@/support/config";

export type DirectoryListing = {
  urn: string;
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

const getAppPathForUrnType = (type: string) => {
  switch (type) {
    case "cloud":
      return config.root;
    case "trash":
      return config.trash;
    default:
      throw new Error("Invalid URN type");
  }
};

const makeSafePath = (dirpath: string) =>
  path.normalize(dirpath).replace(/^(\.\.(\/|\\|$))+/, "");

const ensurePathStartsWithSlash = (dirpath: string) =>
  dirpath.startsWith("/") ? dirpath : `/${dirpath}`;

/**
 * Build directory path from URN.
 *
 * @param URN
 * @returns directory path
 */
const buildPath = (urn: string) => {
  const parsedUrn = urnApi.parse(urn);

  if (parsedUrn.section !== "fs") {
    throw new Error("Only fs section is supported");
  }

  const appPath = getAppPathForUrnType(parsedUrn.type);

  return path.join(
    appPath,
    ensurePathStartsWithSlash(makeSafePath(parsedUrn.resource))
  );
};

const stripRoot = (dirpath: string) => {
  const root = path.normalize(config.root);
  const safePath = path.normalize(dirpath);

  return safePath.replace(root, "");
};

const getDirectoryListing = async (urn: string) => {
  const directoryPath = buildPath(urn);

  const files = await fs.readdir(directoryPath, {
    withFileTypes: true,
  });

  const listing = files.map((file) => {
    const filePath = path.join(directoryPath, file.name);

    return _fileMetadata(urn, filePath);
  });

  return Promise.all(listing);
};

const getRawFile = async (filepath: string) => {
  const safePath = config.root + makeSafePath(filepath);

  return await fs.readFile(safePath);
};

const _fileMetadata = async (
  directoryUrn: string,
  filepath: string
): Promise<DirectoryListing> => {
  const parsedDirectoryUrn = urnApi.parse(directoryUrn);
  const fileUrn = urnApi.format({
    section: "fs",
    type: parsedDirectoryUrn.type,
    resource: path.join(parsedDirectoryUrn.resource, path.basename(filepath)),
  });

  const stats = await fs.stat(filepath);

  const neutralFilepath = stripRoot(filepath);

  return {
    urn: fileUrn,
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

const moveTo = async (source: string, destination: string) => {
  const sourcePath = config.root + makeSafePath(source);
  const destinationPath = config.trash + makeSafePath(destination);

  await move(sourcePath, destinationPath);
};

const moveToTrash = async (source: string) => {
  const sourcePath = config.root + makeSafePath(source);
  const trashPath = config.trash + makeSafePath(source);

  await moveTo(sourcePath, trashPath);
};

const getFileMetadata = async (filepath: string) => {
  const safePath = config.root + makeSafePath(filepath);

  return _fileMetadata(safePath);
};

export const FileSystemService = {
  getDirectoryListing,
  getRawFile,
  getFileMetadata,
  moveToTrash,
  moveTo,
};
