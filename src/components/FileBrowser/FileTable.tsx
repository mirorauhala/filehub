import { useParams, useRouter } from "next/navigation";
import { useFiles } from "./FilesContext";
import prettyBytes from "pretty-bytes";
import { type FileStat } from "webdav";
import { FileActions } from "./FileActions";
import { decodeClient, encodeClient } from "@/support/coding";

const File = ({ file }: { file: FileStat }) => {
  const router = useRouter();
  const params = useParams();

  const onDoubleClick = () => {
    if (!params) return;
    if (file.type === "directory") {
      const { slug } = params as { slug: string };

      const existingPath = decodeClient(slug) + "/" + file.basename;

      router.push(`/d/${encodeClient(existingPath)}`);
    } else {
      const { slug } = params as { slug: string };

      const existingPath = decodeClient(slug) + "/" + file.basename;

      router.push(`/view/${encodeClient(existingPath)}`);
    }
  };

  return (
    <tr>
      <td className="border border-slate-300 p-0.5">
        <input type="checkbox" />
      </td>
      <td
        className="cursor-pointer select-none border border-slate-300 p-0.5"
        onDoubleClick={onDoubleClick}
      >
        {file.basename}
      </td>
      <td className="border border-slate-300 p-0.5">
        {prettyBytes(file.size)}
      </td>
      <td className="border border-slate-300 p-0.5">
        <FileActions file={file} />
      </td>
    </tr>
  );
};

export function FileTable() {
  const files = useFiles();

  return (
    <table className="w-full border-collapse border border-slate-400">
      <thead>
        <tr>
          <th className="border border-slate-300">
            <input type="checkbox" />
          </th>
          <th className="border border-slate-300">
            <span>Name</span>
          </th>
          <th className="border border-slate-300">
            <span>Size</span>
          </th>
          <th className="border border-slate-300">
            <span>Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          <File key={file.filename} file={file} />
        ))}
      </tbody>
    </table>
  );
}
