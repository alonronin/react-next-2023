"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { href: "/", label: "Home", exact: true },
  { href: "/posts", label: "Posts" },
];

export function Navigation() {
  const path = usePathname();

  return (
    <header className="p-6 bg-white shadow-md">
      <nav className="flex items-center gap-4 flex-wrap">
        {menu.map(({ href, label, exact }) => (
          <Link
            href={href}
            key={href}
            className={
              ((exact ? path === href : path.startsWith(href)) &&
                "font-bold") ||
              ""
            }
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
