"use client";
import {
  ArrowUpDown,
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileLineChart,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  FolderArchive,
  LucideIcon,
  MoreHorizontal,
} from "lucide-react";

import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import prettyBytes from "pretty-bytes";
import { FileDropdown } from "./components/dropdown";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type File = {
  id: string;
  basename: string;
  size: number;
  type: "file" | "directory";
  mime: string;
};

export const columns: ColumnDef<File>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "file-type",
    header: () => <div className="sr-only">File type</div>,
    cell: ({ row }) => {
      const file = row.original;

      const getSimpleType = (type: string): LucideIcon => {
        if (!type) return File;
        if (type.includes("image")) {
          return FileImage;
        } else if (type.startsWith("video")) {
          return FileVideo;
        } else if (type.startsWith("audio")) {
          return FileAudio;
        } else if (type.startsWith("text")) {
          return FileText;
        } else if (type.startsWith("pdf")) {
          return FileText;
        } else if (type.startsWith("zip")) {
          return FileArchive;
        } else if (type.startsWith("msword")) {
          return FileText;
        } else if (type.startsWith("excel")) {
          return FileSpreadsheet;
        } else if (type.startsWith("powerpoint")) {
          return FileLineChart;
        } else if (type.startsWith("json")) {
          return FileCode;
        }

        return File;
      };

      const Icon = getSimpleType(file.mime);

      return (
        <div data-type="icon">
          {file.type === "directory" ? (
            <div className="text-gray-500">
              <Folder className="h-4 w-4" />
            </div>
          ) : (
            <div className="text-gray-500">
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "basename",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 text-right"
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (row.original.type === "directory" ? "Folder" : "File"),
    size: 10,
  },
  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 text-right"
          >
            Size
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const pretty = prettyBytes(parseInt(row.getValue("size"), 10));

      return <div className="text-right font-medium">{pretty}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const file = row.original;

      return <FileDropdown file={file} />;
    },
  },
];
