import { Button } from "@/components/Button";
import { useFilesDispatch } from "./FilesContext";

export const FileToolbar = () => {
  const dispatch = useFilesDispatch();

  if (!dispatch) throw new Error("No dispatch found!");

  const handleNewFile = () => {
    const name = prompt("Enter file name");

    if (!name) return;

    dispatch({
      type: "ADD_FILE",
      payload: {
        id: Math.round(Math.random() * 100),
        name: name,
      },
    });
  };

  return (
    <nav>
      <Button onClick={handleNewFile}>Add file</Button>

      <Button onClick={() => dispatch({ type: "DELETE_FILE", payload: 0 })}>
        Delete first file
      </Button>
    </nav>
  );
};
