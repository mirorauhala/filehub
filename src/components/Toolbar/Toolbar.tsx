import type { PropsWithChildren } from "react";

function Button({ children }: PropsWithChildren) {
  return (
    <button className="mb-3 rounded bg-slate-200 px-2 py-0.5 text-lg text-slate-900">
      {children}
    </button>
  );
}

function ButtonRed({ children }: PropsWithChildren) {
  return (
    <button className="mb-3 rounded bg-red-200 px-2 py-0.5 text-lg text-red-900">
      {children}
    </button>
  );
}

export function Toolbar() {
  return (
    <div className="flex justify-between gap-2 px-4">
      <div className="flex gap-1">
        <Button>New...</Button>
        <Button>Upload...</Button>
        <Button>Rename</Button>
        <Button>Share</Button>
      </div>
      <ButtonRed>Delete</ButtonRed>
    </div>
  );
}
