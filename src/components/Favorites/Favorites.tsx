import Link from "next/link";
import { type PropsWithChildren } from "react";
import { Hover } from "@/hooks/Hover/Hover";
import { useHover } from "@/hooks/Hover/useHover";

export function Favorite({
  href,
  children,
}: PropsWithChildren<{
  href: string;
}>) {
  return (
    <Link
      href={href}
      className="relative z-10 block rounded px-2 py-0.5 text-neutral-600 hover:text-neutral-600"
    >
      {children}
    </Link>
  );
}

type Favorite = { href: string; name: string };

export function Favorites({ favorites }: { favorites: Favorite[] }) {
  const { navRef, hoverRef } = useHover<HTMLDivElement, HTMLDivElement>({
    top: 8,
    left: 8,
  });

  return (
    <div className="relative border-b px-2" ref={navRef}>
      <Hover ref={hoverRef} className="absolute rounded bg-neutral-100" />
      <ul className="peer flex gap-0.5 py-2">
        {favorites.length > 0 &&
          favorites.map((favorite) => (
            <li key={favorite.href}>
              <Favorite href={`/d/${favorite.href}`}>{favorite.name}</Favorite>
            </li>
          ))}
      </ul>
    </div>
  );
}
