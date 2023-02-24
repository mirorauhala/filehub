import type { Redirect } from "next";

export function redirectTo(destination: string): { redirect: Redirect } {
  console.log("Redirecting to: " + destination);
  return {
    redirect: {
      destination: destination,
      permanent: false,
    },
  };
}
