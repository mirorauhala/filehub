import FileBrowserNotFound from "@/components/FileBrowser/FileBrowserNotFound";
import { AppLayout } from "@/components/Layouts";
import { GlobalNav } from "@/components/Nav";

export default function NotFound() {
  return (
    <AppLayout>
      <GlobalNav activePage="not-found" />

      <main className="flex min-h-screen w-full flex-col">
        <div className="mx-auto w-full max-w-7xl">
          <h1>Not found</h1>
        </div>
      </main>
    </AppLayout>
  );
}
