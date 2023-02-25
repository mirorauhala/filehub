import { encode } from "@/support/coding";
import { urnApi } from "@/support/urn";

export const getServerSideProps = async () => {
  const storageIndex = encode(
    urnApi.format({ section: "fs", type: "cloud", resource: "/" })
  );

  return {
    redirect: {
      destination: `/d/${storageIndex}`,
      permanent: false,
    },
  };
};

export default function Page() {
  return null;
}
