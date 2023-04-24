"use client";
import { type PropsWithChildren, createContext, useContext } from "react";

export type Page =
  | "browser.storage"
  | "browser.trash"
  | "browser.not-found"
  | "settings"
  | "upload"
  | "about";

export const Shell = ({
  activePage,
  children,
}: PropsWithChildren<{ activePage: Page }>) => {
  return (
    <ShellContext.Provider value={{ activePage }}>
      {children}
    </ShellContext.Provider>
  );
};

export const ShellContext = createContext<{ activePage: Page }>({
  activePage: "browser.storage",
});

export const useShell = () => useContext(ShellContext);
