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
    label: "Files",
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
    className={clsx("block w-full py-2 px-3 text-lg", {
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-500": isActive,
      "text-gray-300 hover:bg-gray-800": !isActive,
    })}
  >
    {children}
  </Link>
);

export function GlobalNav() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 flex w-full justify-between bg-gray-900">
      <ul className="flex flex-row">
        {links.map((link) => {
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

      <ul className="flex flex-row">
        <li>
          <NavLink href={"/"} isActive={false}>
            Settings
          </NavLink>
        </li>
        <li>
          <NavLink href={"/"} isActive={false}>
            Logout
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
