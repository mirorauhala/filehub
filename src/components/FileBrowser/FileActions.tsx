"use client";
import { type FileStat } from "webdav";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { trpc } from "@/utils/trpc";
import { useFilesDispatch } from "./FilesContext";
import { useShell } from "../Shell";

export const FileActions = ({ file }: { file: FileStat }) => {
  const { activePage } = useShell();
  const moveToTrash = trpc.fs.moveToTrash.useMutation();
  const deletePermanently = trpc.fs.deletePermanently.useMutation();
  const dispatch = useFilesDispatch();

  const handleDelete = () => {
    moveToTrash.mutate([
      {
        src: file.filename,
      },
    ]);
    dispatch({ type: "DELETE_FILE", payload: file.filename });
  };

  const handleDeletePermanently = () => {
    deletePermanently.mutate([{ src: file.filename }], {
      onSuccess: () => {
        dispatch({ type: "DELETE_FILE", payload: file.filename });
      },
    });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button>Actions</button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] rounded bg-white p-1 shadow will-change-[opacity,transform]"
          sideOffset={5}
        >
          {activePage === "browser.trash" && (
            <>
              <DropdownMenu.Item
                onClick={handleDelete}
                className="select-none rounded px-1 py-1.5 pl-3 leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-500 data-[disabled]:text-gray-400 data-[highlighted]:text-white"
              >
                Restore
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={handleDeletePermanently}
                className="select-none rounded px-1 py-1.5 pl-3 leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-500 data-[disabled]:text-gray-400 data-[highlighted]:text-white"
              >
                Delete permanently
              </DropdownMenu.Item>
            </>
          )}
          {activePage === "browser.storage" && (
            <DropdownMenu.Item
              onClick={handleDelete}
              className="select-none rounded px-1 py-1.5 pl-3 leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-500 data-[disabled]:text-gray-400 data-[highlighted]:text-white"
            >
              Delete
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
