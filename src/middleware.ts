import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      if (token) {
        return true;
      }

      return false;
    },
  },
});
