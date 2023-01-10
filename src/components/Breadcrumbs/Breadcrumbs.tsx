import { toEncodedPath } from "@/support/fs";
import Link from "next/link";
import { type PropsWithChildren } from "react";

function Breadcrumb({ href, children }: PropsWithChildren<{ href: string }>) {
  return (
    <li className="after:px-0.5 after:text-gray-300 [&:not(:last-child)]:after:content-['/'] ">
      <Link
        href={href}
        className="inline-block rounded-lg border border-transparent px-1 py-0.5 text-gray-500 transition duration-75 ease-in-out hover:bg-gray-100 hover:text-gray-700"
      >
        {children}
      </Link>
    </li>
  );
}

type Breadcrumb = {
  name: string;
  href: string;
};

type BreadcrumbsProps = {
  path: string;
};

export function Breadcrumbs({ path }: BreadcrumbsProps) {
  const breadcrumbs = path
    .split("/")
    .filter(Boolean)
    .map((name, index) => ({
      name,
      href: toEncodedPath(
        path
          .split("/")
          .filter(Boolean)
          .slice(0, index + 1)
          .join("/")
      ),
    }));

  return (
    <div className="bt-2 w-full border-b bg-white px-2 py-1">
      <ul className="flex">
        <Breadcrumb href="/">Files</Breadcrumb>

        {breadcrumbs.length > 0 &&
          breadcrumbs.map(({ name, href }) => (
            <Breadcrumb key={href} href={href}>
              {name}
            </Breadcrumb>
          ))}
      </ul>
    </div>
  );
}
