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

/**
 * Build directory path from URN.
 *
 * @param URN
 * @returns directory path
 */
const buildAbsolutePath = (urn: string) => {
  const parsedUrn = urnApi.parse(urn);

  if (parsedUrn.section !== "fs") {
    throw new Error("Only fs section is supported");
  }

  const appPath = getAppPathForUrnType(parsedUrn.type);

  return path.join(appPath, makeSafePath(parsedUrn.resource));
};

const stripRoot = (dirpath: string) => {
  const root = path.normalize(config.root);
  const safePath = path.normalize(dirpath);

  return safePath.replace(root, "");
};

const getDirectoryListing = async (urn: string) => {
  const parsedUrn = urnApi.parse(urn);
  const directoryPath = buildAbsolutePath(urn);

  const files = await fs.readdir(directoryPath, {
    withFileTypes: true,
  });

  const listing = files.map((file) => {
    const fileUrn = urnApi.format({
      section: "fs",
      type: parsedUrn.type,
      resource: file.name,
    });

    return _fileMetadata(fileUrn);
  });

  return Promise.all(listing);
};

const getRawFile = async (filepath: string) => {
  const safePath = config.root + makeSafePath(filepath);

  return await fs.readFile(safePath);
};

const _fileMetadata = async (urn: string): Promise<DirectoryListing> => {
  const parsedUrn = urnApi.parse(urn);
  const filepath = parsedUrn.resource;
  const absolutePath = buildAbsolutePath(urn);

  const stats = await fs.stat(absolutePath);

  return {
    urn,
    filepath,
    name: path.basename(filepath),
    mime: stats.isFile()
      ? mime.getType(path.basename(filepath)) || "application/octet-stream"
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
  const fileFromUrn = urnApi.parse(source);

  if (fileFromUrn.section !== "fs") {
    throw new Error("This operation is only supported for fs section");
  }

  if (fileFromUrn.type !== "cloud") {
    throw new Error("This operation is only supported for cloud URNs");
  }

  if (fileFromUrn.resource === "/") {
    throw new Error("Cannot move root directory to trash");
  }

  const resource = makeSafePath(fileFromUrn.resource);

  console.log("Moving", resource, "to trash");

  const sourcePath = config.root + resource;
  const trashPath = config.trash + resource;

  await move(sourcePath, trashPath);
};

const getFileMetadata = async (urn: string) => {
  const decodedUrn = urnApi.parse(urn);

  if (decodedUrn.section !== "fs") {
    throw new Error("Only fs section is supported");
  }

  if (decodedUrn.type !== "cloud") {
    throw new Error("Only cloud URNs are supported");
  }

  return _fileMetadata(urn);
};

export const FileSystemService = {
  getDirectoryListing,
  getRawFile,
  getFileMetadata,
  moveToTrash,
  moveTo,
};
