import { Hover } from "@/hooks/Hover/Hover";
import { useHover } from "@/hooks/Hover/useHover";
import { encode } from "@/support/coding";
import clsx from "clsx";
import Link from "next/link";
import { type PropsWithChildren } from "react";

type NavLink = {
  href: string;
  label: string;
  isActive: (activePage: string) => boolean;
};

const links: NavLink[] = [
  {
    href: "/d/" + encode("storage"),
    label: "Files",
    isActive: (activePage) => activePage === "browser.storage",
  },
  {
    href: "/d/" + encode(".trash"),
    label: "Trash",
    isActive: (activePage) => activePage === "browser.trash",
  },
];

export const NavLink = ({
  href,
  isActive,
  children,
}: PropsWithChildren<{ href: string; isActive?: boolean }>) => (
  <Link
    href={href}
    className={clsx("block w-full px-3 py-1 text-lg text-neutral-600", {
      "font-bold": isActive,
    })}
  >
    {children}
  </Link>
);

type SharedNavProps = {
  activePage: string;
};

export const NavLeft = ({ activePage }: SharedNavProps) => {
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

export const NavRight = ({ activePage }: SharedNavProps) => {
  const { navRef, hoverRef } = useHover<HTMLUListElement, HTMLDivElement>({
    left: 8,
  });

  return (
    <>
      <Hover ref={hoverRef} className="z-0 rounded-md bg-neutral-200" />
      <ul className="z-10 flex flex-row" ref={navRef}>
        <li>
          <NavLink href={"/"} isActive={activePage === "settings"}>
            Settings
          </NavLink>
        </li>
        <li>
          <NavLink href={"/"}>Logout</NavLink>
        </li>
      </ul>
    </>
  );
};
