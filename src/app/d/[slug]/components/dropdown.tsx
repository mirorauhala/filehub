import { moveToTrash } from "../actions";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { File } from "../columns";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export const FileDropdown = ({ file }: { file: File }) => {
  const pathname = usePathname();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => console.log(file)}>
          Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            if (!pathname) return;
            await moveToTrash(file);
          }}
        >
          Move to trash
        </DropdownMenuItem>
        <DropdownMenuItem>Info</DropdownMenuItem>
        <DropdownMenuItem>Download</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
