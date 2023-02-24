import { redirectTo } from "@/utils/redirect";

export const getServerSideProps = async () => {
  const storageIndex = Buffer.from("/").toString("base64url");

  return redirectTo("/d/" + storageIndex);
};

export default function Page() {
  return null;
}
