import { router } from "../trpc";
import { authRouter } from "./auth";
import { brainRouter } from "./brain";
import { exampleRouter } from "./example";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  brain: brainRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
