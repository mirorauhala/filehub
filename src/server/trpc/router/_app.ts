import { router } from "../trpc";
import { fsRouter } from "./fs";
import { exampleRouter } from "./example";

export const appRouter = router({
  example: exampleRouter,
  fs: fsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
