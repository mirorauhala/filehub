import Image from "next/image";
import { AppLayout } from "@/components/Layouts";
import { GlobalNav } from "@/components/Nav";
import { redirectTo } from "@/utils/redirect";
import { decode, encode, encodeClient } from "@/support/coding";
import { getFileStat } from "@/utils/webdav";
import { wd } from "@/server/webdav";
import {
  Slideshow,
  SlideshowImage,
  SlideshowInfo,
  SlideshowToolbar,
} from "@/app/view/[slug]/slideshow";

export default async function ViewPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const path = decode(slug);

  const file = getFileStat(await wd.stat(path));
  const download = await wd.getFileDownloadLink(path);

  if (file.type === "directory") {
    return redirectTo(`/d/${encode(file.filename)}`);
  }

  return (
    <main>
      <Slideshow>
        <SlideshowToolbar file={file} />
        <SlideshowImage file={file} />
        {/* <SlideshowInfo file={file} /> */}
      </Slideshow>
    </main>
  );
}
