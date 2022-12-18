export const getServerSideProps = async () => {
  const storageIndex = Buffer.from("/").toString("base64url");

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
