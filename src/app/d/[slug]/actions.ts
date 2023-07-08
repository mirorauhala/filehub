"use server";

import { wd } from "@/server/webdav";
import type { File } from "./columns";
import { decode } from "@/support/coding";
import { revalidatePath } from "next/cache";

export async function moveToTrash(file: File) {
  if (!file) return { success: false, message: "File not found" };

  console.log("Deleting ", decode(file.id));
  await wd.deleteFile(decode(file.id));

  revalidatePath("/d");

  return { success: true };
}
