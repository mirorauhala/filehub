"use client";
import { AppLayout } from "@/components/Layouts";
import { GlobalNav } from "@/components/Nav";
import { Favorites } from "@/components/Favorites";
import { encode } from "@/support/coding";

export default function FileBrowserNotFound() {
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
          <h1>Not found</h1>
        </div>
      </main>
    </AppLayout>
  );
}
