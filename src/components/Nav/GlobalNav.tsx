"use client";
import { NavLeft, NavRight } from "./NavLink";
import { Search } from "./Search";

export function GlobalNav() {
  return (
    <nav className="fixed top-0 z-20 flex w-full justify-between bg-neutral-100 px-2 py-3">
      <NavLeft />
      <Search />
      <NavRight />
    </nav>
  );
}
