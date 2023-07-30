import { type File, columns } from "./columns";
import { DataTable } from "./data-table";
import { wd } from "@/server/webdav";
import { decode, encode } from "@/support/coding";
import { getFileStat } from "@/utils/webdav";
import { type FileStat } from "webdav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Upload } from "@/app/d/[slug]/upload";

export default async function Page({ params }: { params: { slug: string } }) {
  const path = decode(params.slug);
  const files = getFileStat<FileStat[]>(await wd.getDirectoryContents(path));
  const files2 = files
    .map(
      (file) =>
        ({
          id: encode(file.filename),
          basename: file.basename,
          size: file.size,
          type: file.type,
          mime: file.mime,
        }) as File,
    )
    .sort((a, b) => {
      if (a.type === "directory" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "directory") return 1;
      return a.basename.localeCompare(b.basename);
    });

  return (
    <main className="flex min-h-screen w-full flex-col">
      <div className="mx-auto w-full max-w-7xl">
        <Breadcrumbs path={"/"} />
        <Upload path={path} />

        <DataTable columns={columns} data={files2} />
      </div>
    </main>
  );
}
