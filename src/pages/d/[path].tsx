import Link from "next/link";
import Head from "next/head";
import prettyBytes from "pretty-bytes";
import { useRouter } from "next/router";
import { HTMLProps, useEffect, useRef, useState } from "react";
import { AppLayout } from "@/components/Layouts";
import { GlobalNav } from "@/components/Nav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Toolbar } from "@/components/Toolbar/Toolbar";
import { Favorites } from "@/components/Favorites";
import { FileSystemService } from "@/services/FileSystemService";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { DirectoryListing } from "@/services/FileSystemService";
import type { GetServerSidePropsContext, NextPage } from "next";
import { toEncodedPath, toReadablePath } from "@/support/fs";

type PageProps = {
  listing: DirectoryListing[];
  currentPath: string;
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
        currentPath: readableFilepath,
      } as PageProps,
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/d",
        permanent: false,
      },
    };
  }
};

type TableDirectoryListing = DirectoryListing & {
  select: boolean;
};

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean" && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}
const List: NextPage<PageProps> = ({ listing, currentPath }) => {
  const router = useRouter();
  const columnHelper = createColumnHelper<TableDirectoryListing>();

  const columns = [
    columnHelper.accessor("select", {
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.stats.size, {
      id: "size",
      cell: (info) => (
        <span className="text-sm text-gray-600">
          {prettyBytes(info.getValue(), {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </span>
      ),
      header: () => "Size",
    }),
    columnHelper.accessor((row) => row.stats.createdAt, {
      id: "createdAt",
      cell: (info) => (
        <span className="text-sm text-gray-600">
          {info.getValue().toISOString()}
        </span>
      ),
      header: () => "Size",
    }),
  ];

  const table = useReactTable({
    data: listing as TableDirectoryListing[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => table.reset(), [currentPath, table]);

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

          <Breadcrumbs path={currentPath} />

          <Favorites
            favorites={[
              { name: "Home", href: toEncodedPath("/home") },
              { name: "Work", href: toEncodedPath("/work") },
              { name: "Personal", href: toEncodedPath("/personal") },
              { name: "Company", href: toEncodedPath("/company") },
              { name: "Gallery", href: toEncodedPath("/gallery") },
            ]}
          />

          <div className="mx-auto w-full max-w-7xl">
            <h1 className="px-4 py-5 text-4xl font-extrabold">My Files</h1>

            <Toolbar />
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
                    className="cursor-pointer select-none border-t border-gray-200 text-gray-800  hover:border-indigo-200 hover:bg-indigo-50"
                    onDoubleClick={() => {
                      const { original } = row;
                      if (original.type === "directory") {
                        router.push(`/d/${original.base64}`);
                      } else {
                        router.push(`/view/${original.base64}`);
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
