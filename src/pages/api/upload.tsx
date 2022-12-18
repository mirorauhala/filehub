import formidable from "formidable";
import { type NextApiRequest, type NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm({
    multiples: false,
    keepExtensions: true,
    uploadDir: "./tmp",
    maxTotalFileSize: 200 * 1024 * 1024, // 200 MB
    maxFileSize: 200 * 1024 * 1024, // 200 MB
    maxFieldsSize: 2 * 1024 * 1024, // 2 MB
    maxFields: 1,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error", err);
      return res.status(500).json({ status: "Error", message: err.message });
    }
  });
  res.status(200).json({ status: "OK" });
};

export default upload;
