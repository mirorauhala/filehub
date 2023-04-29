/* eslint-disable @typescript-eslint/no-empty-function */
"use client";
import { trpc } from "@/utils/trpc";
import {
  createContext,
  useContext,
  useReducer,
  type PropsWithChildren,
  type Dispatch,
} from "react";
import type { FileStat } from "webdav";

type FilesContext = {
  files: FileStat[];
  path: string;
  actions: {
    rename: (file: FileStat) => void;
    moveToTrash: (file: FileStat) => void;
    deletePermanently: (file: FileStat) => void;
  };
};
const FilesContext = createContext<FilesContext>({
  files: [],
  path: "/",
  actions: {
    rename: () => {},
    moveToTrash: () => {},
    deletePermanently: () => {},
  },
});

const FilesDispatchContext = createContext<Dispatch<FileReducerAction>>(
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {}
);

export function FilesProvider({
  initialFiles,
  path,
  children,
}: PropsWithChildren<{
  initialFiles: FileStat[];
  path: string;
}>) {
  const [files, dispatch] = useReducer(filesReducer, initialFiles);
  const renameMutation = trpc.fs.move.useMutation();
  const trashMutation = trpc.fs.moveToTrash.useMutation();
  const deletePermanentlyMutation = trpc.fs.deletePermanently.useMutation();

  const rename = (file: FileStat) => {
    const name = window.prompt("New name:");

    if (!name) return;
    if (name.length === 0) return;

    renameMutation
      .mutateAsync({
        src: file.filename,
        dst: path + "/" + name,
      })
      .then((resp) => {
        console.group("FileRename");
        if (resp.error) {
          console.log(resp.error);
          return;
        }

        if (!resp.data) {
          console.log("No data");
          return;
        }
        console.groupEnd();

        dispatch({
          type: "RENAME",
          payload: {
            old: file.filename,
            new: resp.data,
          },
        });
      });
  };

  const moveToTrash = (file: FileStat) => {
    trashMutation
      .mutateAsync([
        {
          src: file.filename,
        },
      ])
      .then((resp) => {
        console.group("MoveToTrash");
        if (resp.error) {
          console.log(resp.error);
          return;
        }

        if (resp.success === false) {
          console.log("Fail success");
          return;
        }
        console.log("Success");

        console.groupEnd();

        dispatch({ type: "DELETE_FILE", payload: file.filename });
      });
  };

  const deletePermanently = (file: FileStat) => {
    deletePermanentlyMutation.mutate([{ src: file.filename }], {
      onSuccess: () => {
        dispatch({ type: "DELETE_FILE", payload: file.filename });
      },
    });
  };

  // useEffect(() => {
  //   const sse = new EventSource("http://localhost:3000/api/events/fs");
  //   sse.onmessage = (e) => {
  //     console.log(e);
  //   };
  //   return () => {
  //     sse.close();
  //   };
  // }, []);

  const actions = {
    rename,
    moveToTrash,
    deletePermanently,
  };

  return (
    <FilesContext.Provider value={{ path, files, actions }}>
      <FilesDispatchContext.Provider value={dispatch}>
        {children}
      </FilesDispatchContext.Provider>
    </FilesContext.Provider>
  );
}

export const useFiles = () => useContext(FilesContext);
export const useFilesDispatch = () => useContext(FilesDispatchContext);

type FileReducerAction =
  | { type: "ADD_FILE"; payload: FileStat }
  | { type: "CREATE_DIR"; payload: FileStat }
  | { type: "RENAME"; payload: { old: FileStat["filename"]; new: FileStat } }
  | { type: "DELETE_FILE"; payload: FileStat["filename"] };

function filesReducer(
  files: FileStat[],
  action: FileReducerAction
): FileStat[] {
  switch (action.type) {
    case "ADD_FILE":
      return [...files, action.payload];
    case "DELETE_FILE":
      return files.filter((file) => file.filename !== action.payload);
    case "RENAME":
      return files.map((file) => {
        if (file.filename === action.payload.old) {
          return action.payload.new;
        }
        return file;
      });
    case "CREATE_DIR":
      return [...files, action.payload];
    default:
      throw Error("Unknown action");
  }
}
