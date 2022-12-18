import clsx from "clsx";
import Link from "next/link";
import { type PropsWithChildren } from "react";
import { useRouter } from "next/router";

type NavLink = {
  href: string;
  label: string;
  isActive: (pathname: string) => boolean;
};

const links: NavLink[] = [
  {
    href: "/",
    label: "Home",
    isActive: (pathname) => pathname.startsWith("/d"),
  },
  {
    href: "/upload",
    label: "Upload",
    isActive: (pathname) => pathname.startsWith("/upload"),
  },
  {
    href: "/d?trash",
    label: "Trash",
    isActive: (pathname) => pathname.startsWith("/trash"),
  },
];

const NavLink = ({
  href,
  isActive,
  children,
}: PropsWithChildren<{ href: string; isActive: boolean }>) => (
  <Link
    href={href}
    className={clsx(
      "block w-full rounded-xl px-4 py-2 text-lg font-bold hover:bg-gray-100",
      { "bg-gray-200": isActive }
    )}
  >
    {children}
  </Link>
);

export function GlobalNav() {
  const router = useRouter();

  return (
    <nav className="w-56">
      <ul className="flex flex-col gap-y-2 p-2">
        {links.map((link) => {
          console.log(router.pathname);
          const isActive = link.isActive(router.pathname);

          return (
            <li key={link.href}>
              <NavLink href={link.href} isActive={isActive}>
                {link.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
