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
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useReducer, useState } from "react";

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

type File = {
  name: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultData: DirectoryListing[] = [
  {
    base64: "string",
    filepath: "string",
    name: "string",
    mime: "string",
    type: "file",
    stats: {
      createdAt: new Date(),
      modifiedAt: new Date(),
      accessTime: new Date(),
      size: 10,
    },
  },
];

const columnHelper = createColumnHelper<DirectoryListing>();

const columns = [
  columnHelper.accessor("name", {
    header: () => "Name",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.stats.size, {
    id: "size",
    cell: (info) => (
      <span className="text-sm text-gray-600">
        {prettyBytes(info.getValue())}
      </span>
    ),
    header: () => "Size",
    footer: (info) => info.column.id,
  }),
];

const List: NextPage<PageProps> = ({ listing }) => {
  const [data, setData] = useState(() => [...listing]);
  const rerender = useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Head>
        <title>FileBase</title>
        <meta name="description" content="FileBase" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <GlobalNav />

        <main className="flex min-h-screen w-full flex-col">
          <table className="hidden w-full">
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

          <div className="bt-2 border-b px-2 py-1">
            <ul className="flex">
              <li className="after:px-0.5 after:text-gray-300 [&:not(:last-child)]:after:content-['/'] ">
                <Link
                  href={"/"}
                  className="inline-block rounded-lg border border-transparent px-1 py-0.5 text-gray-500 transition duration-75 ease-in-out hover:bg-gray-100 hover:text-gray-700"
                >
                  Files
                </Link>
              </li>
              <li className="after:px-0.5 after:text-gray-300 [&:not(:last-child)]:after:content-['/'] ">
                <Link
                  href={"/"}
                  className="inline-block rounded-lg border border-transparent px-1 py-0.5 text-gray-500 transition duration-75 ease-in-out hover:bg-gray-100 hover:text-gray-700"
                >
                  cats
                </Link>
              </li>
              <li className="after:px-0.5 after:text-gray-300 [&:not(:last-child)]:after:content-['/'] ">
                <Link
                  href={"/"}
                  className="inline-block rounded-lg border border-transparent px-1 py-0.5 text-gray-500 transition duration-75 ease-in-out hover:bg-gray-100 hover:text-gray-700"
                >
                  tabbies
                </Link>
              </li>
              <li className="after:px-0.5 after:text-gray-300 [&:not(:last-child)]:after:content-['/'] ">
                <Link
                  href={"/"}
                  className="inline-block rounded-lg border border-transparent px-1 py-0.5 text-gray-500 transition duration-75 ease-in-out hover:bg-gray-100 hover:text-gray-700"
                >
                  super cute
                </Link>
              </li>
            </ul>
          </div>
          <div className="border-b px-2">
            <ul className="flex gap-2 py-2">
              <li>
                <Link
                  href="/"
                  className="block rounded bg-blue-100 py-0.5 px-2 text-blue-700"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="block rounded bg-green-100 py-0.5 px-2 text-green-700"
                >
                  Work
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="block rounded bg-amber-100 py-0.5 px-2 text-amber-700"
                >
                  Pictures
                </Link>
              </li>
            </ul>
          </div>

          <div className="mx-auto w-full max-w-7xl">
            <h1 className="px-4 py-5 text-4xl font-extrabold">My Files</h1>

            <div className="flex justify-between gap-2 px-4">
              <div className="flex gap-1">
                <button className="mb-3 rounded bg-gray-200 px-2 py-0.5 text-lg  text-gray-900">
                  New
                </button>
                <button className="mb-3 rounded bg-gray-200 px-2 py-0.5 text-lg  text-gray-900">
                  Rename
                </button>
                <button className="mb-3 rounded bg-gray-200 px-2 py-0.5 text-lg  text-gray-900">
                  Share
                </button>
              </div>
              <button className="mb-3 rounded bg-red-200 px-2 py-0.5 text-lg text-red-900  text-gray-900">
                Delete
              </button>
            </div>

            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="border-y bg-gray-100 p-1 px-4 text-left font-normal text-gray-600 [text-rendering:optimizeLegibility]"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="cursor-pointer select-none border-y border-gray-200 text-gray-800  hover:border-indigo-200 hover:bg-indigo-50"
                    onClick={() => {
                      const { original } = row;
                      if (original.type === "directory") {
                        window.location.href = `/d/${original.base64}`;
                      } else {
                        window.location.href = `/view/${original.base64}`;
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-0.5">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </AppLayout>
    </>
  );
};

export default List;
