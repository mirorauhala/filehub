import "@/styles/globals.css";
import { ClientProvider } from "@/utils/trpcClient";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProvider>
      <html lang="en">
        <head />
        <body>
          <div>{children}</div>
        </body>
      </html>
    </ClientProvider>
  );
}
