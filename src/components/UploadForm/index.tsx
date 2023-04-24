"use client";
import { type FieldValues, useForm } from "react-hook-form";
import { GlobalNav } from "../Nav";

export const UploadForm = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data: FieldValues) => {
    const formData = new FormData();

    for (const file of data.file) {
      if (file instanceof File) {
        formData.append("files[]", file);
      }
    }

    const res = await fetch("/api/upload", {
      method: "POST",

      body: formData,
    });

    const jsonResponse = await res.json();

    const responseSchema = z.object({
      message: z.string(),
      status: z.number(),
    });

    const response = responseSchema.parse(jsonResponse);

    alert(JSON.stringify(`${response.message}, status: ${response.status}`));
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <GlobalNav activePage={"Upload"} />
      <input type="file" {...register("file")} multiple={true} />
      <input type="submit" />
    </form>
  );
};
