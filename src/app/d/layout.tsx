import { AppLayout } from "@/components/Layouts";
import { GlobalNav } from "@/components/Nav";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <AppLayout>
      <GlobalNav />
      {children}
    </AppLayout>
  );
}
