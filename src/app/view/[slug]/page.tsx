import Image from "next/image";
import { AppLayout } from "@/components/Layouts";
import { GlobalNav } from "@/components/Nav";
import { redirectTo } from "@/utils/redirect";
import { decode, encode, encodeClient } from "@/support/coding";
import { getFileStat } from "@/utils/webdav";
import { wd } from "@/server/webdav";

export default async function ViewPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const path = decode(params.slug);

  const file = getFileStat(await wd.stat(path));
  const download = await wd.getFileDownloadLink(path);

  if (file.type === "directory") {
    return redirectTo(`/d/${encode(file.filename)}`);
  }

  return (
    <>
      <AppLayout>
        <GlobalNav />
        <main className="flex min-h-screen w-full flex-col">
          <p>file</p>
          <pre>{JSON.stringify(file, null, 2)}</pre>
          <p>{download}</p>
          <p>{`/api/raw/${encode(file.filename)}`}</p>

          {/image/.test(file.mime || "") && (
            <Image
              src={`/api/raw/${encode(file.filename)}`}
              alt=""
              width={400}
              height={533}
              quality={75}
            />
          )}

          {/* <Link href={`/api/raw/${fileMetadata.base64}`}>Raw</Link> */}
        </main>
      </AppLayout>
    </>
  );
}
