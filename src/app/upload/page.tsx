import { AppLayout } from "@/components/Layouts";
import { GlobalNav } from "@/components/Nav";
import { UploadForm } from "@/components/UploadForm";

export default async function Upload() {
  return (
    <AppLayout>
      <GlobalNav activePage="upload" />
      <main className="flex min-h-screen flex-col">
        <UploadForm />
      </main>
    </AppLayout>
  );
}
