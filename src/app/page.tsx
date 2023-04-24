import { encode } from "@/support/coding";
import { redirect } from "next/navigation";

export default function Page() {
  return redirect("/d/" + encode("storage"));
}
