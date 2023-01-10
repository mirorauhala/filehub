import { toEncodedPath } from "@/support/fs";
import Link from "next/link";
import { type PropsWithChildren } from "react";

function Breadcrumb({ href, children }: PropsWithChildren<{ href: string }>) {
  return (
    <li className="group after:px-0.5 after:text-2xl after:text-gray-300 [&:not(:last-child)]:after:content-['/'] ">
      <Link
        href={href}
        className="inline-block rounded-lg border border-transparent px-1 py-0.5 text-2xl font-extrabold text-gray-500 transition duration-75 ease-in-out hover:bg-gray-100 hover:text-gray-700 group-last:text-gray-700"
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
    <ul className="flex p-4">
      <Breadcrumb href="/">Files</Breadcrumb>

      {breadcrumbs.length > 0 &&
        breadcrumbs.map(({ name, href }) => (
          <Breadcrumb key={href} href={href}>
            {name}
          </Breadcrumb>
        ))}
    </ul>
  );
}
