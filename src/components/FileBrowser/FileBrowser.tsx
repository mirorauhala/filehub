"use client";
import { AppLayout } from "@/components/Layouts";
import { GlobalNav } from "@/components/Nav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Favorites } from "@/components/Favorites";
import { encode } from "@/support/coding";
import {
  FileTable,
  FileToolbar,
  FilesProvider,
} from "@/components/FileBrowser";
import type { FileStat } from "webdav";

type PageProps = {
  files: FileStat[];
};

export default function FileBrowser({ files }: PageProps) {
  return (
    <AppLayout>
      <GlobalNav />

      <main className="flex min-h-screen w-full flex-col">
        <Favorites
          favorites={[
            { name: "Home", href: encode("/home") },
            { name: "Work", href: encode("/work") },
            { name: "Personal", href: encode("/personal") },
            { name: "Company", href: encode("/company") },
            { name: "Gallery", href: encode("/gallery") },
          ]}
        />

        <div className="mx-auto w-full max-w-7xl">
          <Breadcrumbs path={"/"} />
          <FilesProvider initialFiles={files}>
            <FileToolbar />
            <FileTable />
          </FilesProvider>
        </div>
      </main>
    </AppLayout>
  );
}
