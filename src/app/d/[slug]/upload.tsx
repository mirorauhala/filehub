"use client";

import { Button } from "@/components/ui/button";

export const Upload = ({ path }: { path: string }) => {
  const handleUploadClick = () => {
    console.log("Upload");

    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = (e) => {
      if (!e.target) return;
      if (!e.target) return;
      if (!input.files) return;
      const files = Array.from(input.files);
      files.forEach((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", path);

        fetch("/api/upload-file", {
          method: "POST",
          body: formData,
        }).finally(() => console.log("done"));
      });
    };
    input.click();
  };

  return (
    <div className="mb-3 flex px-2 py-1">
      <Button type="button" onClick={handleUploadClick}>
        Upload
      </Button>
    </div>
  );
};
