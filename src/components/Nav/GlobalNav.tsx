"use client";
import { NavLeft, NavRight } from "./NavLink";
import { Search } from "./Search";

export function GlobalNav({ activePage }: { activePage?: string }) {
  return (
    <nav className="fixed top-0 z-20 flex w-full justify-between bg-neutral-100 px-2 py-3">
      <NavLeft activePage={activePage} />
      <Search />
      <NavRight activePage={activePage} />
    </nav>
  );
}
