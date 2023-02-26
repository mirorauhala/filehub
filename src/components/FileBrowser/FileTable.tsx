import { Button } from "../Button";
import { type File, useFiles, useFilesDispatch } from "./FilesContext";

const File = ({ file }: { file: File }) => {
  const dispatch = useFilesDispatch();

  if (!dispatch) throw new Error("No dispatch found!");

  const onDelete = () => {
    dispatch({ type: "DELETE_FILE", payload: file.id });
  };

  return (
    <li>
      {file.name} <Button onClick={onDelete}>Delete</Button>
    </li>
  );
};

export function FileTable() {
  const files = useFiles();

  return (
    <ul>
      {files.map((file) => (
        <File key={file.id} file={file} />
      ))}
    </ul>
  );
}
