import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import { FileSystemService } from "@/services/FileSystemService";

export const brainRouter = router({
  moveToTrash: publicProcedure
    .input(z.object({ src: z.string() }).array().min(1))
    .mutation(async ({ input }) => {
      try {
        await Promise.all(
          input.map(({ src }) => FileSystemService.moveToTrash(src))
        );
      } catch (error) {
        return {
          success: false,
          error,
        };
      }

      return {
        success: true,
      };
    }),
  moveTo: publicProcedure
    .input(z.array(z.object({ src: z.string(), dst: z.string() })).min(1))
    .mutation(async ({ input }) => {
      input.forEach(async ({ src, dst }) => {
        await FileSystemService.moveTo(src, dst);
      });

      return {
        success: true,
      };
    }),
});
