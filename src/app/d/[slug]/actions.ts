"use server";

import { wd } from "@/server/webdav";
import type { File } from "./columns";
import { decode } from "@/support/coding";
import { revalidatePath } from "next/cache";
import { getFileStat } from "@/utils/webdav";

export async function moveToTrash(file: File) {
  if (!file) return { success: false, message: "File not found" };

  console.log("Deleting ", decode(file.id));
  await wd.deleteFile(decode(file.id));

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
