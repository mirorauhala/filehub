import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import { wd } from "@/server/webdav";
import { basename } from "path";
import { getFileStat } from "@/utils/webdav";

const incrementalMove = async (src: string, dst: string) => {
  let i = 0;
  let targetName = i === 1 ? dst : `${dst}.${i}`;

  try {
    while (await wd.exists(targetName)) {
      i++;
      targetName = `${dst}.${i}`;
    }

    await wd.moveFile(src, targetName);
  } catch (e) {
    console.log(e);
  }
  return targetName;
};

export const fsRouter = router({
  move: publicProcedure
    .input(
      z.object({
        src: z.string(),
        dst: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        if (!(await wd.exists(input.src))) {
          return {
            success: false,
            error: `Source file ${input.src} does not exist`,
          };
        }

        if (await wd.exists(input.dst)) {
          return {
            success: false,
            error: `Target file ${input.dst} already exists`,
          };
        }

        await wd.moveFile(input.src, input.dst);

        const movedFile = getFileStat(await wd.stat(input.dst));

        return {
          success: true,
          data: movedFile,
        };
      } catch (error) {
        return {
          success: false,
          error,
        };
      }
    }),
  moveToTrash: publicProcedure
    .input(z.object({ src: z.string() }).array().min(1))
    .mutation(async ({ input }) => {
      try {
        input.map(async ({ src }) => {
          console.log(`Trashing: ${src}`);

          const fileBasename = basename(src);

          await incrementalMove(src, `/.trash/${fileBasename}`);
        });

        return {
          success: true,
        };
      } catch (error) {
        return {
          success: false,
          error,
        };
      }
    }),
  deletePermanently: publicProcedure
    .input(z.object({ src: z.string() }).array().min(1))
    .mutation(async ({ input }) => {
      try {
        input.forEach(async ({ src }) => {
          console.log(`Delete: ${src}`);
          await wd.deleteFile(src);
        });
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
  createDirectory: publicProcedure
    .input(z.object({ basename: z.string(), dst: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const path = `${input.dst}/${input.basename}`;

        if (await wd.exists(path)) {
          return {
            success: false,
            error: `Directory ${path} already exists`,
          };
        }

        await wd.createDirectory(path);
        const createdDirectory = getFileStat(await wd.stat(path));

        return {
          success: true,
          data: createdDirectory,
        };
      } catch (error) {
        return {
          success: false,
          error,
        };
      }
    }),
});
