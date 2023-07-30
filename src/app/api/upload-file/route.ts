import { wd } from "@/server/webdav";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

const POST = async (req: NextRequest) => {
  console.log("POST /api/upload-file");
  try {
    const formData = await req.formData();
    const file = formData.get("file") as unknown as File;
    const path = formData.get("path") as string;

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    // todo: onUploadProgress
    await wd.putFileContents(
      path + "/" + file.name,
      Buffer.from(await file.arrayBuffer()),
    );

    revalidatePath("/d");

    return NextResponse.json({ revalidated: true, success: true });
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return NextResponse.json({ error }, { status: 500 });
  }
};

export { POST };
