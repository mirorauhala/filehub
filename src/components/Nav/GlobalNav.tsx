import clsx from "clsx";
import Link from "next/link";
import { type PropsWithChildren } from "react";
import { useRouter } from "next/router";
import { urnApi } from "@/support/urn";
import { encode } from "@/support/coding";

type NavLink = {
  href: string;
  label: string;
  isActive: (activePage: string) => boolean;
};

const links: NavLink[] = [
  {
    href:
      "/d/" +
      encode(
        urnApi.format({
          section: "fs",
          type: "cloud",
          resource: "/",
        })
      ),
    label: "Files",
    isActive: (activePage) => activePage === "cloud",
  },
  {
    href: "/upload",
    label: "Upload",
    isActive: (activePage) => activePage === "upload",
  },
  {
    href:
      "/d/" +
      encode(
        urnApi.format({
          section: "fs",
          type: "trash",
          resource: "/",
        })
      ),
    label: "Trash",
    isActive: (activePage) => activePage === "trash",
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

export function GlobalNav({ activePage }: { activePage: string }) {
  return (
    <nav className="fixed top-0 flex w-full justify-between bg-gray-900">
      <ul className="flex flex-row">
        {links.map((link) => {
          const isActive = link.isActive(activePage);

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
