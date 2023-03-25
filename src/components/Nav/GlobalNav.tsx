import clsx from "clsx";
import Link from "next/link";
import { type PropsWithChildren } from "react";
import { urnApi } from "@/support/urn";
import { encode } from "@/support/coding";
import { Hover } from "@/hooks/Hover/Hover";
import { useHover } from "@/hooks/Hover/useHover";

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
    className={clsx("block w-full py-1 px-3 text-lg text-neutral-600")}
  >
    {children}
  </Link>
);

export function GlobalNav({ activePage }: { activePage: string }) {
  return (
    <nav className="fixed top-0 flex w-full justify-between bg-neutral-100 py-3 px-2">
      <NavLeft activePage={activePage} />
      <Search />
      <NavRight activePage={activePage} />
    </nav>
  );
}

const Search = () => {
  return (
    <form className="flex items-center">
      <input
        type="text"
        className="w-80 rounded border border-neutral-200 bg-neutral-50 py-1 px-3 text-center text-neutral-600 outline-none transition-all duration-150 ease-in-out placeholder:text-neutral-400 placeholder:transition-colors after:absolute after:h-full after:w-full after:border-white hover:cursor-pointer hover:border-neutral-300 hover:shadow hover:shadow-neutral-200 hover:placeholder:text-neutral-500 focus:w-96 focus:cursor-text focus:border-blue-500 focus:bg-blue-50 focus:text-blue-600 focus:placeholder:text-blue-500"
        placeholder="Search"
      />
    </form>
  );
};

type NavProps = {
  activePage: string;
};

const NavLeft = ({ activePage }: NavProps) => {
  const { navRef, hoverRef } = useHover<HTMLUListElement, HTMLDivElement>({
    left: 8,
  });

  return (
    <>
      <Hover ref={hoverRef} className="z-0 rounded-md bg-neutral-200" />
      <ul className="z-10 flex flex-row" ref={navRef}>
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
    </>
  );
};

const NavRight = ({ activePage }: NavProps) => {
  const { navRef, hoverRef } = useHover<HTMLUListElement, HTMLDivElement>({
    left: 8,
  });

  return (
    <>
      <Hover ref={hoverRef} className="z-0 rounded-md bg-neutral-200" />
      <ul className="z-10 flex flex-row" ref={navRef}>
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
    </>
  );
};
