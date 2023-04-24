import { encode } from "@/support/coding";
import { redirect } from "next/navigation";

export default function DirectoryIndex() {
  const storageIndex = encode("storage");

  return redirect("/d/" + storageIndex);
}
