import type { PropsWithChildren } from "react";

function Button({ children }: PropsWithChildren) {
  return (
    <button className="mb-3 rounded bg-slate-200 px-2 py-0.5 text-lg text-slate-900">
      {children}
    </button>
  );
}

function ButtonRed(
  props: PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>
) {
  const { children, ...rest } = props;

  return (
    <button
      className="mb-3 rounded bg-red-200 px-2 py-0.5 text-lg text-red-900"
      {...rest}
    >
      {children}
    </button>
  );
}

export function Toolbar({
  selectionCount,
  onDelete,
}: {
  selectionCount: number;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-between gap-2 px-4">
      <div className="flex gap-1">
        <Button>New...</Button>
        <Button>Upload...</Button>

        {selectionCount > 0 && (
          <>
            <Button>Rename</Button>
            <Button>Share</Button>
          </>
        )}
      </div>
      {selectionCount > 0 && <ButtonRed onClick={onDelete}>Delete</ButtonRed>}
    </div>
  );
}
