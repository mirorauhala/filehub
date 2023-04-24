import FileBrowser from "@/components/FileBrowser/FileBrowser";
import { Shell } from "@/components/Shell";
import { wd } from "@/server/webdav";
import { decode } from "@/support/coding";
import { getFileStat } from "@/utils/webdav";
import { notFound } from "next/navigation";
import { type FileStat } from "webdav";

const getBrowserType = (page: string): FileBrowserType => {
  if (page.startsWith(".trash")) {
    return "browser.trash";
  }

  return "browser.storage";
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const path = decode(params.slug);

  try {
    const files = getFileStat<FileStat[]>(await wd.getDirectoryContents(path));

    return (
      <Shell activePage={getBrowserType(path)}>
        <FileBrowser files={files} />
      </Shell>
    );
  } catch (e) {
    console.error(e);
    notFound();
  }
}
