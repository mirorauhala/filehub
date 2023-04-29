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

  // do {
  //   console.log(`Move: ${targetName}`);
  //   await wd.moveFile(src, targetName);
  //   i++;
  //   targetName = `${dst}.${i}`;
  // } while ();
};

export const fsRouter = router({
  move: publicProcedure
    .input(
      z.object({
        filename: z.string(),
        newName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await wd.moveFile(input.filename, input.newName);
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
  moveToTrash: publicProcedure
    .input(z.object({ src: z.string() }).array().min(1))
    .mutation(async ({ input }) => {
      try {
        input.forEach(async ({ src }) => {
          console.log(`Trashing: ${src} to /.trash/${src}`);

          const fileBasename = basename(src);

          incrementalMove(src, `/.trash/${fileBasename}`);
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
