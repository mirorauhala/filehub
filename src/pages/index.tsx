import { encode } from "@/support/coding";
import { urnApi } from "@/support/urn";
import { redirectTo } from "@/utils/redirect";

export const getServerSideProps = async () => {
  const indexUrn = urnApi.format({
    section: "fs",
    type: "cloud",
    resource: "/",
  });

  const encodedUrn = encode(indexUrn);

  return redirectTo("/d/" + encodedUrn);
};

export default function Page() {
  return null;
}
