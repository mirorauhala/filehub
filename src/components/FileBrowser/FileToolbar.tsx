import { Button } from "@/components/Button";
import { useFiles, useFilesDispatch } from "./FilesContext";
import { trpc } from "@/utils/trpc";

export const FileToolbar = () => {
  const dispatch = useFilesDispatch();
  const { path } = useFiles();
  const createDir = trpc.fs.createDirectory.useMutation();

  if (!dispatch) throw new Error("No dispatch found!");

  return (
    <nav>
      <Button
        onClick={() => {
          const name = window.prompt("Enter folder name");

          if (!name) return;
          if (name.length === 0) return;

          createDir
            .mutateAsync({
              basename: name,
              dst: path,
            })
            .then((res) => {
              if (res.error) {
                console.log(res.error);
                return;
              }

              if (!res.data) {
                console.log("No data");
                return;
              }

              dispatch({
                type: "CREATE_DIR",
                payload: res.data,
              });
            });
        }}
      >
        Create folder
      </Button>
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
