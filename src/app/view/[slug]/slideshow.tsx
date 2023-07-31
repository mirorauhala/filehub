"use client";
import Image from "next/image";
import type { PropsWithChildren } from "react";
import type { FileStat } from "webdav";
import { encode } from "@/support/coding";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const Slideshow = ({ children }: PropsWithChildren) => {
  return <div className="relative bg-black">{children}</div>;
};

export const SlideshowToolbar = ({ file }: { file: FileStat }) => {
  const router = useRouter();
  return (
    <div className="absolute z-30 flex h-16 w-full items-center justify-between gap-20 bg-white/10">
      <ul className="flex text-white">
        <li>
          <button
            className="px-4 py-6"
            aria-label="Close"
            onClick={() => router.back()}
          >
            <XIcon className="h-4 w-4" />
          </button>
        </li>
        <li className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap text-sm">
          {file.basename}
        </li>
      </ul>

      <ul className="flex   pr-2 text-white">
        <li>
          <button className="text-md px-3 py-2 tracking-tight">
            View info
          </button>
        </li>
        <li>
          <button className="text-md px-3 py-2 tracking-tight">Share</button>
        </li>
        <li>
          <Link
            className="text-md px-3 py-2 tracking-tight"
            href={`/api/raw/${encode(file.filename)}?download=true`}
          >
            Download
          </Link>
        </li>
      </ul>
    </div>
  );
};

export const SlideshowImage = ({
  file,
  children,
}: PropsWithChildren<{ file: FileStat }>) => {
  return (
    <div className="relative flex min-h-[calc(100vh)] w-full flex-col items-center justify-center">
      {!file.mime?.startsWith("image") && (
        <p className="text-sm text-white">
          File can&apos;t be previewed. Only images are supported.
        </p>
      )}
      {file.mime?.startsWith("image") && (
        <>
          <div className="absolute z-20 h-full w-full" />
          <Image
            className="object-contain px-5 pb-10 pt-20"
            src={`/api/raw/${encode(file.filename)}`}
            alt=""
            fill={true}
            quality={75}
          />
        </>
      )}
      {file.mime?.startsWith("video") && (
        <video
          controls
          src={`/api/raw/${encode(file.filename)}`}
          className="object-contain px-5 pb-10 pt-20"
        />
      )}
    </div>
  );
};

export const SlideshowInfo = ({
  file,
  children,
}: PropsWithChildren<{ file: FileStat }>) => {
  return (
    <div className="backdrop absolute left-1/2 top-1/2 z-20 h-60 w-60 -translate-x-1/2 -translate-y-1/2 p-4 text-white backdrop-blur">
      <ul>
        <li>Name: </li>
        <li>Mime: {file.mime}</li>
      </ul>
    </div>
  );
};
