"use server";

import { wd } from "@/server/webdav";
import type { File } from "./columns";
import { decode } from "@/support/coding";
import { revalidatePath } from "next/cache";
import { getFileStat } from "@/utils/webdav";

export async function moveToTrash(fileHandle: File) {
  if (!fileHandle)
    return { success: false, message: "File missing from request" };

  // validate file exists
  const file = getFileStat(await wd.stat(decode(fileHandle.id)));
  if (!fileHandle) return { success: false, message: "File not found" };

  console.log("Deleting ", decode(fileHandle.id));

  // if the file is a directory, the whole directory is trashed.
  //  if the file is a file, just the file is moved to the root of the trash
  // @todo does not handle filename collisions
  if (file.type === "directory") {
    const oldFilepath = file.filename;
    console.log("oldFilepath", oldFilepath);

    const inherintFilename = file.filename.replace("/storage/", "");
    await wd.moveFile(oldFilepath, `/.trash/${inherintFilename}`, {
      overwrite: false,
    });
  } else {
    const oldFilepath = file.filename;
    await wd.moveFile(oldFilepath, `/.trash/${file.basename}`, {
      overwrite: false,
    });
  }

  revalidatePath("/d");

  return { success: true };
}

export async function renameFile(requestFile: File, newName: string) {
  if (!requestFile)
    return { success: false, message: "File missing from request" };

  if (!newName || newName.length === 0)
    return { success: false, message: "New name missing from request" };

  // validate file exists
  const file = getFileStat(await wd.stat(decode(requestFile.id)));
  if (!file) return { success: false, message: "File not found" };

  if (file.basename === newName) return { success: true };

  const oldFilepath = file.filename;
  const newFilepath = file.filename.replace(file.basename, newName);

  console.log("Renaming ", oldFilepath, " to ", newFilepath);

  await wd.moveFile(oldFilepath, newFilepath);

  revalidatePath("/d");

  return { success: true };
}
