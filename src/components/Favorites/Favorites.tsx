import Link from "next/link";
import type { PropsWithChildren } from "react";

export function Favorite({
  href,
  children,
}: PropsWithChildren<{
  href: string;
}>) {
  return (
    <Link
      href={href}
      className="block rounded bg-blue-100 py-0.5 px-2 text-blue-700"
    >
      {children}
    </Link>
  );
}

type Favorite = { href: string; name: string };
export function Favorites({ favorites }: { favorites: Favorite[] }) {
  return (
    <div className="border-b px-2">
      <ul className="flex gap-2 py-2">
        {favorites.length > 0 &&
          favorites.map((favorite) => (
            <li key={favorite.href}>
              <Favorite href={favorite.href}>{favorite.name}</Favorite>
            </li>
          ))}
      </ul>
    </div>
  );
}
