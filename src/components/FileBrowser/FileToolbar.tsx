import { Button } from "@/components/Button";
import { useFilesDispatch } from "./FilesContext";

export const FileToolbar = () => {
  const dispatch = useFilesDispatch();

  if (!dispatch) throw new Error("No dispatch found!");

  return (
    <nav>
      <Button
        onClick={() =>
          dispatch({
            type: "DELETE_FILE",
            payload: "jack-dong-yJozLVBxNA0-unsplash.jpg",
          })
        }
      >
        Delete first file
      </Button>
    </nav>
  );
};
