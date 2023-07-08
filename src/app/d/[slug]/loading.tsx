export default function LoadingPage() {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <div className="mx-auto w-full max-w-7xl">
        <ul className="flex p-4">
          <li className="group after:px-0.5 after:text-2xl after:text-gray-300 [&:not(:last-child)]:after:content-['/'] ">
            <div className="inline-block h-9 w-20 animate-pulse rounded-lg border border-transparent bg-gray-100 px-1 py-0.5" />
          </li>
        </ul>

        <div className="h-80 w-full animate-pulse rounded-lg bg-gray-50" />
      </div>
    </main>
  );
}
