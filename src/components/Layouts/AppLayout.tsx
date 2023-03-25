export function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col pt-[60px]">{children}</div>;
}
