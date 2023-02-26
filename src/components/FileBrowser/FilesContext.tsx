import {
  createContext,
  useContext,
  useReducer,
  type PropsWithChildren,
  type Dispatch,
} from "react";

const FilesContext = createContext<File[]>([]);
const FilesDispatchContext = createContext<Dispatch<FileReducerAction> | null>(
  null
);

export function FilesProvider({ children }: PropsWithChildren) {
  const [tasks, dispatch] = useReducer(filesReducer, initialTasks);

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
  | { type: "ADD_FILE"; payload: File }
  | { type: "DELETE_FILE"; payload: File["id"] };

function filesReducer(tasks: typeof initialTasks, action: FileReducerAction) {
  switch (action.type) {
    case "ADD_FILE":
      return [...tasks, action.payload];
    case "DELETE_FILE":
      return tasks.filter((task) => task.id !== action.payload);
    default:
      throw Error("Unknown action");
  }
}

export type File = {
  id: number;
  name: string;
};

const initialTasks: File[] = [
  { id: 1, name: "cat.jpg" },
  { id: 2, name: "dog.jpg" },
  { id: 3, name: "guinea-pig.jpg" },
];
