import Link from "next/link";
import Head from "next/head";
import prettyBytes from "pretty-bytes";
import { useRouter } from "next/router";
import { type HTMLProps, useEffect, useRef, useState } from "react";
import { AppLayout } from "@/components/Layouts";
import { GlobalNav } from "@/components/Nav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Toolbar } from "@/components/Toolbar";
import { Favorites } from "@/components/Favorites";
import { FileSystemService } from "@/services/FileSystemService";
import {
  type RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { DirectoryListing } from "@/services/FileSystemService";
import type { GetServerSidePropsContext, NextPage } from "next";
import { encode, decode } from "@/support/coding";
import { trpc } from "@/utils/trpc";
import { urnApi } from "@/support/urn";

type PageProps = {
  listing: DirectoryListing[];
  currentPath: string;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const path = ctx.query.path as string;
  const parsedUrn = decode(path);

  const listing = await FileSystemService.getDirectoryListing(parsedUrn);

  return {
    props: {
      listing,
    } as PageProps,
  };
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
const List: NextPage<PageProps> = ({ listing }) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();
  const columnHelper = createColumnHelper<TableDirectoryListing>();

  const urn = urnApi.parse(decode(router.query.path as string));
  const currentPath = urn.resource;

  const rowSelectionCount = Object.keys(rowSelection).length;

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
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  const moveToTrash = trpc.brain.moveToTrash.useMutation();

  const handleDelete = () => {
    const fileIds = table
      .getSelectedRowModel()
      .flatRows.map((row) => ({ src: row.original.urn }));

    moveToTrash.mutate(fileIds);

    // router.reload();
  };

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
                          <Link href={`/d/${file.urn}`}>Enter</Link>
                        )}
                        {file.type === "file" && (
                          <Link href={`/view/${file.urn}`}>View</Link>
                        )}
                        <button>Rename</button>
                        <button>Delete</button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          <Favorites
            favorites={[
              { name: "Home", href: encode("/home") },
              { name: "Work", href: encode("/work") },
              { name: "Personal", href: encode("/personal") },
              { name: "Company", href: encode("/company") },
              { name: "Gallery", href: encode("/gallery") },
            ]}
          />

          <div className="mx-auto w-full max-w-7xl">
            <Breadcrumbs path={currentPath} />
            <Toolbar
              selectionCount={rowSelectionCount}
              onDelete={handleDelete}
            />
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
                        router.push(`/d/${encode(original.urn)}`);
                      } else {
                        router.push(`/view/${encode(original.urn)}`);
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
            {Object.keys(rowSelection).length} of{" "}
            {table.getPreFilteredRowModel().rows.length} Total Rows Selected
          </div>
        </main>
      </AppLayout>
    </>
  );
};

export default List;
