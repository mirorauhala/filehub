import { AppLayout } from "@/components/Layouts";
import { GlobalNav } from "@/components/Nav";
import { type GetServerSidePropsContext, type NextPage } from "next";
import Head from "next/head";
import {
  type DirectoryListing,
  FileSystemService,
  toReadablePath,
} from "@/services/FileSystemService";
import prettyBytes from "pretty-bytes";
import Link from "next/link";

type PageProps = {
  listing: DirectoryListing[];
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const path = ctx.query.path as string;
  const readableFilepath = toReadablePath(path);

  try {
    const listing = await FileSystemService.getDirectoryListing(
      readableFilepath
    );

    return {
      props: {
        listing,
      } as PageProps,
    };
  } catch (error) {
    console.error("listing", error);
    return {
      redirect: {
        destination: "/d",
        permanent: false,
      },
    };
  }
};

const List: NextPage = ({ listing }: PageProps) => {
  return (
    <>
      <Head>
        <title>Homebase</title>
        <meta name="description" content="Homebase" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <GlobalNav />
        <main className="flex min-h-screen w-full flex-col">
          <h1 className="text-4xl font-black">My Base</h1>

          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Size</th>
                <th className="text-left">Modified</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listing.length > 0 &&
                listing.map((file) => {
                  return (
                    <tr key={file.name}>
                      <td>{file.name}</td>
                      <td>
                        {prettyBytes(file.stats.size, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td>2021-01-01</td>
                      <td>
                        {file.type === "directory" && (
                          <Link href={`/d/${file.base64}`}>Enter</Link>
                        )}
                        {file.type === "file" && (
                          <Link href={`/view/${file.base64}`}>View</Link>
                        )}
                        <button>Rename</button>
                        <button>Delete</button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </main>
      </AppLayout>
    </>
  );
};

export default List;
