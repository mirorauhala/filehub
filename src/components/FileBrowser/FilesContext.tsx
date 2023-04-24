"use client";
import {
  createContext,
  useContext,
  useReducer,
  type PropsWithChildren,
  type Dispatch,
  useEffect,
} from "react";
import type { FileStat } from "webdav";

const FilesContext = createContext<FileStat[]>([]);
const FilesDispatchContext = createContext<Dispatch<FileReducerAction>>(
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {}
);

export function FilesProvider({
  initialFiles,
  children,
}: PropsWithChildren<{
  initialFiles: FileStat[];
}>) {
  const [tasks, dispatch] = useReducer(filesReducer, initialFiles);

  useEffect(() => {
    const sse = new EventSource("http://localhost:3000/api/events/fs");
    sse.onmessage = (e) => {
      console.log(e);
    };
    return () => {
      sse.close();
    };
  }, []);

  return (
    <FilesContext.Provider value={tasks}>
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
  | { type: "DELETE_FILE"; payload: FileStat["filename"] };

function filesReducer(files: FileStat[], action: FileReducerAction) {
  switch (action.type) {
    case "ADD_FILE":
      return [...files, action.payload];
    case "DELETE_FILE":
      return files.filter((file) => file.filename !== action.payload);
    default:
      throw Error("Unknown action");
  }
}
