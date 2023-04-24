import { router } from "../trpc";
import { authRouter } from "./auth";
import { fsRouter } from "./fs";
import { exampleRouter } from "./example";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  fs: fsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
